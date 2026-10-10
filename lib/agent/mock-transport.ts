"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { reduceEvent, markApproval, settleAction, userTurn } from "@/components/agent/core/timeline";
import type { RestoredMessage } from "@/components/agent/core/conversations";
import type {
  AgentEvent,
  AgentProfile,
  AgentTransport,
  AgentTurn,
  Attachment,
  ContextUsage,
  PendingApproval,
  SendOptions,
  Source,
  TextTurn,
  UserTurn,
} from "@/components/agent/core/types";
import { formatBytes } from "@/components/agent/core/attachments";
import {
  EMPTY_RUN_STATE,
  compensationOrder,
  reduceRunEvent,
  stepsAfterCheckpoint,
  type Checkpoint,
  type Confidence,
  type Effect,
  type Handoff,
  type PlanStep,
  type QueueItem,
  type RunEvent,
  type RunState,
} from "@/components/agent/core/run";
import type { ImageStage } from "@/components/agent/workspace/tool-output";

type Beat =
  | { beat: "say"; text: string }
  | {
      beat: "tool";
      name: string;
      params: Record<string, unknown>;
      ms: number;
      result: unknown;
      attachments?: Attachment[];
      progress?: { at: number; partial: unknown }[];
    }
  | {
      beat: "ask";
      action: string;
      params: Record<string, unknown>;
      onApprove?: string;
      onReject?: string;
    }
  | { beat: "fail"; error: string; fatal?: boolean }
  | { beat: "reason"; steps: string[] }
  | { beat: "sources"; sources: Source[] }
  | { beat: "confidence"; confidence: Confidence }
  | { beat: "suggest"; items: string[] }
  | { beat: "run"; event: DistributiveOmit<RunEvent, "eventId" | "at"> }
  | { beat: "wait"; ms: number }
  | { beat: "pausePoint"; ms: number }
  | { beat: "until"; signal: Signal }
  | { beat: "image"; stages: ImageStage[] };

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

const SCRIPTS: Record<string, Beat[]> = {
  default: [
    { beat: "say", text: "Let me look that up." },
    {
      beat: "tool",
      name: "search_inventory",
      params: { query: "sealed booster boxes", limit: 3 },
      ms: 900,
      result: { matches: 3, topResult: "Eclipse Vault — 1st Edition" },
    },
    {
      beat: "say",
      text: "Three sealed boxes match. The strongest is **Eclipse Vault — 1st Edition**, with 24 packs left of an original 250.\n\nWant me to put one on hold?",
    },
  ],

  approval: [
    { beat: "say", text: "I can do that. Checking the balance first." },
    {
      beat: "tool",
      name: "read_wallet",
      params: {},
      ms: 700,
      result: { available: 2481, currency: "USD" },
    },
    {
      beat: "say",
      text: "There is enough available. This one spends real money, so it is yours to confirm rather than mine.",
    },
    {
      beat: "ask",
      action: "purchase_pack",
      params: { pack: "Eclipse Vault — 1st Edition", price: 129, currency: "USD" },
    },
  ],

  report: [
    { beat: "say", text: "Pulling the last thirty days." },
    {
      beat: "tool",
      name: "export_activity",
      params: { window: "30d", format: "csv" },
      ms: 1200,
      result: { rows: 148 },
      attachments: [
        {
          id: "mock-activity-csv",
          name: "activity-30d.csv",
          mime: "text/csv",
          kind: "data",
          size: 4821,
          text: [
            "date,event,item,value",
            "2026-07-08,pull,Eclipse Vault,129.00",
            "2026-07-11,sale,Aurora Prism,84.50",
            "2026-07-19,pull,Cobalt Run,72.00",
            "2026-08-02,sale,Eclipse Vault,240.00",
          ].join("\n"),
          delivery: { sent: "produced" },
        },
      ],
    },
    { beat: "say", text: "148 rows, attached above. Net position over the window is **+$123.50**." },
  ],

  error: [
    { beat: "say", text: "Trying the pricing service." },
    {
      beat: "tool",
      name: "fetch_market_price",
      params: { item: "Eclipse Vault" },
      ms: 800,
      result: { success: false },
    },
    { beat: "fail", error: "The pricing service did not respond in time." },
  ],
};

function attachmentsAndSearchBeats(sendOptions?: SendOptions): Beat[] {
  const attachments = sendOptions?.attachments ?? [];
  const beats: Beat[] = [];

  if (attachments.length) {
    const lines = attachments.map((a) => `- **${a.name}** (${formatBytes(a.size)})`).join("\n");
    beats.push({
      beat: "say",
      text: `Got it — ${attachments.length === 1 ? "one attachment" : `${attachments.length} attachments`}:\n${lines}`,
    });
  } else {
    beats.push({
      beat: "say",
      text: "I don't see any attachments on this one — attach an image or a file with the + menu, or paste/drag one in, and I'll describe it back.",
    });
  }

  if (sendOptions?.webSearch) {
    beats.push({ beat: "wait", ms: 250 });
    beats.push({
      beat: "say",
      text: attachments.length
        ? "\n\nI also checked the web for anything related [1][2]."
        : "I checked the web while I was at it [1][2].",
    });
    beats.push({
      beat: "sources",
      sources: [
        { id: "aw1", n: 1, title: "Product overview", url: "https://example.com/overview", domain: "example.com" },
        { id: "aw2", n: 2, title: "Latest specs", url: "https://example.com/specs", domain: "example.com" },
      ],
    });
    beats.push({ beat: "confidence", confidence: "high" });
  }

  return beats;
}

function scriptFor(text: string, sendOptions?: SendOptions): Beat[] {
  if (sendOptions?.attachments?.length || sendOptions?.webSearch) {
    return attachmentsAndSearchBeats(sendOptions);
  }
  const t = text.toLowerCase();
  if (/\b(buy|purchase|order|hold|reserve)\b/.test(t)) return SCRIPTS.approval;
  if (/\b(report|export|csv|activity|download)\b/.test(t)) return SCRIPTS.report;
  if (/\b(price|worth|value|market|fail|error|broken)\b/.test(t)) return SCRIPTS.error;
  return SCRIPTS.default;
}

export type ConversationId =
  | "chat"
  | "tools"
  | "planning"
  | "approvals"
  | "run-control"
  | "recovery"
  | "long-session";

export type ConversationBeatMeta = { label: string; prompt: string };

export type ConversationDef = {
  id: ConversationId;
  title: string;
  starter: string;
  beats: ConversationBeatMeta[];
};

export const CONVERSATIONS: ConversationDef[] = [
  {
    id: "chat",
    title: "Chat",
    starter: "Explain how the new pricing model works",
    beats: [
      { label: "Answer with sources", prompt: "Explain how the new pricing model works" },
      { label: "Code example", prompt: "Show me a code example" },
      { label: "Attach files", prompt: "Here's a screenshot and the spec, take a look" },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    starter: "Search the codebase and run the tests",
    beats: [
      { label: "Search, then a test run", prompt: "Search the codebase and run the tests" },
      { label: "A terminal streams", prompt: "Run the build" },
      { label: "A tool fails, then retries", prompt: "Now deploy it" },
      { label: "A crash with a stack trace", prompt: "Run the database migration" },
      { label: "Generate an image", prompt: "Make a hero image for the release" },
      { label: "An artifact", prompt: "Write up the release notes" },
      { label: "A web and a component preview", prompt: "Put together a quick demo page" },
      { label: "A sandbox", prompt: "Run a quick calculation" },
    ],
  },
  {
    id: "planning",
    title: "Planning",
    starter: "Plan the Q3 launch",
    beats: [
      { label: "Plan, edit, run, verify", prompt: "Plan the Q3 launch" },
      { label: "Undo the changes", prompt: "Actually, undo that" },
    ],
  },
  {
    id: "approvals",
    title: "Approvals",
    starter: "Rotate the production API key",
    beats: [
      { label: "Approve a tool", prompt: "Rotate the production API key" },
      { label: "High-risk, needs a code", prompt: "Now wire the vendor payment" },
      { label: "Approval expires", prompt: "Also raise the campaign budget, take your time" },
      { label: "Stale approval", prompt: "Reorganize the folders while you're at it" },
      { label: "Needs a secret", prompt: "Set up the webhook integration" },
    ],
  },
  {
    id: "run-control",
    title: "Run control",
    starter: "Migrate the database, this will take a while",
    beats: [
      { label: "Pause, queue, resume", prompt: "Migrate the database, this will take a while" },
      { label: "Cancel mid-step", prompt: "Also reindex search" },
      { label: "Restore a checkpoint", prompt: "Restore the reindex from its checkpoint" },
    ],
  },
  {
    id: "recovery",
    title: "Recovery",
    starter: "Sync my calendar",
    beats: [
      { label: "Connection drop and restore", prompt: "Sync my calendar" },
      { label: "Partial failure, retry", prompt: "Now sync both warehouses" },
      { label: "Fatal error, retry", prompt: "Rebuild the search index" },
      { label: "Hand off to a person", prompt: "Cancel my flight booking" },
    ],
  },
  {
    id: "long-session",
    title: "Long session",
    starter: "Let's keep working on the quarterly report",
    beats: [
      { label: "Context near the limit", prompt: "Let's keep working on the quarterly report" },
      { label: "About this agent", prompt: "What model and tools do you have?" },
      { label: "Dictation-ready reply", prompt: "Remind me to call the vendor tomorrow" },
    ],
  },
];

export function heroImageUrl(): string {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">`,
    `<defs>`,
    `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="midnightblue"/><stop offset="0.55" stop-color="mediumslateblue"/><stop offset="1" stop-color="lightsalmon"/></linearGradient>`,
    `<radialGradient id="sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="lightyellow"/><stop offset="0.6" stop-color="gold"/><stop offset="1" stop-color="coral" stop-opacity="0"/></radialGradient>`,
    `</defs>`,
    `<rect width="640" height="480" fill="url(#sky)"/>`,
    `<circle cx="430" cy="250" r="120" fill="url(#sun)"/>`,
    `<circle cx="430" cy="250" r="52" fill="lightyellow"/>`,
    `<path d="M0 300 L90 230 L170 280 L260 200 L360 290 L450 230 L540 280 L640 220 L640 480 L0 480 Z" fill="slateblue" opacity="0.85"/>`,
    `<path d="M0 350 L110 290 L210 340 L320 280 L420 350 L520 300 L640 340 L640 480 L0 480 Z" fill="darkslateblue"/>`,
    `<path d="M0 410 L130 360 L250 400 L380 350 L500 410 L640 370 L640 480 L0 480 Z" fill="midnightblue"/>`,
    `</svg>`,
  ].join("");
  const base64 = typeof btoa === "function" ? btoa(svg) : Buffer.from(svg, "utf-8").toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

export async function speakMock(text: string): Promise<string> {
  const frames = Math.max(8, Math.min(400, text.length * 2));
  const dataSize = frames * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i += 1) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 8000, true);
  view.setUint32(28, 16000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  const base64 = typeof btoa === "function" ? btoa(binary) : Buffer.from(bytes).toString("base64");
  return `data:audio/wav;base64,${base64}`;
}

const AGENT_PROFILE: AgentProfile = {
  name: "Report assistant",
  model: "Deep",
  instructions: "Helps draft and revise the quarterly report; asks before anything irreversible.",
  tools: [
    { name: "search_code", description: "Search the codebase" },
    { name: "run_tests", description: "Run a test suite" },
  ],
};

type CheckpointBeat = { beat: "checkpoint"; label: string };

export function releasePreviewUrl(): string {
  const path = "/samples/release-preview.html";
  return typeof location === "undefined" ? path : new URL(path, location.origin).href;
}

type ConversationBeatScript = (Beat | CheckpointBeat)[] | ((sendOptions?: SendOptions) => (Beat | CheckpointBeat)[]);

const CONVERSATION_SCRIPTS: Record<ConversationId, ConversationBeatScript[]> = {
  chat: [
    [
      { beat: "reason", steps: ["Checking the pricing documentation", "Cross-referencing the plan tiers"] },
      {
        beat: "say",
        text: "The new model bills per seat with a usage overage above the plan's included volume [1][2].\n\n```ts\ntype Plan = { seats: number; included: number; overageRate: number };\n```",
      },
      {
        beat: "sources",
        sources: [
          { id: "cp1", n: 1, title: "Pricing overview", url: "https://example.com/pricing", domain: "example.com" },
          { id: "cp2", n: 2, title: "Plan tiers", url: "https://example.com/tiers", domain: "example.com" },
        ],
      },
      { beat: "confidence", confidence: "high" },
      { beat: "suggest", items: ["Show me a code example"] },
    ],
    [
      {
        beat: "say",
        text: "Install and start it with `npm run dev`, then price a bill with this:\n\n```ts\nfunction price(plan: Plan, seats: number, used: number) {\n  const overage = Math.max(0, used - plan.included);\n  return seats * 10 + overage * plan.overageRate;\n}\n```",
      },
      { beat: "suggest", items: ["Here's a screenshot and the spec, take a look"] },
    ],
    (sendOptions) => [
      ...attachmentsAndSearchBeats(sendOptions),
      { beat: "checkpoint", label: "After the pricing walkthrough" },
    ],
  ],

  tools: [
    [
      { beat: "reason", steps: ["Searching the codebase"] },
      {
        beat: "tool",
        name: "search_code",
        params: { query: "pricing overage" },
        ms: 300,
        result: {
          kind: "search",
          query: "pricing overage",
          results: [
            { title: "billing/price.ts", url: "https://example.com/billing/price.ts", domain: "billing/price.ts" },
            { title: "billing/price.test.ts", url: "https://example.com/billing/price.test.ts", domain: "billing/price.test.ts" },
          ],
        },
      },
      {
        beat: "tool",
        name: "run_tests",
        params: { suite: "billing" },
        ms: 600,
        progress: [
          {
            at: 200,
            partial: {
              kind: "test-results",
              summary: { passed: 1, failed: 0, skipped: 0, total: 3 },
              suites: [{ name: "billing", status: "running", tests: [{ name: "prices a plan", status: "passed" }] }],
            },
          },
        ],
        result: {
          kind: "test-results",
          summary: { passed: 3, failed: 0, skipped: 0, total: 3, duration: 600 },
          suites: [
            {
              name: "billing",
              status: "passed",
              tests: [
                { name: "prices a plan", status: "passed", duration: 12 },
                { name: "charges overage", status: "passed", duration: 9 },
                { name: "rejects a negative seat count", status: "passed", duration: 4 },
              ],
            },
          ],
        },
      },
      { beat: "say", text: "Found the billing module and all three tests pass." },
      { beat: "suggest", items: ["Run the build"] },
    ],
    [
      { beat: "say", text: "Running the build." },
      {
        beat: "tool",
        name: "run_build",
        params: { script: "build" },
        ms: 900,
        progress: [
          { at: 200, partial: { kind: "terminal", command: "npm run build", output: "> app@3.1.0 build\n" } },
          { at: 450, partial: { kind: "terminal", command: "npm run build", output: "> app@3.1.0 build\nCompiling 42 modules...\n" } },
          { at: 700, partial: { kind: "terminal", command: "npm run build", output: "> app@3.1.0 build\nCompiling 42 modules...\nOptimising assets...\n" } },
        ],
        result: {
          kind: "terminal",
          command: "npm run build",
          output: "> app@3.1.0 build\nCompiling 42 modules...\nOptimising assets...\nDone in 0.9s\n",
          exitCode: 0,
        },
      },
      { beat: "say", text: "The build passed." },
      { beat: "suggest", items: ["Now deploy it"] },
    ],
    [
      { beat: "say", text: "Deploying now." },
      {
        beat: "tool",
        name: "deploy",
        params: { target: "production" },
        ms: 500,
        progress: [{ at: 150, partial: { kind: "terminal", command: "npm run deploy", output: "Building...\n" } }],
        result: {
          success: false,
          kind: "terminal",
          command: "npm run deploy",
          output: "Building...\nERROR: connection to registry timed out",
          exitCode: 1,
        },
      },
      { beat: "say", text: "That failed — retrying." },
      {
        beat: "tool",
        name: "deploy",
        params: { target: "production" },
        ms: 400,
        result: { kind: "terminal", command: "npm run deploy", output: "Building...\nUploading...\nDeployed to production.", exitCode: 0 },
      },
      { beat: "say", text: "Deployed on the second try." },
      { beat: "suggest", items: ["Run the database migration"] },
    ],
    [
      { beat: "say", text: "Running the migration." },
      {
        beat: "tool",
        name: "run_migration",
        params: { direction: "up" },
        ms: 300,
        result: {
          success: false,
          error: "TypeError: Cannot read properties of undefined (reading 'rows')",
          kind: "stack-trace",
          trace:
            "TypeError: Cannot read properties of undefined (reading 'rows')\n    at migrate (src/db/migrate.ts:42:17)\n    at run (src/db/index.ts:9:3)\n    at main (src/cli.ts:21:5)",
        },
      },
      { beat: "say", text: "The migration crashed. Press Retry to run it again." },
      { beat: "suggest", items: ["Make a hero image for the release"] },
    ],
    [
      { beat: "say", text: "Generating that now." },
      { beat: "image", stages: ["queued", "generating", "refining", "complete"] },
      { beat: "say", text: "Here's the image." },
      { beat: "suggest", items: ["Write up the release notes"] },
    ],
    [
      { beat: "say", text: "Drafting the release notes." },
      {
        beat: "tool",
        name: "write_notes",
        params: { title: "Release notes" },
        ms: 300,
        result: {
          kind: "artifact",
          title: "Release notes 3.2.0",
          description: "What changed in this release",
          language: "markdown",
          content: "# 3.2.0\n\n- Per-seat pricing with usage overage\n- Faster builds\n- Fixed the migration crash\n",
        },
      },
      { beat: "say", text: "The notes are ready." },
      { beat: "suggest", items: ["Put together a quick demo page"] },
    ],
    () => [
      { beat: "say", text: "Putting together a small preview." },
      {
        beat: "tool",
        name: "build_preview",
        params: {},
        ms: 300,
        result: { kind: "web-preview", url: releasePreviewUrl(), logs: [{ level: "log", message: "Preview ready", at: 0 }] },
      },
      {
        beat: "tool",
        name: "build_component",
        params: { name: "PriceTag" },
        ms: 300,
        result: { kind: "jsx-preview", jsx: "<div><strong>$10</strong> per seat</div>" },
      },
      { beat: "say", text: "Preview is live." },
      { beat: "suggest", items: ["Run a quick calculation"] },
    ],
    [
      { beat: "say", text: "Running that in the sandbox." },
      {
        beat: "tool",
        name: "run_code",
        params: { language: "typescript" },
        ms: 300,
        result: {
          kind: "sandbox",
          title: "Overage calculator",
          language: "typescript",
          code: "const seats = 12;\nconst overage = 340 * 0.02;\nconsole.log(seats * 10 + overage);",
          output: "126.8",
        },
      },
      { beat: "say", text: "A 12-seat bill with 340 units over comes to 126.80." },
    ],
  ],

  planning: [
    [
      {
        beat: "run",
        event: {
          type: "run_proposed", runId: "conv-plan", goal: "Launch Q3", version: 1,
          plan: [{ id: "pl1", title: "Draft the launch brief", status: "pending" }],
        },
      },
      { beat: "wait", ms: 80 },
      {
        beat: "run",
        event: {
          type: "plan_edited", version: 1,
          plan: [
            { id: "pl1", title: "Draft the launch brief", status: "pending" },
            { id: "pl2", title: "Line up the announcement", status: "pending" },
          ],
        },
      },
      { beat: "wait", ms: 80 },
      {
        beat: "run",
        event: {
          type: "plan_edited", version: 1,
          plan: [
            { id: "pl1", title: "Draft the launch brief", status: "pending" },
            { id: "pl2", title: "Line up the announcement", status: "pending" },
            { id: "pl3", title: "Ship the release", status: "pending" },
          ],
        },
      },
      { beat: "wait", ms: 80 },
      {
        beat: "run",
        event: {
          type: "plan_edited", version: 2,
          plan: [
            { id: "pl1", title: "Draft the launch brief", status: "pending" },
            { id: "pl2", title: "Line up the announcement", status: "pending" },
            { id: "pl3", title: "Ship the release", status: "pending" },
            { id: "pl4", title: "Notify the partner list", status: "pending" },
          ],
        },
      },
      { beat: "until", signal: "approve" },
      { beat: "run", event: { type: "step_status", stepId: "pl1", status: "running" } },
      { beat: "wait", ms: 100 },
      { beat: "run", event: { type: "step_status", stepId: "pl1", status: "done", ms: 100 } },
      { beat: "run", event: { type: "step_status", stepId: "pl2", status: "running", confidence: "low" } },
      { beat: "run", event: { type: "run_status", status: "waiting_for_approval" } },
      { beat: "until", signal: "verify" },
      { beat: "run", event: { type: "step_status", stepId: "pl3", status: "running" } },
      { beat: "wait", ms: 100 },
      {
        beat: "run",
        event: {
          type: "effect", outcome: "committed",
          effect: { id: "eff-pl3", stepId: "pl3", description: "Published the release notes", target: "Changelog", reversible: true },
        },
      },
      { beat: "run", event: { type: "step_status", stepId: "pl3", status: "done", ms: 100 } },
      { beat: "run", event: { type: "step_status", stepId: "pl4", status: "running" } },
      { beat: "wait", ms: 80 },
      { beat: "run", event: { type: "step_status", stepId: "pl4", status: "done", ms: 80 } },
      { beat: "run", event: {
        type: "checkpoint",
        checkpoint: { id: "cp-plan-1", label: "After shipping the release", turnId: "$userTurn", at: 0, stepId: "pl3" },
      } },
      {
        beat: "run",
        event: {
          type: "run_status", status: "completed",
        },
      },
      {
        beat: "tool",
        name: "changed_files",
        params: {},
        ms: 0,
        result: {
          kind: "file-tree",
          files: [
            { path: "docs/launch-brief.md", change: "added" },
            { path: "CHANGELOG.md", change: "modified" },
          ],
        },
      },
      {
        beat: "tool",
        name: "commit_changes",
        params: {},
        ms: 0,
        result: {
          kind: "commit", hash: "a1b2c3d", message: "Ship the Q3 launch", author: "agent", date: Date.now(),
          files: [
            { path: "docs/launch-brief.md", status: "added", additions: 42, deletions: 0 },
            { path: "CHANGELOG.md", status: "modified", additions: 6, deletions: 0 },
          ],
        },
      },
      {
        beat: "tool",
        name: "package_info",
        params: {},
        ms: 0,
        result: { kind: "package-info", name: "@app/release", currentVersion: "3.1.0", newVersion: "3.2.0", changeType: "minor", description: "Q3 launch" },
      },
      { beat: "say", text: "Launch complete — 4 steps done, one committed." },
      { beat: "suggest", items: ["Actually, undo that"] },
    ],
    [
      { beat: "run", event: { type: "run_status", status: "compensating" } },
      {
        beat: "run",
        event: {
          type: "effect", outcome: "reversed",
          effect: { id: "eff-pl3", stepId: "pl3", description: "Published the release notes", target: "Changelog", reversible: true },
        },
      },
      { beat: "run", event: { type: "run_status", status: "compensated" } },
      { beat: "say", text: "Reverted the changelog entry. The commit itself stays in history, but its effect is undone." },
    ],
  ],

  approvals: [
    [
      { beat: "say", text: "I can do that. Checking access first." },
      { beat: "tool", name: "check_access", params: {}, ms: 300, result: { allowed: true } },
      { beat: "say", text: "This changes a production credential, so it's yours to confirm." },
      { beat: "ask", action: "rotate_key", params: { key: "PROD_API_KEY" } },
      { beat: "suggest", items: ["Now wire the vendor payment"] },
    ],
    [
      { beat: "say", text: "This moves real money, so it needs a verification code." },
      {
        beat: "ask",
        action: "wire_payment",
        params: { vendor: "Acme Textiles", amount: 12500, currency: "USD", risk: "high" },
        onApprove: "\n\nVerified — the payment is wired.",
        onReject: "\n\nDeclined — nothing was sent.",
      },
      { beat: "suggest", items: ["Also raise the campaign budget, take your time"] },
    ],
    [
      {
        beat: "run",
        event: { type: "run_proposed", runId: "conv-appr-exp", goal: "Raise the campaign budget", version: 1, plan: [{ id: "bx1", title: "Confirm budget", status: "pending" }] },
      },
      { beat: "wait", ms: 60 },
      { beat: "run", event: { type: "approval_expired", version: 1 } },
      { beat: "until", signal: "approve" },
      { beat: "run", event: { type: "step_status", stepId: "bx1", status: "running" } },
      { beat: "wait", ms: 80 },
      { beat: "run", event: { type: "step_status", stepId: "bx1", status: "done", ms: 80 } },
      { beat: "run", event: { type: "run_status", status: "completed" } },
      { beat: "say", text: "Budget raised, on the second approval." },
      { beat: "suggest", items: ["Reorganize the folders while you're at it"] },
    ],
    [
      {
        beat: "run",
        event: { type: "run_proposed", runId: "conv-stale", goal: "Reorganize the folders", version: 1, plan: [{ id: "sf1", title: "Sort files", status: "pending" }] },
      },
      { beat: "wait", ms: 50 },
      {
        beat: "run",
        event: {
          type: "plan_edited", version: 2,
          plan: [
            { id: "sf1", title: "Sort files", status: "pending" },
            { id: "sf2", title: "Rename duplicates", status: "pending" },
          ],
        },
      },
      { beat: "run", event: { type: "plan_approved", version: 1 } },
      { beat: "say", text: "Your approval was for the first version — the plan changed since, so approve v2 to go ahead." },
      { beat: "until", signal: "approve" },
      { beat: "run", event: { type: "step_status", stepId: "sf1", status: "running" } },
      { beat: "wait", ms: 80 },
      { beat: "run", event: { type: "step_status", stepId: "sf1", status: "done", ms: 80 } },
      { beat: "run", event: { type: "step_status", stepId: "sf2", status: "running" } },
      { beat: "wait", ms: 80 },
      { beat: "run", event: { type: "step_status", stepId: "sf2", status: "done", ms: 80 } },
      { beat: "run", event: { type: "run_status", status: "completed" } },
      { beat: "say", text: "Done, on the version you actually approved." },
      { beat: "suggest", items: ["Set up the webhook integration"] },
    ],
    [
      { beat: "say", text: "That needs a secret I don't have yet." },
      {
        beat: "tool",
        name: "webhook_setup",
        params: {},
        ms: 200,
        result: { kind: "environment-variables", variables: [
          { name: "WEBHOOK_SECRET", value: "", required: true },
          { name: "WEBHOOK_URL", value: "https://hooks.example.com/inbound", required: true },
        ] },
      },
      { beat: "say", text: "Add `WEBHOOK_SECRET` and I can finish the setup." },
    ],
  ],

  "run-control": [
    [
      {
        beat: "run",
        event: {
          type: "run_proposed", runId: "conv-rc", goal: "Migrate the database", version: 1,
          plan: [
            { id: "rc1", title: "Back up the database", status: "pending" },
            { id: "rc2", title: "Migrate the schema", status: "pending" },
          ],
        },
      },
      { beat: "run", event: { type: "plan_approved", version: 1 } },
      { beat: "run", event: { type: "step_status", stepId: "rc1", status: "running" } },
      { beat: "wait", ms: 100 },
      { beat: "run", event: { type: "step_status", stepId: "rc1", status: "done", ms: 100 } },
      { beat: "run", event: { type: "checkpoint", checkpoint: { id: "cp-rc-1", label: "After the backup", turnId: "$userTurn", at: 0, stepId: "rc1" } } },
      { beat: "run", event: { type: "step_status", stepId: "rc2", status: "running" } },
      // Long enough for a person to press Pause.
      { beat: "pausePoint", ms: 5000 },
      { beat: "run", event: { type: "step_status", stepId: "rc2", status: "done", ms: 100 } },
      { beat: "run", event: { type: "run_status", status: "completed" } },
      { beat: "say", text: "Migration finished." },
      { beat: "suggest", items: ["Also reindex search"] },
    ],
    [
      { beat: "say", text: "Starting the reindex — press Cancel any time." },
      { beat: "suggest", items: ["Restore the reindex from its checkpoint"] },
      {
        beat: "run",
        event: {
          type: "run_proposed", runId: "conv-rc2", goal: "Reindex search", version: 1,
          plan: [
            { id: "rx1", title: "Back up the index", status: "pending" },
            { id: "rx2", title: "Rebuild the index", status: "pending" },
          ],
        },
      },
      { beat: "run", event: { type: "plan_approved", version: 1 } },
      { beat: "run", event: { type: "step_status", stepId: "rx1", status: "running" } },
      { beat: "wait", ms: 100 },
      { beat: "run", event: { type: "step_status", stepId: "rx1", status: "done", ms: 100 } },
      { beat: "run", event: { type: "checkpoint", checkpoint: { id: "cp-rx-1", label: "After the index backup", turnId: "$userTurn", at: 0, stepId: "rx1" } } },
      { beat: "run", event: { type: "step_status", stepId: "rx2", status: "running" } },
      { beat: "wait", ms: 5000 },
      { beat: "run", event: { type: "step_status", stepId: "rx2", status: "done", ms: 5000 } },
      { beat: "run", event: { type: "run_status", status: "completed" } },
    ],
    [
      { beat: "say", text: "Pick the checkpoint on the run above and press Restore to rewind it." },
    ],
  ],

  recovery: [
    [
      {
        beat: "run",
        event: { type: "run_proposed", runId: "conv-rec1", goal: "Sync the calendar", version: 1, plan: [{ id: "cal1", title: "Fetch events", status: "pending" }] },
      },
      { beat: "run", event: { type: "plan_approved", version: 1 } },
      { beat: "run", event: { type: "step_status", stepId: "cal1", status: "running" } },
      { beat: "wait", ms: 80 },
      { beat: "run", event: { type: "connection", connection: "reconnecting" } },
      { beat: "wait", ms: 150 },
      { beat: "run", event: { type: "connection", connection: "connected" } },
      { beat: "run", event: { type: "step_status", stepId: "cal1", status: "done", ms: 230 } },
      { beat: "run", event: { type: "run_status", status: "completed" } },
      { beat: "say", text: "Calendar synced after a brief reconnect." },
      { beat: "suggest", items: ["Now sync both warehouses"] },
    ],
    [
      {
        beat: "run",
        event: {
          type: "run_proposed", runId: "conv-rec2", goal: "Sync inventory", version: 1,
          plan: [
            { id: "i1", title: "Sync warehouse A", status: "pending" },
            { id: "i2", title: "Sync warehouse B", status: "pending" },
          ],
        },
      },
      { beat: "run", event: { type: "plan_approved", version: 1 } },
      { beat: "run", event: { type: "step_status", stepId: "i1", status: "running" } },
      { beat: "wait", ms: 80 },
      { beat: "run", event: { type: "step_status", stepId: "i1", status: "done", ms: 80 } },
      {
        beat: "run",
        event: { type: "effect", outcome: "committed", effect: { id: "e1", stepId: "i1", description: "Synced warehouse A", target: "Warehouse A", reversible: true } },
      },
      { beat: "run", event: { type: "step_status", stepId: "i2", status: "running" } },
      { beat: "wait", ms: 80 },
      { beat: "run", event: { type: "step_status", stepId: "i2", status: "failed", ms: 80 } },
      {
        beat: "run",
        event: { type: "effect", outcome: "failed", effect: { id: "e2", stepId: "i2", description: "Sync warehouse B", target: "Warehouse B", reversible: true, error: "Timed out" } },
      },
      {
        beat: "run",
        event: {
          type: "run_status", status: "partially_failed",
          error: { what: "Warehouse B did not sync", why: "The upstream API timed out", next: "Retry the effect", kind: "connection", fatal: false },
        },
      },
      { beat: "say", text: "Warehouse A is in sync. Warehouse B timed out — retry it and the run finishes." },
      { beat: "suggest", items: ["Rebuild the search index"] },
    ],
    [
      { beat: "say", text: "Trying to process that." },
      { beat: "tool", name: "core_service", params: {}, ms: 300, result: { success: false } },
      {
        beat: "fail",
        error: "The core service crashed. Why: it returned a malformed response. Next: press Retry, or start a new conversation.",
        fatal: true,
      },
    ],
    [
      {
        beat: "run",
        event: {
          type: "run_proposed", runId: "conv-ho", goal: "Cancel the flight booking", version: 1,
          plan: [
            { id: "h1", title: "Locate booking", status: "pending" },
            { id: "h2", title: "Cancel with airline", status: "pending" },
          ],
        },
      },
      { beat: "run", event: { type: "plan_approved", version: 1 } },
      { beat: "run", event: { type: "step_status", stepId: "h1", status: "running" } },
      { beat: "wait", ms: 60 },
      { beat: "run", event: { type: "step_status", stepId: "h1", status: "done", ms: 60 } },
      { beat: "run", event: { type: "step_status", stepId: "h2", status: "running" } },
      { beat: "wait", ms: 60 },
      { beat: "run", event: { type: "step_status", stepId: "h2", status: "failed", ms: 60 } },
      {
        beat: "run",
        event: {
          type: "run_status", status: "handoff_required",
          error: { what: "I couldn't cancel the booking", why: "The airline only lets the account holder cancel", next: "Hand it to a person who has access", kind: "access", fatal: true },
        },
      },
      { beat: "say", text: "I can't finish this one — the airline only lets the account holder cancel. Hand it to a person below." },
      { beat: "until", signal: "otp" },
    ],
  ],

  "long-session": [
    [
      { beat: "say", text: "Picking up where we left off — here's the next section of the report." },
      { beat: "suggest", items: ["What model and tools do you have?"] },
    ],
    [
      { beat: "say", text: "Happy to say — see \"About this agent\" for the full profile." },
      { beat: "suggest", items: ["Remind me to call the vendor tomorrow"] },
    ],
    [{ beat: "say", text: "Reminder set for tomorrow: call the vendor." }],
  ],
};

const MOCK_MODEL = "steady";

const MOCK_PRICED_MODEL = "anthropic/claude-sonnet-4";

function startUsage(conversation: ConversationId | undefined): ContextUsage | undefined {
  if (!conversation) return undefined;
  const used = conversation === "long-session" ? 82_000 : 8_000;
  const outputTokens = Math.round(used * 0.28);
  return { usedTokens: used, maxTokens: 100_000, inputTokens: used - outputTokens, outputTokens, modelId: MOCK_PRICED_MODEL };
}

const CHUNK = 3;
const CHAR_MS = 12;
const THINK_MS = 420;
const REASON_STEP_MS = 120;
// Long enough for the image blur to visibly clear.
const IMAGE_STAGE_MS = 1200;

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const id = setTimeout(resolve, Math.max(0, ms));
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });

export type MockTransportOptions = {
  latency?: number;
  capabilities?: Partial<AgentTransport["capabilities"]>;
  conversation?: ConversationId;
  speed?: number;
};

type Signal = "approve" | "resume" | "verify" | "otp";

type ImageAttachment = Attachment & { stage: ImageStage };

export type MockAgentTransport = AgentTransport & {
  lastSettings?: SendOptions["settings"];
};

function updateRunningToolAttachment(turns: AgentTurn[], name: string, attachment: ImageAttachment): AgentTurn[] {
  for (let i = turns.length - 1; i >= 0; i -= 1) {
    const turn = turns[i];
    if (turn.kind === "tool" && turn.name === name && turn.status === "running") {
      const next = turns.slice();
      next[i] = { ...turn, attachments: [attachment] };
      return next;
    }
  }
  return turns;
}

export function useMockTransport(options: MockTransportOptions = {}): MockAgentTransport {
  const { latency = THINK_MS, conversation, speed = 1 } = options;

  const [turns, setTurns] = useState<AgentTurn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [runState, setRunState] = useState<RunState>(EMPTY_RUN_STATE);
  const [lastSettings, setLastSettings] = useState<SendOptions["settings"] | undefined>(undefined);
  const [usage, setUsage] = useState<ContextUsage | undefined>(() => startUsage(conversation));
  const turnsRef = useRef<AgentTurn[]>([]);
  const [restorePoints, setRestorePoints] = useState<Checkpoint[]>([]);

  const abortRef = useRef<AbortController | null>(null);
  const askCount = useRef(0);
  const imageSeq = useRef(0);
  const queueSeq = useRef(0);
  const runEventSeq = useRef(0);
  const beatIndexRef = useRef(0);
  const fatalRetriedRef = useRef(false);
  const crashRetriedRef = useRef(false);
  const modelRef = useRef(MOCK_MODEL);
  const restoreTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const runStateRef = useRef(runState);
  const highRiskRef = useRef<string | null>(null);
  const waitersRef = useRef<Partial<Record<Signal, ((value: boolean) => void)[]>>>({});
  const cancelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emit = useCallback(
    (event: AgentEvent) => {
      setTurns((prev) => {
        const next = reduceEvent(prev, event);
        return conversation
          ? next.map((t) => (t.kind === "text" && !t.model ? { ...t, model: modelRef.current } : t))
          : next;
      });
    },
    [conversation],
  );

  const emitRun = useCallback((partial: DistributiveOmit<RunEvent, "eventId" | "at">) => {
    const event = { ...partial, eventId: `run-evt-${(runEventSeq.current += 1)}`, at: Date.now() } as RunEvent;
    const next = reduceRunEvent(runStateRef.current, event);
    runStateRef.current = next;
    setRunState(next);
    return event;
  }, []);

  // Holds an answer that arrives before its wait so the next wait takes it at once.
  const earlyRef = useRef<Partial<Record<Signal, boolean>>>({});

  const waitSignal = useCallback(
    (signal: Signal) =>
      new Promise<boolean>((resolve) => {
        const early = earlyRef.current[signal];
        if (early !== undefined) {
          delete earlyRef.current[signal];
          resolve(early);
          return;
        }
        const list = waitersRef.current[signal] ?? [];
        waitersRef.current[signal] = [...list, resolve];
      }),
    [],
  );

  const resolveSignal = useCallback(
    (signal: Signal, value: boolean) => {
      const list = waitersRef.current[signal];
      if (!list || list.length === 0) {
        if (conversation) earlyRef.current[signal] = value;
        return;
      }
      const [next, ...rest] = list;
      waitersRef.current[signal] = rest;
      next(value);
    },
    [conversation],
  );

  const stream = useCallback(
    async (text: string, signal: AbortSignal, scale = 1) => {
      for (let i = 0; i < text.length; i += CHUNK) {
        await sleep((CHAR_MS * CHUNK) / scale, signal);
        emit({ type: "text", content: text.slice(i, i + CHUNK) });
      }
    },
    [emit],
  );

  const askPermission = useCallback(
    (turnId: string, action: string, params: Record<string, unknown>) =>
      new Promise<boolean>((resolve) => {
        const settle = (approved: boolean) => {
          setPendingApprovals((prev) => prev.filter((p) => p.turnId !== turnId));
          setTurns((prev) => markApproval(prev, turnId, approved ? "approved" : "rejected"));
          resolve(approved);
        };
        setTurns((prev) => markApproval(prev, turnId, "pending"));
        setPendingApprovals((prev) => [
          ...prev,
          { turnId, action, params, approve: () => settle(true), reject: () => settle(false) },
        ]);
      }),
    [],
  );

  const runImageBeat = useCallback(
    async (beat: Extract<Beat, { beat: "image" }>, signal: AbortSignal, scale: number) => {
      const attachmentId = `mock-image-${(imageSeq.current += 1)}`;
      const name = "generated-image.png";
      emit({ type: "tool_call", name: "generate_image", parameters: {} });

      const stages = beat.stages;
      for (let i = 0; i < stages.length - 1; i += 1) {
        await sleep(IMAGE_STAGE_MS / scale, signal);
        if (signal.aborted) return;
        const stage = stages[i];
        if (conversation) emit({ type: "tool_progress", name: "generate_image", partial: { kind: "image", stage } });
        setTurns((prev) =>
          updateRunningToolAttachment(prev, "generate_image", {
            id: attachmentId, name, mime: conversation ? "image/svg+xml" : "image/png", kind: "image", size: 0, stage,
            ...(conversation && stage !== "error" ? { url: heroImageUrl() } : {}),
          }),
        );
      }
      await sleep(IMAGE_STAGE_MS / scale, signal);
      if (signal.aborted) return;

      const finalStage = stages[stages.length - 1];
      const success = finalStage !== "error";
      const finalAttachment: ImageAttachment = {
        id: attachmentId, name, mime: conversation ? "image/svg+xml" : "image/png", kind: "image", size: success ? 48_210 : 0,
        ...(conversation && success ? { url: heroImageUrl() } : {}),
        delivery: { sent: "produced" }, stage: finalStage,
      };
      emit({
        type: "tool_result",
        name: "generate_image",
        result: success ? { success: true, result: { stage: finalStage } } : { success: false, error: "The image could not be generated." },
        attachments: [finalAttachment],
      });
    },
    [emit, conversation],
  );

  const runBeat = useCallback(
    async (beat: Beat, signal: AbortSignal, scale: number) => {
      switch (beat.beat) {
        case "say":
          await stream(beat.text, signal, scale);
          return;

        case "tool": {
          emit({ type: "tool_call", name: beat.name, parameters: beat.params });
          let elapsed = 0;
          for (const step of beat.progress ?? []) {
            await sleep(Math.max(0, step.at - elapsed) / scale, signal);
            if (signal.aborted) return;
            elapsed = step.at;
            emit({ type: "tool_progress", name: beat.name, partial: step.partial });
          }
          await sleep(Math.max(0, beat.ms - elapsed) / scale, signal);
          const resultShape = beat.result as { success?: boolean; error?: string } | undefined;
          const ok = resultShape?.success !== false;
          emit({
            type: "tool_result",
            name: beat.name,
            result: ok
              ? { success: true, result: beat.result }
              : {
                  success: false,
                  error: resultShape?.error ?? "Upstream returned no data.",
                  ...(conversation && (beat.result as { kind?: string })?.kind ? { result: beat.result } : {}),
                },
            ...(beat.attachments ? { attachments: beat.attachments } : {}),
          });
          return;
        }

        case "ask": {
          const correlationId = `mock-${beat.action}-${(askCount.current += 1)}`;
          emit({ type: "action_request", correlationId, action: beat.action, parameters: beat.params });

          const highRisk = beat.params.risk === "high";
          let approved: boolean;
          if (highRisk) {
            setTurns((prev) => markApproval(prev, correlationId, "pending"));
            highRiskRef.current = correlationId;
            setPendingApprovals((prev) => [
              ...prev,
              {
                turnId: correlationId,
                action: beat.action,
                params: beat.params,
                approve: () => {},
                reject: () => {
                  setPendingApprovals((p) => p.filter((x) => x.turnId !== correlationId));
                  setTurns((p) => markApproval(p, correlationId, "rejected"));
                  highRiskRef.current = null;
                  resolveSignal("otp", false);
                },
              },
            ]);
            approved = await waitSignal("otp");
          } else {
            approved = await askPermission(correlationId, beat.action, beat.params);
          }

          setTurns((prev) =>
            settleAction(prev, beat.action, approved ? { success: true } : { success: false, error: "Declined." }),
          );
          await stream(
            approved
              ? (beat.onApprove ?? "\n\nDone — it is on hold under your name for 24 hours.")
              : (beat.onReject ?? "\n\nUnderstood, nothing was bought. Say the word if you change your mind."),
            signal,
            scale,
          );
          return;
        }

        case "fail": {
          emit({ type: "error", error: beat.error, fatal: beat.fatal ?? false });
          if (beat.fatal) setError(new Error(beat.error));
          return;
        }

        case "reason": {
          for (const step of beat.steps) {
            emit({ type: "reasoning", step });
            await sleep(REASON_STEP_MS / scale, signal);
          }
          emit({ type: "reasoning_done", ms: beat.steps.length * REASON_STEP_MS });
          return;
        }

        case "sources":
          emit({ type: "sources", sources: beat.sources });
          return;

        case "confidence":
          emit({ type: "confidence", confidence: beat.confidence });
          return;

        case "suggest":
          emit({ type: "suggestions", items: beat.items });
          return;

        case "run":
          emitRun(beat.event);
          return;

        case "wait": {
          // Short waits are floored above the poll interval; waits of 1s or more are not scaled.
          const floor = beat.ms >= 1000 ? beat.ms : 80;
          await sleep(Math.max(beat.ms / scale, floor), signal);
          return;
        }

        case "until":
          await waitSignal(beat.signal);
          return;

        case "pausePoint": {
          await sleep(Math.max(beat.ms / scale, beat.ms >= 1000 ? beat.ms : 80), signal);
          while (runStateRef.current.run?.status === "paused") await waitSignal("resume");
          return;
        }

        case "image":
          await runImageBeat(beat, signal, scale);
          return;
      }
    },
    [askPermission, conversation, emit, emitRun, resolveSignal, runImageBeat, stream, waitSignal],
  );

  const send = useCallback(
    async (text: string, sendOptions?: SendOptions) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const { signal } = controller;

      setError(null);
      setIsLoading(true);
      setLastSettings(sendOptions?.settings);
      earlyRef.current = {};
      modelRef.current = sendOptions?.model ?? MOCK_MODEL;
      const thisUserTurn = userTurn(text, sendOptions?.attachments);
      setTurns((prev) => [...prev, thisUserTurn]);

      const scale = conversation ? Math.max(speed, 0.001) : 1;

      try {
        await sleep(latency / scale, signal);

        const beatNumber = beatIndexRef.current;
        const conversationScript = conversation
          ? CONVERSATION_SCRIPTS[conversation][Math.min(beatNumber, CONVERSATION_SCRIPTS[conversation].length - 1)]
          : undefined;
        const script = conversation ? conversationScript : scriptFor(text, sendOptions);
        const beats = typeof script === "function" ? script(sendOptions) : (script ?? []);
        if (conversation) beatIndexRef.current = beatNumber + 1;
        if (conversation) {
          setUsage((prev) => {
            if (!prev) return prev;
            const usedTokens = Math.min(prev.maxTokens, prev.usedTokens + 9_000);
            const grown = usedTokens - prev.usedTokens;
            const written = Math.round(grown * 0.28);
            return {
              ...prev,
              usedTokens,
              inputTokens: (prev.inputTokens ?? 0) + grown - written,
              outputTokens: (prev.outputTokens ?? 0) + written,
            };
          });
        }

        for (const beat of beats) {
          if (signal.aborted) break;
          if (conversation && runStateRef.current.run?.status === "cancelled") break;

          if (beat.beat === "checkpoint") {
            setRestorePoints((prev) => [
              ...prev,
              { id: `cp-chat-${prev.length + 1}`, label: beat.label, turnId: thisUserTurn.id, at: Date.now() },
            ]);
            continue;
          }

          // "$userTurn" stands in for the id of the user turn just sent.
          const resolvedBeat =
            beat.beat === "run" && beat.event.type === "checkpoint" && beat.event.checkpoint.turnId === "$userTurn"
              ? { ...beat, event: { ...beat.event, checkpoint: { ...beat.event.checkpoint, turnId: thisUserTurn.id } } }
              : beat;
          await runBeat(resolvedBeat, signal, scale);
          if (conversation && runStateRef.current.run?.status === "cancelled") break;
        }

        if (!signal.aborted) emit({ type: "done" });
      } catch (cause) {
        if ((cause as DOMException)?.name !== "AbortError") {
          const failure = cause instanceof Error ? cause : new Error(String(cause));
          setError(failure);
          emit({ type: "error", error: failure.message, fatal: true });
        }
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
          setIsLoading(false);
        }
      }
    },
    [emit, latency, runBeat, conversation, speed],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (cancelTimeoutRef.current) {
      clearTimeout(cancelTimeoutRef.current);
      cancelTimeoutRef.current = null;
    }
    setTurns([]);
    setPendingApprovals([]);
    setError(null);
    setIsLoading(false);
    runStateRef.current = EMPTY_RUN_STATE;
    setRunState(EMPTY_RUN_STATE);
    highRiskRef.current = null;
    waitersRef.current = {};
    beatIndexRef.current = 0;
    fatalRetriedRef.current = false;
    crashRetriedRef.current = false;
    restoreTimersRef.current.forEach(clearTimeout);
    restoreTimersRef.current = [];
    setRestorePoints([]);
    setUsage(startUsage(conversation));
  }, [conversation]);

  useEffect(() => {
    turnsRef.current = turns;
  }, [turns]);

  useEffect(() => {
    return () => {
      if (cancelTimeoutRef.current) clearTimeout(cancelTimeoutRef.current);
      restoreTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  const restore = useCallback((messages: RestoredMessage[]) => {
    setTurns(
      messages.map((m, i) =>
        m.role === "user"
          ? { kind: "user", id: `restored-${i}`, text: m.content }
          : { kind: "text", id: `restored-${i}`, text: m.content },
      ),
    );
  }, []);

  const approvePlan = useCallback(
    (version: number, plan?: PlanStep[]) => {
      const run = runStateRef.current.run;
      if (!run) return;
      if (plan) emitRun({ type: "plan_edited", version, plan });
      emitRun({ type: "plan_approved", version });
      if (runStateRef.current.run?.status === "running") resolveSignal("approve", true);
    },
    [emitRun, resolveSignal],
  );

  const pause = useCallback(() => {
    if (!runStateRef.current.run) return;
    emitRun({ type: "run_status", status: "paused" });
  }, [emitRun]);

  const resume = useCallback(
    (checkpointId?: string) => {
      const run = runStateRef.current.run;
      if (!run) return;
      const checkpoint = checkpointId ? run.checkpoints.find((c) => c.id === checkpointId) : undefined;
      const rerun = checkpoint ? stepsAfterCheckpoint(run, checkpoint.id) : [];
      emitRun({ type: "run_status", status: "running", resumeFrom: checkpointId });
      resolveSignal("resume", true);
      if (conversation && checkpoint) {
        setTurns((prev) => [
          ...prev,
          {
            kind: "text",
            id: `restored-${prev.length}`,
            text: `Restored to "${checkpoint.label}" — the steps after it are running again.`,
            streaming: false,
            at: Date.now(),
            model: modelRef.current,
          },
        ]);
        const timers = restoreTimersRef.current;
        rerun.forEach((stepId, i) => {
          timers.push(setTimeout(() => emitRun({ type: "step_status", stepId, status: "running" }), (2 * i + 1) * 40));
          timers.push(setTimeout(() => emitRun({ type: "step_status", stepId, status: "done", ms: 40 }), (2 * i + 2) * 40));
        });
        timers.push(setTimeout(() => emitRun({ type: "run_status", status: "completed" }), (2 * rerun.length + 3) * 40));
      }
    },
    [conversation, emitRun, resolveSignal],
  );

  const cancel = useCallback(() => {
    const run = runStateRef.current.run;
    if (!run || run.status === "cancelled" || run.status === "completed") return;
    emitRun({ type: "run_status", status: "cancelling" });
    const runningStep = run.plan.find((p) => p.status === "running");
    if (runningStep) {
      // Fixed delay, not scaled by speed: long enough to see the stopping state.
      cancelTimeoutRef.current = setTimeout(() => {
        cancelTimeoutRef.current = null;
        emitRun({ type: "step_status", stepId: runningStep.id, status: conversation ? "skipped" : "done", ms: 0 });
      }, 400);
    } else {
      emitRun({ type: "run_status", status: "cancelled" });
    }
  }, [emitRun, conversation]);

  const skipStep = useCallback((stepId: string) => emitRun({ type: "step_status", stepId, status: "skipped" }), [emitRun]);

  const retryStep = useCallback(
    (stepId: string) => {
      emitRun({ type: "step_status", stepId, status: "running" });
      setTimeout(() => emitRun({ type: "step_status", stepId, status: "done", ms: 200 }), 60);
    },
    [emitRun],
  );

  const retryEffect = useCallback(
    (effectId: string) => {
      const run = runStateRef.current.run;
      const effect = run?.effects.find((f) => f.id === effectId);
      if (!effect) return;
      const retried: Omit<Effect, "status"> = {
        id: effect.id, stepId: effect.stepId, description: effect.description, target: effect.target, reversible: effect.reversible,
      };
      emitRun({ type: "effect", outcome: "committed", effect: retried });
      const stillFailed = run?.effects.some((f) => f.id !== effectId && f.status === "failed");
      if (run?.plan.some((p) => p.id === effect.stepId && p.status === "failed")) {
        emitRun({ type: "step_status", stepId: effect.stepId, status: "done" });
      }
      if (!stillFailed && run?.status === "partially_failed") {
        emitRun({ type: "run_status", status: "completed" });
      }
    },
    [emitRun],
  );

  const compensate = useCallback(() => {
    const run = runStateRef.current.run;
    if (!run) return;
    emitRun({ type: "run_status", status: "compensating" });
    const { reverse } = compensationOrder(run);
    if (reverse.length === 0) {
      emitRun({ type: "run_status", status: "compensated" });
      return;
    }
    reverse.forEach((effect, i) => {
      setTimeout(
        () => {
          emitRun({
            type: "effect", outcome: "reversed",
            effect: { id: effect.id, stepId: effect.stepId, description: effect.description, target: effect.target, reversible: effect.reversible },
          });
          if (i === reverse.length - 1) emitRun({ type: "run_status", status: "compensated" });
        },
        (i + 1) * 40,
      );
    });
  }, [emitRun]);

  const handoff = useCallback(
    (note?: string, owner?: string) => {
      const run = runStateRef.current.run;
      if (!run) return;
      const handoffState: Handoff = {
        owner,
        goal: run.goal,
        done: run.plan.filter((p) => p.status === "done").map((p) => p.title),
        failed: run.plan.filter((p) => p.status === "failed").map((p) => p.title),
        unknown: run.plan.filter((p) => p.status === "pending" || p.status === "running").map((p) => p.title),
        note,
      };
      emitRun({ type: "handoff", handoff: handoffState });
      resolveSignal("otp", true);
    },
    [emitRun, resolveSignal],
  );

  const summarise = useCallback(async () => {
    setUsage((u) => (u ? { ...u, usedTokens: Math.round(u.maxTokens * 0.2) } : u));
    setTurns((prev) => {
      const pending = [...prev].reverse().find((t): t is TextTurn => t.kind === "text")?.suggestions;
      return [
        ...prev,
        { kind: "text", id: `summary-${prev.length}`, text: "Summary: we have been drafting the quarterly report; the outline and the vendor notes are kept, older detail is condensed.", streaming: false, at: Date.now(), model: modelRef.current, ...(pending?.length ? { suggestions: pending } : {}) },
      ];
    });
  }, []);

  const transcribe = useCallback(async (audio: Blob) => {
    await sleep(Math.min(600, 200 + audio.size / 1000));
    return "Remind me to call the vendor tomorrow at ten.";
  }, []);

  const restoreTo = useCallback((turnId: string) => {
    setTurns((prev) => {
      const idx = prev.findIndex((t) => t.id === turnId);
      return idx === -1 ? prev : prev.slice(0, idx + 1);
    });
    setRestorePoints((prev) => {
      const idx = prev.findIndex((c) => c.turnId === turnId);
      return idx === -1 ? prev : prev.slice(0, idx + 1);
    });
  }, []);

  const verifyStep = useCallback(
    (stepId: string) => {
      emitRun({ type: "step_status", stepId, status: "done", confidence: "high", ms: 150 });
      resolveSignal("verify", true);
    },
    [emitRun, resolveSignal],
  );

  const approveWithCode = useCallback(
    (code: string): boolean => {
      const turnId = highRiskRef.current;
      // "000000" is the one rejected code.
      if (!turnId || !/^\d{6}$/.test(code) || code === "000000") return false;
      setPendingApprovals((prev) => prev.filter((p) => p.turnId !== turnId));
      setTurns((prev) => markApproval(prev, turnId, "approved"));
      highRiskRef.current = null;
      resolveSignal("otp", true);
      return true;
    },
    [resolveSignal],
  );

  const enqueue = useCallback(
    (text: string, sendOptions?: SendOptions) => {
      const run = runStateRef.current.run;
      if (!run) return;
      const item: QueueItem = {
        id: `q-${(queueSeq.current += 1)}`, text, attachments: sendOptions?.attachments, model: sendOptions?.model, at: Date.now(),
      };
      emitRun({ type: "queue", queue: [...run.queue, item] });
    },
    [emitRun],
  );

  const reorderQueue = useCallback(
    (ids: string[]) => {
      const run = runStateRef.current.run;
      if (!run) return;
      const byId = new Map(run.queue.map((q) => [q.id, q]));
      const reordered = ids.map((id) => byId.get(id)).filter((q): q is QueueItem => Boolean(q));
      emitRun({ type: "queue", queue: reordered });
    },
    [emitRun],
  );

  const dequeue = useCallback(
    (id: string) => {
      const run = runStateRef.current.run;
      if (!run) return;
      emitRun({ type: "queue", queue: run.queue.filter((q) => q.id !== id) });
    },
    [emitRun],
  );

  const sendQueuedNow = useCallback(
    (id: string) => {
      const run = runStateRef.current.run;
      const item = run?.queue.find((q) => q.id === id);
      if (!run || !item) return;
      emitRun({ type: "queue", queue: run.queue.filter((q) => q.id !== id) });
      void send(item.text, { attachments: item.attachments, model: item.model });
    },
    [emitRun, send],
  );

  const editMessage = useCallback(
    async (turnId: string, text: string) => {
      setTurns((prev) =>
        prev.map((t) => {
          if (t.kind !== "user" || t.id !== turnId) return t;
          const user = t as UserTurn;
          const versions = user.versions?.length ? user.versions : [{ id: `${turnId}-v1`, text: user.text }];
          const nextVersions = [...versions, { id: `${turnId}-v${versions.length + 1}`, text }];
          return { ...user, text, versions: nextVersions, activeVersion: nextVersions.length - 1 };
        }),
      );
      await sleep(THINK_MS / (conversation ? Math.max(speed, 0.001) : 1));
      setTurns((prev) => {
        const idx = prev.findIndex((t) => t.id === turnId);
        const replyIdx = idx + 1;
        const altText = `Updated — here's the answer to the edited message: "${text}"`;
        if (idx === -1 || !prev[replyIdx] || prev[replyIdx].kind !== "text") {
          return [...prev, { kind: "text", id: `${turnId}-reply-${prev.length}`, text: altText, streaming: false, at: Date.now(), ...(conversation ? { model: modelRef.current } : {}) }];
        }
        const reply = prev[replyIdx] as TextTurn;
        const regenerations = reply.regenerations?.length ? reply.regenerations : [{ id: `${reply.id}-r1`, text: reply.text }];
        const nextRegenerations = [...regenerations, { id: `${reply.id}-r${regenerations.length + 1}`, text: altText }];
        const next = prev.slice();
        next[replyIdx] = { ...reply, text: altText, regenerations: nextRegenerations, activeVersion: nextRegenerations.length - 1 };
        return next;
      });
    },
    [conversation, speed],
  );

  const regenerate = useCallback(
    async (turnId: string) => {
      await sleep(THINK_MS / (conversation ? Math.max(speed, 0.001) : 1));
      if (conversation === "recovery" && !fatalRetriedRef.current && error) {
        fatalRetriedRef.current = true;
        setError(null);
        setTurns((prev) => [
          ...prev.filter((t) => t.kind !== "error"),
          { kind: "text", id: `retry-${prev.length}`, text: "It worked this time — the index is rebuilt.", streaming: false, at: Date.now(), model: modelRef.current, suggestions: ["Cancel my flight booking"] },
        ]);
        return;
      }
      if (conversation === "tools" && !crashRetriedRef.current && turnsRef.current.some((t) => t.kind === "tool" && t.name === "run_migration" && t.status === "error")) {
        crashRetriedRef.current = true;
        emit({ type: "tool_call", name: "run_migration", parameters: { direction: "up" } });
        await sleep(300 / Math.max(speed, 0.001));
        emit({
          type: "tool_result",
          name: "run_migration",
          result: { success: true, result: { kind: "terminal", command: "npm run migrate", output: "Applied 3 migrations." + String.fromCharCode(10), exitCode: 0 } },
        });
        emit({ type: "text", content: "The migration ran cleanly this time." });
        emit({ type: "suggestions", items: ["Make a hero image for the release"] });
        emit({ type: "done" });
        return;
      }
      setTurns((prev) => {
        const idx = prev.findIndex((t) => t.id === turnId);
        if (idx === -1 || prev[idx].kind !== "text") return prev;
        const turn = prev[idx] as TextTurn;
        const regenerations = turn.regenerations?.length ? turn.regenerations : [{ id: `${turnId}-r1`, text: turn.text }];
        const altText = `Here's another way to put it — take ${regenerations.length + 1}.`;
        const nextRegenerations = [...regenerations, { id: `${turnId}-r${regenerations.length + 1}`, text: altText }];
        const next = prev.slice();
        next[idx] = { ...turn, text: altText, regenerations: nextRegenerations, activeVersion: nextRegenerations.length - 1 };
        return next;
      });
    },
    [conversation, emit, speed, error],
  );

  const selectBranch = useCallback((turnId: string, index: number) => {
    setTurns((prev) => {
      const userIdx = prev.findIndex((t) => t.id === turnId && t.kind === "user");
      const pairedReply = !conversation || userIdx === -1 ? -1 : prev.findIndex((t, i) => i > userIdx && t.kind === "text");
      return prev.map((t, i) => {
        if (t.id === turnId && t.kind === "user" && t.versions?.[index]) return { ...t, text: t.versions[index].text, activeVersion: index };
        if (t.id === turnId && t.kind === "text" && t.regenerations?.[index]) return { ...t, text: t.regenerations[index].text, activeVersion: index };
        if (i === pairedReply && t.kind === "text" && t.regenerations?.[index]) {
          return { ...t, text: t.regenerations[index].text, activeVersion: index };
        }
        return t;
      });
    });
  }, [conversation]);

  const capabilities = useMemo(
    () => ({
      attachments: "content" as const,
      models: true,
      approvals: true,
      plans: true,
      pause: true,
      checkpoints: true,
      queue: true,
      compensation: true,
      handoff: true,
      branching: true,
      sources: true,
      ...(conversation ? { settings: true, effects: true } : {}),
      ...options.capabilities,
    }),
    [options.capabilities, conversation],
  );

  return {
    turns,
    send,
    abort,
    reset,
    restore,
    isLoading,
    error,
    isReady: true,
    pendingApprovals,
    capabilities,
    runState,
    approvePlan,
    pause,
    resume,
    cancel,
    skipStep,
    retryStep,
    retryEffect,
    compensate,
    handoff,
    enqueue,
    reorderQueue,
    dequeue,
    sendQueuedNow,
    editMessage,
    regenerate,
    selectBranch,
    verifyStep,
    approveWithCode,
    lastSettings,
    ...(conversation
      ? { usage, summarise, restoreTo, restorePoints, transcribe, agent: AGENT_PROFILE }
      : {}),
  };
}
