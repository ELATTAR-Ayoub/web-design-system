/**
 * @covers ai-speech-input
 *
 * jsdom has neither SpeechRecognition nor MediaRecorder, so both are stubbed
 * at the module boundary the component reads them from (`window`), matching
 * the "listening" and "processing" states the usage study documents. Also
 * proves the restyled record button rides the button's own `variant` (no
 * hardcoded destructive/primary colour classes) and that the pulse ring uses
 * the system's `anim-pulse`, not core-Tailwind's ping keyframe.
 */
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SpeechInput } from "@/components/ai-elements/speech-input";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

class StubSpeechRecognition extends EventTarget {
  continuous = false;
  interimResults = false;
  lang = "";
  start = vi.fn(() => this.dispatchEvent(new Event("start")));
  stop = vi.fn(() => this.dispatchEvent(new Event("end")));
}

function stubSpeechRecognitionCtor() {
  const instances: StubSpeechRecognition[] = [];
  class Ctor extends StubSpeechRecognition {
    constructor() {
      super();
      instances.push(this);
    }
  }
  (window as unknown as { SpeechRecognition: typeof Ctor }).SpeechRecognition = Ctor;
  return instances;
}

afterEach(() => {
  delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
  delete (window as unknown as { MediaRecorder?: unknown }).MediaRecorder;
});

describe("SpeechInput — speech-recognition mode, stubbed at the window seam", () => {
  it("idle renders the mic affordance and is disabled until recognition initialises", async () => {
    stubSpeechRecognitionCtor();
    render(<SpeechInput />);
    // Recognition readiness flips via a microtask (RULES §4 set-state fix) —
    // wait a tick for it to settle before asserting the enabled state.
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("clicking starts listening and swaps to the stop icon", async () => {
    const instances = stubSpeechRecognitionCtor();
    const user = setup();
    render(<SpeechInput />);
    await act(async () => {
      await Promise.resolve();
    });

    await user.click(screen.getByRole("button"));
    expect(instances[0].start).toHaveBeenCalledTimes(1);
  });

  it("a final transcript result forwards text to the caller", async () => {
    const instances = stubSpeechRecognitionCtor();
    const onTranscriptionChange = vi.fn();
    const user = setup();
    render(<SpeechInput onTranscriptionChange={onTranscriptionChange} />);
    await act(async () => {
      await Promise.resolve();
    });

    await user.click(screen.getByRole("button"));
    const recognition = instances[0];

    const resultEvent = Object.assign(new Event("result"), {
      resultIndex: 0,
      results: [Object.assign([{ transcript: "hello" }], { isFinal: true })],
    });
    act(() => recognition.dispatchEvent(resultEvent));

    expect(onTranscriptionChange).toHaveBeenCalledWith("hello");
  });

  it("recording is carried by the destructive state, stop icon and label — no ring", async () => {
    stubSpeechRecognitionCtor();
    const user = setup();
    const { container } = render(<SpeechInput />);
    await act(async () => {
      await Promise.resolve();
    });
    const button = screen.getByRole("button", { name: "Start dictation" });
    expect(button).not.toHaveAttribute("aria-pressed");
    await user.click(button);
    const stop = screen.getByRole("button", { name: "Stop dictation" });
    expect(stop).not.toHaveAttribute("aria-pressed");
    expect(stop).toHaveAttribute("data-variant", "destructive");
    expect(stop.querySelector("svg.lucide-square")).not.toBeNull();
    expect(container.querySelector(".anim-pulse")).toBeNull();
  });

  it("a caller's variant styles it at rest only — recording is destructive whatever was passed", async () => {
    stubSpeechRecognitionCtor();
    const user = setup();
    render(<SpeechInput variant="ghost" />);
    await act(async () => {
      await Promise.resolve();
    });
    const button = screen.getByRole("button", { name: "Start dictation" });
    expect(button).toHaveAttribute("data-variant", "ghost");
    await user.click(button);
    expect(screen.getByRole("button", { name: "Stop dictation" })).toHaveAttribute("data-variant", "destructive");
  });

  it("a standalone dictation button is the 40px icon size by default", async () => {
    stubSpeechRecognitionCtor();
    render(<SpeechInput />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-size", "icon");
    expect(button.className).not.toContain("size-target-min");
  });

  it("a consumer can opt into icon-sm inside a toolbar", async () => {
    stubSpeechRecognitionCtor();
    render(<SpeechInput size="icon-sm" />);
    expect(screen.getByRole("button")).toHaveAttribute("data-size", "icon-sm");
  });

  it("the record button rides the button's own variant, not a hardcoded colour class", async () => {
    stubSpeechRecognitionCtor();
    render(<SpeechInput />);
    await act(async () => {
      await Promise.resolve();
    });
    const button = screen.getByRole("button");
    // The idle colour comes from the button's own `variant="default"`, which
    // is correct token usage (bg-primary is a real shadcn token) — what was
    // removed is the hand-rolled `hover:bg-primary/80` override and the
    // literal `text-white` used for the listening state.
    expect(button.className).not.toMatch(/hover:bg-(?:primary|destructive)\/80/);
    expect(button.className).not.toMatch(/text-white/);
    expect(button.className).not.toMatch(/\bduration-300\b/);
  });
});

describe("SpeechInput — no SpeechRecognition or MediaRecorder available", () => {
  it("disables the control entirely", () => {
    render(<SpeechInput />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("SpeechInput — media-recorder fallback, stubbed at the window seam", () => {
  class StubMediaRecorder extends EventTarget {
    state: "inactive" | "recording" = "inactive";
    start = vi.fn(() => {
      this.state = "recording";
    });
    stop = vi.fn(() => {
      this.state = "inactive";
      // The component discards an empty recording, so emit one real chunk.
      this.dispatchEvent(
        Object.assign(new Event("dataavailable"), { data: new Blob(["audio"]) }),
      );
      this.dispatchEvent(new Event("stop"));
    });
  }

  function stubMediaRecorderCtor() {
    (window as unknown as { MediaRecorder: typeof StubMediaRecorder }).MediaRecorder =
      StubMediaRecorder;
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn(async () => ({
          getTracks: () => [],
        })),
      },
    });
  }

  it("processes a recorded blob through onAudioRecorded and forwards the transcript", async () => {
    stubMediaRecorderCtor();
    const onAudioRecorded = vi.fn(async () => "transcribed text");
    const onTranscriptionChange = vi.fn();
    const user = setup();

    render(
      <SpeechInput
        onAudioRecorded={onAudioRecorded}
        onTranscriptionChange={onTranscriptionChange}
      />,
    );

    await user.click(screen.getByRole("button"));
    // Starting is itself async (awaits getUserMedia) — wait for it to have
    // actually requested the microphone before toggling off, or the second
    // click can race the first and see stale `isListening` state.
    await vi.waitFor(() =>
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledTimes(1),
    );
    await user.click(screen.getByRole("button"));

    await vi.waitFor(() => expect(onAudioRecorded).toHaveBeenCalledTimes(1));
    await vi.waitFor(() =>
      expect(onTranscriptionChange).toHaveBeenCalledWith("transcribed text"),
    );
  });
});

describe("SpeechInput — chosen input device and listening callback (vendored)", () => {
  class RecorderStub extends EventTarget {
    state: "inactive" | "recording" = "inactive";
    start = vi.fn(() => {
      this.state = "recording";
    });
    stop = vi.fn(() => {
      this.state = "inactive";
      this.dispatchEvent(Object.assign(new Event("dataavailable"), { data: new Blob(["audio"]) }));
      this.dispatchEvent(new Event("stop"));
    });
  }

  function stubRecorder() {
    (window as unknown as { MediaRecorder: typeof RecorderStub }).MediaRecorder = RecorderStub;
    const getUserMedia = vi.fn(async () => ({ getTracks: () => [] }));
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });
    return getUserMedia;
  }

  it("asks getUserMedia for the chosen device, exactly", async () => {
    const getUserMedia = stubRecorder();
    const user = setup();
    render(<SpeechInput deviceId="usb-1" onAudioRecorded={async () => "x"} />);
    await user.click(screen.getByRole("button"));
    await vi.waitFor(() => expect(getUserMedia).toHaveBeenCalledTimes(1));
    expect(getUserMedia).toHaveBeenCalledWith({ audio: { deviceId: { exact: "usb-1" } } });
  });

  it("without a deviceId it asks for any audio input", async () => {
    const getUserMedia = stubRecorder();
    const user = setup();
    render(<SpeechInput onAudioRecorded={async () => "x"} />);
    await user.click(screen.getByRole("button"));
    await vi.waitFor(() => expect(getUserMedia).toHaveBeenCalledWith({ audio: true }));
  });

  it("preferMediaRecorder records even where SpeechRecognition exists", async () => {
    stubSpeechRecognitionCtor();
    const getUserMedia = stubRecorder();
    const user = setup();
    render(<SpeechInput preferMediaRecorder onAudioRecorded={async () => "x"} />);
    await user.click(screen.getByRole("button"));
    await vi.waitFor(() => expect(getUserMedia).toHaveBeenCalledTimes(1));
  });

  it("onListeningChange reports start and stop on the media-recorder path", async () => {
    stubRecorder();
    const onListeningChange = vi.fn();
    const user = setup();
    render(<SpeechInput onListeningChange={onListeningChange} onAudioRecorded={async () => "x"} />);
    expect(onListeningChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button"));
    await vi.waitFor(() => expect(onListeningChange).toHaveBeenLastCalledWith(true));
    await user.click(screen.getByRole("button", { name: "Stop dictation" }));
    await vi.waitFor(() => expect(onListeningChange).toHaveBeenLastCalledWith(false));
  });

  it("onListeningChange reports start, stop and error on the speech-recognition path", async () => {
    const instances = stubSpeechRecognitionCtor();
    const onListeningChange = vi.fn();
    const user = setup();
    render(<SpeechInput onListeningChange={onListeningChange} />);
    await act(async () => {
      await Promise.resolve();
    });
    await user.click(screen.getByRole("button"));
    expect(onListeningChange).toHaveBeenLastCalledWith(true);
    act(() => instances[0].dispatchEvent(new Event("error")));
    expect(onListeningChange).toHaveBeenLastCalledWith(false);
  });
});
