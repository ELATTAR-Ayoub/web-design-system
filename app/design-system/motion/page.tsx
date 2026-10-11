"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import {
  Code,
  DoDont,
  DsPageHeader,
  DsSection,
  Meta,
  Note,
  PageFootNav,
  Panel,
} from "@/components/ds/kit";
import { TokenValue, useTokenValue } from "@/components/ds/token-swatch";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { FourteenMotions } from "@/components/docs/page/fourteen-motions";
import { findCategory } from "@/lib/ds/nav";
import {
  DURATION_TOKENS,
  EASE_TOKENS,
  type MotionNameEntry,
} from "@/lib/motion-names";

const { category } = findCategory("foundations", "motion");

function entry(list: ReadonlyArray<MotionNameEntry>, name: string): MotionNameEntry {
  const found = list.find((e) => e.name === name);
  if (!found) throw new Error(`${name} is not in lib/motion-names.ts`);
  return found;
}

const DURATION_USE: Record<string, string> = {
  "--duration-tick": "The machine beat. Arriving rows stagger by half a tick each (--enter-stage); the landing intro counts its stages in ticks.",
  "--duration-fast": "anim-exit, the toggle pill's fade, and every small hover and focus transition — checkbox, radio, slider, icon swap.",
  "--duration-normal":
    "The default. press springing back, anim-close, anim-collapse, the sheet sliding out, toggle-slide travelling. Also what Tailwind's own transition default is repointed at.",
  "--duration-slow": "anim-enter — content arriving — and the IconSwap wheel rolling.",
  "--duration-overlay-enter": "The sheet sliding in from its edge. Popups no longer use it — they open on --duration-open.",
  "--duration-open":
    "The overlay entrance — dialog, popover, menu, tooltip — and disclosure expanding. Longer than overlay-enter on purpose: ease-emphasized spends its last stretch settling an overshoot, and a shorter step clips the bounce rather than resolving it.",
  "--duration-bloom":
    "Atmosphere, not feedback. The cosmic bloom's hover swell — an order of magnitude slower than the control scale, because light spreading is not a state change.",
};

const durations = Object.keys(DURATION_USE).map((name) => ({
  ...entry(DURATION_TOKENS, name),
  use: DURATION_USE[name],
}));


const EASE_USE: Record<string, string> = {
  "--ease-emphasized": "THE curve. Overshoots then settles. press springing back, anim-open, anim-expand, anim-change, toggle-slide, swap-roll.",
  "--ease-enter": "Anything that arrives. anim-enter, the sheet sliding in. Fast start, long settle.",
  "--ease-exit":
    "Anything leaving under its own weight. anim-exit, the sheet sliding out. Declared rather than left to the framework, whose own ease-in is a gentler curve.",
  "--ease-move": "Anything that loops, and anything closing. anim-close, anim-collapse, pulse, shimmer, the glint, the cosmic drift, the stars.",
  "--ease-out-flex": "Long travel that must not overshoot — the sidebar's resize rail.",
  "--ease-settle": "Long travel that lands soft. Long moves that settle softly, such as a row travelling to its new place in a list.",
  "--ease-standard": "The neutral curve, for a change with no character of its own — hover tints and colour changes in the docs chrome.",
};

const easings = EASE_TOKENS.map((t) => ({ ...t, use: EASE_USE[t.name] }));

function points(curve: string | null): number[] | null {
  if (!curve) return null;
  const m = /cubic-bezier\(([^)]+)\)/.exec(curve);
  if (!m) return null;
  const parts = m[1].split(",").map((n) => Number(n.trim()));
  return parts.length === 4 && parts.every(Number.isFinite) ? parts : null;
}

function CurveGraph({ token }: { token: string }) {
  const pts = points(useTokenValue(token));
  const d = pts
    ? `M 0 100 C ${pts[0] * 100} ${100 - pts[1] * 100} ${pts[2] * 100} ${100 - pts[3] * 100} 100 0`
    : null;
  return (
    <svg
      viewBox="-8 -58 116 172"
      className="h-28 w-full"
      role="img"
      aria-label={pts ? `Easing curve ${pts.join(", ")}` : `Easing curve ${token}`}
    >
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="none"
        stroke="var(--border)"
      />
      <line
        x1="0"
        y1="0"
        x2="100"
        y2="0"
        stroke="var(--border)"
        strokeDasharray="3 3"
      />
      <path d={d ?? undefined} fill="none" stroke="var(--color-action)" strokeWidth="2.5" />
    </svg>
  );
}

export default function MotionPage() {
  const [run, setRun] = useState(0);
  const replay = () => setRun((n) => n + 1);

  return (
    <>
      <DsPageHeader
        eyebrow="Sections"
        title={category.title}
        blurb={category.blurb}
        contents={category.contents}
      />

      <Note tone="action" title="Everything on this page is live" className="mb-12">
        Timings are judged, not read. Use the
        replay buttons to re-run the entrances. If your system is set to reduce
        motion, every animation here collapses to near-zero — which is the
        correct behaviour, not a bug.
      </Note>

      <DsSection
        id="durations"
        title="Durations"
        description="The control scale, plus one atmospheric step. Every row prints the value the browser resolved and sweeps on that same token, so the page cannot disagree with styles/motion.css."
      >
        <Panel
          label="Same distance, every speed"
          note={`run ${run}`}
        >
          <div className="mb-5 flex justify-end">
            <Button variant="outline" size="sm" onClick={replay}>
              <Icon icon={RotateCcw} size="sm" tone="inherit" />
              Replay
            </Button>
          </div>
          <div className="space-y-4">
            {durations.map((d) => (
              <div
                key={d.name}
                className="grid items-center gap-4 sm:grid-cols-[13rem_4rem_1fr]"
              >
                <span className="type-number-sm text-action-ink">
                  {d.name}
                </span>
                <TokenValue token={d.name} />
                <div className="h-8 overflow-hidden rounded-sm bg-muted">
                  <div
                    key={`${d.name}-${run}`}
                    className="h-full rounded-sm bg-action"
                    style={{
                      // allow-dynamic-motion: the token name is interpolated; the browser resolves the value.
                      animation: `ds-sweep var(${d.name}) var(--ease-enter) both`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-border pt-5">
            {durations.map((d) => (
              <p key={d.name} className="type-small text-muted-foreground">
                <span className="type-number-sm text-muted-foreground">
                  {d.name}
                </span>{" "}
                — {d.use}
              </p>
            ))}
          </div>
        </Panel>
      </DsSection>

      <DsSection
        id="easing"
        title="Easing"
        description="Seven curves, each with a job. Things that arrive use ease-enter, things that leave use ease-exit, things that loop use ease-move, and only press and the overlays may overshoot. Each graph is drawn from the curve the browser resolved, not from a copy of it."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {easings.map((e) => (
            <Panel key={e.name} label={e.name}>
              <CurveGraph token={e.name} />
              <div className="mt-4 h-6 rounded-sm bg-muted">
                <div
                  key={`${e.name}-${run}`}
                  className="size-6 rounded-sm bg-value"
                  style={{
                    // allow-dynamic-motion: the token name is interpolated; the browser resolves the value.
                    animation: `ds-travel var(--duration-bloom) var(${e.name}) both`,
                  }}
                />
              </div>
              <TokenValue token={e.name} className="mt-4 block" />
              <p className="type-small mt-2 text-muted-foreground">{e.use}</p>
            </Panel>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={replay}>
            <Icon icon={RotateCcw} size="sm" tone="inherit" />
            Replay curves
          </Button>
        </div>
      </DsSection>

      <DsSection
        id="named"
        title="The fourteen"
        description="Every animation in the system, on the thing it animates. Use one of these; don't write a new keyframe. They all live in styles/motion.css — change that file and every component follows."
      >
        <FourteenMotions />
      </DsSection>

      <DsSection
        id="choreography"
        title="Reveal choreography"
        description="A multi-step reveal is just the fourteen, one after another. Example:"
      >
        <Meta
          items={[
            { k: "1 · Dim", v: "The backdrop fades in (anim-enter)." },
            { k: "2 · Panel", v: "The panel opens (anim-open)." },
            { k: "3 · Rows", v: "Rows come in one after another (anim-enter, staggered with --enter-stage)." },
            { k: "4 · The number", v: "The important value wobbles once everything has landed (anim-change)." },
            { k: "5 · Leave", v: "Panel closes (anim-close), backdrop fades (anim-exit)." },
            { k: "Skip", v: "Any step can be skipped — nothing is ever left half-way." },
          ]}
        />
      </DsSection>

      <DsSection
        id="reduced"
        title="Reduced motion"
        description="If the user's OS says reduce motion, everything still works — it just doesn't move."
      >
        <Panel label="What prefers-reduced-motion: reduce does">
          <ul className="space-y-3">
            {[
              "Every animation jumps straight to its end.",
              "Loops stop.",
              "Things that would fade in are simply there.",
              "Nothing disappears — no information lives only inside an animation.",
            ].map((t) => (
              <li key={t} className="type-small flex gap-2.5 text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-action" />
                {t}
              </li>
            ))}
          </ul>
          <p className="type-small mt-5 border-t border-border pt-5 text-muted-foreground">
            Handled once in <Code>styles/motion.css</Code>. You don&rsquo;t
            have to do anything in a component.
          </p>
        </Panel>

        <Note className="mt-4" title="Animating from JavaScript? Use the hook">
          CSS animations are covered automatically. If you drive motion from
          JS — a canvas, a value written to <Code>style</Code> on every
          frame — read <Code>hooks/use-reduced-motion.ts</Code> and skip the
          motion when it returns <Code>true</Code>.
        </Note>
      </DsSection>

      <DsSection id="rules" title="Rules">
        <DoDont
          dos={[
            "Use a duration token — tick, fast, normal, slow, overlay-enter, open or bloom. Nothing in between.",
            "Reserve ease-emphasized for press and the overlays; anywhere else the overshoot reads as celebration.",
            "Keep skeletons shaped like the content they stand in for.",
            "Reach for one of the fourteen before writing a keyframe; a fifteenth is a design decision recorded in RULES.md.",
          ]}
          donts={[
            "Don't animate anything for longer than open (420ms) unless it is atmosphere on the bloom step.",
            "Don't loop an animation except spin, shimmer, pulse and caret — constant movement is fatiguing.",
            "Don't flash, strobe or rapidly alternate brightness; it is an accessibility hazard.",
            "Don't let text move while it is being read — animate the container, not the copy.",
          ]}
        />
      </DsSection>

      <PageFootNav groupId="foundations" slug="motion" />
    </>
  );
}
