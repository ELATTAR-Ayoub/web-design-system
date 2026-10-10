"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

export type SpeechVoice = {
  id: string;
  label: string;
  lang: string;
  local: boolean;
};

export type SpeechAdapter = {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  voices: SpeechVoice[];
  voiceId: string | null;
  setVoiceId: (id: string) => void;
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  analyser: AnalyserNode | null;
};

export function speakableText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " — code block — ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* Support never changes after load, so the store never emits. */
const subscribeNever = () => () => {};
const hasSynthesis = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function useBrowserSpeech({
  lang = "en-US",
  enabled = true,
}: { lang?: string; enabled?: boolean } = {}): SpeechAdapter {
  /* Read, not set: detecting it in an effect would flash "unsupported" on first paint. */
  const isSupported = useSyncExternalStore(subscribeNever, hasSynthesis, () => false);
  const [isSpeaking, setSpeaking] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechVoice[]>([]);
  const [picked, setVoiceId] = useState<string | null>(null);

  const nativeVoices = useRef<SpeechSynthesisVoice[]>([]);
  const myUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const read = () => {
      const list = window.speechSynthesis.getVoices();
      if (!list.length) return;
      nativeVoices.current = list;
      setVoices(
        list.map((voice) => ({
          id: voice.voiceURI,
          label: voice.name,
          lang: voice.lang,
          local: voice.localService,
        })),
      );
    };

    read();
    window.speechSynthesis.addEventListener("voiceschanged", read);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", read);
  }, []);

  const voiceId = useMemo(() => {
    if (picked) return picked;
    if (!voices.length) return null;
    const base = lang.split("-")[0];
    const match =
      voices.find((v) => v.lang === lang && v.local) ??
      voices.find((v) => v.lang.startsWith(base) && v.local) ??
      voices.find((v) => v.lang.startsWith(base)) ??
      voices[0];
    return match?.id ?? null;
  }, [lang, picked, voices]);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    // Cancel the shared synthesiser only if this instance is the one speaking.
    if (activeUtterance && activeUtterance === myUtterance.current) {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    }
    setSpeaking(false);
    setPaused(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const body = speakableText(text);
      if (!body) return;

      // Cancel first: a new read takes over, or answers queue up back to back.
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(body);
      utterance.lang = lang;
      const voice = nativeVoices.current.find((v) => v.voiceURI === voiceId);
      if (voice) utterance.voice = voice;

      myUtterance.current = utterance;
      activeUtterance = utterance;

      utterance.onstart = () => {
        setSpeaking(true);
        setPaused(false);
      };
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
        if (activeUtterance === utterance) activeUtterance = null;
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setPaused(false);
        if (activeUtterance === utterance) activeUtterance = null;
      };

      window.speechSynthesis.speak(utterance);
    },
    [enabled, lang, voiceId],
  );

  const pause = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.pause();
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.resume();
    setPaused(false);
  }, []);

  // Read at cleanup time, and cancel only if this instance was the one speaking.
  useEffect(() => () => {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      activeUtterance &&
      activeUtterance === myUtterance.current
    ) {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    }
  }, []);

  return useMemo(
    () => ({
      isSupported,
      isSpeaking,
      isPaused,
      voices,
      voiceId,
      setVoiceId,
      speak,
      pause,
      resume,
      stop,
      analyser: null,
    }),
    [isSupported, isSpeaking, isPaused, voices, voiceId, speak, pause, resume, stop],
  );
}
