/**
 * Authored documentation page for `ai-plan`.
 *
 * Live specimens render the real `Plan` from `components/ai-elements/plan.tsx`;
 * they live in `plan-specimen.tsx` because a spec module cannot carry
 * `"use client"`.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { PlanExamples, PlanShowcase, PlanStateGrid } from "./plan-specimen";

const SRC = "components/ai-elements/plan.tsx";

export const spec: ComponentDocSpec = {
  name: "ai-plan",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A collapsible card for the steps an agent intends to take. Press the chevron to fold the step list.",
      label: "Plan",
      render: <PlanShowcase />,
      source: `import { Plan, PlanAction, PlanContent, PlanDescription, PlanFooter, PlanHeader, PlanTitle, PlanTrigger } from "@/components/ai-elements/plan";

<Plan defaultOpen>
  <PlanHeader>
    <div className="flex min-w-0 flex-col gap-1">
      <PlanTitle>Fix the invoice export</PlanTitle>
      <PlanDescription>4 steps</PlanDescription>
    </div>
    <PlanAction>
      <PlanTrigger />
    </PlanAction>
  </PlanHeader>
  <PlanContent>{/* the steps */}</PlanContent>
  <PlanFooter>
    <Button size="sm">Run the plan</Button>
  </PlanFooter>
</Plan>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It composes the system&apos;s own Card, Collapsible and Button, and the Shimmer sibling for the streaming state.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Plan is a Card and a Collapsible at once, so open state is the Collapsible's (open, defaultOpen, onOpenChange). PlanTitle and PlanDescription take a plain string, not nodes, because isStreaming wraps it in Shimmer. Put PlanTrigger inside PlanAction (or anywhere under Plan) and the steps inside PlanContent.",
      language: "tsx",
      code: `import {
  Plan, PlanAction, PlanContent, PlanDescription, PlanHeader, PlanTitle, PlanTrigger,
} from "@/components/ai-elements/plan";

<Plan defaultOpen isStreaming={drafting}>
  <PlanHeader>
    <div className="flex min-w-0 flex-col gap-1">
      <PlanTitle>{goal}</PlanTitle>
      <PlanDescription>{drafting ? "Drafting the plan…" : \`\${steps.length} steps\`}</PlanDescription>
    </div>
    <PlanAction>
      <PlanTrigger />
    </PlanAction>
  </PlanHeader>
  <PlanContent>
    <ol>{steps.map((s) => <li key={s.id}>{s.title}</li>)}</ol>
  </PlanContent>
</Plan>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Open or collapsed, and streaming or not. The trigger is a ghost icon Button and inherits its states.",
      blocks: [
        { body: <PlanStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: open when <code className="type-code">defaultOpen</code> is set, collapsed otherwise; the content
                folds on <code className="type-code">anim-expand</code>/<code className="type-code">anim-collapse</code>.{" "}
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong>: on the trigger, inherited from Button
                variant ghost. <strong>loading</strong>: <code className="type-code">isStreaming</code> shimmers the title and description
                while the plan is still being drafted. <strong>success</strong>: N/A — a plan is a proposal; whether it ran lives in the
                run, not in this card. <strong>error</strong>: N/A — the card has no failure of its own; a rejected plan is told by a
                sibling (the workspace uses a Confirmation) inside PlanContent. <strong>disabled</strong>: N/A — a plan card is never
                inert; a caller disables its own action buttons. <strong>empty</strong>: N/A — a plan with no steps is a PlanContent with
                nothing in it; the caller decides whether to render the card at all.
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
      description: "A plan that starts folded and carries no footer.",
      label: "Collapsed",
      render: <PlanExamples />,
      source: `<Plan defaultOpen={false}>
  <PlanHeader>
    <div className="flex min-w-0 flex-col gap-1">
      <PlanTitle>Fix the invoice export</PlanTitle>
      <PlanDescription>4 steps</PlanDescription>
    </div>
    <PlanAction><PlanTrigger /></PlanAction>
  </PlanHeader>
  <PlanContent>{/* steps */}</PlanContent>
</Plan>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: `Read from ${SRC}.`,
      blocks: [
        {
          label: "Plan",
          body: (
            <Meta
              items={[
                { k: "isStreaming?", v: "boolean, default false — provided to PlanTitle and PlanDescription through context; they render their text inside Shimmer." },
                { k: "defaultOpen? / open? / onOpenChange?", v: "Forwarded to Collapsible; the open state of the content." },
                { k: "className?", v: "string — merged onto the Card, which already has shadow-none." },
                { k: "...props", v: 'Collapsible props, spread on the Collapsible; Plan renders Collapsible asChild around a Card with data-slot="plan".' },
              ]}
            />
          ),
        },
        {
          label: "PlanHeader",
          body: <Meta items={[{ k: "...props", v: 'CardHeader props. Adds flex items-start justify-between, data-slot="plan-header".' }]} />,
        },
        {
          label: "PlanTitle",
          body: (
            <Meta
              items={[
                { k: "children", v: "string, required — not a node, so it can be shimmered." },
                { k: "...props", v: "CardTitle props minus children." },
              ]}
            />
          ),
        },
        {
          label: "PlanDescription",
          body: (
            <Meta
              items={[
                { k: "children", v: "string, required — shimmered while streaming." },
                { k: "className?", v: "string — text-balance is added." },
                { k: "...props", v: "CardDescription props minus children." },
              ]}
            />
          ),
        },
        { label: "PlanAction", body: <Meta items={[{ k: "...props", v: 'CardAction props — the header\'s trailing corner slot. data-slot="plan-action".' }]} /> },
        { label: "PlanContent", body: <Meta items={[{ k: "...props", v: "CardContent props, rendered through CollapsibleContent asChild — this is the part that folds." }]} /> },
        { label: "PlanFooter", body: <Meta items={[{ k: "...props", v: "div props, rendered as CardFooter. Sits outside the collapsible content, so it stays visible when the steps are folded." }]} /> },
        {
          label: "PlanTrigger",
          body: (
            <Meta
              items={[
                { k: "className?", v: "string" },
                { k: "...props", v: 'CollapsibleTrigger props, on a Button variant ghost size icon with a ChevronsUpDown glyph and an sr-only "Toggle plan".' },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: 'PlanTrigger is a real button named "Toggle plan" (sr-only text; the glyph is decorative) and carries aria-expanded and aria-controls from Radix Collapsible. The card itself is a plain container, not a landmark.' },
                { k: "Keyboard", v: "Tab reaches the trigger; Enter or Space toggles the content." },
                { k: "Target size", v: "The trigger is the 40px icon Button. The upstream 32px size-8 override was removed, because an icon-only control never goes below 40px." },
                { k: "Motion", v: "The fold plays anim-expand/anim-collapse from the motion system and the streaming shimmer is Shimmer's; the blanket prefers-reduced-motion rule collapses both." },
                { k: "Streaming", v: "Shimmer is visual only; the text stays real text throughout, so a screen reader reads it." },
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
              The AgentWorkspace draws a run&apos;s plan inline in the reply, in{" "}
              <code className="type-code">components/agent/workspace/run-inline.tsx</code>: the goal is the title, the step count and plan
              version the description, a &quot;View as workflow&quot; icon button sits in PlanAction beside the trigger, and the numbered,
              editable steps are the PlanContent. While the agent is still writing the plan, the title and description shimmer. Vendored
              change: the trigger lost its 32px size override so it is a 40px icon target. The Card, Collapsible and Button underneath
              are the system&apos;s own, restyled through tokens.
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
