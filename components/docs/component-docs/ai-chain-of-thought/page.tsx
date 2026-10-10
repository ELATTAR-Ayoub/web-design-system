import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { ChainOfThoughtExamples, ChainOfThoughtPreview, ChainOfThoughtStateGrid } from "./chain-of-thought-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-chain-of-thought",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A header that opens a list of steps. The steps show the three statuses: complete in muted text, active in full text and pending at half strength. One step carries search results as badges.",
      label: "ChainOfThought",
      render: <ChainOfThoughtPreview />,
      source: `import {
  ChainOfThought, ChainOfThoughtContent, ChainOfThoughtHeader,
  ChainOfThoughtSearchResult, ChainOfThoughtSearchResults, ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";

<ChainOfThought defaultOpen>
  <ChainOfThoughtHeader>Worked through 4 steps</ChainOfThoughtHeader>
  <ChainOfThoughtContent>
    <ChainOfThoughtStep label="Read the order form" status="complete" />
    <ChainOfThoughtStep icon={SearchIcon} label="Searched for “renewal terms”" status="complete">
      <ChainOfThoughtSearchResults>
        <ChainOfThoughtSearchResult>contracts.example</ChainOfThoughtSearchResult>
      </ChainOfThoughtSearchResults>
    </ChainOfThoughtStep>
    <ChainOfThoughtStep label="Comparing the discount dates" status="active" />
    <ChainOfThoughtStep label="Draft the summary" status="pending" />
  </ChainOfThoughtContent>
</ChainOfThought>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It is built on the system Collapsible, Badge and Icon.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "ChainOfThought owns the open state, and both ChainOfThoughtHeader and ChainOfThoughtContent read it, so they must be its children. Make it controlled with open and onOpenChange when something outside needs to open it, as the workspace does when a step needs the reader. A step takes a label, an optional description and any children; give it a status, and an icon if the default dot is not enough. A tool step's card can go in label, since it is a ReactNode.",
      language: "tsx",
      code: `import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";

<ChainOfThought open={open} onOpenChange={setOpen}>
  <ChainOfThoughtHeader>
    {working ? <Shimmer as="span">Working…</Shimmer> : \`Worked through \${steps.length} steps\`}
  </ChainOfThoughtHeader>
  <ChainOfThoughtContent>
    {steps.map((s) => (
      <ChainOfThoughtStep key={s.id} label={s.title} status={s.done ? "complete" : "active"} />
    ))}
  </ChainOfThoughtContent>
</ChainOfThought>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The container opens and closes; each step carries one of three statuses.",
      blocks: [
        { body: <ChainOfThoughtStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: closed by default (<code className="type-code">defaultOpen</code> is false). Only the header shows.{" "}
                <strong>open</strong>: the steps unfold with anim-expand and the chevron turns 180 degrees. <strong>loading</strong>: a step with
                status <code className="type-code">&quot;active&quot;</code> is in full foreground and the others are muted; to show work in
                flight put a Shimmer in the header, as the workspace does. A pending step is half-strength.{" "}
                <strong>success</strong>: status <code className="type-code">&quot;complete&quot;</code>, the default, is muted. Nothing here
                shows a tick; the status only changes the text colour. <strong>hover</strong>: the header&apos;s text goes from muted to full
                foreground. <strong>focus-visible</strong>: the system-wide 2px ring on the header button. <strong>pressed</strong>: no separate
                treatment. <strong>empty</strong>: ChainOfThoughtContent with no children opens to nothing; the workspace never mounts the chain
                without steps. <strong>error</strong> and <strong>disabled</strong>: N/A. A failed step is shown by what the step contains (the
                workspace puts a ToolStepCard with its own error and retry inside), not by a status, and the header always opens.
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
      description: "A controlled chain with a shimmering header while work is in flight, and a step that carries an image.",
      label: "Controlled, and with an image",
      render: <ChainOfThoughtExamples />,
      source: `const [open, setOpen] = useState(true);

<ChainOfThought onOpenChange={setOpen} open={open}>
  <ChainOfThoughtHeader><Shimmer as="span">Working…</Shimmer></ChainOfThoughtHeader>
  <ChainOfThoughtContent>…</ChainOfThoughtContent>
</ChainOfThought>

<ChainOfThoughtStep label="Looked at the seat chart" status="complete">
  <ChainOfThoughtImage caption="Seats by month, from the usage export.">
    <img alt="A sample image" src="/imgs/sample-photo.jpg" />
  </ChainOfThoughtImage>
</ChainOfThoughtStep>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/chain-of-thought.tsx.",
      blocks: [
        {
          label: "ChainOfThought",
          anchor: "api-chain-of-thought",
          body: (
            <Meta
              items={[
                { k: "open?", v: "boolean. Controlled open state." },
                { k: "defaultOpen?", v: "boolean, default false." },
                { k: "onOpenChange?", v: "(open: boolean) => void." },
                { k: "…div props", v: 'Base class: "not-prose w-full space-y-4".' },
              ]}
            />
          ),
        },
        {
          label: "ChainOfThoughtHeader",
          anchor: "api-chain-of-thought-header",
          body: (
            <Meta
              items={[
                { k: "children?", v: 'ReactNode, default "Chain of Thought". The label; it sits between the brain icon and the chevron.' },
                { k: "…CollapsibleTrigger props", v: "Base: a full-width row, type-small, muted, hover:text-foreground, with a 44px hit area from an after: pseudo-element." },
              ]}
            />
          ),
        },
        {
          label: "ChainOfThoughtContent",
          anchor: "api-chain-of-thought-content",
          body: (
            <Meta
              items={[
                { k: "…CollapsibleContent props", v: 'Base class: "mt-2 space-y-3 text-popover-foreground outline-none". Opens with anim-expand and closes with anim-collapse.' },
              ]}
            />
          ),
        },
        {
          label: "ChainOfThoughtStep",
          anchor: "api-chain-of-thought-step",
          body: (
            <Meta
              items={[
                { k: "label", v: "ReactNode, required." },
                { k: "description?", v: "ReactNode, type-small, muted, under the label." },
                { k: "status?", v: '"complete" | "active" | "pending", default "complete". complete is muted, active is text-foreground, pending is muted at half strength.' },
                { k: "icon?", v: "LucideIcon, default DotIcon. Drawn through the system Icon. A thin line below it joins one step to the next." },
                { k: "children?", v: "ReactNode, shown under the description: search results, an image, a card." },
                { k: "…div props", v: "Arrives with anim-enter, the system's shared arrival." },
              ]}
            />
          ),
        },
        {
          label: "Search results and image",
          anchor: "api-chain-of-thought-extras",
          body: (
            <Meta
              items={[
                { k: "ChainOfThoughtSearchResults", v: "div props. A wrapping flex row, gap-2." },
                { k: "ChainOfThoughtSearchResult", v: 'Badge props, variant "secondary". Use asChild to make one a link.' },
                { k: "ChainOfThoughtImage.caption?", v: "string, type-small, muted, under the image." },
                { k: "ChainOfThoughtImage children", v: "The image, centred on a bg-muted frame with a rounded-lg radius and a max height of max-h-88 (22rem)." },
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
      description: "One disclosure button controls a list of steps.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role and state", v: "The header is a button whose open state comes from Radix Collapsible (aria-expanded). Header and content each wrap their own Collapsible bound to the same state, so the content is not wired to the button with aria-controls." },
                { k: "Name", v: 'The header\'s text: "Chain of Thought" by default, or what you pass. Keep it a statement of what happened, as the workspace does ("Worked through 3 steps").' },
                { k: "Steps", v: "Steps are plain divs, not a list, so a screen reader reads them in order but does not announce a count. Status is shown by colour alone: complete, active and pending are different greys. Put the status in the label text when it matters." },
                { k: "Keyboard", v: "Tab to the header, Enter or Space toggles. Controls inside a step (a link, a retry button) are ordinary tab stops." },
                { k: "Target size", v: "The header is one line of small text, about 20px. An after: pseudo-element extends its hit area to 44px high without moving the layout." },
                { k: "Motion", v: "The steps arrive with anim-enter and the body opens with anim-expand; both are CSS and collapse under the blanket reduced-motion rule in styles/motion.css. The chevron turn is a transition-transform." },
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
              <p>
                When an agent does several things before it answers, the reader wants the answer first and the working one click away. Chain of
                Thought is that fold: a header, and steps with a status. In the AgentWorkspace it is how tool steps are shown in{" "}
                <code className="type-code">components/agent/workspace/workspace-reply.tsx</code>: the header reads &quot;Working…&quot; in a
                Shimmer while a step is running and &quot;Worked through N steps&quot; afterwards, each reasoning line is a complete step, a search
                step shows its results as linked badges, and any other tool is a ToolStepCard inside a step&apos;s label. It is controlled there,
                so it can open itself when a step needs the reader.
              </p>
              <p className="mt-3">
                The vendored changes: the header gets a 44px hit area through an <code className="type-code">after:</code> pseudo-element; the
                hand-rolled enter and exit classes on the content and the step&apos;s fade and slide are replaced by the system&apos;s own
                animation (the Collapsible&apos;s, and anim-enter); the search result Badge drops its duplicated padding and the font-normal and
                text-xs that fought type-badge; and the image cap becomes the spacing-scale max-h-88 instead of an arbitrary 22rem.
              </p>
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
