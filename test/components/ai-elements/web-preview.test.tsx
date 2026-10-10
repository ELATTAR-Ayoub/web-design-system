import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview";

describe("WebPreview", () => {
  it("throws when a sub-component renders outside WebPreview", () => {
    // Swallow the expected React error-boundary console noise for this one
    // assertion; the throw itself is the behaviour under test.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<WebPreviewUrl />)).toThrow(
      "WebPreview components must be used within a WebPreview"
    );
    spy.mockRestore();
  });

  it("renders the official composition and commits a typed URL to the iframe on Enter", () => {
    const handleUrlChange = vi.fn();
    render(
      <WebPreview defaultUrl="/" onUrlChange={handleUrlChange}>
        <WebPreviewNavigation>
          <WebPreviewNavigationButton tooltip="Reload">R</WebPreviewNavigationButton>
          <WebPreviewUrl />
        </WebPreviewNavigation>
        <WebPreviewBody />
      </WebPreview>
    );

    const input = screen.getByPlaceholderText("Enter URL...");
    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(handleUrlChange).toHaveBeenCalledWith("https://example.com");
    expect(screen.getByTitle("Preview")).toHaveAttribute(
      "src",
      "https://example.com"
    );
  });

  it("WebPreviewNavigationButton is a 32px icon-sm toolbar button", () => {
    render(
      <WebPreview>
        <WebPreviewNavigation>
          <WebPreviewNavigationButton tooltip="Go back">B</WebPreviewNavigationButton>
        </WebPreviewNavigation>
      </WebPreview>
    );
    const button = screen.getByRole("button", { name: "B" });
    expect(button).toHaveAttribute("data-size", "icon-sm");
    expect(button.className).not.toContain("size-target-min");
  });

  it("WebPreviewConsole starts collapsed, opens on click, and colours log levels via -ink tokens", () => {
    const logs = [
      { level: "log" as const, message: "loaded", timestamp: new Date() },
      { level: "warn" as const, message: "deprecated api", timestamp: new Date() },
      { level: "error" as const, message: "failed", timestamp: new Date() },
    ];
    render(
      <WebPreview>
        <WebPreviewConsole logs={logs} />
      </WebPreview>
    );

    // Collapsed by default: the trigger reports closed and Radix has not
    // mounted the log rows yet (they appear only after opening, below).
    const trigger = screen.getByRole("button", { name: "Console" });
    expect(trigger).toHaveAttribute("data-state", "closed");
    expect(screen.queryByText("failed")).not.toBeInTheDocument();
    // The type role is on a span: Button's own text-sm would beat it on the button.
    expect(screen.getByText("Console").className).toContain("type-nav");
    expect(trigger.className).toContain("min-h-(--size-target-min)");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "open");

    expect(screen.getByText("failed").className).toContain("text-destructive-ink");
    expect(screen.getByText("deprecated api").className).toContain("text-warning-ink");
    expect(screen.getByText("loaded").className).toContain("text-foreground");
  });
});
