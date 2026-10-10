import {
  Code,
  DsPageHeader,
  DsSection,
  Note,
  PageFootNav,
  Panel,
} from "@/components/ds/kit";
import { TokenSwatchList } from "@/components/ds/token-swatch";
import { findCategory } from "@/lib/ds/nav";

const { category } = findCategory("foundations", "colors");

const monochrome = [
  {
    token: "--background",
    name: "Background",
    use: "The page. White on light, zinc 950 on dark. Utility: bg-background.",
    measure: false,
  },
  {
    token: "--card",
    name: "Card",
    use: "Containers. Aliased by --popover and --sidebar. Utilities: bg-card, bg-popover.",
    measure: false,
  },
  {
    token: "--muted",
    name: "Muted",
    use: "Fills and hairlines. Aliased by --secondary and --border. Utilities: bg-muted, border-border.",
    measure: false,
  },
  {
    token: "--accent",
    name: "Accent",
    use: "Hover surfaces and stronger borders. Aliased by --input. Utilities: bg-accent, border-input.",
    measure: false,
  },
  {
    token: "--foreground",
    name: "Foreground",
    use: "All primary text. Utility: text-foreground.",
  },
  {
    token: "--muted-foreground",
    name: "Muted foreground",
    use: "Secondary text, metadata, helper copy. The one step that is not a mirror between themes — see the note below. Utility: text-muted-foreground.",
  },
];

const action = [
  {
    token: "--color-action-ink",
    name: "Action ink",
    use: "The text-safe end, resolved for whichever theme you are in. The ONLY action colour allowed on text, icons and links. Utility: text-action-ink.",
  },
  {
    token: "--color-action-bright",
    name: "Action bright",
    use: "The lifted end. Ink on dark, and the focus ring there. Illegible as text on light — never name it directly.",
  },
  {
    token: "--color-action",
    name: "Action",
    use: "The fill. Drives --primary: buttons, selection, active nav. Never carries a glyph — put text-primary-foreground on top.",
  },
  {
    token: "--color-action-dark",
    name: "Action dark",
    use: "The deep end. Ink on light, plus gradient floors and the foil ramp's base.",
  },
];

const value = [
  {
    token: "--color-value-ink",
    name: "Value ink",
    use: "The text-safe end, resolved per theme. Every figure, label and glyph that means worth.",
  },
  {
    token: "--color-value",
    name: "Value",
    use: "Balances, rankings, premium actions, reward surfaces.",
  },
  {
    token: "--color-value-bright",
    name: "Value bright",
    use: "Reward moments and the foil gradient's top stop.",
  },
  {
    token: "--color-value-dark",
    name: "Value dark",
    use: "Foil gradient floor, and ink on light.",
  },
];

const state = [
  {
    token: "--color-success",
    name: "Success",
    use: "Completed, cleared, live, gained. Emerald rather than a plain green, to open a gap against lime. A fill, a border or a bloom — never a glyph.",
    measure: false,
  },
  {
    token: "--color-warning",
    name: "Warning",
    use: "Pending, needs attention, purchase limit approaching. Amber, forty degrees off lime.",
    measure: false,
  },
  {
    token: "--color-info",
    name: "Information",
    use: "Neutral notices and explainers. Cyan rather than blue, so a notice cannot be mistaken for the brand.",
    measure: false,
  },
  {
    token: "--destructive",
    name: "Destructive",
    use: "shadcn's own. Deletes, failed payments, validation errors. Spent as a tint rather than a solid fill — not because the pairing fails, but because a solid red card recolours its own body copy and reads as a traffic light beside the other four Alert variants.",
    measure: false,
  },
];

const code = [
  { token: "--code-keyword", name: "Keyword", use: "Control flow and declarations: if, return, const, @media, decorators. Action ink." },
  { token: "--code-string", name: "String", use: "Quoted literals and URLs. Success ink." },
  { token: "--code-number", name: "Number", use: "Numeric, boolean and constant literals; regular expressions. Value ink." },
  { token: "--code-function", name: "Function", use: "Calls and declarations. Info ink." },
  { token: "--code-type", name: "Type", use: "A KIND of thing: class names, built-ins, tags, CSS selectors. Warning ink." },
  { token: "--code-variable", name: "Variable", use: "A SPECIFIC thing: properties, parameters, variables, attribute names. Destructive ink." },
  { token: "--code-punctuation", name: "Punctuation", use: "Structural marks and operators. Foreground." },
  { token: "--code-comment", name: "Comment", use: "Comments. Muted foreground — already tuned as body text." },
];

const stateInk = [
  {
    token: "--color-success-ink",
    name: "Success ink",
    use: "Every success glyph, label and figure, and the Stat delta's favourable direction. Utility: text-success-ink.",
  },
  {
    token: "--color-warning-ink",
    name: "Warning ink",
    use: "Every warning glyph and label. Utility: text-warning-ink.",
  },
  {
    token: "--color-info-ink",
    name: "Information ink",
    use: "Every informational glyph and label. Utility: text-info-ink.",
  },
  {
    token: "--color-destructive-ink",
    name: "Destructive ink",
    use: "Field errors, failed states, destructive glyphs. Utility: text-destructive-ink.",
  },
];

export default function ColorsPage() {
  return (
    <>
      <DsPageHeader
        eyebrow="Sections"
        title={category.title}
        blurb={category.blurb}
        contents={category.contents}
      />

      <Note tone="action" title="Measured, not asserted" className="mb-12">
        Every value below is read from the live stylesheet and every contrast
        ratio is computed from it at runtime. Nothing on this page is typed by
        hand, so it cannot disagree with <Code>app/globals.css</Code> — and it
        re-measures when you flip the theme, so the ratios you are reading are
        the ratios for the mode you are actually in. The rules that govern all of
        it live in <Code>RULES.md</Code>.
      </Note>

      <DsSection
        id="monochrome"
        title="Monochrome — zinc"
        description="Six steps on shadcn's own token names, read downward on light and upward on dark. There is no second naming system."
      >
        <TokenSwatchList tokens={monochrome} />
        <Note tone="value" title="The one step that is not a mirror" className="mt-4">
          Every other neutral inverts cleanly between the two themes. Muted
          foreground does not. On dark it is zinc 300, which measures about 13:1;
          the mirror image would be zinc 400 on white, which measures 3.1:1 and
          fails AA outright. Nor is it zinc 500, which this system shipped for a
          long time: that clears AA on <Code>--background</Code> and misses it on{" "}
          <Code>--muted</Code> by a tenth of a point — and muted text on a muted
          fill is the most repeated pair in the whole system. Light sits one step
          deeper than zinc 500 so both pairs clear. Flip the theme and watch the
          ratio above: it stays legal in both, and it gets there by different
          means.
        </Note>
      </DsSection>

      <DsSection
        id="action"
        title="Action — the thing that acts"
        description="Buttons, links, focus, selection, the agent. It answers one question: can I act on this, or is this the thing I picked? It is a blue today; it has been purple and wine before, and no component knew."
      >
        <TokenSwatchList tokens={action} />
        <Note tone="action" title="One text-safe shade per theme — and it is not the same shade" className="mt-4">
          The ratios above are measured live, so flip the theme and watch them
          trade places. On dark, <Code>--color-action-bright</Code> clears AA and
          the deep end fails. On light it is exactly reversed. A component cannot
          know which surface it is sitting on, so it never names either end — it
          writes <Code>text-action-ink</Code>, and the theme block answers.
          The mid shade is a fill in both themes and can never carry a glyph;
          put <Code>text-primary-foreground</Code> on top of it.
        </Note>
      </DsSection>

      <DsSection
        id="value"
        title="Value — the thing that is worth something"
        description="Balances, rankings, rewards, premium actions. Nothing else. It is lime today, and it follows the same ink rule the action ramp does."
      >
        <TokenSwatchList tokens={value} />
      </DsSection>

      <DsSection
        id="state"
        title="State"
        description="Four meanings, fixed. Two of them moved when the brand did, and both moves were forced rather than aesthetic."
      >
        <TokenSwatchList tokens={state} />

        <h3 className="type-h4 mt-8 mb-4 text-foreground">
          The text-safe end of each
        </h3>
        <TokenSwatchList tokens={stateInk} />

        <Note tone="error" title="A mark with no foreground of its own is on this contract too" className="mt-4">
          Only <Code>-ink</Code> may carry a glyph, a label or a figure — and
          the rule reaches further than text. A button may be as dark as it
          likes because it brings its own label; a progress fill, a slider range
          and a 2px tab rule bring nothing, so the only thing making them
          visible is their contrast with the surface under them. Those name{" "}
          <Code>bg-action-ink</Code> and the state inks for the same reason.
          Fills, borders, rings and blooms keep the raw token above.
        </Note>

        <Note tone="value" title="Why info is cyan and success is emerald" className="mt-4">
          A state colour has one job: to be unmistakable for anything else on the
          screen. Information used to be blue 400, which stopped working the
          moment action became blue — a neutral notice read as a promotion.
          Success used to be green 400, a few degrees from lime, which is too
          close when a completed sale and a valuable one appear in the same
          same row. Warning did not move and gained separation for free: it is
          amber, and lime sits forty degrees away from it, where the old value
          hue sat almost on top of it. That collision is the one this rebrand
          fixed by accident.
        </Note>
      </DsSection>

      <DsSection
        id="code"
        title="Code"
        description="Eight roles for highlighted code, each pointing at a colour already on this page, so a code block follows the theme and never brings a palette of its own."
      >
        <TokenSwatchList tokens={code} />

        <Note tone="action" title="Two highlighters, one set of roles" className="mt-4">
          The agent family&apos;s Prism code block colours each <Code>.token.*</Code>{" "}
          class from these roles (<Code>styles/utilities.css</Code>). The AI
          Elements code blocks — <Code>CodeBlock</Code> and the code inside an
          agent&apos;s answer — highlight with Shiki&apos;s CSS-variables theme{" "}
          (<Code>lib/code-theme.ts</Code>), which writes{" "}
          <Code>var(--shiki-token-keyword)</Code> and so on instead of a colour;{" "}
          <Code>styles/tokens.css</Code> aliases every <Code>--shiki-*</Code> name to
          the role it means. Neither ships GitHub&apos;s or any other vendor
          palette.
        </Note>
      </DsSection>

      <DsSection
        id="beyond"
        title="What is deliberately not a colour token"
        description="Two things this system refuses to express as a colour, because a colour is the wrong tool for both."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Panel label="Texture">
            <p className="type-small text-muted-foreground">
              A surface that has to feel rare, precious or alive is a{" "}
              <em>texture</em>, not a hue — a moving gradient, a foil ramp, an
              iridescent bloom. Those live in <Code>globals.css</Code> as
              utilities (<Code>foil-value</Code>, <Code>bloom-cosmic</Code>,{" "}
              <Code>sheen-action</Code>) and are built from the two ramps above,
              so they follow a rebrand without carrying colour tokens of their
              own.
            </p>
          </Panel>
          <Panel label="Meaning">
            <p className="type-small text-muted-foreground">
              Nothing may be communicated by colour alone. A state ships its
              glyph and its label as well as its hue; a status ships its
              sentence. The four state colours above are a second signal on top
              of a first one, never the only one — which is also what keeps this
              system legible when both themes and every form of colour-blindness
              are accounted for.
            </p>
          </Panel>
        </div>
      </DsSection>

      <PageFootNav groupId="foundations" slug="colors" />
    </>
  );
}
