"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

/**
 * The assistant reading its answer out loud.
 *
 * `SpeechAdapter` is the seam. The workspace only ever speaks through this
 * interface, so replacing the browser's synthesiser with ElevenLabs — or with
 * anything that returns audio — is one module that satisfies the type. Nothing
 * above this file learns which one is in use.
 *
 * The browser implementation below is the default because it costs nothing,
 * needs no key, works offline, and is available on every machine this will be
 * demoed on. Its one real limitation is stated rather than hidden:
 *
 *   `speechSynthesis` gives you no audio stream. There is no AnalyserNode and
 *   therefore no waveform data, so `analyser` is null and anything drawing a
 *   level has to animate procedurally. A network adapter that plays through
 *   WebAudio returns a real analyser here and that drawing becomes a genuine
 *   reading of the audio, with no change to the components.
 */

export type SpeechVoice = {
  id: string;
  label: string;
  lang: string;
  /** Shipped with the OS rather than fetched. Local voices start instantly. */
  local: boolean;
};

export type SpeechAdapter = {
  /** False when this environment cannot speak at all. The workspace hides the control. */
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
  /**
   * Live audio for anything that draws a level, when the adapter has one. Null means the
   * caller should animate procedurally rather than draw a flat line.
   */
  analyser: AnalyserNode | null;
};

/**
 * Strip markdown before speaking.
 *
 * The model writes markdown, and a synthesiser reads the asterisks out loud.
 * This is deliberately blunt — it removes syntax rather than parsing structure,
 * because the goal is a sentence that sounds right, not a faithful rendering.
 */
export function speakableText(markdown: string): string {
  return markdown
    // Fenced code is never worth reading aloud.
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

/**
 * The browser's own synthesiser.
 *
 * Voice loading is asynchronous and, in Chrome, returns an empty list on the
 * first synchronous call — hence the `voiceschanged` subscription rather than a
 * single read at mount.
 */
/* Support never changes after load, so the store never emits. */
const subscribeNever = () => () => {};
const hasSynthesis = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

/**
 * The one utterance the shared `speechSynthesis` is currently speaking,
 * shared across every `useBrowserSpeech` instance in the tree.
 *
 * The browser only ever plays one utterance at a time — a second reply's
 * "Read aloud" starting is correctly a global takeover, cancelling
 * whichever reply was speaking. But the console mounts a FRESH hook
 * instance per reply (`WorkspaceThread`'s meta row), and that instance's
 * own unmount effect used to call `speechSynthesis.cancel()`
 * unconditionally — so scrolling to (or otherwise unmounting) an OLDER
 * reply while a NEWER one was still reading cut the newer one off, because
 * the older instance's cleanup fired and cancelled the shared synthesiser
 * out from under it. This module-level ref is what lets an instance tell
 * "am I the one still talking" from "someone else already took over"
 * before it cancels — on `stop()` or on unmount — rather than cancelling
 * unconditionally.
 */
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function useBrowserSpeech({
  lang = "en-US",
  enabled = true,
}: { lang?: string; enabled?: boolean } = {}): SpeechAdapter {
  /* A fact about the environment, not state — so it is read, not set. Detecting
     it in an effect would make the first paint claim "unsupported" and then
     correct itself, which flickers the whole speech control. */
  const isSupported = useSyncExternalStore(subscribeNever, hasSynthesis, () => false);
  const [isSpeaking, setSpeaking] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechVoice[]>([]);
  const [picked, setVoiceId] = useState<string | null>(null);

  const nativeVoices = useRef<SpeechSynthesisVoice[]>([]);
  /** Whichever utterance THIS instance most recently started — compared
   *  against the module-level `activeUtterance` to decide whether this
   *  instance is still the one actually speaking. */
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

  /**
   * Which voice speaks.
   *
   * Derived rather than synced. Local voices first, because a network voice
   * stalls for a beat before the first syllable and that reads as the feature
   * being broken. `picked` holds only what the user chose, so the default keeps
   * following `lang` until they override it — an effect that wrote the default
   * into state would pin the first language the component ever saw.
   */
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
    // Only cancel the SHARED synthesiser when this instance is the one
    // actually speaking. An instance that never started anything (or whose
    // utterance another instance already superseded) has nothing of its own
    // to stop, and cancelling would cut off whoever the active speaker
    // actually is.
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

      // Cancel first. Queueing utterances means the assistant reads three
      // answers back to back after the user has moved on. This is the one
      // place a genuine global takeover is correct — whoever else was
      // speaking loses, on purpose — unlike `stop()` and the unmount
      // cleanup below, which must not cancel someone else's read.
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

  // A page that navigates away mid-sentence leaves the synthesiser talking to
  // an empty room — it is a global, not a component. But an individual
  // instance unmounting (a reply scrolled out of the transcript, say) must
  // NOT cancel the shared synthesiser unless it was actually the one
  // speaking — `myUtterance.current` is read here, not captured, so it
  // reflects whatever this instance most recently started even though the
  // effect itself only ever runs its cleanup once, on unmount.
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
