import Link from "next/link";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta } from "@/components/ds/kit";
import { docRoute } from "@/lib/ds/docs/catalog";

import { meta } from "./meta";

const Part = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <Link className="text-action-ink underline underline-offset-2" href={docRoute(name)}>
    {children}
  </Link>
);
import { WorkspaceLiveSpecimen } from "./workspace-live-specimen";
import { WorkspaceAtlas } from "./workspace-atlas";

export const spec: ComponentDocSpec = {
  name: "agent-workspace",
  // Needs 64rem for the third column.
  wide: true,
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Pick one of the seven conversations — Chat, Tools, Planning, Approvals, Run control, Recovery, Long session — and press the suggestion under each answer to move to the next step. Everything is live: it talks to a scripted agent, so every button does what it says. The history on the left has one row per conversation: open one to switch, start a new chat, or archive and delete a row (Delete has an Undo).",
      label: "Agent workspace",
      flush: true,
      wide: true,
      render: (
        <div className="p-6">
          <WorkspaceLiveSpecimen
            fullScreenHref={`${docRoute("agent-workspace")}/live`}
          />
        </div>
      ),
      source: `import { AgentWorkspace } from "@/components/agent";
import { CONVERSATIONS, useMockTransport, type ConversationId } from "@/lib/agent/mock-transport";

function Demo({ conversation }: { conversation: ConversationId }) {
  // Every send moves the conversation one step forward, whatever was typed.
  const transport = useMockTransport({ conversation });
  return (
    <AgentWorkspace
      key={conversation}
      transport={transport}
      suggestions={[CONVERSATIONS.find((c) => c.id === conversation)!.starter]}
    />
  );
}`,
    },
    {
      kind: "disclosure",
      id: "conversations",
      title: "The seven conversations",
      description:
        "Each one is a short script. Every message you send, typed or picked from a suggestion, moves it on one step, and the suggestion under each answer offers the next step. The last step offers none.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Chat", v: "A reasoned answer with citations and sources, then a code example, then an image and a PDF you attach. Edit your message or regenerate an answer to branch, copy it, read it aloud, and restore to a saved point." },
                { k: "Tools", v: "A search and a test run that fills in as it goes, a terminal that streams, a deploy that fails and retries, a crash with a stack trace you can Retry, an image, a generated document, a web and a component preview, and a sandbox run." },
                { k: "Planning", v: "A plan that streams in, a step you edit, a workflow view, then Run plan. A low-confidence step stops to ask. The files, commit and package that changed are shown, and Undo changes reverts the commit." },
                { k: "Approvals", v: "A tool waiting for your yes or no, a high-risk one that needs a code (000000 is always wrong), an approval that expires, an approval replaced by a newer plan, and a tool that needs a secret." },
                { k: "Run control", v: "A long run you can pause and resume. Messages you send meanwhile wait in the queue, where you can reorder, remove or send one now. Cancel a run mid-step, then restore a checkpoint." },
                { k: "Recovery", v: "The connection drops mid-answer and comes back, one part fails and is retried, a crash offers Retry (it works the second time), and the run is handed to a person with an owner and a note." },
                { k: "Long session", v: "The context nears its limit and Summarise frees room. Try dictation, About this agent, the voice picker, switching, archiving and deleting conversations from the history, and the model picker." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "anatomy",
      title: "Anatomy",
      description:
        "Four places, one fact each, the way Claude lays its own app out. Every part is a Vercel AI Elements component (vendored, restyled to the system) or a shared agent part — each links to its own page.",
      blocks: [
        {
          label: "History, header, thread",
          body: (
            <Meta
              items={[
                { k: "History", v: <>A shadcn Sidebar (workspace-history.tsx): New chat, conversations grouped by age, Archive and Delete with Undo. On a phone it is the Sidebar&apos;s own Sheet, opened from the header&apos;s trigger.</> },
                { k: "Header", v: <>Sidebar trigger, the agent&apos;s animated face — <Part name="agent-avatar">CubeAvatar</Part>, one scene per agent state, or your <code className="type-code">avatar</code> — its name and the conversation title, <Part name="agent-voice-orb">VoiceOrb</Part> only while voice is active, and the settings gear (autonomy, length, temperature, <Part name="ai-voice-selector">VoiceSelector</Part>, <Part name="ai-agent">About this agent</Part>).</> },
                { k: "Thread", v: <><Part name="ai-conversation">Conversation</Part> (the scrolling log) of <Part name="ai-message">Message</Part>s. Each reply reads in a fixed order: <Part name="ai-shimmer">Shimmer</Part> while it waits, <Part name="ai-reasoning">Reasoning</Part>, the <Part name="ai-chain-of-thought">ChainOfThought</Part> of tool steps (each a <Part name="ai-tool">Tool</Part>, approvals as a <Part name="ai-confirmation">Confirmation</Part> inside it), the answer, outputs, the run, <Part name="ai-sources">Sources</Part> with <Part name="ai-inline-citation">InlineCitation</Part>s, then the actions (copy, regenerate, read aloud, and <Part name="ai-open-in-chat">Open in…</Part> when you pass <code className="type-code">openIn</code> targets) and follow-up <Part name="ai-suggestion">Suggestion</Part>s. <Part name="ai-checkpoint">Checkpoint</Part>s sit after the turn they restore to.</> },
                { k: "Answer text", v: <><Part name="ai-message">MessageResponse</Part> — markdown as the system&apos;s <code className="type-code">.prose</code>: headings, lists and table cells take the type roles; links ask first in an AlertDialog; code is a <Part name="ai-code-block">CodeBlock</Part> (a one-line shell command a <Part name="ai-snippet">Snippet</Part>) highlighted on the <code className="type-code">--code-*</code> roles.</> },
              ]}
            />
          ),
        },
        {
          label: "Outputs and the run",
          body: (
            <Meta
              items={[
                { k: "Tool outputs", v: <>A tool&apos;s typed result picks its component: <Part name="ai-terminal">Terminal</Part>, <Part name="ai-test-results">TestResults</Part>, <Part name="ai-stack-trace">StackTrace</Part>, <Part name="ai-file-tree">FileTree</Part>, <Part name="ai-commit">Commit</Part>, <Part name="ai-package-info">PackageInfo</Part>, <Part name="ai-environment-variables">EnvironmentVariables</Part>, <Part name="ai-schema-display">SchemaDisplay</Part>, <Part name="ai-sandbox">Sandbox</Part>, <Part name="ai-artifact">Artifact</Part>, <Part name="ai-web-preview">WebPreview</Part> (http(s) only), <Part name="ai-jsx-preview">JSXPreview</Part>, <Part name="ai-image">Image</Part> and <Part name="ai-audio-player">AudioPlayer</Part> for read-aloud. An image a tool is making develops in a <Part name="agent-generated-image">GeneratedImage</Part>, from its first stage to the finished picture, with Retry on a failure. A malformed result falls back to the plain Tool output.</> },
                { k: "The run", v: <>Inline in the reply that started it: the <Part name="ai-plan">Plan</Part> (edit a step, Run plan), the <Part name="ai-task">Task</Part> checklist with Pause / Resume / Cancel, a <Part name="ai-question">Question</Part> when the agent must ask, Undo changes, and the handoff form. A reply whose run is paused or waiting is not finished — no actions until it settles.</> },
                { k: "Workflow", v: <>View as workflow opens the plan as a graph: <Part name="ai-canvas">Canvas</Part>, <Part name="ai-node">Node</Part>s, <Part name="ai-edge">Edge</Part>s, <Part name="ai-connection">Connection</Part>, <Part name="ai-controls">Controls</Part>, <Part name="ai-panel">Panel</Part> and a <Part name="ai-toolbar">Toolbar</Part> per node.</> },
              ]}
            />
          ),
        },
        {
          label: "Composer",
          body: (
            <Meta
              items={[
                { k: "The box", v: <><Part name="ai-prompt-input">PromptInput</Part>: attachment and source chips (<Part name="ai-attachments">Attachments</Part>, filled), the message, then + · Search · model · Effort … the context meter · the mic · Send.</> },
                { k: "+ menu", v: "One panel: Photos & files, the sources to tick, then the skills. Typing @ or / at the start of a word opens the sources or commands palette above the box." },
                { k: "Model", v: <><Part name="ai-model-selector">ModelSelector</Part> — a search dialog (Escape or a press outside closes it).</> },
                { k: "Effort", v: <>A chip that opens the <Part name="agent-effort-slider">EffortSlider</Part> (Faster ↔ Smarter). At the last level, while the message is focused, the box runs the <Part name="agent-spark-field">SparkField</Part>.</> },
                { k: "Voice", v: <><Part name="ai-speech-input">SpeechInput</Part> beside Send, split with a <Part name="ai-mic-selector">MicSelector</Part> when the transport transcribes; the live words show as a <Part name="ai-transcription">Transcription</Part>.</> },
                { k: "Context", v: <><Part name="ai-context">Context</Part> — the meter; its card shows input, output and their price, on a thin bar. Summarise appears beside it from 90% full.</> },
                { k: "Queue", v: <>Messages sent while the agent works wait in a <Part name="ai-queue">Queue</Part> docked on top of the box — reorder, remove, send now. The plan is not repeated there.</> },
                { k: "Phone", v: "Under 448px wide only +, the mic and Send stay in the box; Search, the model, Effort and the context meter move to a row under it." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "state-atlas",
      title: "State atlas",
      description:
        "Frozen StateGrids: all 12 run statuses beside the mark a step wears in the workspace, and all 26 avatar states — static props, no transport, rendered in the current theme.",
      label: "Workspace state atlas",
      flush: true,
      render: (
        <div className="p-6">
          <WorkspaceAtlas />
        </div>
      ),
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
        "AgentWorkspace takes a transport plus optional speech, a read-aloud function, conversations, models and starter suggestions. Context usage, summarising, restore points and the agent profile come from the transport itself. Every control is gated on both transport.capabilities and the matching transport method actually existing.",
      language: "tsx",
      code: `import { AgentWorkspace } from "@/components/agent";

function Workspace({ transport }: { transport: AgentTransport }) {
  return (
    <AgentWorkspace
      transport={transport}
      conversations={{
        items: history,
        activeId: currentConversationId,
        onOpen: openConversation,
        onNew: startNewConversation,
        onArchive: archiveConversation,
        onDelete: deleteConversation,
        onRestore: restoreConversation,
      }}
      speech={speech}
      speak={synthesiseSpeech}
      models={models}
      suggestions={["Tidy my inbox"]}
      settingsOpen={settingsOpen}
      onSettingsOpenChange={setSettingsOpen}
    />
  );
}`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "A workspace-level composite has no single interaction state of its own — each region classifies the states that apply to it; N/A entries carry a one-line reason.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "empty", v: "No turns yet — the Conversation's empty state: a greeting and the starter Suggestions." },
                { k: "loading / busy", v: "Shown in the reply that is working — Shimmer \"Thinking…\" before the first event, Reasoning or the chain of tool steps while it works, the run's Task inline — and in the composer's submit↔stop swap. No separate status row." },
                { k: "error", v: "A fatal transport error renders inline in the thread; a non-fatal one is a turn (see the transport's own error turn handling). A failed step says it once, in the step, with its own Retry." },
                { k: "paused / waiting", v: "A reply whose run is paused or waiting on the reader is not finished: no actions and no follow-ups until the run settles, and a message sent meanwhile waits in the queue." },
                { k: "disabled", v: "The composer disables itself while !transport.isReady, with a reason." },
                { k: "hover / focus-visible / pressed", v: "N/A at the workspace level — every interactive element within it is one of the parts already documented on its own page (the AI Elements parts, each documented on its own page), which classify these states themselves." },
                { k: "success", v: "N/A here specifically — a completed run surfaces as a toast (\"Run completed\"), not a workspace-level visual state." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/agent/agent-workspace.tsx.",
      blocks: [
        {
          label: "AgentWorkspace",
          body: (
            <Meta
              items={[
                { k: "transport", v: "AgentTransport — required. Also the source of context usage (usage, summarise), chat restore points (restorePoints, restoreTo), dictation transcription (transcribe) and the agent profile (agent)." },
                { k: "avatar?", v: "AvatarRenderer — the agent's face in the header, animated for its current state (thinking, running a tool, waiting…). Defaults to the built-in CubeAvatar; pass your own to replace it." },
                { k: "speech?", v: "SpeechAdapter — the read-aloud voices offered in settings (VoiceSelector) and the header voice orb while it speaks." },
                { k: "speak?", v: "(text, voiceId?) => Promise<string> — resolves to a playable audio url; turns on Read aloud under each finished reply. Absent renders no Read aloud." },
                { k: "openIn?", v: "OpenInTarget[] — { id, title, icon?, createUrl(query) } for each chat service the reply's Open in… menu offers, opened in a new tab with the user message as the query. Absent or empty renders no menu; nothing third-party is built in." },
                { k: "toolStates?", v: "ToolStateMap — maps the caller's own tool names onto the 26-state vocabulary." },
                { k: "name? / title?", v: "string — the agent's name and the conversation's own title in the thin header. Absent title renders nothing there." },
                { k: "conversations?", v: "{ items; activeId?; onOpen; onNew?; onArchive?; onDelete?; onRestore? } — the history Sidebar, grouped Today / Yesterday / Previous 7 days / Older, with New chat, and Archive / Delete (Delete offers Undo through onRestore). Absent renders no history and no sidebar trigger." },
                { k: "models?", v: "GlideOption[] — the composer's ModelSelector, shown only when transport.capabilities.models is true." },
                { k: "sources?", v: "PromptSource[] — what @ offers. Typing @ at the start of a word opens a Sources palette above the composer, and the + menu lists them as checkable items; picks show as chips and ride SendOptions.sources. Shown only when transport.capabilities.sources is true." },
                { k: "commands?", v: "AgentCommand[] — what / offers. Typing / at the start of a word opens a Commands palette; a command either runs in the browser (run) or writes its directive into the message. Commands with group \"skill\" are also in the + menu." },
                { k: "efforts?", v: "string[] — the composer's Effort levels, low to high, chosen on a slider that opens from the Effort chip (at the last level the box sparks while focused) (default Low · Medium · High · Extra · Max, starting at the middle one, High). The level rides SendOptions.settings.effort, so it shows only when transport.capabilities.settings is true; [] hides it." },
                { k: "suggestions?", v: "string[] — starter Suggestions on the empty conversation. Follow-ups come from each answer's own suggestions and hide while the composer has text." },
                { k: "settingsOpen? / onSettingsOpenChange?", v: "boolean / (open: boolean) => void — controls the header's settings sheet. Uncontrolled when omitted." },
                { k: "historyOpen? / onHistoryOpenChange?", v: "boolean / (open: boolean) => void — controls the history Sidebar on desktop. Uncontrolled, open, when omitted; on a phone the sidebar is its own Sheet." },
                { k: "className?", v: "string" },
              ]}
            />
          ),
        },
        {
          label: "What reaches the transport",
          body: (
            <Meta
              items={[
                { k: "SendOptions.sources?", v: "string[] — ids of the sources picked with @, forwarded only when transport.capabilities.sources is true." },
                { k: "SendOptions.webSearch?", v: "boolean — the composer's own \"Search the web\" toggle in its tools row. The toggle's ON/OFF state is internal to AgentWorkspace, not a prop; a transport without search simply ignores the field." },
                { k: "AgentTurn.at?", v: "number — epoch ms a user or text turn was sent/started. Absent renders no time; present, the transcript's own meta row shows it relative (\"2m ago\")." },
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
      description: "Every region defers to the part that already owns its accessibility contract.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Landmarks", v: "A thin <header> for the sidebar trigger, identity, title and settings; the history Sidebar labelled \"Conversations\"; the Conversation log; the composer form." },
                { k: "Sheets and dialogs", v: "On a phone the history Sidebar is its own Sheet, which owns its focus trap, Escape-to-close and focus return. Pressing a toast's action (Undo) does not close an open Sheet or Dialog. The model and voice pickers are search dialogs with no corner ✕ over the field — Escape or a press outside closes them." },
                { k: "Links", v: "A link in an answer asks before it opens (an AlertDialog naming the URL), so a reader never leaves on a link they did not read." },
                { k: "Targets", v: "Hit targets follow RULES: icon-only controls at least 40px, 32px only in a toolbar beside other small controls, nested controls small with their hit area restored." },
                { k: "Live status", v: "Status is announced by the part that shows it — the Shimmer, Reasoning, Tool and Task status regions — inside the reply." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why",
      description:
        "What this replaces and why it is better than assembling the workspace family by hand on every page that needs one.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Replaces", v: "Hand-wiring a bespoke history list, plan panel and settings drawer per product — each of which would have to re-derive the same capability gating this file centralises once." },
                { k: "Why", v: "One place enforces \"a control renders only when both the capability flag and the transport method exist\" for the whole run-model surface, instead of that rule being re-implemented (and drifting) per consuming product." },
              ]}
            />
          ),
        },
        {
          body: (
            <p className="type-small text-muted-foreground">
              For the full component-by-component case — what each part of the
              workspace replaces and why — see{" "}
              <Link
                href="/design-system/components/agent-workspace/why"
                className="text-action underline underline-offset-2"
              >
                Why these components
              </Link>
              .
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
