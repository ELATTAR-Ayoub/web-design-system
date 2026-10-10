/**
 * Documentation page for `source-foundation`.
 *
 * Authored, not generated. This is the one item every other item in the
 * registry assumes is already installed — not a component with a specimen,
 * but the shared source and style delivery: the four `styles/*.css` files,
 * the `app/globals.css` entry that imports them in load-bearing order,
 * `lib/utils.ts` (the `cn()` merge, taught this system's non-standard token
 * groups), and the icon primitives (`components/ui/icon.tsx`,
 * `components/ui/icon-swap.tsx`) every other component is built against.
 * There is no single specimen to render — see `selection-control` and `menu`
 * for the page shape this follows when a capability is not a placeable thing.
 */

import { Code, Meta } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "source-foundation",
  omitted: {
    preview: "There is no single placeable specimen — this item is four stylesheets, a class-merge helper and two icon primitives that every other page's own Preview already exercises. See \"Why there is no live specimen\" below for the reasoning in full, kept as its own section because it is an argument, not a one-line disclaimer.",
    usage: "Nothing here is called or imported on its own — app/globals.css imports the four styles/*.css files once, at the project root, and every other item's own Usage section already shows cn() and the icon primitives being used in context. A usage snippet here would either repeat globals.css verbatim or duplicate another page's example.",
    api: "This delivers CSS files and one utility function, not a component with props — cn()'s signature (ClassValue[] → string) is documented in lib/utils.ts itself, and the four stylesheets have no JavaScript surface to table. \"What this installs\" above is the closest honest equivalent: what each file contributes, not a prop list that does not exist.",
    states: "A stylesheet and a merge function have no interaction states — nothing here is rendered, focused or clicked. States belongs to the components built from this foundation, each documented on its own page.",
    accessibility: "This foundation has no role, name or announcement of its own to get right or wrong — accessibility is a property of the components and pages built from these tokens, not of the tokens' delivery mechanism. Colour contrast, motion and focus-ring accessibility are covered on the Colors and Motion foundation pages, where the actual values live.",
    keyboard: "Nothing here is focusable — there is no keyboard behaviour to document for a stylesheet import and a class-merge function.",
    responsive: "The four stylesheets define values, not layout — a token like --shadow-btn or a .type-h1 rule has no viewport of its own. Responsive behaviour belongs to the component consuming a token (see Table or Sidebar, which genuinely reflow), not to the token's definition.",
  },
  sections: [
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "disclosure",
      id: "what-it-delivers",
      title: "What this installs",
      blocks: [
        {
          label: "styles/",
          body: (
            <Meta
              items={[
                { k: "tokens.css", v: "Faces, the dark variant, the brand and semantic colour scales, the light and dark theme blocks, and @layer base." },
                { k: "typeset.css", v: "Every .type-* role and the .prose long-form flow." },
                { k: "motion.css", v: "The duration and easing scale, every @keyframes block, the motion utilities, and both reduced-motion overrides." },
                { k: "utilities.css", v: "The sanctioned effect utilities and surfaces (glass, press, premium-surface, media-scrim, ...)." },
              ]}
            />
          ),
        },
        {
          label: "Everything else",
          body: (
            <Meta
              items={[
                {
                  k: "app/globals.css",
                  v: "The entry components.json points at. It only @imports the four files above, in a load-bearing order — tokens before typeset and motion read them, utilities last so its unlayered rules win — and holds nothing else.",
                },
                {
                  k: "lib/utils.ts",
                  v: "cn(), a tailwind-merge instance taught this system's non-standard --text-*, --shadow-* and --radius-* token groups so a later override actually wins instead of colliding silently.",
                },
                {
                  k: "Icon primitives",
                  v: "components/ui/icon.tsx and components/ui/icon-swap.tsx — the only sanctioned way a Lucide glyph enters the product. See the icon page.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why-no-specimen",
      title: "Why there is no live specimen",
      blocks: [
        {
          body: (
            <p className="type-body text-muted-foreground">
              Every other page&rsquo;s preview already IS a specimen of this
              foundation — every colour, radius, spacing value and type role a
              component uses on any page resolves through these four files. A
              separate showcase here would either repeat the Colors, Typography,
              Spacing and Motion foundation pages, or invent a demo with no real
              referent. Read those pages for the foundation in use, and{" "}
              <Code>styles/tokens.css</Code> itself for the values.
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
