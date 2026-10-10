import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation";

const body = (
  <>
    <ConfirmationTitle>
      <ConfirmationRequest>Allow this?</ConfirmationRequest>
      <ConfirmationAccepted>You approved</ConfirmationAccepted>
      <ConfirmationRejected>You rejected</ConfirmationRejected>
    </ConfirmationTitle>
    <ConfirmationActions>
      <ConfirmationAction>Approve</ConfirmationAction>
    </ConfirmationActions>
  </>
);

describe("Confirmation", () => {
  it("renders nothing without approval or while input streams", () => {
    const { container, rerender } = render(
      <Confirmation state="approval-requested">{body}</Confirmation>,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(
      <Confirmation approval={{ id: "1" }} state="input-streaming">
        {body}
      </Confirmation>,
    );
    expect(container).toBeEmptyDOMElement();
  });
  it("requested: shows request and actions that fire", async () => {
    const onClick = vi.fn();
    render(
      <Confirmation approval={{ id: "1" }} state="approval-requested">
        <ConfirmationRequest>Allow this?</ConfirmationRequest>
        <ConfirmationActions>
          <ConfirmationAction onClick={onClick}>Approve</ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>,
    );
    expect(screen.getByText("Allow this?")).toBeInTheDocument();
    const b = screen.getByRole("button", { name: "Approve" });
    expect(b).toHaveClass("min-h-8");
    expect(b.className).not.toContain("size-target-min");
    await userEvent.setup().click(b);
    expect(onClick).toHaveBeenCalled();
  });
  it("accepted", () => {
    render(
      <Confirmation approval={{ id: "1", approved: true }} state="approval-responded">
        {body}
      </Confirmation>,
    );
    expect(screen.getByText("You approved")).toBeInTheDocument();
    expect(screen.queryByText("You rejected")).not.toBeInTheDocument();
    expect(screen.queryByText("Allow this?")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
  it("rejected", () => {
    render(
      <Confirmation approval={{ id: "1", approved: false }} state="output-denied">
        {body}
      </Confirmation>,
    );
    expect(screen.getByText("You rejected")).toBeInTheDocument();
    expect(screen.queryByText("You approved")).not.toBeInTheDocument();
  });
});
