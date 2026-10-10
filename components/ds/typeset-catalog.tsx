import { Code, Meta, Panel } from "@/components/ds/kit";
import { TYPOGRAPHY } from "@/lib/ds/platform-contract";

export type TypesetRole = {
  cls: string;
  use: string;
  sample: string;
  group: "words" | "code" | "numerics";
};

function stepsFor(cls: string): string {
  const spec = TYPOGRAPHY.find((role) => role.role === cls);
  if (!spec) return "";
  const step = (s: { sizePx: number; linePx: number }) => `${s.sizePx}/${s.linePx}`;
  const face = spec.face === "mono" ? "Geist Mono" : "Inter";
  const tracking = spec.tracking === "normal" ? "no tracking" : spec.tracking;
  return [
    `${step(spec.phone)} · ${step(spec.tablet)} · ${step(spec.desktop)}`,
    String(spec.weight),
    tracking,
    face,
  ].join(" · ");
}

export const TYPESET_ROLES: TypesetRole[] = [
  {
    cls: "display",
    use: "A hero or a reveal moment. Once per screen, at most.",
    sample: "Everything comes from the system",
    group: "words",
  },
  {
    cls: "h1",
    use: "The page heading. Exactly one per screen.",
    sample: "Typeset",
    group: "words",
  },
  {
    cls: "h2",
    use: "A major section of a page.",
    sample: "The seventeen roles",
    group: "words",
  },
  {
    cls: "h3",
    use: "A subsection, a modal title, a panel heading.",
    sample: "Two faces, and only two",
    group: "words",
  },
  {
    cls: "h4",
    use: "A card title or a row title.",
    sample: "Inter Local",
    group: "words",
  },
  {
    cls: "lead",
    use: "The sentence under a page heading. One per screen.",
    sample: "A role owns family, size, line height, weight and tracking — and nothing else.",
    group: "words",
  },
  {
    cls: "body",
    use: "Interface copy, descriptions, dialog content, table cells.",
    sample:
      "Colour, case and product meaning belong to the component that spends the role.",
    group: "words",
  },
  {
    cls: "small",
    use: "Helper text, secondary detail, captions, field labels.",
    sample: "Sell-back values are quoted at the time of sale.",
    group: "words",
  },
  {
    cls: "nav",
    use: "Sidebar rows, top navigation, tab triggers, group labels.",
    sample: "Foundations",
    group: "words",
  },
  {
    cls: "badge",
    use: "Badges, chips, pills and tags. Case belongs to the component.",
    sample: "Limited edition",
    group: "words",
  },
  {
    cls: "code",
    use: "A token name, an inline snippet, a fenced block.",
    sample: "var(--color-action-ink)",
    group: "code",
  },
  {
    cls: "identifier",
    use: "Strings people read back or type in: serials, invite codes, hashes.",
    sample: "4KQ2-9WXP-7T1M",
    group: "code",
  },
  {
    cls: "number-sm",
    use: "Timestamps, counters, supply figures, metadata.",
    sample: "412 / 2,000",
    group: "numerics",
  },
  {
    cls: "number-base",
    use: "Table figures, transaction amounts, quantities, odds.",
    sample: "1,284",
    group: "numerics",
  },
  {
    cls: "number-md",
    use: "A price on a tile, a leaderboard score.",
    sample: "$48.00",
    group: "numerics",
  },
  {
    cls: "number-lg",
    use: "A stat tile, a reward amount, a value in an inspection panel.",
    sample: "$1,240.00",
    group: "numerics",
  },
  {
    cls: "number-xl",
    use: "The one figure a screen is about — a balance, a total.",
    sample: "$12,480.65",
    group: "numerics",
  },
];

const GROUP_TITLES: Record<TypesetRole["group"], string> = {
  words: "Words",
  code: "Code",
  numerics: "Numerics",
};

function RoleRow({ role }: { role: TypesetRole }) {
  return (
    <div
      data-testid="typeset-role"
      data-role={role.cls}
      className="grid gap-4 border-b border-border px-6 py-7 last:border-b-0 lg:grid-cols-[17rem_1fr] lg:gap-8"
    >
      <div>
        <p className="type-code text-action-ink">.type-{role.cls}</p>
        <p className="type-small mt-2 text-muted-foreground">{role.use}</p>
        <p className="type-number-sm mt-2 text-muted-foreground">{stepsFor(role.cls)}</p>
      </div>
      <div className="min-w-0 self-center">
        <p className={`type-${role.cls} text-foreground`}>{role.sample}</p>
      </div>
    </div>
  );
}

function DetailGroup({ group }: { group: TypesetRole["group"] }) {
  const roles = TYPESET_ROLES.filter((r) => r.group === group);
  return (
    <div data-testid={`typeset-group-${group}`} className="mt-6">
      <Panel label={GROUP_TITLES[group]} flush bodyClassName="">
        {roles.map((role) => (
          <RoleRow key={role.cls} role={role} />
        ))}
      </Panel>
    </div>
  );
}

export function TypesetCatalog() {
  return (
    <>
      <div
        data-testid="typeset-continuous-preview"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        {TYPESET_ROLES.map((role) => (
          <RoleRow key={role.cls} role={role} />
        ))}
      </div>

      <div data-testid="typeset-detail-groups">
        <DetailGroup group="words" />
        <DetailGroup group="code" />
        <DetailGroup group="numerics" />
      </div>

      <Meta
        className="mt-6"
        items={[
          {
            k: "Sizes",
            v: "Every role is a --text-<role> and --leading-<role> token pair in styles/tokens.css, redefined at each breakpoint there. styles/typeset.css holds no sizes and no media queries, so the .type-* class and the text-* utility can never be moved apart.",
          },
          {
            k: "Breakpoints",
            v: "Two: (width >= 768px) and (width >= 1024px). No clamp() — a fluid size cannot be asserted at a value, only at a viewport.",
          },
          {
            k: "Tracking",
            v: "Nine of the seventeen are tracked and eight are normal — the top of the scale, and everything set in mono. Each one names a --tracking-* token; no role writes an em value by hand.",
          },
          {
            k: "The floor",
            v: "14px. Nothing in the public scale renders smaller.",
          },
        ]}
      />
    </>
  );
}

export { Code };
