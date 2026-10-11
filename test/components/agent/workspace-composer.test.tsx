/**
 * @covers agent-workspace
 *
 * `WorkspaceComposer` — the AI Elements `PromptInput` composition. jsdom has no
 * SpeechRecognition, MediaDevices or object URLs, so each is stubbed at the
 * `window` / `navigator` seam the components read them from.
 */
import * as React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  WorkspaceComposer,
  type VoiceState,
  type WorkspaceComposerProps,
} from "@/components/agent/workspace/workspace-composer";
import type { AgentTransport, ContextUsage, TransportCapabilities } from "@/components/agent/core/types";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

const capabilities: TransportCapabilities = {
  attachments: "content",
  models: true,
  approvals: false,
  branching: false,
};

function makeTransport(overrides: Partial<AgentTransport> = {}, caps: Partial<TransportCapabilities> = {}): AgentTransport {
  return {
    turns: [],
    send: vi.fn(),
    abort: vi.fn(),
    reset: vi.fn(),
    isLoading: false,
    error: null,
    isReady: true,
    pendingApprovals: [],
    capabilities: { ...capabilities, ...caps },
    ...overrides,
  };
}

const models = [
  { id: "m-fast", name: "Fast model", provider: "anthropic" },
  { id: "m-deep", name: "Deep model", provider: "openai" },
];

function Harness(props: Partial<WorkspaceComposerProps> & { initial?: string }) {
  const [value, setValue] = React.useState(props.initial ?? "");
  const [webSearch, setWebSearch] = React.useState(props.webSearch ?? false);
  const [model, setModel] = React.useState(props.model ?? "m-fast");
  return (
    <WorkspaceComposer
      transport={makeTransport()}
      value={value}
      onValueChange={setValue}
      onSubmit={vi.fn()}
      onStop={vi.fn()}
      status="ready"
      models={models}
      {...props}
      model={model}
      onModelChange={(id) => {
        setModel(id);
        props.onModelChange?.(id);
      }}
      webSearch={webSearch}
      onWebSearchChange={(on) => {
        setWebSearch(on);
        props.onWebSearchChange?.(on);
      }}
    />
  );
}

beforeEach(() => {
  let n = 0;
  URL.createObjectURL = vi.fn(() => `blob:test/${n++}`);
  URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
  vi.restoreAllMocks();
});

describe("WorkspaceComposer — text and submit", () => {
  it("typing reports every change", async () => {
    const user = setup();
    const onValueChange = vi.fn();
    render(<WorkspaceComposer {...baseProps()} value="" onValueChange={onValueChange} />);
    await user.type(screen.getByRole("textbox"), "hi");
    expect(onValueChange).toHaveBeenLastCalledWith("i");
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it("Enter sends and clears; Shift+Enter is a newline", async () => {
    const user = setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    const box = screen.getByRole("textbox");
    await user.type(box, "first{Shift>}{Enter}{/Shift}second");
    expect(onSubmit).not.toHaveBeenCalled();
    expect((box as HTMLTextAreaElement).value).toBe("first\nsecond");
    await user.keyboard("{Enter}");
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toBe("first\nsecond");
    await waitFor(() => expect((box as HTMLTextAreaElement).value).toBe(""));
  });

  it("will not send an empty message", async () => {
    const user = setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
    await user.type(screen.getByRole("textbox"), "{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("while streaming the submit control is Stop and calls onStop", async () => {
    const user = setup();
    const onStop = vi.fn();
    const onSubmit = vi.fn();
    render(<Harness status="streaming" onStop={onStop} onSubmit={onSubmit} />);
    const stop = screen.getByRole("button", { name: "Stop" });
    expect(stop).toBeEnabled();
    await user.click(stop);
    expect(onStop).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("a message typed while busy still goes to onSubmit (the controller queues it)", async () => {
    const user = setup();
    const onSubmit = vi.fn();
    render(<Harness status="streaming" onSubmit={onSubmit} initial="next one" />);
    await user.click(screen.getByRole("textbox"));
    await user.keyboard("{Enter}");
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith("next one", expect.any(Object)));
  });

  it("disabled blocks typing and submit and states the reason", () => {
    render(<Harness disabled disabledReason="Connecting to the agent…" initial="x" />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Connecting to the agent…");
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });
});

describe("WorkspaceComposer — attachments", () => {
  async function addFiles(files: File[]) {
    const input = screen.getByLabelText("Upload files") as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { files } });
    });
  }

  it("the + menu offers Add photos or files, and files show in the header", async () => {
    const user = setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: /add|attach|more/i }));
    expect(await screen.findByRole("menuitem", { name: "Add photos or files" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await addFiles([new File(["a,b"], "data.csv", { type: "text/csv" })]);
    expect(await screen.findByText("data.csv")).toBeInTheDocument();
  });

  it("passes our Attachment shape (name, mime, kind, size) to onSubmit and clears the strip", async () => {
    const user = setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} initial="see file" />);
    await addFiles([
      new File(["a,b\n1,2"], "data.csv", { type: "text/csv" }),
      new File(["png"], "chart.png", { type: "image/png" }),
    ]);
    await screen.findByText("data.csv");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const [text, options] = onSubmit.mock.calls[0];
    expect(text).toBe("see file");
    expect(options.attachments).toHaveLength(2);
    expect(options.attachments[0]).toMatchObject({ name: "data.csv", mime: "text/csv", kind: "data" });
    expect(options.attachments[1]).toMatchObject({ name: "chart.png", mime: "image/png", kind: "image" });
    expect(typeof options.attachments[0].id).toBe("string");
    await waitFor(() => expect(screen.queryByText("data.csv")).not.toBeInTheDocument());
  });

  it("an attachment can be removed before sending", async () => {
    const user = setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} initial="hi" />);
    await addFiles([new File(["x"], "gone.txt", { type: "text/plain" })]);
    await screen.findByText("gone.txt");
    await user.click(screen.getByRole("button", { name: "Remove" }));
    const confirm = await screen.findByRole("alertdialog", { name: "Remove this attachment?" });
    await user.click(within(confirm).getByRole("button", { name: "Remove" }));
    await waitFor(() => expect(screen.queryByText("gone.txt")).not.toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][1].attachments).toBeUndefined();
  });

  it("an image attachment previews on hover", async () => {
    const user = setup();
    render(<Harness />);
    await addFiles([new File(["png"], "chart.png", { type: "image/png" })]);
    const chip = await screen.findByText("chart.png");
    await user.hover(chip);
    const big = await screen.findAllByRole("img", { name: "chart.png" });
    expect(big.length).toBeGreaterThan(0);
  });

  it("no + menu when the transport carries no attachments", () => {
    render(<Harness transport={makeTransport({}, { attachments: "none" })} />);
    expect(screen.queryByRole("button", { name: /add|attach|more/i })).not.toBeInTheDocument();
  });
});

describe("WorkspaceComposer — web search and model", () => {
  it("the Search button toggles web search and is passed in the send options", async () => {
    const user = setup();
    const onWebSearchChange = vi.fn();
    const onSubmit = vi.fn();
    render(<Harness onWebSearchChange={onWebSearchChange} onSubmit={onSubmit} initial="q" />);
    const search = screen.getByRole("button", { name: /search/i });
    expect(search).toHaveAttribute("aria-pressed", "false");
    await user.click(search);
    expect(onWebSearchChange).toHaveBeenCalledWith(true);
    expect(search).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][1].webSearch).toBe(true);
  });

  it("choosing a model reports it and sends it with the message", async () => {
    const user = setup();
    const onModelChange = vi.fn();
    const onSubmit = vi.fn();
    render(<Harness onModelChange={onModelChange} onSubmit={onSubmit} initial="q" />);
    await user.click(screen.getByRole("button", { name: /fast model/i }));
    await user.click(await screen.findByText("Deep model"));
    expect(onModelChange).toHaveBeenCalledWith("m-deep");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][1].model).toBe("m-deep");
  });

  it("no model picker without models or without the capability", () => {
    const { rerender } = render(<Harness models={undefined} />);
    expect(screen.queryByRole("button", { name: /fast model/i })).not.toBeInTheDocument();
    rerender(<Harness transport={makeTransport({}, { models: false })} />);
    expect(screen.queryByRole("button", { name: /fast model/i })).not.toBeInTheDocument();
  });
});

describe("WorkspaceComposer — dictation (browser recogniser)", () => {
  class StubRecognition extends EventTarget {
    continuous = false;
    interimResults = false;
    lang = "";
    start = vi.fn(() => this.dispatchEvent(new Event("start")));
    stop = vi.fn(() => this.dispatchEvent(new Event("end")));
  }
  let instances: StubRecognition[] = [];

  beforeEach(() => {
    instances = [];
    class Ctor extends StubRecognition {
      constructor() {
        super();
        instances.push(this);
      }
    }
    (window as unknown as { SpeechRecognition: typeof Ctor }).SpeechRecognition = Ctor;
  });

  function result(text: string) {
    return Object.assign(new Event("result"), {
      resultIndex: 0,
      results: Object.assign([Object.assign([{ transcript: text, confidence: 1 }], { isFinal: true })], { length: 1 }),
    });
  }

  async function ready() {
    await act(async () => {
      await Promise.resolve();
    });
  }

  /** A harness whose status the test drives, recording every reported voice state. */
  function Run({ states, onSubmit }: { states: VoiceState[]; onSubmit?: () => void }) {
    const [status, setStatus] = React.useState<WorkspaceComposerProps["status"]>("ready");
    return (
      <>
        <button type="button" onClick={() => setStatus("streaming")}>go busy</button>
        <button type="button" onClick={() => setStatus("ready")}>go ready</button>
        <Harness status={status} onSubmit={onSubmit} onVoiceStateChange={(s) => states.push(s)} />
      </>
    );
  }

  async function dictate(user: ReturnType<typeof setup>, text: string) {
    await user.click(screen.getByRole("button", { name: "Start dictation" }));
    await act(async () => {
      instances[0].dispatchEvent(result(text));
    });
  }

  it("dictated text lands in the textarea, shows as a live transcript, and reports listening", async () => {
    const user = setup();
    const states: VoiceState[] = [];
    render(<Harness onVoiceStateChange={(s) => states.push(s)} />);
    await ready();
    await dictate(user, "hello");
    expect(states.at(-1)).toBe("listening");
    await act(async () => {
      instances[0].dispatchEvent(result("world"));
    });
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("hello world");
    const transcript = document.querySelector('[data-slot="transcription"]') as HTMLElement;
    expect(within(transcript).getByText("hello")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Stop dictation" }));
    // Stopping alone is not thinking: nothing has been sent yet.
    expect(states.at(-1)).toBe("idle");
    expect(document.querySelector('[data-slot="transcription"]')).toBeNull();
  });

  it("stopping without having said anything goes straight back to idle", async () => {
    const user = setup();
    const states: VoiceState[] = [];
    render(<Harness onVoiceStateChange={(s) => states.push(s)} />);
    await ready();
    await user.click(screen.getByRole("button", { name: "Start dictation" }));
    await user.click(screen.getByRole("button", { name: "Stop dictation" }));
    expect(states).toEqual(["listening", "idle"]);
  });

  it("a recogniser error goes back to idle", async () => {
    const user = setup();
    const states: VoiceState[] = [];
    render(<Harness onVoiceStateChange={(s) => states.push(s)} />);
    await ready();
    await user.click(screen.getByRole("button", { name: "Start dictation" }));
    await act(async () => {
      instances[0].dispatchEvent(new Event("error"));
    });
    expect(states).toEqual(["listening", "idle"]);
  });

  it("dictate, send: thinking until the send settles, then idle", async () => {
    const user = setup();
    const states: VoiceState[] = [];
    const onSubmit = vi.fn();
    render(<Run states={states} onSubmit={onSubmit} />);
    await ready();
    await dictate(user, "what is on my plate");
    await user.click(screen.getByRole("button", { name: "Stop dictation" }));
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(states.at(-1)).toBe("thinking");
    await user.click(screen.getByText("go busy"));
    expect(states.at(-1)).toBe("thinking");
    await user.click(screen.getByText("go ready"));
    expect(states.at(-1)).toBe("idle");
  });

  it("a message typed by hand never makes the voice think", async () => {
    const user = setup();
    const states: VoiceState[] = [];
    const onSubmit = vi.fn();
    render(<Run states={states} onSubmit={onSubmit} />);
    await ready();
    await user.type(screen.getByRole("textbox"), "typed");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(states).toEqual([]);
  });

  it("emptying the dictated text before sending drops it", async () => {
    const user = setup();
    const states: VoiceState[] = [];
    const onSubmit = vi.fn();
    render(<Run states={states} onSubmit={onSubmit} />);
    await ready();
    await dictate(user, "oops");
    await user.click(screen.getByRole("button", { name: "Stop dictation" }));
    await user.clear(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "typed instead");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(states.at(-1)).toBe("idle");
  });

  it("leaving while thinking reports idle", async () => {
    const user = setup();
    const states: VoiceState[] = [];
    const { unmount } = render(<Run states={states} />);
    await ready();
    await dictate(user, "hello");
    await user.click(screen.getByRole("button", { name: "Stop dictation" }));
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(states.at(-1)).toBe("thinking"));
    unmount();
    expect(states.at(-1)).toBe("idle");
  });

  it("pressing the mic never sends the message that is being typed", async () => {
    const user = setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} initial="draft" />);
    await ready();
    await user.click(screen.getByRole("button", { name: "Start dictation" }));
    await user.click(screen.getByRole("button", { name: "Stop dictation" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("draft");
  });

  it("offers no microphone choice on the browser recogniser (it cannot honour one)", async () => {
    render(<Harness />);
    await ready();
    expect(screen.getByRole("button", { name: "Start dictation" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Choose microphone" })).not.toBeInTheDocument();
  });

  it("hides dictation entirely where the browser cannot recognise speech", () => {
    delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    render(<Harness />);
    expect(screen.queryByRole("button", { name: "Start dictation" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Choose microphone" })).not.toBeInTheDocument();
  });
});

describe("WorkspaceComposer — dictation through transport.transcribe (chosen microphone)", () => {
  class StubRecorder extends EventTarget {
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
  let getUserMedia: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    (window as unknown as { MediaRecorder: typeof StubRecorder }).MediaRecorder = StubRecorder;
    getUserMedia = vi.fn(async () => ({ getTracks: () => [{ stop: vi.fn() }] }));
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        enumerateDevices: vi.fn(async () => [
          { deviceId: "mic-a", kind: "audioinput", label: "Built-in Mic" },
          { deviceId: "mic-b", kind: "audioinput", label: "USB Mic" },
        ]),
        getUserMedia,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
  });
  afterEach(() => {
    delete (window as unknown as { MediaRecorder?: unknown }).MediaRecorder;
  });

  function withTranscribe(transcribe: (b: Blob) => Promise<string>) {
    return makeTransport({ transcribe });
  }

  async function pickUsbMic(user: ReturnType<typeof setup>) {
    await user.click(screen.getByRole("button", { name: "Choose microphone" }));
    await user.click(await screen.findByText("USB Mic"));
  }

  it("joins the microphone picker to the dictation button as one split control", async () => {
    render(<Harness transport={withTranscribe(async () => "")} />);
    const picker = screen.getByRole("button", { name: "Choose microphone" });
    const dictate = screen.getByRole("button", { name: /dictation/i });
    const pair = picker.closest("[data-slot=composer-dictation]");
    expect(pair).not.toBeNull();
    expect(pair?.contains(dictate)).toBe(true);
    // One mic glyph for the pair: the picker shows only its chevron.
    expect(picker.querySelector("svg.lucide-mic")).toBeNull();
  });

  it("records from the chosen device and puts the transcript in the textarea", async () => {
    const user = setup();
    const states: VoiceState[] = [];
    const transcribe = vi.fn(async (blob: Blob) => (blob ? "spoken words" : ""));
    render(<Harness transport={withTranscribe(transcribe)} onVoiceStateChange={(s) => states.push(s)} />);
    await pickUsbMic(user);
    await user.click(screen.getByRole("button", { name: "Start dictation" }));
    await waitFor(() => expect(getUserMedia).toHaveBeenCalledWith({ audio: { deviceId: { exact: "mic-b" } } }));
    await waitFor(() => expect(states.at(-1)).toBe("listening"));
    await user.click(screen.getByRole("button", { name: "Stop dictation" }));
    await waitFor(() => expect(transcribe).toHaveBeenCalledTimes(1));
    expect(transcribe.mock.calls[0][0]).toBeInstanceOf(Blob);
    await waitFor(() => expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("spoken words"));
    expect(states.at(-1)).toBe("idle");
  });

  it("uses this path even where the browser also has a recogniser", async () => {
    (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = class extends EventTarget {};
    const user = setup();
    render(<Harness transport={withTranscribe(async () => "x")} />);
    await user.click(screen.getByRole("button", { name: "Start dictation" }));
    await waitFor(() => expect(getUserMedia).toHaveBeenCalledWith({ audio: true }));
  });

  it("says Transcribing… while the server works", async () => {
    const user = setup();
    let finish: (text: string) => void = () => {};
    const pending = new Promise<string>((resolve) => {
      finish = resolve;
    });
    render(<Harness transport={withTranscribe(() => pending)} />);
    await user.click(screen.getByRole("button", { name: "Start dictation" }));
    await waitFor(() => expect(getUserMedia).toHaveBeenCalled());
    await user.click(screen.getByRole("button", { name: "Stop dictation" }));
    expect(await screen.findByText("Transcribing…")).toBeInTheDocument();
    await act(async () => finish("done"));
    await waitFor(() => expect(screen.queryByText("Transcribing…")).not.toBeInTheDocument());
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("done");
  });

  it("a failed transcription toasts and leaves the textarea alone", async () => {
    const user = setup();
    const states: VoiceState[] = [];
    render(
      <Harness
        transport={withTranscribe(async () => {
          throw new Error("down");
        })}
        initial="keep me"
        onVoiceStateChange={(s) => states.push(s)}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Start dictation" }));
    await waitFor(() => expect(getUserMedia).toHaveBeenCalled());
    await user.click(screen.getByRole("button", { name: "Stop dictation" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("keep me");
    expect(states.at(-1)).toBe("idle");
    expect(screen.queryByText("Transcribing…")).not.toBeInTheDocument();
  });
});

describe("WorkspaceComposer — context meter", () => {
  const usage = (used: number): ContextUsage => ({ usedTokens: used, maxTokens: 100_000, inputTokens: used });

  it("renders only when the transport reports usage", () => {
    const { rerender } = render(<Harness />);
    expect(screen.queryByRole("img", { name: "Model context usage" })).not.toBeInTheDocument();
    rerender(<Harness transport={makeTransport({ usage: usage(20_000) })} />);
    expect(screen.getByRole("img", { name: "Model context usage" })).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });

  it("offers Summarise at 90% and above, and calls the transport", async () => {
    const user = setup();
    const summarise = vi.fn();
    const { rerender } = render(<Harness transport={makeTransport({ usage: usage(50_000), summarise })} />);
    expect(screen.queryByRole("button", { name: "Summarise" })).not.toBeInTheDocument();
    rerender(<Harness transport={makeTransport({ usage: usage(92_000), summarise })} />);
    await user.click(screen.getByRole("button", { name: "Summarise" }));
    expect(summarise).toHaveBeenCalledTimes(1);
  });

  it("no Summarise when the transport cannot summarise", () => {
    render(<Harness transport={makeTransport({ usage: usage(95_000) })} />);
    expect(screen.queryByRole("button", { name: "Summarise" })).not.toBeInTheDocument();
  });
});

describe("WorkspaceComposer — dock", () => {
  it("renders the dock above the input", () => {
    render(<Harness dock={<div data-testid="dock">Queued</div>} />);
    const dock = screen.getByTestId("dock");
    const form = screen.getByRole("textbox").closest("form") as HTMLElement;
    expect(dock.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

function baseProps(): WorkspaceComposerProps {
  return {
    transport: makeTransport(),
    value: "",
    onValueChange: vi.fn(),
    onSubmit: vi.fn(),
    onStop: vi.fn(),
    status: "ready",
    webSearch: false,
    onWebSearchChange: vi.fn(),
  };
}

describe("WorkspaceComposer — @ sources, / commands, skills and effort", () => {
  const sources = [
    { id: "docs", label: "Documents", description: "Specs and notes" },
    { id: "mail", label: "Mail" },
  ];
  const withSources = () => makeTransport({}, { sources: true });

  it("@ at the start of a word opens Sources; a pick becomes a chip and its id rides the send", async () => {
    const user = setup();
    const onSubmit = vi.fn();
    render(<Harness transport={withSources()} sources={sources} onSubmit={onSubmit} />);
    const box = screen.getByRole("textbox", { name: "Message" });
    await user.click(box);
    await user.keyboard("look in @");
    const palette = await screen.findByRole("dialog", { name: "Sources" });
    // The palette took the keystroke: the @ is not left in the message.
    expect(box).toHaveValue("look in ");
    await user.click(within(palette).getByText("Documents"));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Sources" })).toBeNull());
    expect(screen.getByRole("button", { name: "Remove Documents" })).toBeInTheDocument();
    await user.click(box);
    await user.keyboard("the spec{Enter}");
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith("look in the spec", expect.objectContaining({ sources: ["docs"] })),
    );
  });

  it("an @ inside a word is just text", async () => {
    const user = setup();
    render(<Harness transport={withSources()} sources={sources} />);
    const box = screen.getByRole("textbox", { name: "Message" });
    await user.click(box);
    await user.keyboard("me@example.com");
    expect(box).toHaveValue("me@example.com");
    expect(screen.queryByRole("dialog", { name: "Sources" })).toBeNull();
  });

  it("the + menu is one panel: files, then sources to tick, then skills", async () => {
    const user = setup();
    const onSubmit = vi.fn();
    const commands = [{ id: "plan", label: "Plan first", group: "skill" as const, directive: "Plan first:" }];
    render(<Harness transport={withSources()} sources={sources} commands={commands} onSubmit={onSubmit} initial="hi" />);
    await user.click(screen.getByRole("button", { name: "Add files, sources or skills" }));
    const menu = await screen.findByRole("menu");
    const items = Array.from(menu.querySelectorAll("[role=menuitem], [role=menuitemcheckbox]"));
    expect(items.map((i) => i.textContent?.trim())).toEqual(["Add photos or files", "Documents", "Mail", "Plan first"]);
    const docs = screen.getByRole("menuitemcheckbox", { name: "Documents" });
    await user.click(docs);
    // Several sources are picked in one visit: the panel stays open.
    expect(screen.getByRole("menuitemcheckbox", { name: "Documents" })).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Remove Documents" })).toBeInTheDocument();
    await user.click(screen.getByRole("textbox", { name: "Message" }));
    await user.keyboard("{Enter}");
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith("hi", expect.objectContaining({ sources: ["docs"] })));
  });

  it("offers no @ picker when the transport cannot take sources", async () => {
    const user = setup();
    render(<Harness sources={sources} />);
    expect(screen.queryByRole("button", { name: "Add sources" })).toBeNull();
    await user.click(screen.getByRole("textbox", { name: "Message" }));
    await user.keyboard("@");
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue("@");
  });

  it("/ opens Commands: a directive is written into the message, a run command runs", async () => {
    const user = setup();
    const run = vi.fn();
    const commands = [
      { id: "explain", label: "/explain", group: "command" as const, directive: "Explain it step by step." },
      { id: "summarise", label: "/summarise", group: "command" as const, run },
    ];
    render(<Harness commands={commands} />);
    const box = screen.getByRole("textbox", { name: "Message" });
    await user.click(box);
    await user.keyboard("/");
    const palette = await screen.findByRole("dialog", { name: "Commands" });
    await user.click(within(palette).getByText("/explain"));
    await waitFor(() => expect(box).toHaveValue("Explain it step by step. "));

    await user.click(box);
    await user.keyboard("{Control>}a{/Control}{Backspace}/");
    await user.click(within(await screen.findByRole("dialog", { name: "Commands" })).getByText("/summarise"));
    expect(run).toHaveBeenCalledTimes(1);
    expect(box).toHaveValue("");
  });

  it("offers skills in the + menu and writes the picked one into the message", async () => {
    const user = setup();
    const commands = [{ id: "plan", label: "Plan first", group: "skill" as const, directive: "Plan first:" }];
    render(<Harness commands={commands} />);
    await user.click(screen.getByRole("button", { name: "Add files, sources or skills" }));
    await user.click(await screen.findByRole("menuitem", { name: "Plan first" }));
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue("Plan first: "));
  });

  it("the Effort chip opens the effort slider, which steps the level from the keyboard", async () => {
    const user = setup();
    const onEffortChange = vi.fn();
    render(<Harness efforts={["Low", "Medium", "High"]} effort="Medium" onEffortChange={onEffortChange} />);
    await user.click(screen.getByRole("button", { name: "Choose effort, Medium" }));
    const slider = await screen.findByRole("slider", { name: "Effort" });
    expect(slider).toHaveAttribute("aria-valuetext", "Medium");
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(onEffortChange).toHaveBeenCalledWith("High");
    await user.keyboard("{Home}");
    expect(onEffortChange).toHaveBeenLastCalledWith("Low");
  });

  it("at Max the chip takes the agent colour and the box sparks while the message is focused", async () => {
    const user = setup();
    const { container, rerender } = render(<Harness efforts={["Low", "Max"]} effort="Low" onEffortChange={vi.fn()} />);
    const field = () => container.querySelector("[data-slot=spark-field]");
    await user.click(screen.getByRole("textbox", { name: "Message" }));
    expect(field()).not.toHaveAttribute("data-active");
    rerender(<Harness efforts={["Low", "Max"]} effort="Max" onEffortChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Choose effort, Max" })).toHaveClass("text-agent");
    expect(field()).toHaveAttribute("data-active");
    await user.click(document.body);
    expect(field()).not.toHaveAttribute("data-active");
  });

  it("renders no Effort control without levels", () => {
    render(<Harness efforts={[]} onEffortChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /Choose effort/ })).toBeNull();
  });

  it("puts the mic beside Send, after everything else in the bar", async () => {
    const w = window as unknown as { SpeechRecognition?: unknown };
    w.SpeechRecognition = class extends EventTarget {
      start() {}
      stop() {}
    };
    render(<Harness />);
    const mic = await screen.findByRole("button", { name: "Start dictation" });
    const send = screen.getByRole("button", { name: "Submit" });
    const search = screen.getByRole("button", { name: "Search the web" });
    expect(search.compareDocumentPosition(mic) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(mic.compareDocumentPosition(send) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    delete w.SpeechRecognition;
  });
});

describe("WorkspaceComposer — compact (phone width)", () => {
  afterEach(() => vi.restoreAllMocks());

  it("keeps only +, the mic and Send in the box; Search, the model and Effort move under it", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 360, height: 120 } as DOMRect);
    const { container } = render(
      <Harness efforts={["Low", "High"]} effort="Low" onEffortChange={vi.fn()} />,
    );
    const box = container.querySelector("[data-slot=input-group]")!;
    const below = container.querySelector("[data-slot=composer-below]")!;
    expect(below).not.toBeNull();
    for (const name of ["Search the web", "Choose effort, Low"]) {
      expect(within(below as HTMLElement).getByRole("button", { name })).toBeInTheDocument();
      expect(within(box as HTMLElement).queryByRole("button", { name })).toBeNull();
    }
    expect(within(below as HTMLElement).getByText("Fast model")).toBeInTheDocument();
    expect(within(box as HTMLElement).getByRole("button", { name: "Add files, sources or skills" })).toBeInTheDocument();
    expect(within(box as HTMLElement).getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("is not compact at a normal width", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 720, height: 120 } as DOMRect);
    const { container } = render(<Harness />);
    expect(container.querySelector("[data-slot=composer-below]")).toBeNull();
  });
});
