/**
 * @covers voice
 *
 * Named outright because a test is mapped to a capability by the module
 * it imports, and `@/components/agent/parts/voice` reads as `voice`, not as the
 * contract row `voice`.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { speakableText, useBrowserSpeech } from "@/components/agent/voice/speech";


/* ── speech ────────────────────────────────────────────────────────────────── */

describe("speakableText", () => {
  it("strips markdown syntax rather than reading punctuation aloud", () => {
    expect(speakableText("**Value** is not *price*.")).toBe("Value is not price.");
    expect(speakableText("- one\n- two")).toBe("one two");
    expect(speakableText("[a link](https://example.com)")).toBe("a link");
    expect(speakableText("`code()`")).toBe("code()");
  });

  it("replaces a fenced code block rather than reading source code aloud", () => {
    expect(speakableText("before\n```ts\nconst x = 1;\n```\nafter")).toBe(
      "before — code block — after",
    );
  });
});

/**
 * `useBrowserSpeech`'s speak/pause/resume/stop cycle, with `speechSynthesis`
 * and `SpeechSynthesisUtterance` stubbed at the seam this hook actually reads
 * — jsdom defines neither, matching row 105's documented gap.
 */
describe("useBrowserSpeech — the speak/pause/resume/stop cycle, speechSynthesis stubbed at the seam", () => {
  class StubUtterance {
    text: string;
    lang = "";
    voice: unknown = null;
    onstart: (() => void) | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(text: string) {
      this.text = text;
    }
  }

  function stubSynthesis() {
    const synth = {
      getVoices: vi.fn(() => [] as SpeechSynthesisVoice[]),
      speak: vi.fn((utterance: StubUtterance) => utterance.onstart?.()),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true, writable: true });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: StubUtterance,
      configurable: true,
      writable: true,
    });
    return synth;
  }

  /* Each test explicitly unmounts before the globals it installed are torn
     down below — `useBrowserSpeech`'s own unmount effect calls
     `speechSynthesis.cancel()`, and running that against an already-deleted
     stub is a false failure that has nothing to do with the hook. */
  afterEach(() => {
    Reflect.deleteProperty(window, "speechSynthesis");
    Reflect.deleteProperty(window, "SpeechSynthesisUtterance");
  });

  it("is reported supported once window.speechSynthesis exists", () => {
    stubSynthesis();
    const { result, unmount } = renderHook(() => useBrowserSpeech());
    expect(result.current.isSupported).toBe(true);
    unmount();
  });

  it("speak() cancels any prior utterance, then drives a stripped-markdown utterance through the seam", () => {
    const synth = stubSynthesis();
    const { result, unmount } = renderHook(() => useBrowserSpeech());

    act(() => result.current.speak("**bold** text"));

    expect(synth.cancel).toHaveBeenCalledTimes(1);
    expect(synth.speak).toHaveBeenCalledTimes(1);
    const utterance = synth.speak.mock.calls[0][0] as StubUtterance;
    expect(utterance.text).toBe("bold text");
    // The stub's speak() fires onstart synchronously — the seam this hook
    // listens on for `isSpeaking`.
    expect(result.current.isSpeaking).toBe(true);
    unmount();
  });

  it("stop() cancels synthesis and clears speaking/paused state", () => {
    const synth = stubSynthesis();
    const { result, unmount } = renderHook(() => useBrowserSpeech());

    act(() => result.current.speak("hello"));
    act(() => result.current.stop());

    expect(synth.cancel).toHaveBeenCalledTimes(2);
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.isPaused).toBe(false);
    unmount();
  });

  it("pause()/resume() call the seam and toggle isPaused", () => {
    const synth = stubSynthesis();
    const { result, unmount } = renderHook(() => useBrowserSpeech());

    act(() => result.current.speak("hello"));
    act(() => result.current.pause());
    expect(synth.pause).toHaveBeenCalledTimes(1);
    expect(result.current.isPaused).toBe(true);

    act(() => result.current.resume());
    expect(synth.resume).toHaveBeenCalledTimes(1);
    expect(result.current.isPaused).toBe(false);
    unmount();
  });

  it("an empty utterance after stripping markdown never reaches the seam", () => {
    const synth = stubSynthesis();
    const { result, unmount } = renderHook(() => useBrowserSpeech());

    // speakableText("**  **") strips the bold markers and trims to "" —
    // pure markdown syntax with no actual words.
    act(() => result.current.speak("**  **"));

    expect(synth.speak).not.toHaveBeenCalled();
    unmount();
  });

  /**
   * Fix round: `WorkspaceThread` mounts a fresh `useBrowserSpeech()` per
   * reply's meta row. Two instances — A (an older reply, still speaking) and
   * B (a newer one) — exercise the module-level `activeUtterance` tracking
   * that keeps an unrelated instance's unmount from cutting off whichever
   * instance actually owns the current read.
   */
  describe("cross-instance: only the active speaker cancels the shared synthesiser", () => {
    it("B unmounting while A speaks does not cancel A's read", () => {
      const synth = stubSynthesis();
      const a = renderHook(() => useBrowserSpeech());
      const b = renderHook(() => useBrowserSpeech());

      act(() => a.result.current.speak("A is reading this"));
      synth.cancel.mockClear();

      b.unmount();

      expect(synth.cancel).not.toHaveBeenCalled();
      expect(a.result.current.isSpeaking).toBe(true);
      a.unmount();
    });

    it("A unmounting while it is the one actually speaking does cancel", () => {
      const synth = stubSynthesis();
      const a = renderHook(() => useBrowserSpeech());

      act(() => a.result.current.speak("A is reading this"));
      synth.cancel.mockClear();

      a.unmount();

      expect(synth.cancel).toHaveBeenCalledTimes(1);
    });

    it("B starting a read while A speaks returns A's own state to not-speaking", () => {
      const synth = stubSynthesis();
      const a = renderHook(() => useBrowserSpeech());
      const b = renderHook(() => useBrowserSpeech());

      act(() => a.result.current.speak("A is reading this"));
      expect(a.result.current.isSpeaking).toBe(true);

      const utteranceA = synth.speak.mock.calls[0][0] as StubUtterance;
      act(() => {
        b.result.current.speak("B takes over");
        // The real `speechSynthesis.cancel()` a genuine takeover calls fires
        // the superseded utterance's own `onend` — the stub does not do
        // this automatically, so it is driven here the way a real browser
        // would drive it, to prove A's local state still follows its own
        // utterance's lifecycle regardless of the module-level bookkeeping.
        utteranceA.onend?.();
      });

      expect(a.result.current.isSpeaking).toBe(false);
      expect(b.result.current.isSpeaking).toBe(true);

      a.unmount();
      b.unmount();
    });
  });
});
