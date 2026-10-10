import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { ConversationPreview, ConversationStateGrid } from "./conversation-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-conversation",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A scrolling log of six messages. It starts at the bottom; scroll up and the round button appears to jump back to the latest message. The corner button downloads the thread as Markdown.",
      label: "Conversation",
      render: <ConversationPreview />,
      source: `import {
  Conversation, ConversationContent, ConversationDownload, ConversationScrollButton,
} from "@/components/ai-elements/conversation";

<div className="flex h-80 flex-col">
  <Conversation aria-label="Renewal thread">
    <ConversationContent>
      {messages.map((m) => (
        <Message from={m.role} key={m.id}>
          <MessageContent>{text(m)}</MessageContent>
        </Message>
      ))}
    </ConversationContent>
    <ConversationDownload aria-label="Download conversation" messages={messages} />
    <ConversationScrollButton aria-label="Scroll to latest message" />
  </Conversation>
</div>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It also needs the use-stick-to-bottom package the source imports.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Conversation is a flex-1 box that scrolls, so its parent must be a flex column with a height, or it has nothing to scroll inside. Put the messages in ConversationContent and the two buttons as its siblings: they position themselves against the Conversation. An empty thread is an empty state inside the content, not a different component.",
      language: "tsx",
      code: `import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

<Conversation aria-label="Conversation" className="min-h-0">
  <ConversationContent className="mx-auto w-full max-w-3xl gap-10 p-4">
    {turns.length === 0 ? (
      <ConversationEmptyState title="No messages yet" description="Ask something to begin." />
    ) : (
      turns.map((t) => <Turn key={t.id} turn={t} />)
    )}
  </ConversationContent>
  <ConversationScrollButton aria-label="Scroll to latest message" />
</Conversation>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The log keeps its own scroll position; the visible states are empty, at the bottom and scrolled away.",
      blocks: [
        { body: <ConversationStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: pinned to the bottom, so new content scrolls into view; resizing animates (
                <code className="type-code">initial=&quot;smooth&quot; resize=&quot;smooth&quot;</code>). Scroll up and it stops following until the
                reader returns. <strong>empty</strong>: the thread has no messages, shown by ConversationEmptyState (title, description and an
                optional icon, or your own children). <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong>: only on
                the two buttons, which are Button variant outline and inherit its states. <strong>ConversationScrollButton</strong> shows only when
                the log is not at the bottom, which is its one visibility rule. <strong>loading</strong>: N/A, a log has no loading state of its own;
                the reply being streamed is the message&apos;s. <strong>success</strong> and <strong>error</strong>: N/A, nothing here reports a
                result; the download button saves a file and gives no confirmation, so a caller that wants one shows a toast.{" "}
                <strong>disabled</strong>: N/A, neither button has a reason to be disabled; both accept the disabled prop from Button if a caller
                needs it.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/conversation.tsx.",
      blocks: [
        {
          label: "Conversation",
          anchor: "api-conversation",
          body: (
            <Meta
              items={[
                { k: "…StickToBottom props", v: 'Anything use-stick-to-bottom\'s StickToBottom accepts. Preset: role="log", initial="smooth", resize="smooth". Base class: relative flex-1 overflow-y-hidden.' },
                { k: "aria-label?", v: "string. Names the log; the workspace passes \"Conversation\". Without it the log has no name." },
              ]}
            />
          ),
        },
        {
          label: "ConversationContent",
          anchor: "api-conversation-content",
          body: (
            <Meta
              items={[{ k: "…StickToBottom.Content props", v: "Base class: flex flex-col gap-8 p-4. Add a max width and horizontal centring here for a readable column." }]}
            />
          ),
        },
        {
          label: "ConversationEmptyState",
          anchor: "api-conversation-empty",
          body: (
            <Meta
              items={[
                { k: "title?", v: 'string, default "No messages yet". type-nav.' },
                { k: "description?", v: 'string, default "Start a conversation to see messages here". type-small, muted. Pass "" to drop it.' },
                { k: "icon?", v: "ReactNode, shown above the title in the muted colour. Ignored when children is set." },
                { k: "children?", v: "ReactNode. Replaces the whole default layout; the workspace puts its heading and starter suggestions here." },
                { k: "…div props", v: "Base class: flex size-full flex-col items-center justify-center gap-3 p-8 text-center." },
              ]}
            />
          ),
        },
        {
          label: "ConversationScrollButton",
          anchor: "api-conversation-scroll",
          body: (
            <Meta
              items={[
                { k: "…Button props", v: 'size="icon" (40px), variant "outline", type "button". Absolutely positioned bottom-4, horizontally centred. Renders nothing at the bottom. Named "Scroll to the latest message" unless you pass aria-label.' },
              ]}
            />
          ),
        },
        {
          label: "ConversationDownload and messagesToMarkdown",
          anchor: "api-conversation-download",
          body: (
            <Meta
              items={[
                { k: "messages", v: "UIMessage[], required. The text parts of each message are joined." },
                { k: "filename?", v: 'string, default "conversation.md".' },
                { k: "formatMessage?", v: '(message, index) => string. Default: "**Role:** text".' },
                { k: "…Button props", v: 'Except onClick. size "icon", variant "outline", absolutely positioned top-4 right-4. Also needs an aria-label.' },
                { k: "messagesToMarkdown(messages, formatMessage?)", v: "Exported helper returning the Markdown string the button saves, messages separated by a blank line." },
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
      description: "The container is a live log. The two buttons are icon-only and need names from the caller.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: 'role="log" on the Conversation. A log is a polite live region, so a screen reader announces text added at the bottom.' },
                { k: "Name", v: 'Pass aria-label to Conversation (the workspace uses "Conversation"); a log with no name is announced as just "log".' },
                { k: "Icon-only buttons", v: "ConversationScrollButton and ConversationDownload render an icon and no text, so each carries a default name — “Scroll to the latest message” and “Download conversation”. An aria-label you pass wins." },
                { k: "Target size", v: "Both buttons are size icon, 40px, which meets the icon-only floor." },
                { k: "Keyboard", v: "The log scrolls with the arrow keys, Page Up and Page Down once focused or when a child is. The buttons take Tab and Enter or Space. The scroll button leaves the tab order when it disappears at the bottom." },
                { k: "Motion", v: "Stick-to-bottom scrolls with the smooth setting. The following is done by use-stick-to-bottom in JavaScript, not by a CSS animation, so the blanket rule in styles/motion.css does not cover it. The Conversation itself has no CSS motion." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why this exists",
      blocks: [
        {
          body: (
            <Note tone="action">
              <p>
                A chat that appends at the bottom has two jobs a plain scroll box does not: follow the new text without yanking a reader who has
                scrolled up, and offer a way back. use-stick-to-bottom does both, and Conversation wraps it with the log role and the buttons. The
                AgentWorkspace uses it in <code className="type-code">components/agent/workspace/workspace-thread.tsx</code>: one Conversation with
                the thread inside ConversationContent, a ConversationEmptyState holding the greeting and the starter suggestions when the thread is
                empty, and a ConversationScrollButton.
              </p>
              <p className="mt-3">
                The vendored changes: the scroll and download buttons dropped the arbitrary centring (<code className="type-code">left-[50%]
                translate-x-[-50%]</code> became <code className="type-code">left-1/2 -translate-x-1/2</code>) and the redundant{" "}
                <code className="type-code">rounded-full</code> and dark-mode background overrides, since Button&apos;s outline variant already
                carries the pill radius and its themed colours. The empty state uses type-nav and type-small, and the icons go through the system
                Icon.
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
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
