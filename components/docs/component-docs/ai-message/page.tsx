/**
 * Authored documentation page for `ai-message`.
 *
 * Every live specimen renders the real parts from
 * `components/ai-elements/message.tsx`; the interactive ones live in the
 * companion client file `message-specimen.tsx` (a spec module cannot carry
 * `"use client"`).
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { MessageBranchSpecimen, MessagePreview, MessageStateGrid } from "./message-specimen";

const HTML_PROPS = "Everything a div accepts, plus className.";

export const spec: ComponentDocSpec = {
  name: "ai-message",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A user message in its bubble, then an assistant reply rendered from markdown, with its action row. Code, the link check and diagrams are all live.",
      label: "Message",
      render: <MessagePreview />,
      source: `import {
  Message, MessageAction, MessageActions, MessageContent, MessageResponse, MessageToolbar,
} from "@/components/ai-elements/message";

<Message from="assistant">
  <MessageContent>
    <MessageResponse>{markdown}</MessageResponse>
  </MessageContent>
  <MessageToolbar>
    <MessageActions>
      <MessageAction label="Copy reply" tooltip="Copy reply">
        <Icon icon={CopyIcon} size="sm" tone="inherit" />
      </MessageAction>
    </MessageActions>
  </MessageToolbar>
</Message>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. MessageResponse also needs the Streamdown packages the source imports (streamdown, @streamdown/code, @streamdown/math, @streamdown/mermaid, @streamdown/cjk), and the streamdown-chrome utility in styles/utilities.css.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "from decides the side: a user message right-aligns in a secondary bubble, an assistant message sits flush on the page. MessageContent is the bubble, and MessageResponse inside it renders the markdown. Put several versions of a reply inside MessageBranchContent and add the selector to let the reader page through them. Actions go in MessageToolbar, so they sit under the reply.",
      language: "tsx",
      code: `import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from "@/components/ai-elements/message";

<Message from="assistant">
  <MessageBranch defaultBranch={0} onBranchChange={(i) => select(i)}>
    <MessageBranchContent>
      {versions.map((v) => (
        <MessageContent key={v.id}>
          <MessageResponse isAnimating={v.streaming}>{v.text}</MessageResponse>
        </MessageContent>
      ))}
    </MessageBranchContent>
    <MessageToolbar>
      <MessageBranchSelector>
        <MessageBranchPrevious />
        <MessageBranchPage />
        <MessageBranchNext />
      </MessageBranchSelector>
    </MessageToolbar>
  </MessageBranch>
</Message>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Message is mostly static. What moves is the action buttons, the branch selector and the streaming reply.",
      blocks: [
        { body: <MessageStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: a user bubble (<code className="type-code">bg-secondary</code>) or a plain assistant block.{" "}
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong>: only on the controls. MessageAction and the
                branch buttons are Button, so they inherit its states; Message and MessageContent are not interactive and have none.{" "}
                <strong>loading</strong>: a MessageAction takes Button&apos;s <code className="type-code">loading</code> prop (the workspace uses it for &quot;Preparing audio&quot;), and MessageResponse takes{" "}
                <code className="type-code">isAnimating</code> from Streamdown while text is still arriving; the memo re-renders on every change to
                children or isAnimating. <strong>disabled</strong>: MessageBranchPrevious and MessageBranchNext disable when there is one version
                or none; MessageAction passes disabled to its Button. <strong>empty</strong>: MessageBranchSelector renders{" "}
                <code className="type-code">null</code> with one version or fewer, so no selector shows for a reply that was never regenerated;
                a Message without children is an empty block. <strong>success</strong>: N/A, nothing in the component reports completion; the
                caller shows a toast for actions like copy. <strong>error</strong>: N/A for the message itself. Inside MessageResponse a diagram
                that fails to draw shows a destructive Alert with a retry button, and a link goes through a confirmation dialog.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description: "Two versions of one reply. The selector wraps around: Next on the last version returns to the first.",
      label: "Branches",
      render: <MessageBranchSpecimen />,
      source: `<Message from="assistant">
  <MessageBranch defaultBranch={0}>
    <MessageBranchContent>
      <MessageContent key="a"><MessageResponse>First version</MessageResponse></MessageContent>
      <MessageContent key="b"><MessageResponse>Second version</MessageResponse></MessageContent>
    </MessageBranchContent>
    <MessageToolbar>
      <MessageBranchSelector>
        <MessageBranchPrevious />
        <MessageBranchPage />
        <MessageBranchNext />
      </MessageBranchSelector>
    </MessageToolbar>
  </MessageBranch>
</Message>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/message.tsx.",
      blocks: [
        {
          label: "Message",
          anchor: "api-message",
          body: (
            <Meta
              items={[
                { k: "from", v: 'UIMessage["role"] ("user", "assistant" or "system"), required. "user" adds is-user (right-aligned, justify-end); anything else adds is-assistant. The class drives MessageContent through group-[.is-user].' },
                { k: "…div props", v: HTML_PROPS + " Base: group flex w-full max-w-[95%] flex-col gap-2." },
              ]}
            />
          ),
        },
        {
          label: "MessageContent",
          anchor: "api-message-content",
          body: (
            <Meta
              items={[
                { k: "…div props", v: HTML_PROPS + " Type is type-body. A user message gets the rounded bg-secondary bubble with px-4 py-3; an assistant message has no fill." },
              ]}
            />
          ),
        },
        {
          label: "MessageResponse",
          anchor: "api-message-response",
          body: (
            <Meta
              items={[
                { k: "children", v: "string, the markdown. Re-renders only when children or isAnimating change (React.memo)." },
                { k: "isAnimating?", v: "boolean, Streamdown's. Set it while the reply is streaming." },
                { k: "components?", v: "Streamdown's Components map, merged over the system's own. The system map renders h1–h6, p, ul, ol, li, blockquote, hr, strong, em, th, td and inline code as bare elements so .prose sets their type." },
                { k: "plugins, shikiTheme, linkSafety, mermaid", v: "Preset by the system: code (Shiki), math, mermaid and CJK plugins; SYSTEM_CODE_THEME for both light and dark; the link check on; the diagram error Alert. Passing one replaces the preset." },
                { k: "className?", v: 'Merged after "prose streamdown-chrome size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0".' },
                { k: "…Streamdown props", v: "Anything else Streamdown accepts." },
              ]}
            />
          ),
        },
        {
          label: "MessageActions, MessageAction, MessageToolbar",
          anchor: "api-message-actions",
          body: (
            <Meta
              items={[
                { k: "MessageActions", v: "div props. A flex row, gap-1." },
                { k: "MessageAction.tooltip?", v: "string. When set, the button is wrapped in a Tooltip showing it, and the string is also the accessible name unless label is given." },
                { k: "MessageAction.label?", v: "string. The sr-only text inside the button, taking priority over tooltip." },
                { k: "MessageAction.variant?", v: 'Button variant, default "ghost".' },
                { k: "MessageAction.size?", v: 'Button size, default "icon-sm" (32px).' },
                { k: "MessageAction…", v: "Every other Button prop. Always type=button." },
                { k: "MessageToolbar", v: "div props. A full-width row, mt-4, items-center justify-between, gap-4: the actions on one side and the branch selector on the other." },
              ]}
            />
          ),
        },
        {
          label: "MessageBranch and its parts",
          anchor: "api-message-branch",
          body: (
            <Meta
              items={[
                { k: "MessageBranch.defaultBranch?", v: "number, default 0. Uncontrolled: the current index is kept inside." },
                { k: "MessageBranch.onBranchChange?", v: "(branchIndex: number) => void. Called when Previous or Next changes the version." },
                { k: "MessageBranch…", v: "div props. A grid with gap-2 and min-w-0 children." },
                { k: "MessageBranchContent", v: "Its children are the versions, one element each with a stable key. Only the current one is shown (the others are hidden, still mounted). It registers the count with MessageBranch." },
                { k: "MessageBranchSelector", v: "ButtonGroup props. Returns null when there are fewer than two versions." },
                { k: "MessageBranchPrevious / MessageBranchNext", v: 'Button props. aria-label "Previous branch" / "Next branch", size icon-sm, variant ghost, disabled with fewer than two versions. They wrap around at the ends. children replaces the chevron.' },
                { k: "MessageBranchPage", v: 'span props. Reads "{n} of {total}".' },
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
      description: "Message adds no roles of its own; it sits inside the conversation's log. The controls it carries are real buttons.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Structure", v: "Message and MessageContent are plain divs. Authorship is shown by alignment and fill only, so a screen reader does not hear who spoke unless the caller adds a visible or sr-only label." },
                { k: "Markdown", v: "MessageResponse renders real heading, list, table, blockquote and code elements, so the reply has semantic structure. Headings inside a reply start wherever the markdown does; the caller should keep them below the page's own." },
                { k: "Action names", v: "MessageAction has no icon-only fallback of its own: it needs label or tooltip, which becomes sr-only text. Without either the button has no name." },
                { k: "Branch buttons", v: 'Named "Previous branch" and "Next branch"; the page text "1 of 2" is read as ordinary text.' },
                { k: "Keyboard", v: "Every control is a button, so Tab reaches it and Enter or Space presses it. The link check is an AlertDialog: focus moves into it, Escape cancels, and Cancel and Open link are the two exits." },
                { k: "Target size", v: "MessageAction and the branch buttons are icon-sm (32px). That is allowed only because they sit together in a toolbar row beside other small controls; a lone message action should be size icon (40px) or larger." },
                { k: "Motion", v: "The reply has no motion of its own. The action row's fade in the workspace comes from md:duration-fast classes, which the blanket reduced-motion rule in styles/motion.css collapses." },
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
                A reply is the one thing every agent screen renders, and it needs more than a div: markdown that is safe to show while it is still
                streaming, code with copy and download, tables, links that ask before leaving, diagrams, and several versions of one answer. AI
                Elements already solves that, so the system vendors it rather than rebuilding it, and restyles it so the reply speaks the same type,
                colour and code roles as the rest of the page. The AgentWorkspace uses Message, MessageContent, MessageResponse, MessageActions,
                MessageBranch and its selector in <code className="type-code">components/agent/workspace/workspace-reply.tsx</code>, one pair per
                turn.
              </p>
              <p className="mt-3">
                The vendored changes, each marked &quot;Vendored change:&quot; in the source: MessageContent drops the dead{" "}
                <code className="type-code">is-user:dark</code> class (no such variant is registered) and uses type-body; MessageBranch gets min-w-0
                on its grid children so a wide code block cannot push the message past its column; MessageResponse is the large one. Streamdown
                draws markdown with its own Tailwind type classes, which beat .prose, so plain elements are rendered without them and .prose sets
                them on the type roles. The elements that carry behaviour (links, code blocks, tables) keep Streamdown&apos;s component and are
                restyled by <code className="type-code">streamdown-chrome</code> in styles/utilities.css. Code is highlighted with the system theme
                (lib/code-theme.ts), the link check is an AlertDialog and a failed diagram is an Alert with a retry button.
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
