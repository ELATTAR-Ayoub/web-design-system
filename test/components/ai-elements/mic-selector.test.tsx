/**
 * @covers ai-mic-selector
 *
 * `navigator.mediaDevices` is stubbed (jsdom has none): enumerateDevices
 * returns two inputs, getUserMedia grants permission.
 */
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  MicSelector,
  MicSelectorContent,
  MicSelectorEmpty,
  MicSelectorItem,
  MicSelectorLabel,
  MicSelectorList,
  MicSelectorTrigger,
  MicSelectorValue,
} from "@/components/ai-elements/mic-selector";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

const devices = [
  { deviceId: "a", kind: "audioinput", label: "Built-in Mic (1234:abcd)" },
  { deviceId: "b", kind: "audioinput", label: "USB Mic" },
  { deviceId: "c", kind: "videoinput", label: "Camera" },
] as MediaDeviceInfo[];

beforeEach(() => {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: {
      enumerateDevices: vi.fn(async () => devices),
      getUserMedia: vi.fn(async () => ({ getTracks: () => [{ stop: vi.fn() }] })),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });
});
afterEach(() => vi.restoreAllMocks());

function Example({ onValueChange }: { onValueChange?: (v?: string) => void }) {
  return (
    <MicSelector onValueChange={onValueChange}>
      <MicSelectorTrigger>
        <MicSelectorValue />
      </MicSelectorTrigger>
      <MicSelectorContent>
        <MicSelectorEmpty />
        <MicSelectorList>
          {(list) =>
            list.map((d) => (
              <MicSelectorItem key={d.deviceId} value={d.deviceId}>
                <MicSelectorLabel device={d} />
              </MicSelectorItem>
            ))
          }
        </MicSelectorList>
      </MicSelectorContent>
    </MicSelector>
  );
}

describe("MicSelector", () => {
  it("shows the placeholder before a device is chosen", async () => {
    render(<Example />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByText("Select microphone...")).toBeInTheDocument();
  });

  it("lists only audio inputs once opened and requests permission", async () => {
    const user = setup();
    render(<Example />);
    await user.click(screen.getByRole("button"));
    expect(await screen.findByText("USB Mic")).toBeInTheDocument();
    expect(screen.queryByText("Camera")).not.toBeInTheDocument();
    await waitFor(() => expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled());
  });

  it("never opens narrower than a readable list, even from a tiny trigger", async () => {
    const user = setup();
    render(<Example />);
    await user.click(screen.getByRole("button"));
    await screen.findByText("USB Mic");
    expect(document.querySelector("[data-slot=popover-content]")).toHaveClass("min-w-64");
  });

  it("splits the hardware id out of the label and mutes it", async () => {
    const user = setup();
    render(<Example />);
    await user.click(screen.getByRole("button"));
    const id = await screen.findByText("(1234:abcd)");
    expect(id.className).toContain("text-muted-foreground");
  });

  it("selecting a device reports it and closes the list", async () => {
    const user = setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("USB Mic"));
    expect(onValueChange).toHaveBeenCalled();
    // The list closed; the only "USB Mic" left is the trigger's own value.
    await waitFor(() => expect(screen.queryAllByText("USB Mic")).toHaveLength(1));
    expect(screen.queryByText("Built-in Mic")).not.toBeInTheDocument();
  });
});
