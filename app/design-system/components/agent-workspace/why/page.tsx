/**
 * The workspace explainer: why each component in `AgentWorkspace` is the one
 * that shipped, and the licence it ships under.
 *
 * An authored route, not a catalog item — it documents a set of components
 * that already have their own catalog pages, rather than one component of
 * its own. Registered directly in `lib/ds/nav.ts`'s `catalog` list (slug
 * `"agent-workspace/why"`) rather than getting a second `DsGroup`, the same
 * way the two family landings are registered inline rather than duplicating
 * the mechanism.
 *
 * Every specimen is imported from the component's own `component-docs/*`
 * playground — never a second implementation — so
 * this page can only ever show the real, already-verified fixture.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { Code, DsPageHeader, DsSection, Note } from "@/components/ds/kit";
import { Button } from "@/components/ui/button";
import { docRoute } from "@/lib/ds/docs/catalog";

import { MessagePreview } from "@/components/docs/component-docs/ai-message/message-specimen";
import { ReasoningPlayground } from "@/components/docs/component-docs/ai-reasoning/reasoning-specimen";
import { ChainOfThoughtPreview } from "@/components/docs/component-docs/ai-chain-of-thought/chain-of-thought-specimen";
import { ToolPreview } from "@/components/docs/component-docs/ai-tool/tool-specimen";
import { ConfirmationPreview } from "@/components/docs/component-docs/ai-confirmation/confirmation-specimen";
import { TerminalPreview } from "@/components/docs/component-docs/ai-terminal/terminal-specimen";
import { SourcesPreview } from "@/components/docs/component-docs/ai-sources/sources-specimen";
import { PlanShowcase } from "@/components/docs/component-docs/ai-plan/plan-specimen";
import { TaskShowcase } from "@/components/docs/component-docs/ai-task/task-specimen";
import { QueueShowcase } from "@/components/docs/component-docs/ai-queue/queue-specimen";
import { CanvasPreview } from "@/components/docs/component-docs/ai-canvas/canvas-specimen";
import { PromptInputSpecimen } from "@/components/docs/component-docs/ai-prompt-input/prompt-input-specimen";
import { ContextShowcase } from "@/components/docs/component-docs/ai-context/context-specimen";
import { EffortSliderSpecimen } from "@/components/docs/component-docs/agent-effort-slider/effort-slider-specimen";
import { GeneratedImageStill } from "@/components/docs/component-docs/agent-generated-image/generated-image-specimen";
import { SparkFieldSpecimen } from "@/components/docs/component-docs/agent-spark-field/spark-field-specimen";

export const metadata: Metadata = {
  title: "Why these components — Agent Workspace — Elattar's Design System",
  description:
    "One card per part of the AgentWorkspace — Vercel AI Elements restyled to the system, and the parts built here — and the licence they ship under.",
};

type WhyCardData = {
  title: string;
  catalogName: string;
  whatItIs: string;
  whereUsed: string;
  whyChosen: string;
  whatChanged: string;
  specimen: React.ReactNode;
};

function WhyCard({ title, catalogName, whatItIs, whereUsed, whyChosen, whatChanged, specimen }: WhyCardData) {
  return (
    <article className="flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="type-h4 text-foreground">{title}</h3>
        <Button asChild size="sm" variant="ghost">
          <Link href={docRoute(catalogName)}>Catalog page</Link>
        </Button>
      </div>

      {/* A specimen can be genuinely wide (Queue, Effect Ledger, an activity
          log). It scrolls inside its own box here, rather than the box
          growing to fit it and blowing out the grid track (min-w-0 above
          only stops the ARTICLE from stretching the track — the specimen
          itself still needs somewhere to overflow TO). */}
      <div className="min-w-0 overflow-x-auto">{specimen}</div>

      <dl className="flex flex-col gap-4">
        <div>
          <dt className="type-badge text-muted-foreground">What it is</dt>
          <dd className="type-small mt-1.5 text-foreground">{whatItIs}</dd>
        </div>
        <div>
          <dt className="type-badge text-muted-foreground">Where it&rsquo;s used</dt>
          <dd className="type-small mt-1.5 text-foreground">{whereUsed}</dd>
        </div>
        <div>
          <dt className="type-badge text-muted-foreground">Why this one</dt>
          <dd className="type-small mt-1.5 text-muted-foreground">{whyChosen}</dd>
        </div>
        <div>
          <dt className="type-badge text-muted-foreground">What we changed</dt>
          <dd className="type-small mt-1.5 text-muted-foreground">{whatChanged}</dd>
        </div>
      </dl>
    </article>
  );
}

/* ── From Vercel AI Elements — what the AgentWorkspace is built from ──── */

const AI_ELEMENTS_CARDS: WhyCardData[] = [
  {
    title: "Message",
    catalogName: "ai-message",
    specimen: <MessagePreview />,
    whatItIs: "A turn: the user's bubble, or the agent's answer as markdown with its action row underneath.",
    whereUsed: "Every turn in the thread (workspace-thread.tsx, workspace-reply.tsx). The answer is MessageResponse; copy, regenerate, read aloud and Open in… (when you pass `openIn`) are MessageActions.",
    whyChosen: "It renders an agent's markdown as it streams — half-written code fences and links included — which a hand-built bubble would have to re-solve.",
    whatChanged: "The answer is the system's .prose: headings, lists and cells take the type roles instead of Streamdown's own classes; links ask first in an AlertDialog; code uses the --code-* roles; a failed diagram is an Alert.",
  },
  {
    title: "Reasoning",
    catalogName: "ai-reasoning",
    specimen: <ReasoningPlayground />,
    whatItIs: "The model's thinking, open while it streams and folded into “Thought for N seconds” when it ends.",
    whereUsed: "The top of a reply that thought before answering (workspace-reply.tsx).",
    whyChosen: "It owns the open-while-thinking, close-when-done behaviour and the duration line — the part of a status row worth keeping, without a separate row.",
    whatChanged: "Type and colour on the system roles, the trigger's hit area restored to 44px, and “1 second” in the singular.",
  },
  {
    title: "Chain of Thought",
    catalogName: "ai-chain-of-thought",
    specimen: <ChainOfThoughtPreview />,
    whatItIs: "The steps an agent took, in order, each with its status — searches with their results, tool calls with their output.",
    whereUsed: "Under the reasoning in a reply: one step per tool call (workspace-reply.tsx). It replaced the old Activity column.",
    whyChosen: "Status belongs in the reply that has it. A chain of steps reads the work where it happened, instead of in a side panel the reader has to look away to.",
    whatChanged: "Restyled to the system, with a 44px trigger; the steps take the run's own statuses through reply-model.ts.",
  },
  {
    title: "Tool",
    catalogName: "ai-tool",
    specimen: <ToolPreview />,
    whatItIs: "One tool call: its name, its state, its input and its output, collapsible.",
    whereUsed: "Each step of the chain (workspace-reply.tsx); a typed result picks a richer output component instead of plain JSON.",
    whyChosen: "Seven states, from waiting on input to denied, cover everything a call goes through — the run model maps onto them in one tested adapter (toolState in reply-model.ts).",
    whatChanged: "State badges on the -ink roles, so a running, failed or denied call reads in both themes.",
  },
  {
    title: "Confirmation",
    catalogName: "ai-confirmation",
    specimen: <ConfirmationPreview />,
    whatItIs: "An approval asked inside the tool that needs it: Approve or Decline, then the recorded answer.",
    whereUsed: "Inside the Tool that waits on the reader, and for a run's plan (run-inline.tsx).",
    whyChosen: "The question sits beside the thing it is about — not in a separate approvals list where the reader has to match a request to its call.",
    whatChanged: "A quiet record once answered (no alert chrome on a decision already made), and the actions on the system's Button sizes.",
  },
  {
    title: "Terminal and the output family",
    catalogName: "ai-terminal",
    specimen: <TerminalPreview />,
    whatItIs: "Command output with ANSI colour — one of fourteen output components a typed tool result can ask for.",
    whereUsed: "workspace-outputs.tsx: a result with kind \"terminal\", \"test-results\", \"stack-trace\", \"commit\", \"web-preview\" and so on renders its own component; anything else falls back to the plain Tool output.",
    whyChosen: "A test run, a crash or a diff is easier to read as itself than as JSON. The typed contract (tool-output.ts) checks each shape before it is trusted.",
    whatChanged: "ANSI colours mapped onto the -ink roles (terminal-ansi), code on the --code-* roles, and a web preview accepts only http(s).",
  },
  {
    title: "Sources",
    catalogName: "ai-sources",
    specimen: <SourcesPreview />,
    whatItIs: "“Used N sources”, opening to the links an answer drew on; inline citations point into it.",
    whereUsed: "Under the answer, with InlineCitation badges in the text (workspace-reply.tsx).",
    whyChosen: "One collapsed line keeps the answer first and the evidence one press away.",
    whatChanged: "Action-ink text, a 44px trigger, “1 source” in the singular, and a citation that never throws on a bad URL.",
  },
  {
    title: "Plan",
    catalogName: "ai-plan",
    specimen: <PlanShowcase />,
    whatItIs: "The run's plan as a card you can edit and run, and its checklist as it executes.",
    whereUsed: "Inline in the reply that started the run (run-inline.tsx), with Pause, Resume, Cancel and Undo changes beside the Task.",
    whyChosen: "A run is part of the conversation that asked for it. Drawing it inline replaced the run bar, the dock tray and the activity column.",
    whatChanged: "The trigger at the 40px icon size; the Task trigger is a real button the keyboard can reach.",
  },
  {
    title: "Task",
    catalogName: "ai-task",
    specimen: <TaskShowcase />,
    whatItIs: "A collapsible checklist of steps with the files each one touched.",
    whereUsed: "The running plan's steps (run-inline.tsx).",
    whyChosen: "A step list that collapses once read, and reads well at a glance while it runs.",
    whatChanged: "A <button> trigger with a 44px hit area instead of a div the keyboard skipped.",
  },
  {
    title: "Queue",
    catalogName: "ai-queue",
    specimen: <QueueShowcase />,
    whatItIs: "Messages waiting behind a busy agent: reorder, remove, send one now.",
    whereUsed: "Docked on top of the composer while messages wait (RunQueue in run-inline.tsx).",
    whyChosen: "A message sent while the agent works should wait in sight, attached to the box it was typed in.",
    whatChanged: "Only queued messages — the plan is not repeated there — on the system's elevation ladder.",
  },
  {
    title: "Canvas (workflow)",
    catalogName: "ai-canvas",
    specimen: <CanvasPreview />,
    whatItIs: "React Flow, set up for a plan: nodes, edges, controls and a panel.",
    whereUsed: "View as workflow (workflow-dialog.tsx) draws the plan as a graph.",
    whyChosen: "A plan with branches reads better as a graph than as a list, and React Flow is the standard for it.",
    whatChanged: "xy-tokens puts React Flow's own colours on the system roles, and it follows the resolved theme instead of tagging itself light.",
  },
  {
    title: "Prompt Input",
    catalogName: "ai-prompt-input",
    specimen: <PromptInputSpecimen />,
    whatItIs: "The composer: attachments, the message, a tools row and Send.",
    whereUsed: "WorkspaceComposer (workspace-composer.tsx), one + menu (files, sources, skills), @ and / palettes, Search, the model, Effort, the context meter, the mic beside Send.",
    whyChosen: "File handling, drag-and-drop and submit-or-stop are solved; the workspace adds only what its transport needs.",
    whatChanged: "A rounded rectangle rather than a pill (a tall pill clips its own placeholder on a phone), filled chips, and a compact phone layout — only +, the mic and Send in the box.",
  },
  {
    title: "Context",
    catalogName: "ai-context",
    specimen: <ContextShowcase />,
    whatItIs: "How full the context window is, with input, output and their price.",
    whereUsed: "The composer's tools row (workspace-composer.tsx); Summarise appears beside it from 90% full.",
    whyChosen: "A long conversation should say it is running out before it does, and what it has cost.",
    whatChanged: "A thin bar, figures on the number role.",
  },
  {
    title: "Effort Slider",
    catalogName: "agent-effort-slider",
    specimen: <EffortSliderSpecimen />,
    whatItIs: "An effort control: Faster ↔ Smarter on a notched track.",
    whereUsed: "Opened from the Effort chip in the composer.",
    whyChosen: "A choice between five ordered levels reads as a slider, not a menu.",
    whatChanged: "Built here; the level rides settings.effort.",
  },
  {
    title: "Spark Field",
    catalogName: "agent-spark-field",
    specimen: <SparkFieldSpecimen />,
    whatItIs: "A max-effort effect: a tint and rising sparks over the box while you type.",
    whereUsed: "The composer, at the last effort level, while the message is focused.",
    whyChosen: "Max effort is the one moment that earns an effect: it says the next answer will think hard.",
    whatChanged: "Off under reduced motion, coloured from --agent, with an imperative bump() so typing feeds it.",
  },
  {
    title: "Generated Image",
    catalogName: "agent-generated-image",
    specimen: <GeneratedImageStill stage="refining" />,
    whatItIs: "The frame a tool-generated image appears in: it holds a square place in the reply, shows progress as clarity from blurred to sharp, and offers Retry on a failure.",
    whereUsed: "The workspace reply, one frame for each image tool, from its first stage to the finished picture.",
    whyChosen: "An image takes time, and a blurred preview that sharpens tells the reader how far along it is without a progress bar or a layout jump.",
    whatChanged: "Original: a filter transition on the child, a stage pill that leaves when done, the shimmer utility before any image exists, and no canvas or custom keyframe.",
  },
];

export default function AgentWorkspaceWhyPage() {
  return (
    <>
      <DsPageHeader
        eyebrow="COMPONENTS / AGENT"
        title="Why these components"
        blurb="One card per part of the AgentWorkspace — Vercel AI Elements restyled to the system, and the parts built here. Each says what it is, where it sits, why it beats the part beside it, and what changed from its source."
      />

      <div className="mb-10 flex flex-wrap gap-3">
        <Button asChild size="lg" variant="secondary">
          <Link href={docRoute("agent-workspace")}>Back to the live workspace</Link>
        </Button>
      </div>

      <DsSection
        id="ai-elements"
        title="From Vercel AI Elements — the workspace"
        description="The AgentWorkspace is composed from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md), vendored and restyled to this system's tokens, with the parts built here. Each part has its own page; the full map is the workspace page's Anatomy."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {AI_ELEMENTS_CARDS.map((card) => (
            <WhyCard key={card.title} {...card} />
          ))}
        </div>
      </DsSection>

      <DsSection id="licence" title="Licence">
        <Note tone="action" title="Apache-2.0">
          Vercel AI Elements ships under Apache-2.0. The vendored parts live in <Code>components/ai-elements/</Code>{" "}
          with their licence and attribution in <Code>components/ai-elements/NOTICE.md</Code>, and every restyled file
          keeps its header naming its source. The parts built here — the effort slider, the spark field, the voice orb and the
          generated-image frame — are
          this system&rsquo;s own and carry no upstream licence.
        </Note>
      </DsSection>
    </>
  );
}
