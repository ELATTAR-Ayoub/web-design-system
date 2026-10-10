import { Code, Meta, Panel } from "@/components/ds/kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { ContentChange } from "@/components/ui/content-change";

import { NextMessageSpecimen } from "./next-message-specimen";
import { meta } from "./meta";

function ReplayableTabPanel() {
  return (
    <Tabs defaultValue="billing" className="w-full max-w-sm">
      <TabsList aria-label="Replay the entrance with a different panel">
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
      </TabsList>
      <TabsContent value="billing">
        <ContentChange contentKey="billing" animationClassName="anim-enter">
          <Panel label="Tab panel">
            <p className="type-body text-foreground">Billing details for this cycle.</p>
          </Panel>
        </ContentChange>
      </TabsContent>
      <TabsContent value="usage">
        <ContentChange contentKey="usage" animationClassName="anim-enter">
          <Panel label="Tab panel">
            <p className="type-body text-foreground">42% of this month&rsquo;s quota used.</p>
          </Panel>
        </ContentChange>
      </TabsContent>
    </Tabs>
  );
}

export const spec: ComponentDocSpec = {
  name: "content-change",
  omitted: {
    keyboard: "ContentChange renders a plain <div> with no interactive role — it wraps children, and any focusable elements inside it keep whatever keyboard behaviour they already have, documented on their own pages. The wrapper itself defines no key handling.",
    responsive: "ContentChange sets no width, height or breakpoint rule of its own — the wrapping <div> takes exactly the size children would render at without it, so there is nothing about the wrapper that reflows, zooms or mirrors differently from its content.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The real component. Press Next message to advance to a new one — each press changes contentKey on the same persistent element, exactly the shape a real inbound-message thread uses (shown in Usage below), and the entrance plays again on every change.",
      label: "Next message replays the entrance",
      render: <NextMessageSpecimen />,
      source: `"use client";

const MESSAGES = ["A new message arrived.", "Another one just landed.", "One more just came in."];

function NextMessageSpecimen() {
  const [index, setIndex] = useState(0);

  return (
    <>
      <ContentChange contentKey={index}>
        <Panel label="Message">
          <p>{MESSAGES[index]}</p>
        </Panel>
      </ContentChange>
      <Button onClick={() => setIndex((current) => (current + 1) % MESSAGES.length)}>
        Next message
      </Button>
    </>
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
        "Changing contentKey replays the entrance; re-rendering with the same key does not, no matter how many times children itself changes.",
      language: "tsx",
      code: `import { ContentChange } from "@/components/ui/content-change";

function Thread({ latestMessage }: { latestMessage: Message }) {
  return (
    <ContentChange contentKey={latestMessage.id}>
      <MessageBubble message={latestMessage} />
    </ContentChange>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "The same verified entrance, anim-enter, used here for a tab panel swap rather than a message arrival. Switching between these two tabs is the real-world case ContentChange's contentKey pattern targets.",
      label: "anim-enter — switch tabs to replay",
      render: <ReplayableTabPanel />,
      source: `<Tabs defaultValue="billing">
  <TabsList aria-label="Replay the entrance with a different panel">
    <TabsTrigger value="billing">Billing</TabsTrigger>
    <TabsTrigger value="usage">Usage</TabsTrigger>
  </TabsList>
  <TabsContent value="billing">
    <ContentChange contentKey="billing" animationClassName="anim-enter">
      <Panel label="Tab panel">
        <p>Billing details for this cycle.</p>
      </Panel>
    </ContentChange>
  </TabsContent>
  <TabsContent value="usage">
    <ContentChange contentKey="usage" animationClassName="anim-enter">
      <Panel label="Tab panel">
        <p>42% of this month&rsquo;s quota used.</p>
      </Panel>
    </ContentChange>
  </TabsContent>
</Tabs>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "ContentChange",
          body: (
            <Meta
              items={[
                { k: "contentKey", v: "React.Key — required. Identifies the current content: a message id, a tab's panel name, a page number." },
                {
                  k: "animationClassName",
                  v: (
                    <>
                      <Code>&quot;anim-enter&quot;</Code> (default, and the only
                      value accepted) — the one entrance{" "}
                      <Code>styles/motion.css</Code> verifies safe under reduced
                      motion. Not an arbitrary <Code>anim-*</Code> string; its
                      rise, scale and stagger are tuned instead through the
                      element&rsquo;s own <Code>--enter-y</Code>,{" "}
                      <Code>--enter-scale</Code> and <Code>--enter-stage</Code>{" "}
                      custom properties.
                    </>
                  ),
                },
                { k: "children", v: "React.ReactNode — required. Never remounted across a key change; only the animation class is restarted on the same element." },
                { k: "...props", v: "Every other <div> prop, forwarded to the wrapping element." },
              ]}
            />
          ),
        },
        {
          label: "useReplayOnStateChange",
          body: (
            <p className="type-body text-muted-foreground">
              A second, lower-level export kept for <Code>Checkbox</Code>,{" "}
              <Code>Radio</Code> and <Code>Switch</Code>, which animate on a Radix
              <Code>data-state</Code> attribute rather than a value the component
              receives as a prop — there is nothing for a <Code>contentKey</Code> to
              key on in that case. It watches the DOM attribute with a
              <Code>MutationObserver</Code> and replays the same remove/reflow/re-add
              on change. Not intended for direct use outside those three controls.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "ContentChange carries no role of its own — its accessibility story is the reduced-motion guarantee built into which animations it is allowed to play, not a landmark or announcement.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Reduced motion",
                  v: (
                    <>
                      <Code>animationClassName</Code> only accepts{" "}
                      <Code>&quot;anim-enter&quot;</Code> — the one entrance{" "}
                      <Code>styles/motion.css</Code>&rsquo;s global{" "}
                      <Code>prefers-reduced-motion</Code> block special-cases with an
                      explicit <Code>opacity: 1; transform: none</Code> landing frame, on
                      top of the blanket duration cut. Widening that type to an arbitrary{" "}
                      <Code>anim-*</Code> string would let a caller reach for an
                      unverified keyframe and risk content stuck invisible or
                      mid-transform under reduced motion (trap 19) — so the type itself is
                      the accessibility guarantee here, not a runtime check.
                    </>
                  ),
                },
                {
                  k: "No remount",
                  v: "The remove/reflow/re-add technique keeps the same DOM element across a contentKey change, which is what keeps focus and scroll position inside children intact — a key-driven remount would throw both away on every replay.",
                },
                {
                  k: "No announcement",
                  v: "A visual entrance is not itself an accessible-name or live-region change. If the new content is also new information a screen-reader user needs to hear (an arriving chat message, for instance), that is a separate aria-live region the caller owns — ContentChange only replays the visual pulse.",
                },
              ]}
            />
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
