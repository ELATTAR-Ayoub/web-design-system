/**
 * Smoke test for the `ai-input` documentation group: every specimen file and
 * every page's section render nodes render without throwing, and each
 * component's main control has the accessible name its page documents.
 *
 * @covers ai-prompt-input
 * @covers ai-attachments
 * @covers ai-model-selector
 * @covers ai-mic-selector
 * @covers ai-speech-input
 * @covers ai-transcription
 * @covers ai-voice-selector
 * @covers agent-voice-orb
 * @covers agent-generated-image
 * @covers agent-effort-slider
 * @covers agent-spark-field
 *
 * Stubs, each at the seam the component reads:
 *  - `navigator.mediaDevices` (MicSelector lists the machine's inputs);
 *  - canvas `getContext` returning null, so SparkField's loop never starts.
 */
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { spec as effortSliderSpec } from "@/components/docs/component-docs/agent-effort-slider/page";
import { EffortSliderSpecimen } from "@/components/docs/component-docs/agent-effort-slider/effort-slider-specimen";
import { spec as generatedImageSpec } from "@/components/docs/component-docs/agent-generated-image/page";
import { GeneratedImageSpecimen } from "@/components/docs/component-docs/agent-generated-image/generated-image-specimen";
import { spec as voiceOrbSpec } from "@/components/docs/component-docs/agent-voice-orb/page";
import { VoiceOrbSpecimen } from "@/components/docs/component-docs/agent-voice-orb/voice-orb-specimen";
import { spec as sparkFieldSpec } from "@/components/docs/component-docs/agent-spark-field/page";
import { SparkFieldSpecimen } from "@/components/docs/component-docs/agent-spark-field/spark-field-specimen";
import { spec as attachmentsSpec } from "@/components/docs/component-docs/ai-attachments/page";
import {
  AttachmentHoverSpecimen,
  AttachmentsEmptySpecimen,
  AttachmentsSpecimen,
} from "@/components/docs/component-docs/ai-attachments/attachments-specimen";
import { spec as micSelectorSpec } from "@/components/docs/component-docs/ai-mic-selector/page";
import {
  MicSelectorCompactSpecimen,
  MicSelectorSpecimen,
} from "@/components/docs/component-docs/ai-mic-selector/mic-selector-specimen";
import { spec as modelSelectorSpec } from "@/components/docs/component-docs/ai-model-selector/page";
import { ModelSelectorSpecimen } from "@/components/docs/component-docs/ai-model-selector/model-selector-specimen";
import { spec as promptInputSpec } from "@/components/docs/component-docs/ai-prompt-input/page";
import {
  PromptInputSpecimen,
  SubmitStatuses,
} from "@/components/docs/component-docs/ai-prompt-input/prompt-input-specimen";
import { spec as speechInputSpec } from "@/components/docs/component-docs/ai-speech-input/page";
import { SpeechInputSpecimen } from "@/components/docs/component-docs/ai-speech-input/speech-input-specimen";
import { spec as transcriptionSpec } from "@/components/docs/component-docs/ai-transcription/page";
import { TranscriptionSpecimen } from "@/components/docs/component-docs/ai-transcription/transcription-specimen";
import { spec as voiceSelectorSpec } from "@/components/docs/component-docs/ai-voice-selector/page";
import {
  VoicePreviewStates,
  VoiceSelectorSpecimen,
} from "@/components/docs/component-docs/ai-voice-selector/voice-selector-specimen";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

beforeEach(() => {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: {
      enumerateDevices: vi.fn(async () => [
        { deviceId: "a", kind: "audioinput", label: "Built-in Mic (1234:abcd)" },
        { deviceId: "b", kind: "audioinput", label: "USB Mic" },
      ]),
      getUserMedia: vi.fn(async () => ({ getTracks: () => [{ stop: vi.fn() }] })),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

/** Every React node a page authors: showcase renders, install notes, disclosure bodies. */
function nodesOf(spec: ComponentDocSpec): ReactNode[] {
  return spec.sections.flatMap((section): ReactNode[] => {
    if (section.kind === "showcase" || section.kind === "effect") return [section.render];
    if (section.kind === "install") return section.notes ? [section.notes] : [];
    if (section.kind === "disclosure") return section.blocks.map((b) => b.body);
    return [];
  });
}

const PAGES: Array<[string, ComponentDocSpec]> = [
  ["ai-prompt-input", promptInputSpec],
  ["ai-attachments", attachmentsSpec],
  ["ai-model-selector", modelSelectorSpec],
  ["ai-mic-selector", micSelectorSpec],
  ["ai-speech-input", speechInputSpec],
  ["ai-transcription", transcriptionSpec],
  ["ai-voice-selector", voiceSelectorSpec],
  ["agent-voice-orb", voiceOrbSpec],
  ["agent-generated-image", generatedImageSpec],
  ["agent-effort-slider", effortSliderSpec],
  ["agent-spark-field", sparkFieldSpec],
];

describe("ai-input documentation pages", () => {
  it.each(PAGES)("%s: the spec names itself and renders every section node", (name, spec) => {
    expect(spec.name).toBe(name);
    const ids = spec.sections.map((s) => s.id);
    expect(ids.slice(0, 3)).toEqual(["preview", "installation", "usage"]);
    expect(ids).toContain("states");
    expect(ids).toContain("api");
    expect(ids).toContain("accessibility");
    expect(ids).toContain("why");
    expect(ids.at(-1)).toBe("source");
    for (const node of nodesOf(spec)) {
      const { unmount } = render(<>{node}</>);
      unmount();
    }
  });
});

describe("ai-prompt-input specimens", () => {
  it("names the textarea Message and the submit button Submit, and sends the typed text", async () => {
    const user = setup();
    render(<PromptInputSpecimen />);
    await user.type(screen.getByRole("textbox", { name: "Message" }), "hello");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByText(/Sent “hello” with 0 files/)).toBeInTheDocument();
  });

  it("names the submit button Stop while streaming", () => {
    render(<SubmitStatuses />);
    expect(screen.getAllByRole("button", { name: "Stop" })).toHaveLength(2);
  });
});

describe("ai-attachments specimens", () => {
  it("names each remove button after its file and removes the chip", async () => {
    const user = setup();
    render(<AttachmentsSpecimen variant="list" />);
    await user.click(screen.getByRole("button", { name: "Remove campaign-brief.pdf" }));
    const confirm = await screen.findByRole("alertdialog", { name: "Remove this attachment?" });
    await user.click(within(confirm).getByRole("button", { name: "Remove" }));
    await waitFor(() => expect(screen.queryByText("campaign-brief.pdf")).not.toBeInTheDocument());
    render(<AttachmentsEmptySpecimen />);
    render(<AttachmentHoverSpecimen />);
    expect(screen.getByText("No attachments")).toBeInTheDocument();
  });
});

describe("ai-model-selector specimens", () => {
  it("opens a dialog named by its title, with no corner close button", async () => {
    const user = setup();
    render(<ModelSelectorSpecimen />);
    await user.click(screen.getByRole("button", { name: "Sonnet" }));
    const dialog = await screen.findByRole("dialog", { name: "Choose a model" });
    expect(within(dialog).queryByRole("button", { name: /close/i })).not.toBeInTheDocument();
    await user.click(within(dialog).getByText("Haiku"));
    expect(screen.getByText("Using Haiku.")).toBeInTheDocument();
  });
});

describe("ai-mic-selector specimens", () => {
  it("lists the devices behind a trigger and picks one", async () => {
    const user = setup();
    render(<MicSelectorSpecimen />);
    await user.click(screen.getByRole("button", { name: /select microphone/i }));
    expect(await screen.findByText("USB Mic")).toBeInTheDocument();
    render(<MicSelectorCompactSpecimen />);
    expect(screen.getByRole("button", { name: "Choose microphone" })).toBeInTheDocument();
  });
});

describe("ai-speech-input specimens", () => {
  it("is a button named Start dictation", () => {
    render(<SpeechInputSpecimen />);
    expect(screen.getByRole("button", { name: "Start dictation" })).toBeInTheDocument();
    render(<SpeechInputSpecimen disabled compact />);
  });
});

describe("ai-transcription specimens", () => {
  it("marks the word at the current time active and seeks on a press", async () => {
    const user = setup();
    render(<TranscriptionSpecimen />);
    expect(screen.getByRole("button", { name: "came" })).toHaveAttribute("data-active", "true");
    await user.click(screen.getByRole("button", { name: "forecast" }));
    expect(screen.getByRole("button", { name: "forecast" })).toHaveAttribute("data-active", "true");
    render(<TranscriptionSpecimen seekable={false} initialTime={0} />);
  });
});

describe("ai-voice-selector specimens", () => {
  it("opens a dialog named by its title and names the preview buttons by their next action", async () => {
    const user = setup();
    render(<VoiceSelectorSpecimen />);
    await user.click(screen.getByRole("button", { name: "Voice: Ada" }));
    const dialog = await screen.findByRole("dialog", { name: "Choose a voice" });
    expect(within(dialog).queryByRole("button", { name: /^close$/i })).not.toBeInTheDocument();
    expect(within(dialog).getAllByRole("button", { name: "Play preview" })).toHaveLength(4);
    render(<VoicePreviewStates />);
  });
});

describe("agent-voice-orb specimens", () => {
  it("draws the orb and switches its state from the group", async () => {
    const user = setup();
    render(<VoiceOrbSpecimen />);
    expect(screen.getByRole("radiogroup", { name: "Voice state" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Voice: listening" })).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Speaking" }));
    expect(screen.getByRole("img", { name: "Voice: speaking" })).toBeInTheDocument();
  });
});

describe("agent-generated-image specimens", () => {
  it("draws the frame and switches its stage from the group", async () => {
    const user = setup();
    render(<GeneratedImageSpecimen />);
    expect(screen.getByRole("group", { name: "Generated image" }).dataset.stage).toBe("generating");
    await user.click(screen.getByRole("radio", { name: "Error" }));
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(screen.getByRole("group", { name: "Generated image" }).dataset.stage).toBe("generating");
  });
});

describe("agent-effort-slider specimens", () => {
  it("is a slider named Effort whose value text is the level and which steps with the keyboard", async () => {
    const user = setup();
    render(<EffortSliderSpecimen />);
    const slider = screen.getByRole("slider", { name: "Effort" });
    expect(slider).toHaveAttribute("aria-valuetext", "Medium");
    slider.focus();
    await user.keyboard("{End}");
    expect(slider).toHaveAttribute("aria-valuetext", "Max");
    expect(screen.getByText(/the last level/)).toBeInTheDocument();
  });
});

describe("agent-spark-field specimens", () => {
  it("is not armed until the box is focused at the last level", async () => {
    const user = setup();
    render(<SparkFieldSpecimen />);
    expect(screen.getByText(/Not armed/)).toBeInTheDocument();
    await user.click(screen.getByRole("textbox", { name: "Message" }));
    expect(screen.getByText("Armed: max effort, the box focused.")).toBeInTheDocument();
    expect(document.querySelector('[data-slot="spark-field"]')).toHaveAttribute("data-active");
  });
});
