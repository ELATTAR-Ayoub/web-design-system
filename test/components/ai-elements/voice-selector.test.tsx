/**
 * @covers ai-voice-selector
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  VoiceSelector,
  VoiceSelectorAccent,
  VoiceSelectorAge,
  VoiceSelectorAttributes,
  VoiceSelectorBullet,
  VoiceSelectorContent,
  VoiceSelectorDescription,
  VoiceSelectorEmpty,
  VoiceSelectorGender,
  VoiceSelectorGroup,
  VoiceSelectorInput,
  VoiceSelectorItem,
  VoiceSelectorList,
  VoiceSelectorName,
  VoiceSelectorPreview,
  VoiceSelectorTrigger,
} from "@/components/ai-elements/voice-selector";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

function Example({ onValueChange }: { onValueChange?: (v?: string) => void }) {
  return (
    <VoiceSelector onValueChange={onValueChange}>
      <VoiceSelectorTrigger>Pick a voice</VoiceSelectorTrigger>
      <VoiceSelectorContent>
        <VoiceSelectorInput placeholder="Search voices..." />
        <VoiceSelectorList>
          <VoiceSelectorEmpty>No voices found.</VoiceSelectorEmpty>
          <VoiceSelectorGroup heading="Voices">
            <VoiceSelectorItem onSelect={() => onValueChange?.("ada")} value="ada">
              <VoiceSelectorName>Ada</VoiceSelectorName>
              <VoiceSelectorDescription>Warm and clear</VoiceSelectorDescription>
              <VoiceSelectorAttributes>
                <VoiceSelectorGender value="female" />
                <VoiceSelectorBullet />
                <VoiceSelectorAccent value="british" />
                <VoiceSelectorBullet />
                <VoiceSelectorAge>34</VoiceSelectorAge>
              </VoiceSelectorAttributes>
            </VoiceSelectorItem>
            <VoiceSelectorItem value="bo">
              <VoiceSelectorName>Bo</VoiceSelectorName>
            </VoiceSelectorItem>
          </VoiceSelectorGroup>
        </VoiceSelectorList>
      </VoiceSelectorContent>
    </VoiceSelector>
  );
}

describe("VoiceSelector", () => {
  it("opens, lists voices, and selecting reports the value", async () => {
    const user = setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Pick a voice" }));
    await screen.findByText("Ada");
    // No corner ✕ over the search field.
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    await user.click(screen.getByText("Ada"));
    expect(onValueChange).toHaveBeenCalledWith("ada");
  });

  it("filters by search text and shows the empty state", async () => {
    const user = setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Pick a voice" }));
    await user.type(await screen.findByPlaceholderText("Search voices..."), "zzz");
    expect(await screen.findByText("No voices found.")).toBeInTheDocument();
  });

  it("attribute parts carry type-small, never raw text-xs", async () => {
    const user = setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Pick a voice" }));
    const age = await screen.findByText("34");
    expect(age.className).toContain("type-small");
    expect(age.className).toContain("tabular-nums");
    expect(age.className).not.toMatch(/\btext-xs\b/);
    expect(screen.getByText("Warm and clear").className).toContain("type-small");
    expect(screen.getByText("Ada").className).toContain("type-nav");
    expect(screen.getByText("🇬🇧")).toBeInTheDocument();
    // gender renders a decorative icon through <Icon>
    expect(age.closest("[data-slot='command-item']")?.querySelector("svg[aria-hidden='true']")).not.toBeNull();
  });
});

describe("VoiceSelectorPreview", () => {
  it("plays, shows pause while playing, and disables while loading", async () => {
    const user = setup();
    const onPlay = vi.fn();
    const { rerender } = render(<VoiceSelectorPreview onPlay={onPlay} />);
    await user.click(screen.getByRole("button", { name: "Play preview" }));
    expect(onPlay).toHaveBeenCalledTimes(1);

    // Nested in a row: 24px visual (size-6), 44px hit area via a 10px
    // pseudo-element outset on each side (24 + 2 x 10).
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("size-6");
    expect(cls).toContain("overflow-visible");
    expect(cls).toContain("after:-inset-2.5");

    rerender(<VoiceSelectorPreview playing />);
    expect(screen.getByRole("button", { name: "Pause preview" })).toBeEnabled();

    rerender(<VoiceSelectorPreview loading />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
