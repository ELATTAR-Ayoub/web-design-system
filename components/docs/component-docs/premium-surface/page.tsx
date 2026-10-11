import { Button } from "@/components/ui/button";
import { Code, Meta, Note, Row } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

function PremiumSurfaceSpecimen() {
  return (
    <Row>
      <Button variant="premium" size="xl" emphasis="caps">
        Open pack
      </Button>
      <Button variant="premium" size="lg">
        Claim reward
      </Button>
      <Button variant="premium">Upgrade to Pro</Button>
    </Row>
  );
}

export const spec: ComponentDocSpec = {
  name: "premium-surface",
  omitted: {
    api: "foil-value is a CSS class, not a component — it takes no props. Every value it reads or exposes (the ramp tokens, the hover-speed change) is already listed in Classes above; an API Reference here would just repeat that table under a different heading.",
    keyboard: "The class is a background-image and a hover/active transition on whatever host wears it — it attaches no key handler and changes nothing about the host's own keyboard behaviour. Keyboard operability is the host element's job (a real button, in every specimen here), covered under Usage.",
    responsive: "foil-value paints inside whatever box the host already is — it sets no width, height or breakpoint of its own, so it has no responsive behaviour beyond following the host's. A button wearing this class reflows exactly as far as an unstyled button does.",
  },
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "Effect",
      description:
        "The same foil-value ramp — light–dark–light with a metal-edge band at 52%, a static diagonal foil texture drifting slowly and forever, and a glint that sweeps across on a five-and-a-half-second cycle — across the three real money/reward moments this surface is for: a hero pack-opening CTA (xl, call-to-action type), a reward claim, and a premium upsell. Same class, three hosts, so the metal reads consistently rather than as a one-off treatment on a single button.",
      appliedAs: "foil-value",
      render: <PremiumSurfaceSpecimen />,
      source: `<Button variant="premium" size="xl" emphasis="caps">Open pack</Button>
<Button variant="premium" size="lg">Claim reward</Button>
<Button variant="premium">Upgrade to Pro</Button>`,
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
        "Reserve this for money and reward moments — pack openings, premium upsells, reward CTAs — not for general emphasis. foil-value sets position: relative itself; the host needs overflow-hidden so the foil and glint layers stay inside the shape.",
      language: "tsx",
      code: `<Button variant="premium">Claim reward</Button>`,
    },
    {
      kind: "disclosure",
      id: "classes",
      title: "Classes",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "foil-value",
                  v: "The element's own background-image: a seven-stop linear-gradient in the value ramp with the metal-edge band at 52%. ::after paints fine diagonal striations plus a broad sheen on soft-light, drifting on value-foil-drift. ::before is the glint: a narrow bright band on screen blend, cycling on value-glint.",
                },
                {
                  k: "Hover",
                  v: (
                    <>
                      <Code>::before</Code>&rsquo;s glint speeds up to{" "}
                      <Code>--duration-glint-hover</Code> (2400ms, from 5500ms at
                      rest); <Code>::after</Code>&rsquo;s opacity rises to 1.
                    </>
                  ),
                },
                {
                  k: "Tokens read",
                  v: "--color-value, --color-value-bright, --color-value-dark. The 42% mix depth at the ramp's edge band is re-measured against AA on any change to the value ramp — a darker hue needs a deeper mix to clear contrast at that band.",
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
              The label text sits on the ramp&rsquo;s darkest band roughly a third
              of the way down; that band is deliberately mixed deep enough to
              clear AA against text-value-foreground, and needs re-measuring on
              any value-ramp change (see foil-value&rsquo;s own comment in
              utilities.css for the method — the stops are color-mix() and
              cannot be parsed as plain RGB).
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
            <Note tone="action" title="Documented in motion.css's vanishing-keyframe ledger">
              <p>
                <Code>value-glint</Code> is listed as DECORATIVE: it spends most
                of its cycle at <Code>opacity: 0</Code>, so freezing it under
                prefers-reduced-motion leaves the button looking like it does
                for most of every cycle anyway — foil and ramp intact, no glint.
              </p>
              <p className="mt-2">
                <Code>value-foil-drift</Code> is not in the ledger because it
                never reaches zero opacity — it only shifts background-position
                — so freezing it at one frame loses nothing.
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
      blocks: [
        {
          body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} />,
        },
      ],
    },
  ],
};
