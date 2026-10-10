"use client";

import * as React from "react";

import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

type Answer = "approved" | "declined" | null;

export function ConfirmationPreview() {
  const [answer, setAnswer] = React.useState<Answer>(null);
  const approval = answer === null ? { id: "step-4" } : { id: "step-4", approved: answer === "approved" };

  return (
    <Panel label="Confirmation" note={answer ?? "waiting for an answer"}>
      <Confirmation approval={approval} state={answer === null ? "approval-requested" : "approval-responded"}>
        <ConfirmationTitle>
          <ConfirmationRequest>Send the reminder to 3 customers with overdue invoices?</ConfirmationRequest>
          <ConfirmationAccepted>Approved. The reminders are going out.</ConfirmationAccepted>
          <ConfirmationRejected>Declined. Nothing was sent.</ConfirmationRejected>
        </ConfirmationTitle>
        <ConfirmationActions>
          <ConfirmationAction onClick={() => setAnswer("declined")} variant="outline">
            Decline
          </ConfirmationAction>
          <ConfirmationAction onClick={() => setAnswer("approved")}>Approve</ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>
      {answer !== null ? (
        <div className="mt-4">
          <ConfirmationAction onClick={() => setAnswer(null)} variant="ghost">
            Ask again
          </ConfirmationAction>
        </div>
      ) : null}
    </Panel>
  );
}

function Body() {
  return (
    <>
      <ConfirmationTitle>
        <ConfirmationRequest>Run the migration?</ConfirmationRequest>
        <ConfirmationAccepted>Approved.</ConfirmationAccepted>
        <ConfirmationRejected>Declined.</ConfirmationRejected>
      </ConfirmationTitle>
      <ConfirmationActions>
        <ConfirmationAction onClick={() => {}} variant="outline">
          Decline
        </ConfirmationAction>
        <ConfirmationAction onClick={() => {}}>Approve</ConfirmationAction>
      </ConfirmationActions>
    </>
  );
}

export function ConfirmationStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="approval-requested" note="request text and both actions">
        <Confirmation approval={{ id: "a" }} className="w-full max-w-xs" state="approval-requested">
          <Body />
        </Confirmation>
      </StateCell>
      <StateCell label="approved" note="approval-responded, approved: true">
        <Confirmation approval={{ id: "a", approved: true }} className="w-full max-w-xs" state="approval-responded">
          <Body />
        </Confirmation>
      </StateCell>
      <StateCell label="declined" note="output-denied, approved: false">
        <Confirmation approval={{ id: "a", approved: false }} className="w-full max-w-xs" state="output-denied">
          <Body />
        </Confirmation>
      </StateCell>
      <StateCell label="hidden" note="input-available renders null">
        <Confirmation approval={{ id: "a" }} className="w-full max-w-xs" state="input-available">
          <Body />
        </Confirmation>
        <span className="type-small text-muted-foreground">(nothing rendered)</span>
      </StateCell>
    </StateGrid>
  );
}

export function ConfirmationExamples() {
  return (
    <Panel label="Recorded answer" note="no actions once answered">
      <Confirmation approval={{ id: "b", approved: false, reason: "Not on a Friday." }} state="output-denied">
        <ConfirmationTitle>
          <ConfirmationRejected>Skipped. Reason given: not on a Friday.</ConfirmationRejected>
        </ConfirmationTitle>
      </Confirmation>
    </Panel>
  );
}
