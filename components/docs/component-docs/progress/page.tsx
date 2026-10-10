/**
 * Authored documentation page for `progress`.
 *
 * Replaces the generated baseline. Migrated from the old `base/feedback`
 * category page (`app/design-system/components/base/feedback/page.tsx`, since deleted),
 * where it was documented together with Spinner under one "Progress &
 * Spinner" heading. Spinner now has its own page — see `spinner`; this page
 * covers only the measurable-total case. Every specimen below renders the
 * real `Progress` from `components/ui/progress.tsx` — nothing here is a
 * styled div. Prop rows in API Reference come from that file's own
 * `progressIndicatorVariants` cva config and component signature; nothing is
 * invented.
 *
 * The Preview section renders `ProgressShowcase` (`./progress-showcase.tsx`),
 * a client companion (per `references/traps.md` #29 — a spec module cannot
 * hold the `useState` the bar animates from) whose "Add 20" / "Reset" /
 * "Send to 100" buttons drive a real value change, so the reader watches the
 * fill actually travel rather than looking at one frozen frame.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Progress } from "@/components/ui/progress";
import { Code, Meta, Note, StateCell, StateGrid } from "@/components/ds/kit";

import { ProgressShowcase } from "./progress-showcase";
import { meta } from "./meta";

const TONES = [
  { tone: "default" as const, label: "Steps today", value: 72 },
  { tone: "success" as const, label: "Hydration goal met", value: 100 },
  { tone: "warning" as const, label: "Storage used", value: 86 },
  { tone: "destructive" as const, label: "Sleep against an 8h need", value: 67 },
];

export const spec: ComponentDocSpec = {
  name: "progress",
  omitted: {
    keyboard: "Progress renders a read-only indicator — role=\"progressbar\" via Radix, with no tabindex and nothing to activate — so it carries no keyboard model of its own. It is never in the tab sequence and has no key that does anything.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Progress when the total is known — pack supply, XP toward the next rank, a reveal sequence. \"Add 20\" and \"Send to 100\" push the reading forward for real and the fill travels to meet it; tone follows the value itself, turning warning near the ceiling and success on completion. Reach for Spinner instead when the total is not known.",
      label: "XP toward the next rank",
      render: <ProgressShowcase />,
      source: `const [xp, setXp] = useState(28);

<div>
  <div className="mb-2.5 flex items-baseline justify-between">
    <span className="type-small text-muted-foreground">XP to Rank 26</span>
    <span className="type-number-sm text-muted-foreground">{xp} / 100</span>
  </div>
  <Progress value={xp} tone={xp >= 100 ? "success" : xp >= 80 ? "warning" : "default"} aria-label="XP to Rank 26" />
</div>

<Button onClick={() => setXp((v) => Math.min(100, v + 20))}>Add 20</Button>
<Button onClick={() => setXp(28)}>Reset</Button>
<Button onClick={() => setXp(100)}>Send to 100</Button>`,
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
      description:
        "Always pair the bar with the real numbers — '412 / 2,000', not just a filled channel. Omit value entirely for the indeterminate case; Radix then omits aria-valuenow rather than announcing a zero.",
      language: "tsx",
      code: `import { Progress } from "@/components/ui/progress";

export function PackSupply() {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="type-small text-muted-foreground">Pack supply remaining</span>
        <span className="type-number-sm text-muted-foreground">412 / 2,000</span>
      </div>
      <Progress value={20.6} aria-label="Pack supply remaining" />
    </div>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "tone is the shape of the reading, not the direction it moved — RULES §1.4: a figure that fell is never destructive. destructive is reserved for a reading outside its safe band, never for a number that merely went down. Every fill names the -ink end of its ramp rather than the raw token, because a filled channel carries no foreground — the only thing that makes it visible is its contrast with the track.",
      label: "Tone",
      render: (
        <div className="max-w-md space-y-8">
          {TONES.map((t) => (
            <div key={t.tone}>
              <div className="mb-2.5 flex items-baseline justify-between">
                <span className="type-small text-muted-foreground">{t.label}</span>
                <span className="type-number-sm text-muted-foreground">{t.value}%</span>
              </div>
              <Progress value={t.value} tone={t.tone} aria-label={t.label} />
            </div>
          ))}
          <div>
            <div className="mb-2.5 flex items-baseline justify-between">
              <span className="type-small text-muted-foreground">XP to Rank 25</span>
              <span className="type-number-sm text-value-ink">3,480 / 5,000</span>
            </div>
            <Progress value={69.6} tone="value" aria-label="XP to Rank 25" />
          </div>
        </div>
      ),
      source: `<Progress value={72} tone="default" aria-label="Steps today" />
<Progress value={100} tone="success" aria-label="Hydration goal met" />
<Progress value={86} tone="warning" aria-label="Storage used" />
<Progress value={67} tone="destructive" aria-label="Sleep against an 8h need" />
<Progress value={69.6} tone="value" aria-label="XP to Rank 25" />`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "The indeterminate case — no value, and genuinely no total to report. The fill is positioned with translateX(-(100 - value)%), and a bar with no value used to land at -100%: an empty channel, indistinguishable from 0%. It is a travelling third-width sliver now — visibly busy, and visibly not a reading. Under reduced motion it stops at the start of the channel rather than freezing at a random partial fill, which would have looked like a percentage.",
      label: "Indeterminate — value omitted",
      render: (
        <div className="max-w-md">
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="type-small text-muted-foreground">Contacting the vault</span>
            <span className="type-small text-muted-foreground">no total to report</span>
          </div>
          <Progress aria-label="Contacting the vault" />
        </div>
      ),
      source: `<Progress aria-label="Contacting the vault" />`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Progress and the progressIndicatorVariants config it is built on.",
      blocks: [
        {
          label: "Progress",
          body: (
            <Meta
              items={[
                {
                  k: "value",
                  v: "number | undefined. 0–100. Omit it entirely for the indeterminate sliver — passing no value (or null) is Radix's own definition of indeterminate, and it is why the primitive omits aria-valuenow rather than writing a zero.",
                },
                {
                  k: "tone",
                  v: '"default" · "value" · "success" · "warning" · "destructive". Default: "default". The shape of the reading (progressing, toward a reward, complete, approaching a limit, outside its safe band) — never the direction a number moved.',
                },
                {
                  k: "...props",
                  v: "Every other prop Radix's ProgressPrimitive.Root accepts (aria-label, className, etc.), forwarded directly. There is no size prop — the track is a fixed 10px (h-2.5) channel, matching the Slider's track exactly.",
                },
              ]}
            />
          ),
        },
        {
          label: "progressIndicatorVariants",
          body: (
            <p className="type-small text-muted-foreground">
              The class-variance-authority function the indicator&rsquo;s
              colour is built on (<Code>tone</Code>). Exported for a consumer
              that needs the identical fill treatment on a non-Progress
              element.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "Progress is not a control — it reports a reading, it is not operated — so the interaction states below are N/A for the same reason Alert's are.",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="determinate" note="value set">
                <Progress value={62} aria-label="Determinate" className="w-full" />
              </StateCell>
              <StateCell label="indeterminate" note="value omitted">
                <Progress aria-label="Indeterminate" className="w-full" />
              </StateCell>
              <StateCell label="complete" note="value = 100">
                <Progress value={100} tone="success" aria-label="Complete" className="w-full" />
              </StateCell>
              <StateCell label="outside safe band" note='tone="destructive"'>
                <Progress value={92} tone="destructive" aria-label="Outside safe band" className="w-full" />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="error" title="destructive is a band, not a direction">
              <Code>destructive</Code> is for a reading{" "}
              <em>outside its safe band</em>, never for one that merely fell.
              A figure moving the wrong way is news, not a fault (RULES
              §1.4) — it stays on the default tone.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "Built on Radix's Progress primitive, so the value announcement comes from the platform rather than being reimplemented.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "progressbar (via Radix).",
                },
                {
                  k: "Value announcement",
                  v: "Passing a numeric value writes aria-valuenow through Radix. Omitting value (the indeterminate case) leaves aria-valuenow unset rather than announcing a false zero — this was previously broken: value was destructured out to compute the fill's transform and never handed back to the primitive, so aria-valuenow was null even on a bar that looked complete.",
                },
                {
                  k: "Accessible name",
                  v: "No accessible name by default — pass aria-label (as every specimen on this page does) or aria-labelledby. A bar with a colour and no name announces a number with no meaning attached.",
                },
                {
                  k: "Colour is not the only signal",
                  v: "Always pair the bar with a written readout of the real figures (\"412 / 2,000\"), never the bar alone — the fill communicates nothing to a reader who cannot see its length.",
                },
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
        "The bar is w-full and has no breakpoint — it is exactly as wide as the box its caller gives it, at every width tested.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              <Code>Progress</Code> sets <Code>h-2.5 w-full</Code> and nothing else about
              its own dimensions, so it stretches to its container at 375, 768, 1440 and
              1920 alike — measured with no overflow at any of them, none at 200% text
              zoom, and none under RTL. One real gap: the fill&rsquo;s{" "}
              <Code>transform: translateX(-{"{100 - value}"}%)</Code> is a fixed
              left-to-right calculation with no <Code>rtl:</Code> variant, so under an
              RTL page the bar still fills from its left edge rather than mirroring —
              the indeterminate sliver (<Code>anim-progress-indeterminate</Code>) has the
              same LTR-only travel direction.
            </p>
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

/* Sizes and Keyboard are omitted for this item:
 *
 * - Sizes: Progress has no size prop — the track is a fixed 10px (h-2.5)
 *   channel, matching the Slider's track deliberately (both are "a filled
 *   channel"). Documenting a Sizes section would invent a lever the source
 *   does not expose.
 * - Keyboard: Progress is not a control — it has no tabIndex and no
 *   Radix-assigned keyboard behaviour, unlike the Slider it visually
 *   matches. There is nothing to document.
 *
 * Responsive is included implicitly rather than as its own section: the
 * track is width: 100% of its container at every breakpoint, with no
 * breakpoint-specific rule in progress.tsx to document separately.
 */
