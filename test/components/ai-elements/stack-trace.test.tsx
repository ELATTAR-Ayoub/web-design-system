/**
 * @covers ai-stack-trace
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  StackTrace,
  StackTraceActions,
  StackTraceContent,
  StackTraceCopyButton,
  StackTraceError,
  StackTraceErrorMessage,
  StackTraceErrorType,
  StackTraceExpandButton,
  StackTraceFrames,
  StackTraceHeader,
} from "@/components/ai-elements/stack-trace";

const trace = `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (/app/components/UserList.tsx:15:23)
    at node_modules/react-dom/cjs/react-dom.development.js:14985:18`;

function renderStackTrace(props: Partial<React.ComponentProps<typeof StackTrace>> = {}) {
  return render(
    <StackTrace trace={trace} {...props}>
      <StackTraceHeader>
        <StackTraceError>
          <StackTraceErrorType />
          <StackTraceErrorMessage />
        </StackTraceError>
        <StackTraceActions>
          <StackTraceCopyButton />
          <StackTraceExpandButton />
        </StackTraceActions>
      </StackTraceHeader>
      <StackTraceContent>
        <StackTraceFrames />
      </StackTraceContent>
    </StackTrace>
  );
}

describe("StackTrace", () => {
  it("parses the error type and message from the raw trace", () => {
    renderStackTrace();
    expect(screen.getByText("TypeError")).toHaveClass("text-destructive-ink");
    expect(
      screen.getByText("Cannot read properties of undefined (reading 'map')")
    ).toBeInTheDocument();
  });

  it("starts closed and opens on header click, per defaultOpen=false", () => {
    renderStackTrace();
    expect(screen.queryByText(/UserList\.tsx/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("TypeError"));
    expect(screen.getByText(/UserList\.tsx/)).toBeVisible();
  });

  it("the header is a focusable button that toggles on Enter and Space", () => {
    renderStackTrace();
    const header = screen.getByText("TypeError").closest("[role=button]") as HTMLElement;
    expect(header).toHaveAttribute("tabindex", "0");
    expect(header).toHaveAttribute("aria-expanded", "false");
    fireEvent.keyDown(header, { key: "Enter" });
    expect(screen.getByText(/UserList.tsx/)).toBeVisible();
    fireEvent.keyDown(header, { key: " " });
    expect(header).toHaveAttribute("aria-expanded", "false");
  });

  it("starts open when defaultOpen is set", () => {
    renderStackTrace({ defaultOpen: true });
    expect(screen.getByText(/UserList\.tsx/)).toBeVisible();
  });

  it("filters internal frames out of node_modules when showInternalFrames is false", () => {
    render(
      <StackTrace defaultOpen trace={trace}>
        <StackTraceContent>
          <StackTraceFrames showInternalFrames={false} />
        </StackTraceContent>
      </StackTrace>
    );
    expect(screen.getByText(/UserList\.tsx/)).toBeInTheDocument();
    expect(screen.queryByText(/react-dom\.development\.js/)).not.toBeInTheDocument();
  });

  it("calls onFilePathClick with file, line and column when a frame is clicked", () => {
    const onFilePathClick = vi.fn();
    render(
      <StackTrace defaultOpen onFilePathClick={onFilePathClick} trace={trace}>
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    );

    fireEvent.click(screen.getByText(/UserList\.tsx/));
    expect(onFilePathClick).toHaveBeenCalledWith(
      "/app/components/UserList.tsx",
      15,
      23
    );
  });

  it("copies the raw trace text", async () => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: vi.fn().mockResolvedValue(undefined) }, configurable: true });
    renderStackTrace();

    fireEvent.click(screen.getByRole("button", { name: "Copy stack trace" }));
    await screen.findByRole("button", { name: "Copied" });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(trace);
  });

  it("the header trigger keeps 44px; the copy button stays a plain icon button", () => {
    const { container } = renderStackTrace();
    expect(container.querySelector('[data-slot="collapsible-trigger"]')).toHaveClass(
      "min-h-(--size-target-min)"
    );
    expect(screen.getByRole("button", { name: "Copy stack trace" })).toHaveAttribute(
      "data-size",
      "icon"
    );
  });
});
