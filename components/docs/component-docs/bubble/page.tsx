import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble";
import { CodeBlock } from "@/components/ds/code-block";
import { Code, DoDont, Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

const BUBBLE_VARIANTS = [
  { v: "default", note: "the sender's own turn" },
  { v: "secondary", note: "the other party" },
  { v: "muted", note: "quieter, on a card" },
  { v: "tinted", note: "brand wash, per theme" },
  { v: "outline", note: "hairline, no fill" },
  { v: "ghost", note: "no bubble at all" },
  { v: "destructive", note: "failed to send" },
] as const;

export const spec: ComponentDocSpec = {
  name: "bubble",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A turn from each side inside a BubbleGroup: secondary for the other party, default aligned to the end for the sender's own message. All seven surfaces and the reactions rail are below.",
      render: (
        <BubbleGroup>
          <Bubble variant="secondary">
            <BubbleContent>Which three?</BubbleContent>
          </Bubble>
          <Bubble align="end">
            <BubbleContent>Eclipse, Origin Pulse and Nightfall.</BubbleContent>
          </Bubble>
        </BubbleGroup>
      ),
      source: `<BubbleGroup>
  <Bubble variant="secondary">
    <BubbleContent>Which three?</BubbleContent>
  </Bubble>
  <Bubble align="end">
    <BubbleContent>Eclipse, Origin Pulse and Nightfall.</BubbleContent>
  </Bubble>
</BubbleGroup>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "The minimal import and call, inside a Message.",
      language: "tsx",
      code: `import { Bubble, BubbleContent } from "@/components/ui/bubble";

export function Reply() {
  return (
    <Bubble variant="muted">
      <BubbleContent>Eclipse Vault is up 14% overnight.</BubbleContent>
    </Bubble>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "Seven variants, all driven off data-slot, so BubbleContent can be swapped for a button or a link without restating a single class.",
      label: "Variants",
      render: (
        <>
          <StateGrid cols={4}>
            {BUBBLE_VARIANTS.map((b) => (
              <StateCell key={b.v} label={b.v} note={b.note}>
                <Bubble variant={b.v}>
                  <BubbleContent>Up 14% overnight</BubbleContent>
                </Bubble>
              </StateCell>
            ))}
            <StateCell label="asChild" note="hover — the whole bubble is the control">
              <Bubble>
                <BubbleContent asChild>
                  <button type="button">Open the set</button>
                </BubbleContent>
              </Bubble>
            </StateCell>
          </StateGrid>

          <Note tone="action" title="tinted is a token now, not a dark: variant" className="mt-4">
            It used to be four inline <Code>oklch(from …)</Code> values with a{" "}
            <Code>dark:</Code> twin for two of them. A colour that needs a{" "}
            <Code>dark:</Code> variant is a token that has not been written
            yet — §1, <em>What light mode actually costs</em>, which is
            explicit that no component carries a <Code>dark:</Code> variant
            for any of the three things that genuinely change between the
            themes. So the wash is <Code>--bubble-tinted</Code>, declared
            once in each theme block and derived from <Code>--primary</Code>{" "}
            so it follows a rebrand. Light lands at lightness 0.93, dark at
            0.30; the component names one class and never asks which surface
            it is on.
          </Note>

          <Note tone="error" title="Two of the seven fail AA — known, and not yet fixed" className="mt-4">
            Rasterised into a 1×1 canvas and measured against the surface
            each one actually paints. <Code>default</Code> is 4.39:1 in both
            themes: it is the system&rsquo;s standard <Code>--primary</Code>{" "}
            fill under <Code>--primary-foreground</Code>, so the gap is
            inherited rather than local to this component, and every primary
            button shares the figure. <Code>destructive</Code> is 6.24:1 on
            dark but 4.12:1 on light, where the ink is the fill shade and the
            wash under it is nearly white.
            <span className="mt-3 block">
              §7 asks every text colour to clear AA and exempts only disabled
              controls, so both of these are failures, not sanctioned
              exceptions. They are reported here rather than quietly
              corrected because the fix is a token move that lands on every
              call site in the system, which is the owner&rsquo;s call and
              not this page&rsquo;s. The other five variants run from 13:1 to
              19:1.
            </span>
          </Note>
        </>
      ),
      source: `<Bubble variant="tinted">
  <BubbleContent>Up 14% overnight</BubbleContent>
</Bubble>

<Bubble>
  <BubbleContent asChild>
    <button type="button">Open the set</button>
  </BubbleContent>
</Bubble>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Alignment inside a run of turns, and the reactions rail — as its own rail, and as reaction data with counts.",
      label: "Alignment and reactions",
      render: (
        <div className="space-y-6">
          <Panel label="Alignment" note="align is set on the Bubble, or inherited from the Message">
            <BubbleGroup>
              <Bubble variant="secondary">
                <BubbleContent>Which three?</BubbleContent>
              </Bubble>
              <Bubble align="end">
                <BubbleContent>Eclipse, Origin Pulse and Nightfall.</BubbleContent>
              </Bubble>
              <Bubble variant="secondary">
                <BubbleContent>Watch the last one.</BubbleContent>
              </Bubble>
            </BubbleGroup>
          </Panel>

          {/* BubbleReactions rings in --card to punch itself out of the bubble
              edge, so this specimen has to sit on a card surface for the ring
              to be invisible. On --background in dark mode it reads as a
              halo. */}
          <Panel
            label="Reactions"
            note="side × align — on a card, which is what the ring assumes"
            bodyClassName="bg-card"
          >
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {(
                [
                  { side: "bottom", align: "end" },
                  { side: "bottom", align: "start" },
                  { side: "top", align: "end" },
                  { side: "top", align: "start" },
                ] as const
              ).map((r) => (
                <div key={`${r.side}-${r.align}`} className="flex flex-col items-center gap-6">
                  <Bubble variant="muted">
                    <BubbleContent>Nice pull</BubbleContent>
                    <BubbleReactions side={r.side} align={r.align}>
                      <span aria-hidden>🔥</span>
                      <span aria-hidden>❤️</span>
                      <span aria-hidden>👏</span>
                    </BubbleReactions>
                  </Bubble>
                  <p className="type-small text-center text-muted-foreground">
                    {r.side} · {r.align}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            label="Reactions with counts"
            note="reactions + showCount — not rendered live on this page, see the note below"
            bodyClassName="bg-card"
          >
            <CodeBlock
              language="tsx"
              className="rounded-lg border border-border"
              code={`<Bubble variant="muted">
  <BubbleContent>Nice pull</BubbleContent>
  <BubbleReactions
    reactions={[
      { emoji: "🔥", count: 12, label: "fire", mine: true },
      { emoji: "❤️", count: 8, label: "a heart" },
      { emoji: "👏", count: 3, label: "applause" },
    ]}
  />
</Bubble>`}
            />

            <Note tone="action" title="The count is never only on hover" className="mt-6">
              <p>
                Collapsing the number until hover or focus is a density
                decision — a rail can hold six of these. It is not where the
                information lives. Every pill carries{" "}
                <Code>8 reacted with a heart</Code> in the accessibility tree
                at rest, so a screen reader and a keyboard user both get the
                count without pointing at anything. §7 does not allow
                information to live in a hover state alone, and §4.3 says the
                same of animation.
              </p>
              <p className="mt-3">
                The first pill is <Code>mine</Code> — the reader already
                reacted that way. It carries a border, a fill <em>and</em>{" "}
                <Code>aria-pressed</Code>, because trap 11 and §7 both rule
                out a hue as the only carrier of a state.
              </p>
              <p className="mt-3">
                <Code>reactions</Code> is a parameter on the rail that
                already existed, not a new component. Pass{" "}
                <Code>children</Code> instead and it stays the bare rail shown
                in the panel above — that form is what this page renders
                live, because <Code>components/ui/bubble.tsx</Code> is not
                itself marked <Code>&quot;use client&quot;</Code> even though
                the <Code>reactions</Code> form attaches an{" "}
                <Code>onClick</Code> handler internally. A server-rendered
                documentation page cannot cross that boundary, so this form is
                shown as code rather than as a live specimen — the same
                component, verified against its source, just not executed
                here.
              </p>
            </Note>
          </Panel>
        </div>
      ),
      source: `<BubbleGroup>
  <Bubble variant="secondary">
    <BubbleContent>Which three?</BubbleContent>
  </Bubble>
  <Bubble align="end">
    <BubbleContent>Eclipse, Origin Pulse and Nightfall.</BubbleContent>
  </Bubble>
</BubbleGroup>

<Bubble variant="muted">
  <BubbleContent>Nice pull</BubbleContent>
  <BubbleReactions
    reactions={[
      { emoji: "🔥", count: 12, label: "fire", mine: true },
      { emoji: "❤️", count: 8, label: "a heart" },
    ]}
  />
</Bubble>`,
    },
    {
      kind: "disclosure",
      id: "vs-ai-message",
      title: "How the workspace draws a turn instead",
      description:
        "A reader deciding whether to reach for Bubble should meet the reason it is not what the agent workspace draws its turns with.",
      blocks: [
        {
          label: "What it is for",
          body: (
            <p className="type-small text-muted-foreground">
              A speech bubble with seven surfaces, an alignment, and a
              reactions rail that can hang off any corner. BubbleContent
              takes <Code>asChild</Code>, so the bubble itself can be the
              button or the link.
            </p>
          ),
        },
        {
          label: "What the workspace does instead",
          body: (
            <p className="type-small text-muted-foreground">
              The workspace&rsquo;s two sides are asymmetric on purpose, and AI
              Message (<Code>components/ai-elements/message.tsx</Code>) encodes
              it: the assistant&rsquo;s reply is set flush in the column like
              body copy, because it is often long, frequently contains lists
              and tables, and three hundred words in a speech bubble are harder
              to read for no gain. Only the user&rsquo;s turn is a surface,{" "}
              <Code>bg-secondary</Code> with <Code>rounded-lg</Code>, drawn by{" "}
              <Code>MessageContent</Code> from the row&rsquo;s{" "}
              <Code>from</Code> rather than by a Bubble. Bubble has seven
              surfaces, reactions and a group; the workspace needs none of
              them, and adopting it would trade AI Message&rsquo;s tested reply
              structure for a primitive that knows nothing about a streamed
              answer.
            </p>
          ),
        },
        {
          body: (
            <>
              <Note tone="action" title="They stay because ui/ travels">
                §10 is explicit that this system is meant to be lifted, and
                that <Code>components/ui</Code>, <Code>components/agent</Code>{" "}
                and the foundations all travel as-is. The next project may
                want a support inbox, a comment thread or a two-person chat
                and no agent at all — and for that project, Bubble is the
                right starting point.
                <span className="mt-3 block">
                  Yes, this is one <Code>npx shadcn add</Code> from coming
                  back. That is not a reason to delete it from{" "}
                  <Code>components/ui</Code> — it is a reason the delete
                  looks free, which is a different thing. What does not come
                  back is the sweep onto these tokens: a regenerated file
                  arrives on stock shadcn&rsquo;s spacing, type and motion
                  scales and fails <Code>check:tokens</Code> on arrival,
                  exactly as §10 warns.
                </span>
              </Note>

              <DoDont
                dos={[
                  "Reach for this when you need a chat surface that is not the agent — a support thread, a comment column, two humans talking.",
                  "Read components/ai-elements/message.tsx before concluding the workspace could just use Bubble. The differences are behavioural, not cosmetic.",
                  "See /design-system/components/ai-message, /design-system/components/message#vs-ai-message and /design-system/components/message-scroller#vs-ai-conversation for the rest of this same question.",
                ]}
                donts={[
                  "Delete this because nothing in this repo imports it. Nothing in this repo is the product; ui/ is the chassis for the next one.",
                  "Rewire the workspace onto Bubble. An agent answer is a document, not a text message, and AI Message's layout says so on purpose.",
                  "Add an agent-coloured variant so the workspace can adopt it. That points the dependency from the generic layer at the product layer, which is the direction this system does not allow.",
                ]}
              />
            </>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Bubble, BubbleContent, BubbleGroup and BubbleReactions.",
      blocks: [
        {
          label: "Bubble",
          body: (
            <Meta
              items={[
                {
                  k: "variant",
                  v: "default · secondary · muted · tinted · outline · ghost · destructive, optional, defaults to default. ghost drops the fill, the padding and the radius, and is the only variant allowed the full width — it is how you set a long answer flush in the column.",
                },
                {
                  k: "align",
                  v: "start (default) or end, optional. Inside a Message it also follows that message's align, so setting it twice is redundant rather than wrong.",
                },
                {
                  k: "Width",
                  v: "Every bubble is capped at 80% of its column (max-w-[80%]) so the ragged edge stays readable. ghost is exempt.",
                },
              ]}
            />
          ),
        },
        {
          label: "BubbleContent",
          body: (
            <Meta
              items={[
                {
                  k: "asChild",
                  v: "boolean, optional, defaults to false. Renders the single child via Radix Slot instead of a <div> — the mechanism that turns a bubble into a button or a link.",
                },
                {
                  k: "Surface",
                  v: "12px / 8px padding, rounded-xl, text-sm. No required props.",
                },
              ]}
            />
          ),
        },
        {
          label: "BubbleGroup",
          body: (
            <Meta
              items={[
                { k: "(all)", v: "No required props. A flex-col wrapper with an 8px gap, one per run of turns." },
              ]}
            />
          ),
        },
        {
          label: "BubbleReactions",
          body: (
            <Meta
              items={[
                {
                  k: "reactions",
                  v: "{ emoji: ReactNode; count: number; label: string; mine?: boolean }[], optional. Pass this or children, not both — draws the rail itself with counts.",
                },
                {
                  k: "side / align",
                  v: "side: top | bottom, defaults to bottom. align: start | end, defaults to end. Absolutely positioned and pulled three quarters outside the bubble, so it needs vertical room around it. Rings in --card: put it on a card surface, or the ring shows as a halo.",
                },
                {
                  k: "showCount",
                  v: "\"hover\" (default) | \"always\". Only changes when the number is visible — the count is in the accessibility tree either way.",
                },
                {
                  k: "onReact",
                  v: "(label: string) => void, optional. Fired with a reaction's label when its button is pressed.",
                },
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
      description:
        "What Bubble actually wires up, verified against its source rather than assumed from its name.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Bubble asChild",
                  v: "When BubbleContent renders asChild over a real <button> or <a>, that element keeps its native keyboard behavior and gets an explicit focus-visible ring — border-ring plus a 3px ring-ring/50 — rather than the browser default.",
                },
                {
                  k: "BubbleReactions",
                  v: "Each reaction is a real <button type=\"button\">. A reaction the reader already gave carries aria-pressed={true} — never mine alone — and the count is always in a visually-hidden sr-only span (\"8 reacted with a heart\"), so a screen reader gets the number without hovering or focusing anything, even though the visible digit is hidden until hover/focus.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description:
        "Bubble contributes no keyboard handling of its own; behaviour below belongs to whatever BubbleContent or BubbleReactions render.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Tab / Shift+Tab",
                  v: "Moves focus to and from an asChild control, or a reaction button, in document order.",
                },
                { k: "Space / Enter", v: "Activates an asChild button or link, or toggles a reaction — native <button> behaviour in both cases." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "A bubble sizes itself off its column rather than the viewport — capped at a percentage of whatever container it sits in, so the same markup reads correctly whether that column is a narrow phone screen or a wide desktop panel.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Width cap",
                  v: "max-w-[80%] of the column it is placed in (ghost is exempt, as noted in API Reference) — a percentage, not a fixed pixel value, so the ragged edge stays proportionally the same whether the column is 320px or 900px wide.",
                },
                {
                  k: "Wrapping",
                  v: "w-fit min-w-0 with wrap-break-word — a bubble grows to fit short content and wraps long content at word boundaries (or mid-word if a single token is wider than the cap) rather than ever forcing its column wider.",
                },
                {
                  k: "BubbleReactions",
                  v: "Absolutely positioned and pulled outside the bubble's own box (side/align), so it needs vertical room around the bubble at every width — see the four side × align specimens under Examples, each of which reads correctly from a narrow to a wide panel.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920px, no overflow under 200% text zoom, and no overflow under RTL.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
