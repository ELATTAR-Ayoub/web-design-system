import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  JSXPreview,
  JSXPreviewContent,
  JSXPreviewError,
} from "@/components/ai-elements/jsx-preview";

describe("JSXPreview", () => {
  it("renders parsed JSX through JSXPreviewContent", () => {
    render(
      <JSXPreview jsx='<div data-testid="parsed">hello</div>'>
        <JSXPreviewContent />
        <JSXPreviewError />
      </JSXPreview>
    );

    expect(screen.getByTestId("parsed")).toHaveTextContent("hello");
  });

  it("auto-closes an incomplete tag while isStreaming, instead of erroring", () => {
    render(
      <JSXPreview isStreaming jsx='<div data-testid="stream">partial'>
        <JSXPreviewContent />
        <JSXPreviewError />
      </JSXPreview>
    );

    expect(screen.getByTestId("stream")).toHaveTextContent("partial");
    // No error surfaces mid-stream — JSXPreviewError renders nothing.
    expect(screen.queryByText(/./, { selector: "[class*=destructive]" })).not.toBeInTheDocument();
  });

  it("surfaces a genuine parse error once streaming has ended, styled on the destructive-ink token", async () => {
    const onError = vi.fn();
    render(
      <JSXPreview jsx="<div>>>>broken" onError={onError}>
        <JSXPreviewContent />
        <JSXPreviewError />
      </JSXPreview>
    );

    await waitFor(() => expect(onError).toHaveBeenCalled());
    const error = await screen.findByText((_, node) => node?.tagName === "SPAN" && !!node.textContent);
    const errorBox = error.closest("div");
    expect(errorBox?.className).toContain("text-destructive-ink");
    expect(errorBox?.className).not.toContain("text-destructive ");
  });

  it("JSXPreviewError supports a render-prop child", async () => {
    render(
      <JSXPreview jsx="<div>>>>broken">
        <JSXPreviewContent />
        <JSXPreviewError>{((error: Error) => <span>Custom: {error.message}</span>) as never}</JSXPreviewError>
      </JSXPreview>
    );

    await waitFor(() => expect(screen.getByText(/Custom:/)).toBeInTheDocument());
  });
});
