/** The docs site's code viewer's copy control — furniture (components/ds/code-block.tsx), not a catalog item. */
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { CodeBlock } from "@/components/ds/code-block";
import { Toaster } from "@/components/ui/toaster";
import { OVERLAY_AXE_OPTIONS } from "../helpers";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

describe("CodeBlock copy control", () => {
  it("carries a named copy control", () => {
    render(<CodeBlock code="const x = 1;" language="ts" />);
    expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
  });

  it("copying rolls the glyph to a check and confirms via a live toast — two signals", async () => {
    const user = setup();
    const copy = vi.fn().mockResolvedValue(undefined);
    render(
      <>
        <CodeBlock code="const x = 1;" language="ts" copy={copy} />
        <Toaster />
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Copy code" }));
    expect(copy).toHaveBeenCalledWith("const x = 1;");

    // Signal 1: the control itself now reads "Copied".
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument(),
    );
    // Signal 2: a toast announced the outcome.
    await waitFor(() => expect(screen.getByText("Copied to clipboard")).toBeInTheDocument());
  });

  it("ships the failure path: a rejected copy reports human copy with a next step", async () => {
    const user = setup();
    const copy = vi.fn().mockRejectedValue(new Error("denied"));
    render(
      <>
        <CodeBlock code="const x = 1;" language="ts" copy={copy} />
        <Toaster />
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(() =>
      expect(screen.getByText("Couldn't copy the code")).toBeInTheDocument(),
    );
    // The control itself never claims success on a rejected write.
    expect(screen.queryByRole("button", { name: "Copied" })).not.toBeInTheDocument();
  });

  it("also carries the copy control on an unrecognised language, not only a highlighted one", () => {
    render(<CodeBlock code="plain text" />);
    expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
  });

  it("axe: a highlighted block with its copy control", async () => {
    const { container } = render(<CodeBlock code="const x = 1;" language="ts" />);
    expect(await axe(container, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

