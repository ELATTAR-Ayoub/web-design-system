/**
 * Documentation page for `keyframes`.
 *
 * Authored, not generated. Every `@keyframes` timeline in `styles/motion.css`
 * — the raw animation curves an `anim-*` (or effect-specific) utility spends.
 * A `@keyframes` block is never applied to an element directly in this
 * system; it is always reached through the utility that names it, which is
 * what keeps "every animation has exactly one home" true. This page is the
 * catalogue those utilities draw from, not a component or a class of its own.
 *
 * An entrance that already played on mount is invisible the moment a reader
 * looks at it, so the opening specimen needs a way to see it again. A spec
 * module stays plain server-rendered data (no local `useState`), per trap 29,
 * so the tile's own counter lives in the companion client file
 * `replay-grid-specimen.tsx`: it is set as the tile's `key`, and bumping it
 * unmounts and remounts the tile, replaying its timeline.
 */

import { Meta, Note } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { ReplayGridSpecimen } from "./replay-grid-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "keyframes",
  omitted: {
    api: "A @keyframes block is a CSS timeline, never applied to an element directly and never exported as a component, hook or prop — its only interface is the anim-* (or component-specific) utility that spends it, and those are catalogued in Classes above.",
    states: "A keyframes timeline is not a component with interaction or async states of its own — it is motion an anim-* utility triggers on mount, a state change, or an interval, and the state that triggers it belongs to that utility's caller, documented there.",
    keyboard: "No keyframes timeline binds a key or intercepts focus — motion here is triggered by mount, a state prop, or an interval on the consuming component, never by a keypress of its own.",
    responsive: "Every timeline plays at the same curve regardless of viewport — none is written with a breakpoint or container query, and 200% zoom, RTL or a narrow width change nothing about how a keyframe runs; only the element it decorates has a Responsive story of its own.",
  },
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "Effect",
      description:
        "The fourteen names in the vocabulary — the eleven system keyframes, each through its anim-* utility, plus the three transitions. Each played once on mount or on its own state change; press Replay to run it again.",
      appliedAs: "anim-enter · anim-exit · anim-open · anim-close · anim-expand · anim-change · anim-spin · anim-shimmer · anim-progress-indeterminate · anim-pulse · anim-caret · press · toggle-slide · swap-roll",
      render: <ReplayGridSpecimen />,
      source: `function ReplayTile({ className, label }: { className: string; label: string }) {
  const [run, setRun] = useState(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <div key={run} className={\`\${className} rounded-lg border border-border bg-card\`}>
        {label}
      </div>
      <Button variant="outline" size="sm" onClick={() => setRun((current) => current + 1)}>
        Replay
      </Button>
    </div>
  );
}

<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
  <ReplayTile className="anim-enter" label="enter" />
  {/* …one tile per name in the vocabulary — see replay-grid-specimen.tsx */}
</div>`,
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
        "Never reference a @keyframes name directly in a component — reach it through the anim-* (or named effect) utility that already spends it, so duration and easing stay on the shared scale.",
      language: "tsx",
      code: `// Right — through the utility, which already carries --duration-open and --ease-emphasized
<div className="anim-open">…</div>

// Wrong — a hand-written animation shorthand bypasses the duration and easing scale entirely
<div style={{ animation: "ds-open var(--duration-open) var(--ease-enter)" }}>…</div>`,
    },
    {
      kind: "disclosure",
      id: "classes",
      title: "Classes",
      description:
        "The fourteen names in the vocabulary — eleven system keyframes, each reached through its anim-* utility, plus the three transitions.",
      blocks: [
        {
          label: "Entrance and exit",
          body: (
            <Meta
              items={[
                {
                  k: "ds-enter → anim-enter",
                  v: "Opacity 0→1 plus a translateY + scale rise, both parameterised (--enter-y, default 12px; --enter-scale, default 0.97) so a scrim can zero the travel and a staggered row can read --enter-stage. Ten per-purpose arrivals merged into this one parameterised timeline on 2026-09-22.",
                },
                {
                  k: "ds-exit → anim-exit",
                  v: "The paired departure — three per-purpose exits merged into this one on 2026-09-22. EXIT in the vanishing-keyframe ledger.",
                },
                { k: "ds-open → anim-open", v: "Scale + rise with overshoot — every modal overlay's entrance. Unchanged." },
                { k: "ds-close → anim-close", v: "The exit. Unchanged. EXIT in the ledger — anticipates up, then drops away faster than it arrived." },
              ]}
            />
          ),
        },
        {
          label: "State change, disclosure and progress",
          body: (
            <Meta
              items={[
                {
                  k: "ds-change → anim-change",
                  v: "Squash-and-stretch reward. Four per-purpose reward timelines merged into this one on 2026-09-22 — IconSwap's landed icon, the checkbox tick, its indeterminate dash and the radio dot all replay this one shared keyframe now.",
                },
                { k: "ds-expand → anim-expand", v: "Height 0 to --unfold-h with an emphasized overshoot — Collapsible / Accordion content opening. Unchanged." },
                { k: "ds-expand → anim-collapse", v: "The reverse, held at height 0 (both fill mode) so the panel does not flash open before unmounting. Unchanged. EXIT in the ledger." },
                { k: "ds-spin → anim-spin", v: "A plain 360° rotation, linear — the loading spinner. Unchanged." },
                { k: "ds-shimmer → anim-shimmer, anim-shimmer-text", v: "The loading sweep. Renamed on 2026-09-22." },
                { k: "ds-progress-indeterminate → anim-progress-indeterminate", v: "A translateX sliver sweeping the channel, linear, infinite — HANDLED in the ledger (pinned visible, not frozen mid-channel). Unchanged." },
                { k: "ds-pulse → anim-pulse", v: "The live indicator's breathing glow. Renamed on 2026-09-22." },
                { k: "ds-caret → anim-caret", v: "A hard on/off blink, steps(1, end) — the OTP caret. Unchanged. HANDLED: pinned visible under reduced motion, since it is the only mark distinguishing the active slot." },
              ]}
            />
          ),
        },
        {
          label: "Transitions",
          body: (
            <Meta
              items={[
                {
                  k: "press",
                  v: "Transform-scale click feel, 0.9 on :active or [data-pressed]. Five per-surface click feels merged into this one on 2026-09-22 — the one click feel in the system now. See the press documentation page.",
                },
                { k: "toggle-slide", v: "The travelling selection pill's own transition. Renamed on 2026-09-22." },
                { k: "swap-roll", v: "Content replacing content in the same slot, via --swap-offset. Unchanged." },
              ]}
            />
          ),
        },
        {
          label: "Transitions for one job — composed from the vocabulary, not added to it",
          body: (
            <Meta
              items={[
                { k: "press-grow", v: "press, plus padding and gap on the same --ease-emphasized spring — for a control that changes SHAPE with its state (the Voice Pill growing from a 44px circle into a labelled pill while it listens). One utility, because two transition-owning utilities on one element fight (RULES §4)." },
                { k: "width-transition", v: "A machine-operated width change on --ease-out-flex, which does not overshoot — panels collapsing, a progress line filling in." },
                { k: "move-transition", v: "width-transition's sibling for something that travels: transform, left/right and background-colour on --ease-out-flex — the sidebar's resize rail following its panel." },
              ]}
            />
          ),
        },
        {
          label: "Surface timelines — not motion vocabulary",
          body: (
            <Meta
              items={[
                { k: "ds-sweep, ds-travel", v: "Used only by the Motion page's own duration/easing demos, not by a shipped component." },
                { k: "cosmic-drift-deep / cosmic-drift-near", v: "The two-layer bloom drift — see the feedback-surface effect page." },
                { k: "value-glint, value-foil-drift, action-beat", v: "The premium foil and action sheen timelines — see premium-surface and action-feedback." },
                { k: "star-sway / star-sway-alt", v: "The starfield's two sparkle-cluster sways — see feedback-surface." },
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
            <p className="type-body text-muted-foreground">
              No keyframe by itself carries required information — the utility
              spending it is what decides whether that is safely true (see each
              effect&rsquo;s own Accessibility section). A caret or an indeterminate
              sliver are the two cases in this system where the animation IS
              part of the information, and both are called out explicitly in
              motion.css&rsquo;s vanishing-keyframe ledger as HANDLED.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "reduced-motion",
      title: "Reduced motion",
      blocks: [
        {
          body: (
            <Note tone="action" title="The vanishing-keyframe ledger">
              motion.css&rsquo;s blanket prefers-reduced-motion rule collapses every
              animation to 0.01ms and one iteration, which freezes it at its
              final frame — correct for almost all of the timelines above, and
              wrong for any that end at opacity: 0. Every keyframe in the file
              that does is accounted for by name in the ledger comment directly
              above the media query, classified EXIT (the element is leaving
              anyway), DECORATIVE (its resting state is already invisible), or
              HANDLED (an explicit override restores it) — and a test,
              motion-contract.test.ts, fails the build on an unlisted one.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        {
          body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} />,
        },
      ],
    },
  ],
};
