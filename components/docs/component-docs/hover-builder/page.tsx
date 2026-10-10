import { Code, Meta, Note } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

function HoverBuilderSpecimen() {
  return (
    <div className="group flex w-full max-w-sm items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors duration-fast hover:border-action/45">
      <div>
        <p className="type-small text-foreground">Hover this row</p>
        <p className="type-small text-muted-foreground">The arrow reacts to the row, not to itself</p>
      </div>
      <Code>
        <span className="inline-block transition-transform duration-fast group-hover:translate-x-0.5">
          →
        </span>
      </Code>
    </div>
  );
}

export const spec: ComponentDocSpec = {
  name: "hover-builder",
  omitted: {
    api: "hover:*, group/group-hover:* and focus-visible:* are Tailwind's own compiled variants, not a component or exported function — there is no prop, hook or class of this system's own to list beyond the Classes table above.",
    states: "The variants ARE the state selector, not a component that has states of its own — the hover, focus-visible and active states they select belong to whatever control wears them, and are documented on that control's own page.",
    keyboard: "hover: has no keyboard equivalent by definition, which is exactly why every hover-only affordance in this system pairs with a focus-visible: rule reaching the same result by keyboard — see Accessibility above; there is no keys-and-actions table of its own to add.",
    responsive: "hover:, group-hover: and focus-visible: select an interaction state, not a viewport — they carry no breakpoint or container query, and nothing about them changes across widths, 200% zoom or RTL; a host wearing one reflows exactly as it otherwise would.",
  },
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "Effect",
      description:
        "hover: for a state on the element itself; group + group-hover: when a child has to react to a hover happening on an ancestor — the arrow above moves because the row is hovered, not because the arrow itself is.",
      appliedAs: "hover:* · group-hover:*",
      render: <HoverBuilderSpecimen />,
      source: `<div className="group hover:border-action/45">
  <p>Hover this row</p>
  <span className="transition-transform group-hover:translate-x-0.5">→</span>
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
        "Real call sites already in this codebase — no invented example.",
      language: "tsx",
      code: `// components/ds/kit.tsx — IndexCard
<Link className="press group ..." href={href}>
  <h3>{title}</h3>
  <Icon className="group-hover:translate-x-0.5 group-hover:text-action-ink" ... />
</Link>

// components/ui/button.tsx — outline variant
"border-input bg-card text-foreground shadow-btn hover:bg-muted active:shadow-btn-down"`,
    },
    {
      kind: "disclosure",
      id: "classes",
      title: "Classes",
      description:
        "Not a system-defined @utility — these are Tailwind's own pseudo-class variants, compiled with the rest of the foundation stylesheet. There is nothing to add beyond the foundation itself.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "hover:*",
                  v: "Any utility, conditioned on :hover — hover:bg-muted, hover:border-action/45, hover:text-foreground. No JavaScript, no state.",
                },
                {
                  k: "group / group-hover:*",
                  v: "group on the ancestor that owns the hover, group-hover:* on a descendant that should react to it — the mechanism IndexCard's arrow and the sidebar's hover states both use.",
                },
                {
                  k: "focus-visible:*",
                  v: "The keyboard equivalent every hover-only affordance needs beside it — a hover state with no focus-visible counterpart is invisible to a keyboard user, per RULES' accessibility rules.",
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
      blocks: [
        {
          body: (
            <p className="type-body text-muted-foreground">
              A pointer never reaches a touch or keyboard user, so a hover-only
              affordance is invisible to both. Every interactive hover state in
              this system pairs with a focus-visible: rule that reaches the same
              visual result by keyboard, and touch devices get the tap/active
              state instead.
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
            <Note tone="action">
              Not applicable to the variant itself — hover: and group-hover:
              select a state, they do not animate. Whatever transition-* utility
              a call site pairs with them (as in the specimen above) is what
              prefers-reduced-motion collapses, via the blanket rule in
              motion.css.
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
