import { Code, Meta, Note } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { ScrimToggleSpecimen } from "./scrim-toggle-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "media-scrim",
  omitted: {
    api: "There is no API: this is one utility class on the element that covers the media, and the ramp's numbers are tokens rather than parameters. Flutter's widget takes a child; the web takes a class name.",
    states:
      "A gradient has no interaction or async state of its own — rest is the only state, and hover, focus, loading and disabled all belong to whatever control is composed on top of it.",
    keyboard:
      "The scrim is paint, never a focusable element; keyboard behaviour belongs to the title link or action button placed inside it.",
  },
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "Effect",
      description:
        "The same photograph and the same white title. Flip the switch to remove the scrim and watch the caption lose its readable edge — transparent through the upper half, rising to a readable edge only while the class is applied.",
      label: "Toggle the scrim",
      appliedAs: "media-scrim",
      render: <ScrimToggleSpecimen />,
      source: `"use client";

function ScrimToggleSpecimen() {
  const [scrim, setScrim] = useState(true);

  return (
    <figure className="relative aspect-video overflow-hidden rounded-xl">
      <img src="/imgs/sample-photo.jpg" alt="" className="absolute inset-0 size-full object-cover" />
      <figcaption
        className={
          scrim
            ? "media-scrim absolute inset-0 flex flex-col justify-end p-6"
            : "absolute inset-0 flex flex-col justify-end p-6 text-(--media-foreground)"
        }
      >
        <p className="type-h3">Eclipse Vault</p>
        <p className="type-small opacity-90">12 cards · opens in 2 days</p>
      </figcaption>
    </figure>
  );
}`,
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
        "Apply it to the element that covers the media's full bounds and compose the copy inside it. It sets the foreground as well as the ramp, so the title does not need its own colour.",
      language: "tsx",
      code: `<div className="relative aspect-video overflow-hidden rounded-xl">
  <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
  <div className="media-scrim absolute inset-0 flex items-end p-6">
    <h3 className="type-h3">{title}</h3>
  </div>
</div>`,
    },
    {
      kind: "disclosure",
      id: "classes",
      title: "The ramp",
      description: "Three stops, and the numbers are Flutter's, copied rather than tuned.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "0%", v: "Transparent. The upper half of the media is untouched." },
                {
                  k: "--media-scrim-mid-stop (58%)",
                  v: "The ink at --media-scrim-mid (18%) — a restrained bridge between the transparent field and the readable edge.",
                },
                {
                  k: "100%",
                  v: "The ink at --media-scrim-end (82%) — enough for white title copy without becoming an opaque slab.",
                },
                {
                  k: "--media-ink / --media-foreground",
                  v: "Black and white, declared once and never redefined for dark mode. A photograph does not change when the application does, so the pair contrasted against it cannot either.",
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
            <div className="space-y-4">
              <Note tone="action" title="The ramp is what makes the contrast claim true">
                White copy at the bottom edge sits on the ink at 82%, so its contrast
                against the darkest part of the ramp is the same on every image. Copy
                placed in the transparent upper half has whatever contrast the
                photograph happens to give it — which is why the utility sets{" "}
                <Code>justify-end</Code> in every example on this page and why a title
                belongs at the bottom.
              </Note>
              <Meta
                items={[
                  {
                    k: "Announcement",
                    v: "None. The scrim is a background; the media's own alt text and the composed copy are what assistive technology reads.",
                  },
                  {
                    k: "Forced colours",
                    v: "Under forced-colors the gradient is removed by the user agent and the composed copy takes the system foreground, which is the correct outcome: the platform is asserting its own contrast.",
                  },
                ]}
              />
            </div>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              The ramp is expressed in percentages of the covered element, so it
              scales with the media at every width and every zoom level and needs no
              breakpoint. Under RTL nothing mirrors — the ramp runs top to bottom,
              and the composed copy follows the page&rsquo;s own direction. Measured
              on this page at 375, 768, 1440 and 1920 with no overflow, and at 200%
              text zoom with the caption still inside the figure.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
