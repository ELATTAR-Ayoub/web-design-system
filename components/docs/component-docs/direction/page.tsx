import { Code, Meta } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { DirectionSwitchShowcase } from "./direction-showcase";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "direction",
  omitted: {
    states: "DirectionProvider renders no DOM node of its own — it is a React context provider around Direction.useDirection's value, nothing else. There is no element here to be at rest, hovered, focused, pressed, loading or empty.",
    keyboard: "Nothing here is focusable: DirectionProvider mounts no element, so there is no tab stop and no key it responds to. Keyboard behaviour belongs to whatever Radix primitive reads the direction downstream — Select, Tabs, Slider and the rest each document their own.",
    responsive: "DirectionProvider has no layout: it writes no width, no breakpoint rule and nothing that reflows. What it changes is which edge \"start\" and \"end\" resolve to for the primitives beneath it, and that holds the same at 375px as at 1920px.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Flip the switch and a real row of controls flows the other way. Every direction-aware Radix primitive beneath DirectionProvider reads dir from it.",
      label: "Switch ltr / rtl",
      render: <DirectionSwitchShowcase />,
      source: `const [dir, setDir] = useState<"ltr" | "rtl">("ltr");

<Switch checked={dir === "rtl"} onCheckedChange={(c) => setDir(c ? "rtl" : "ltr")} />

<div dir={dir}>
  <DirectionProvider direction={dir}>
    <Row>
      <Button variant="outline">{dir === "rtl" ? "إلغاء" : "Cancel"}</Button>
      <Button>{dir === "rtl" ? "حفظ" : "Save"}</Button>
    </Row>
  </DirectionProvider>
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
        "Every Radix-built component in this system (Select, DropdownMenu, Tabs, Slider, ...) reads direction through this same provider — wrap the app once near the root rather than passing dir to each one.",
      language: "tsx",
      code: `import { DirectionProvider, useDirection } from "@/components/ui/direction";

// Once, near the root:
<DirectionProvider direction={locale.isRtl ? "rtl" : "ltr"}>
  <App />
</DirectionProvider>

// Anywhere beneath it:
function Toolbar() {
  const dir = useDirection(); // "ltr" | "rtl"
  return <span>{dir}</span>;
}`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "DirectionProvider",
          body: (
            <Meta
              items={[
                {
                  k: "direction",
                  v: (
                    <>
                      <Code>&quot;ltr&quot; | &quot;rtl&quot;</Code>, default{" "}
                      <Code>&quot;ltr&quot;</Code>. The preferred prop name.
                    </>
                  ),
                },
                {
                  k: "dir",
                  v: "\"ltr\" | \"rtl\" — an alias for direction, kept for drop-in compatibility with Radix's own prop name. direction wins if both are given.",
                },
                { k: "children", v: "React.ReactNode — required." },
              ]}
            />
          ),
        },
        {
          label: "useDirection",
          body: (
            <p className="type-body text-muted-foreground">
              Re-exported directly from Radix&rsquo;s <Code>Direction.useDirection</Code>.
              Returns the current <Code>&quot;ltr&quot; | &quot;rtl&quot;</Code> from the
              nearest <Code>DirectionProvider</Code> above the caller, or{" "}
              <Code>&quot;ltr&quot;</Code> when none is present.
            </p>
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
              This sets reading direction for the Radix primitives that consume it —
              it does not itself write a <Code>dir</Code> attribute to the DOM. Pair
              it with a real <Code>dir</Code> attribute on <Code>&lt;html&gt;</Code> or
              a containing element for the document&rsquo;s own bidi behaviour and CSS
              logical properties to follow the same direction.
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
