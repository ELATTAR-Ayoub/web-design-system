import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Code, Meta, Note, Panel } from "@/components/ds/kit";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";
import { MessageScrollerAddDemo } from "./message-scroller-showcase";

const TRANSCRIPT = [
  { id: "m1", from: "agent", text: "Morning. Three sets on your watchlist moved overnight." },
  { id: "m2", from: "user", text: "Which three?" },
  { id: "m3", from: "agent", text: "Eclipse Vault, Origin Pulse and Nightfall. Eclipse is the outlier — up 14% on twice the usual volume." },
  { id: "m4", from: "user", text: "Anything unusual about the volume?" },
  { id: "m5", from: "agent", text: "It is concentrated. Four accounts account for most of it, and all four bought within the same eleven minutes." },
  { id: "m6", from: "user", text: "Show me what I hold in that set." },
  { id: "m7", from: "agent", text: "Six cards, two of them graded. At this morning's mark that is $2,481.00, up $312.00 since Friday." },
  { id: "m8", from: "user", text: "Leave it. What about Nightfall?" },
  { id: "m9", from: "agent", text: "Flat on price, but the float shrank — nine sealed packs left listed, down from thirty-one." },
  { id: "m10", from: "user", text: "Watch it and tell me if it drops below five." },
  { id: "m11", from: "agent", text: "Set. I will message you the moment the listed count crosses five, and again if it clears out entirely." },
] as const;

function Transcript() {
  return (
    <>
      {TRANSCRIPT.map((t) => (
        <MessageScrollerItem key={t.id} messageId={t.id}>
          <Message align={t.from === "user" ? "end" : "start"}>
            <MessageContent>
              <Bubble
                variant={t.from === "user" ? "default" : "muted"}
                align={t.from === "user" ? "end" : "start"}
              >
                <BubbleContent>{t.text}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </MessageScrollerItem>
      ))}
    </>
  );
}

export const spec: ComponentDocSpec = {
  name: "message-scroller",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A transcript viewport that manages its own scroll: fades its overflowing edge, offers a jump-to-end button while you are reading back, and can anchor on a named message. From @shadcn/react, not Radix. Starts with two turns — nothing to scroll to yet, so the button has nothing to offer. Press \"Add message\" and watch it fade in the moment the transcript actually outgrows the viewport.",
      render: (
        <Panel
          label="Add message"
          note="starts at the top — the button appears once there is somewhere to jump to"
          flush
          bodyClassName="h-80"
        >
          <MessageScrollerAddDemo />
        </Panel>
      ),
      source: `function Transcript({ messages }: { messages: Turn[] }) {
  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="start">
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent>
            {messages.map((m) => (
              <MessageScrollerItem key={m.id} messageId={m.id}>
                <Message align={m.from === "user" ? "end" : "start"}>
                  <MessageContent>
                    <Bubble align={m.from === "user" ? "end" : "start"}>
                      <BubbleContent>{m.text}</BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        {/* Inactive (opacity 0, pointer-events none) until the transcript
            actually outgrows the viewport and the reader isn't at the end. */}
        <MessageScrollerButton direction="end" />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}

// messages grows one turn at a time from an "Add message" button in the
// caller — the scroller itself only reacts to what is already mounted.`,
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
        "The provider owns the state; scrollToEnd, scrollToStart and scrollToMessage come from useMessageScroller inside it, for a button or an effect that needs to move the view on purpose.",
      language: "tsx",
      code: `import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/message-scroller";

function JumpToMessageButton({ messageId }: { messageId: string }) {
  const { scrollToMessage } = useMessageScroller();
  return (
    <button onClick={() => scrollToMessage(messageId)}>
      Jump to that answer
    </button>
  );
}

export function Transcript({ messages }: { messages: ChatMessage[] }) {
  return (
    <MessageScrollerProvider autoScroll>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent>
            {messages.map((m) => (
              <MessageScrollerItem key={m.id} messageId={m.id}>
                {/* ...Message / Bubble */}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton direction="end" />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "defaultScrollPosition controls where the viewport starts before autoScroll takes over. The Preview above uses \"start\" so the fade and the button are both visible; \"end\" is the component's own default.",
      label: "defaultScrollPosition: \"end\"",
      render: (
        <Panel
          label="The same eleven turns, starting at the live edge"
          note="defaultScrollPosition=&quot;end&quot; — the default"
          flush
          bodyClassName="h-80"
        >
          <MessageScrollerProvider autoScroll>
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent className="p-6">
                  <Transcript />
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton direction="start" />
            </MessageScroller>
          </MessageScrollerProvider>
        </Panel>
      ),
      source: `<MessageScrollerProvider autoScroll>
  {/* defaultScrollPosition defaults to "end" */}
</MessageScrollerProvider>`,
    },
    {
      kind: "disclosure",
      id: "vs-ai-conversation",
      title: "How the workspace scrolls instead",
      description:
        "Message Scroller is a generic transcript viewport; the agent workspace scrolls with AI Conversation. This compares the two.",
      blocks: [
        {
          label: "What it is for",
          body: (
            <p className="type-small text-muted-foreground">
              Autoscroll with anchor management, from{" "}
              <Code>@shadcn/react</Code> rather than Radix. A provider, a
              viewport, per-item message ids, a scroll anchor, and a button
              that hides itself once it is already at the end. It can scroll
              to a named message, hold position while older turns are
              prepended, and peek the previous item.
            </p>
          ),
        },
        {
          label: "What the workspace does instead",
          body: (
            <p className="type-small text-muted-foreground">
              The workspace&rsquo;s thread is AI Conversation
              (<Code>components/ai-elements/conversation.tsx</Code>):{" "}
              <Code>Conversation</Code> and <Code>ConversationContent</Code>{" "}
              on <Code>use-stick-to-bottom</Code>, a{" "}
              <Code>ConversationScrollButton</Code> that appears when the
              reader has scrolled away, and an empty state. It follows new
              content while the reader is at the bottom and lets go the moment
              they scroll up, which is all the workspace needs. It never jumps
              to a cited message and never prepends history, so the
              anchor-and-prepend machinery here would add structure and no
              behaviour. The day the thread needs to cite a message, this is
              the component to reach for.
            </p>
          ),
        },
        {
          body: (
            <Note tone="action" title="They stay because ui/ travels">
              §10 is explicit that this system is meant to be lifted, and
              that <Code>components/ui</Code>, <Code>components/agent</Code>{" "}
              and the foundations all travel as-is. The next project may need
              a transcript that jumps to a cited message or prepends older
              history, and for that this is the right starting point —
              deleting it because nothing in this repo imports it would
              remove the one piece the next project is most likely to reach
              for first.
              <span className="mt-3 block">
                See <Code>/design-system/components/ai-conversation</Code> for
                the workspace&rsquo;s own thread,{" "}
                <Code>/design-system/components/message#vs-ai-message</Code>{" "}
                and{" "}
                <Code>/design-system/components/bubble#vs-ai-message</Code>{" "}
                for the row and the surface a turn is drawn on.
              </span>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "The provider, the frame, and the hooks it exposes.",
      blocks: [
        {
          label: "MessageScrollerProvider",
          body: (
            <Meta
              items={[
                {
                  k: "autoScroll",
                  v: "boolean, optional. Follows new content when you are already at the end.",
                },
                {
                  k: "defaultScrollPosition",
                  v: "\"start\" | \"end\" | \"last-anchor\", optional, defaults to \"end\".",
                },
                {
                  k: "scrollEdgeThreshold",
                  v: "number (px), optional, defaults to 8. Tolerance for counting as at an edge.",
                },
              ]}
            />
          ),
        },
        {
          label: "MessageScroller / MessageScrollerViewport / MessageScrollerContent",
          body: (
            <Meta
              items={[
                {
                  k: "MessageScroller",
                  v: "The positioned frame. Everything else nests inside it, and the button is absolute against it. No required props.",
                },
                {
                  k: "MessageScrollerViewport",
                  v: "The element that actually scrolls. Carries scroll-fade-b for the bottom mask, a stable scrollbar gutter so the column does not shift when the bar appears, and hides its own thumb while an autoscroll is running. No required props.",
                },
                {
                  k: "MessageScrollerContent",
                  v: "flex flex-col with a 24px gap. No required props.",
                },
              ]}
            />
          ),
        },
        {
          label: "MessageScrollerItem",
          body: (
            <Meta
              items={[
                { k: "messageId", v: "string, optional. Makes the item addressable by useMessageScroller's scrollToMessage." },
                { k: "scrollAnchor", v: "boolean, optional, defaults to false. Makes this item the resting point." },
                {
                  k: "Rendering",
                  v: "Renders under content-visibility: auto, with an assumed off-screen height of 40 spacing steps (contain-intrinsic-size) so the scrollbar does not jump as items come into view.",
                },
              ]}
            />
          ),
        },
        {
          label: "MessageScrollerButton",
          body: (
            <Meta
              items={[
                { k: "direction", v: "\"start\" | \"end\", optional, defaults to \"end\"." },
                { k: "variant / size", v: "Forwarded straight to the underlying Button. Default variant=\"secondary\", size=\"icon-sm\"." },
                {
                  k: "Visibility",
                  v: "Hides itself — scale, opacity and a translate off its own edge — the moment that direction has nowhere left to go, rather than unmounting.",
                },
              ]}
            />
          ),
        },
        {
          label: "Hooks",
          body: (
            <Meta
              items={[
                { k: "useMessageScroller", v: "scrollToEnd(), scrollToStart(), scrollToMessage(id)." },
                { k: "useMessageScrollerScrollable", v: "Whether either edge still has scroll travel left." },
                { k: "useMessageScrollerVisibility", v: "The current anchor and what is on screen." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "The one interactive element this component renders is MessageScrollerButton, a real Button underneath — its states are Button's, plus the hidden state this component adds on top.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "rest / hover / focus-visible / pressed", v: "Native Button states — see the Button page. This component sets no visual state of its own beyond them." },
                {
                  k: "hidden",
                  v: "data-active=\"false\" — scaled to 95%, faded to 0 opacity and translated off its own edge with a slow ease-in, once that direction has no travel left. Not display:none, so it never abruptly disappears under focus.",
                },
                { k: "loading / disabled / success / empty", v: "N/A — the button has no async action of its own; scrolling is synchronous." },
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
      description:
        "What is actually wired up, verified against message-scroller.tsx rather than assumed from its name.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "MessageScrollerButton",
                  v: "Renders through @shadcn/react's primitive as a real Button and carries its own sr-only label (\"Scroll to end\" / \"Scroll to start\").",
                },
                {
                  k: "MessageScrollerViewport",
                  v: "A plain scrollable region (overflow-y-auto) with no explicit role or live-region announcement in source — it is a native scroll container, not an ARIA widget.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Tab / Shift+Tab", v: "Moves focus to and from MessageScrollerButton in document order, when it is visible." },
                { k: "Space / Enter", v: "Activates the button — native Button behaviour." },
                {
                  k: "Inside the viewport",
                  v: "Arrow keys, Page Up/Down, Home and End scroll the region as they would any native overflow-y: auto element — the component adds no custom key handling of its own.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "The viewport is sized by its host, not by content, so it is the surrounding layout's width and height that decide how it reflows.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Sizing",
                  v: "MessageScroller is size-full min-h-0 flex-col — it takes exactly the box its parent gives it and never grows past it, which is what lets the same component sit inside a fixed-height panel on desktop and a full-height mobile sheet without a prop change.",
                },
                {
                  k: "Narrow widths",
                  v: "MessageScrollerItem is min-w-0 shrink-0, so a wide child (a long unbroken token, a table) scrolls within its own item rather than forcing the whole viewport wider — measured with no overflow at 375, 768, 1440 or 1920.",
                },
                {
                  k: "200% zoom",
                  v: "Scroll thresholds are computed in pixels off the live layout at each render, not hardcoded against a design-time size, so doubled text zoom changes what fits per screen without breaking the autoscroll or scroll-to-end button logic. No zoom overflow measured.",
                },
                {
                  k: "RTL",
                  v: "MessageScrollerButton's chevron carries rtl:translate-x-1/2 and data-[direction=start]:[&_svg]:rotate-180 so the icon points the correct logical direction under RTL rather than a fixed screen direction; no RTL overflow measured.",
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
