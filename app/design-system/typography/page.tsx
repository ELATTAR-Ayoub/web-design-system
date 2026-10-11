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
import { TypesetCatalog } from "@/components/ds/typeset-catalog";
import { Prose } from "@/components/ui/prose";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findCategory } from "@/lib/ds/nav";

const { category } = findCategory("foundations", "typography");

export default function TypographyPage() {
  return (
    <>
      <DsPageHeader
        eyebrow="Sections"
        title={category.title}
        blurb={category.blurb}
        contents={category.contents}
      />

      <DsSection
        id="faces"
        title="Two faces"
        description="Inter sets every word. Geist Mono sets code, identifiers and figures. There is no third face, and no role reaches for one."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Panel label="Inter — words">
            <p className="type-display text-foreground">Aa</p>
            <p className="type-small mt-5 text-muted-foreground">
              Headings, body, navigation, badges, buttons. Loaded as a variable
              face by the <Code>@font-face</Code> in{" "}
              <Code>styles/tokens.css</Code>, so the stylesheet a consumer
              installs carries its own sans.
            </p>
            <p className="type-code mt-4 text-muted-foreground">--font-sans</p>
          </Panel>
          <Panel label="Geist Mono — code and figures">
            <p className="type-number-xl text-value-ink">0123</p>
            <p className="type-small mt-5 text-muted-foreground">
              Prices, balances, counters, serials and code. The five numeric
              roles are tabular, so a column of figures aligns and a live value
              does not shuffle sideways as it updates.
            </p>
            <p className="type-code mt-4 text-muted-foreground">--font-mono</p>
          </Panel>
        </div>
        <Note tone="action" title="What a role owns" className="mt-4">
          Family, size, line height, weight and tracking. Never colour, never
          case, never opacity, never a product meaning — those belong to the
          component that spends the role, which is why{" "}
          <Code>.type-small</Code> serves a muted caption and a foreground note
          without either of them needing a class of its own.
        </Note>
      </DsSection>

      <DsSection
        id="roles"
        title="The seventeen roles"
        description="Public typography is exactly seventeen names, continuous first in canonical order, then grouped into Words, Code and Numerics. This is the one role list in the codebase."
      >
        <TypesetCatalog />
      </DsSection>

      <DsSection
        id="prose"
        title="Prose"
        description="The same scale, reached a second way. A policy, a help article or the output of a markdown renderer has no call site to put a class on, so .prose styles the elements instead — and it does it by adding a selector to the type roles above rather than by owning a second set of sizes."
      >
        <Panel
          label="Long-form content"
          note="max-w-(--width-prose) · 720px"
          bodyClassName="p-6 sm:p-10"
        >
          <Prose className="max-w-(--width-prose)">
            <h2>Refunds and cancellations</h2>
            <p>
              Every element here is unstyled markup inside a single{" "}
              <code>prose</code> wrapper. The heading above is the same
              declaration block as <code>.type-h2</code> — not a copy of its
              size, the block itself — so retuning the scale moves both and
              neither can drift from the other.
            </p>
            <p>
              Links take <code>--color-action-ink</code>, which is the only
              shade of the action ramp that reads in both themes, and they are
              underlined at rest because{" "}
              <a href="#prose">a link identified by hue alone</a> is one signal
              where the accessibility contract asks for two.
            </p>
            <h3>What a reader is entitled to</h3>
            <ul>
              <li>A refund within fourteen days of purchase.</li>
              <li>
                A written reason when a request is refused, including
                <ul>
                  <li>the clause it was refused under, and</li>
                  <li>the address an appeal goes to.</li>
                </ul>
              </li>
              <li>A reply inside one working week.</li>
            </ul>
            <blockquote>
              Nested lists take the interior step rather than the block step, so
              a sub-clause reads as part of its parent rather than as a new
              paragraph.
            </blockquote>
            <h3>Ordered steps</h3>
            <ol>
              <li>Open the order from your account.</li>
              <li>Choose the items you are returning.</li>
              <li>Print the label and post it within seven days.</li>
            </ol>
            <h4 className="type-small text-muted-foreground">
              An explicit class still wins inside prose
            </h4>
            <p>
              That heading is an <code>h4</code> carrying{" "}
              <code>.type-small</code>. The prose selector is wrapped in{" "}
              <code>:where()</code>, so it weighs one element and any real class
              beats it — <code>.prose</code> is a default, not a cage.
            </p>
            <Separator />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Window</TableHead>
                  <TableHead>Refunded to</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Unopened item</TableCell>
                  <TableCell>14 days</TableCell>
                  <TableCell>Original payment method</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Faulty item</TableCell>
                  <TableCell>30 days</TableCell>
                  <TableCell>Original payment method</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Prose>
        </Panel>

        <Meta
          className="mt-4"
          items={[
            {
              k: "Prose",
              v: "components/ui/prose.tsx. Renders the .prose class on a <div> by default; pass asChild to render it as an <article> or other semantic wrapper instead. The panel above uses the real component, not a bare class.",
            },
            {
              k: "What it owns",
              v: "Vertical rhythm on the 8-point scale, list markers and indents, link treatment, quote rule, and code and table chrome — plus the muting on a caption and a table header, which the roles no longer carry.",
            },
            {
              k: "Anchors",
              v: "Nothing. html carries scroll-padding-block-start: var(--scroll-offset), derived from --height-site-header. A scroll-margin here as well would add to it — measured at 192px below a 64px header before it was removed.",
            },
            {
              k: "Wide tables scroll",
              v: "A table is display:block with width:max-content capped at 100%, so it is its own scroll port on the system's thin rail. It takes content width rather than filling the measure — the trade for never being clipped, which is what happened at 375px before the rule existed.",
            },
            {
              k: "What it does not own",
              v: "Sizes. Every one lives in the .type-* role it shares a declaration block with. It also sets no max-width — the measure belongs to the page container, and two owners for one number is how --width-page spent months as prose on the Spacing page.",
            },
          ]}
        />

        <Note tone="error" title="Two mechanisms that do not work" className="mt-4">
          <Code>@apply type-h2</Code> inside a <Code>.prose h2</Code> rule fails
          the build outright — <em>Cannot apply unknown utility class</em> —
          because <Code>@apply</Code> reaches Tailwind utilities and{" "}
          <Code>@utility</Code> registrations, and the type scale lives in{" "}
          <Code>@layer components</Code>. The call-site spelling{" "}
          <Code>[&amp;_h2]:type-h2</Code> is the same wall from the other side
          and fails <em>silently</em>, which is the worse of the two: no error,
          no class, every guard green, and the size quietly falling back to
          inherited.
        </Note>
      </DsSection>

      <DsSection id="rules" title="Rules">
        <DoDont
          dos={[
            "Always apply one of the seventeen roles — never a raw pixel size in a utility.",
            "Put every figure in a numeric role so comparable values stay tabular and aligned.",
            "Add colour and case on the component, beside the role, where the component is what needs them.",
            "Use .type-display once per screen at most, and only for a hero or a reveal.",
          ]}
          donts={[
            "Don't apply font families or numeric weights at the call site; the role already carries both.",
            "Don't add a third typeface. Inter and Geist Mono are the system's two faces.",
            "Don't invent a size beneath a role to escape it. Roles reach 12 and badge reaches 10 on a phone; a size that exists because a role carried a colour or a case you didn't want is how the furniture ladder came back last time.",
            "Don't use proportional figures anywhere money, odds or counts appear.",
          ]}
        />
      </DsSection>

      <PageFootNav groupId="foundations" slug="typography" />
    </>
  );
}
