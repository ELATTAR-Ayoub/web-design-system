import { BotIcon, UserIcon } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Icon } from "@/components/ui/icon";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message";
import { Code, Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "message",
  omitted: {
    states: "Message is layout only — six flex divs and no data of their own. The interaction and async states belong to whatever is placed inside MessageContent (typically Bubble, which documents rest/hover/loading/error on its own page); Message itself has nothing to be in any of those states about.",
    keyboard: "Message places nothing in the tab sequence and attaches no key handler — see Accessibility below. Any keyboard behaviour belongs to a focusable child placed inside it, such as a Bubble rendered asChild as a button or link.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "One turn, laid out. Avatar, header, content, footer — and a single align prop that flips the whole row, so the sender's own messages need no second component.",
      render: (
        <Panel label="A two-turn exchange" note="align: start, then end">
          <MessageGroup>
            <Message>
              <MessageAvatar className="size-8">
                <Icon icon={BotIcon} size="sm" tone="action" />
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>Atlas</MessageHeader>
                <Bubble variant="muted">
                  <BubbleContent>
                    Eclipse Vault is up 14% overnight, on twice the usual volume.
                  </BubbleContent>
                </Bubble>
                <MessageFooter>09:41</MessageFooter>
              </MessageContent>
            </Message>

            <Message align="end">
              <MessageAvatar className="size-8">
                <Icon icon={UserIcon} size="sm" tone="muted" />
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>You</MessageHeader>
                <Bubble align="end">
                  <BubbleContent>Show me what I hold in that set.</BubbleContent>
                </Bubble>
                <MessageFooter>09:42</MessageFooter>
              </MessageContent>
            </Message>
          </MessageGroup>
        </Panel>
      ),
      source: `<MessageGroup>
  <Message>
    <MessageAvatar className="size-8">
      <Icon icon={BotIcon} size="sm" tone="action" />
    </MessageAvatar>
    <MessageContent>
      <MessageHeader>Atlas</MessageHeader>
      <Bubble variant="muted">
        <BubbleContent>Eclipse Vault is up 14% overnight.</BubbleContent>
      </Bubble>
      <MessageFooter>09:41</MessageFooter>
    </MessageContent>
  </Message>

  <Message align="end">
    <MessageAvatar className="size-8">
      <Icon icon={UserIcon} size="sm" tone="muted" />
    </MessageAvatar>
    <MessageContent>
      <MessageHeader>You</MessageHeader>
      <Bubble align="end">
        <BubbleContent>Show me what I hold in that set.</BubbleContent>
      </Bubble>
      <MessageFooter>09:42</MessageFooter>
    </MessageContent>
  </Message>
</MessageGroup>`,
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
        "A minimal two-turn exchange — Message lays out the row, Bubble paints the surface, and align on Message is the only thing that flips a turn to the other side.",
      language: "tsx",
      code: `import {
  Message,
  MessageContent,
  MessageGroup,
} from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";

export function TwoTurnExchange() {
  return (
    <MessageGroup>
      <Message>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              Eclipse Vault is up 14% overnight.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Show me what I hold in that set.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Alignment",
      description:
        "start (default) or end. end sets flex-row-reverse and, through group-data, pushes every slot inside MessageContent to self-end — it is the only alignment control on Message itself.",
      label: "align",
      render: (
        <StateGrid cols={2}>
          <StateCell label="align: start" note="the other party">
            <Message>
              <MessageContent>
                <Bubble variant="muted">
                  <BubbleContent>Which three moved overnight?</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          </StateCell>
          <StateCell label="align: end" note="the sender's own turn">
            <Message align="end">
              <MessageContent>
                <Bubble align="end">
                  <BubbleContent>Show me what I hold in that set.</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          </StateCell>
        </StateGrid>
      ),
      source: `<Message>
  <MessageContent>
    <Bubble variant="muted">
      <BubbleContent>Which three moved overnight?</BubbleContent>
    </Bubble>
  </MessageContent>
</Message>

<Message align="end">
  <MessageContent>
    <Bubble align="end">
      <BubbleContent>Show me what I hold in that set.</BubbleContent>
    </Bubble>
  </MessageContent>
</Message>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Every slot but MessageContent is optional. Drop the avatar, header and footer and the row still holds — the layout does not assume any of them are present.",
      label: "No avatar, no header, no footer",
      render: (
        <Panel note="the parts are all optional">
          <MessageGroup>
            <Message>
              <MessageContent>
                <Bubble variant="outline">
                  <BubbleContent>
                    Six cards, two of them graded. $2,481.00 at this morning&rsquo;s mark.
                  </BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
            <Message align="end">
              <MessageContent>
                <Bubble variant="secondary" align="end">
                  <BubbleContent>Leave it.</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          </MessageGroup>
        </Panel>
      ),
      source: `<MessageGroup>
  <Message>
    <MessageContent>
      <Bubble variant="outline">
        <BubbleContent>Six cards, two of them graded.</BubbleContent>
      </Bubble>
    </MessageContent>
  </Message>
  <Message align="end">
    <MessageContent>
      <Bubble variant="secondary" align="end">
        <BubbleContent>Leave it.</BubbleContent>
      </Bubble>
    </MessageContent>
  </Message>
</MessageGroup>`,
    },
    {
      kind: "disclosure",
      id: "vs-ai-message",
      title: "How the workspace draws a turn instead",
      description:
        "Message is a generic layout primitive; the agent workspace draws its replies with AI Message. This compares the two.",
      blocks: [
        {
          label: "What it is for",
          body: (
            <p className="type-small text-muted-foreground">
              The layout of one turn: avatar, header, content, footer, and an
              align that mirrors the whole row for the sender&rsquo;s own
              messages. It holds no state and knows nothing about what is
              inside it — six flex containers sharing one group/message.
            </p>
          ),
        },
        {
          label: "What the workspace does instead",
          body: (
            <p className="type-small text-muted-foreground">
              AI Message (<Code>components/ai-elements/message.tsx</Code>)
              is a renderer as well as a layout. The workspace groups every
              turn between two user turns into one reply and draws it as a
              single <Code>Message</Code> in a fixed order, with the text
              through <Code>MessageResponse</Code> (Streamdown), so a tool
              call is a part of the reply rather than a peer of it. Message
              has no response renderer, no streaming state and no notion of a
              reply, so adopting it would mean writing all of that around it.
            </p>
          ),
        },
        {
          body: (
            <Note tone="action" title="They stay because ui/ travels">
              §10 is explicit that this system is meant to be lifted, and
              that <Code>components/ui</Code>, <Code>components/agent</Code>{" "}
              and the foundations all travel as-is. The next project may want
              a support inbox, a comment thread or a two-person chat and no
              agent at all — and for that project, Message is the right
              starting point, because AI Message is bound to the AI SDK&rsquo;s
              message shape and a markdown renderer.
              <span className="mt-3 block">
                See <Code>/design-system/components/ai-message</Code> for the
                workspace&rsquo;s own reply,{" "}
                <Code>/design-system/components/bubble#vs-ai-message</Code>{" "}
                for the surface a turn sits on, and{" "}
                <Code>/design-system/components/message-scroller#vs-ai-conversation</Code>{" "}
                for the transcript viewport.
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
      description:
        "Every slot is an optional, className-forwarding <div>. None takes a required prop.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "MessageGroup",
                  v: "No required props — a flex-col wrapper with an 8px gap. One per conversation, or one per run of turns from the same sender.",
                },
                {
                  k: "Message align",
                  v: "\"start\" (default) or \"end\", optional. The only alignment control — nothing below it takes an align of its own except Bubble, which mirrors it.",
                },
                {
                  k: "MessageAvatar",
                  v: "No required props. A rounded well on --muted; the component only sets min-w-8, so give it a size. It lifts itself by 32px when the message has a footer, so it stays level with the bubble rather than the timestamp.",
                },
                {
                  k: "MessageContent",
                  v: "No required props. Everything that is not the avatar — stacks header, bubbles and footer with a 10px gap.",
                },
                {
                  k: "MessageHeader / MessageFooter",
                  v: "No required props. text-xs on --muted-foreground, inset by 12px to line up with BubbleContent's padding. Both collapse that inset to zero when the bubble is ghost, which has no padding to line up with.",
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
      description:
        "message.tsx is plain <div> markup — no role, no keyboard handling. It is layout only; any interaction lives on whatever is placed inside it.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "None. Message and MessageGroup render unstyled semantics beyond a <div> — a screen reader gets whatever the content inside (typically Bubble) provides.",
                },
                {
                  k: "Accessible name",
                  v: "None of its own. MessageHeader and MessageFooter are visible text, read in document order like any other text node.",
                },
                {
                  k: "Focus order",
                  v: "Follows document order. Message places nothing in the tab sequence itself; a focusable child (a Bubble rendered asChild as a button or link) is reached the same way it would be outside a Message.",
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
        "A row built to shrink rather than reflow into a different shape — measured with no overflow at 375, 768, 1440 or 1920, at 200% text zoom, or under RTL.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Narrow widths",
                  v: "MessageContent carries min-w-0 and wrap-break-word, so a long word or an unbroken token (a hash, a URL) wraps inside the bubble rather than pushing the row wider than its container; MessageAvatar is shrink-0 so it holds its size while the content column shrinks around it.",
                },
                {
                  k: "200% text zoom",
                  v: "Header, footer and content are all plain text nodes with no fixed height anywhere in message.tsx, so doubled text takes a second line rather than clipping or overlapping the bubble beside it.",
                },
                {
                  k: "RTL",
                  v: "Message sets no dir of its own and mirrors nothing beyond align — flex-row-reverse for align=\"end\" reverses in the row's own inline direction, so it flips the sender's side consistently whichever way the page's own direction runs; measured with no RTL overflow.",
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
