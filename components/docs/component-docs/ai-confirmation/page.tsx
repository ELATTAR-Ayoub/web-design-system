import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { ConfirmationExamples, ConfirmationPreview, ConfirmationStateGrid } from "./confirmation-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-confirmation",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "Answer the request; the same alert then records the answer and drops its actions.",
      label: "Confirmation",
      render: <ConfirmationPreview />,
      source: `import {
  Confirmation, ConfirmationAccepted, ConfirmationAction, ConfirmationActions,
  ConfirmationRejected, ConfirmationRequest, ConfirmationTitle,
} from "@/components/ai-elements/confirmation";

<Confirmation approval={{ id: "step-4" }} state="approval-requested">
  <ConfirmationTitle>
    <ConfirmationRequest>Send the reminder to 3 customers?</ConfirmationRequest>
    <ConfirmationAccepted>Approved.</ConfirmationAccepted>
    <ConfirmationRejected>Declined.</ConfirmationRejected>
  </ConfirmationTitle>
  <ConfirmationActions>
    <ConfirmationAction variant="outline" onClick={decline}>Decline</ConfirmationAction>
    <ConfirmationAction onClick={approve}>Approve</ConfirmationAction>
  </ConfirmationActions>
</Confirmation>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It is built on the system&apos;s Alert and Button, and takes its state type from the AI SDK&apos;s <code className="type-code">ToolUIPart</code>.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Confirmation takes the tool part's state and its approval record and shows the matching child: ConfirmationRequest while the state is approval-requested, ConfirmationAccepted or ConfirmationRejected once the state is approval-responded, output-denied or output-available. Put all three inside ConfirmationTitle and let the state choose. ConfirmationActions renders only while approval is requested. With no approval, or while the tool is still input-streaming or input-available, the whole component renders null.",
      language: "tsx",
      code: `<Confirmation approval={part.approval} state={part.state}>
  <ConfirmationTitle>
    <ConfirmationRequest>Allow this tool to run?</ConfirmationRequest>
    <ConfirmationAccepted>You allowed it.</ConfirmationAccepted>
    <ConfirmationRejected>You declined it.</ConfirmationRejected>
  </ConfirmationTitle>
  <ConfirmationActions>
    <ConfirmationAction onClick={() => respond(false)} variant="outline">Decline</ConfirmationAction>
    <ConfirmationAction onClick={() => respond(true)}>Allow</ConfirmationAction>
  </ConfirmationActions>
</Confirmation>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The visible state is a function of the tool state and the approval record, not of local component state.",
      blocks: [
        { body: <ConfirmationStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: the request text with Decline and Approve. <strong>hover</strong>, <strong>focus-visible</strong>, <strong>pressed</strong> and <strong>disabled</strong>: inherited from Button — ConfirmationAction renders a real <code className="type-code">Button</code>, so fill, ring and press feel are not redrawn; disabling is the caller&apos;s <code className="type-code">disabled</code> prop. <strong>loading</strong>: N/A — the component has no pending visual; while the tool is <code className="type-code">input-streaming</code> or <code className="type-code">input-available</code> it renders nothing. <strong>success</strong>: the Accepted child, shown once approved. <strong>error</strong>: N/A as a failure — a decline is a recorded answer shown by the Rejected child, in the same neutral alert. <strong>empty</strong>: no <code className="type-code">approval</code> prop renders <code className="type-code">null</code>, so a tool that needs no approval leaves no empty alert behind.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description: "An answer recorded with a reason, with no actions left to press.",
      label: "Examples",
      render: <ConfirmationExamples />,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/confirmation.tsx.",
      blocks: [
        {
          label: "Confirmation",
          body: (
            <Meta
              items={[
                { k: "state", v: 'ToolUIPart["state"], required — decides which children show.' },
                { k: "approval?", v: "{ id: string; approved?: boolean; reason?: string } | undefined — approved is absent while the request is open. Without it the component renders null." },
                { k: "…Alert props", v: 'className and the rest go to the Alert; the base is "flex flex-col gap-2".' },
              ]}
            />
          ),
        },
        {
          label: "ConfirmationTitle",
          body: <Meta items={[{ k: "…AlertDescription props", v: 'Renders inline, so request and answer text sit on one line with any glyph you add.' }]} />,
        },
        {
          label: "ConfirmationRequest, ConfirmationAccepted, ConfirmationRejected",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode. Request shows only in approval-requested. Accepted shows when approval.approved is true and the state is approval-responded, output-denied or output-available. Rejected shows when approved is false in the same states." },
              ]}
            />
          ),
        },
        {
          label: "ConfirmationActions",
          body: <Meta items={[{ k: "…div props", v: "Rendered only in approval-requested; a right-aligned row with gap-2." }]} />,
        },
        {
          label: "ConfirmationAction",
          body: (
            <Meta
              items={[
                { k: "size?", v: 'Button size, default "sm" (32px) — the compact action row beside one other small control.' },
                { k: "…Button props", v: 'variant, onClick, disabled and the rest pass through; type is always "button".' },
              ]}
            />
          ),
        },
        {
          label: "Using the sub-parts outside Confirmation",
          body: <Meta items={[{ k: "Context", v: "Request, Accepted, Rejected and Actions read the state from Confirmation's context and throw if used outside it." }]} />,
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description: "An Alert with real buttons.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: 'The root is the system Alert in its default variant, which carries role="status": a polite live region, so a request that appears is announced at the next pause rather than interrupting. Pass role="alert" yourself when a request is urgent. A recorded answer is not new news, which is why the workspace gives it a record class and no actions.' },
                { k: "Accessible names", v: "Each action is a Button named by its visible text (Approve, Decline); the request itself is the alert's text." },
                { k: "Keyboard", v: "Tab reaches each action in DOM order, Enter or Space activates it. No custom key handling." },
                { k: "Target size", v: "The default size is sm, 32px, which RULES allows only beside other small controls; here the two actions sit side by side in one row. Pass size=\"default\" for a standalone action." },
                { k: "Motion", v: "None of its own; the Alert enters with whatever the host applies." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why this exists",
      blocks: [
        {
          body: (
            <Note tone="action">
              The agent asks before doing anything it is unsure about, and the answer has to be kept where the question was. The AgentWorkspace uses this in <code className="type-code">components/agent/workspace/run-inline.tsx</code>: the plan-approval request (Approve plan v-n to start the run), the recorded rejection notice on a plan, and the per-step Verify or Skip prompt for a low-confidence step, which becomes a quiet Verified or Skipped record once answered. Vendored change: the action buttons duplicated Button&apos;s own small size by hand (<code className="type-code">h-8 px-3 text-sm</code>), so ConfirmationAction now just defaults to <code className="type-code">size=&quot;sm&quot;</code>.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
