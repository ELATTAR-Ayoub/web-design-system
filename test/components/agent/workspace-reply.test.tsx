/**
 * @covers agent-workspace
 *
 * `WorkspaceReply` / `WorkspaceUserMessage` — one reply, composed from AI
 * Elements. Every test builds a plain fake transport; nothing here knows the
 * mock conversations.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { toast } from "sonner";

import { groupReplies } from "@/components/agent/workspace/reply-model";
import type { OpenInTarget } from "@/components/ai-elements/open-in-chat";
import { WorkspaceReply, WorkspaceUserMessage, linkCitations } from "@/components/agent/workspace/workspace-reply";
import { EMPTY_RUN_STATE } from "@/components/agent/core/run";
import type { Run } from "@/components/agent/core/run";
import type {
  ActionTurn,
  AgentTransport,
  AgentTurn,
  Attachment,
  PendingApproval,
  Source,
  TextTurn,
  ToolTurn,
  TransportCapabilities,
  UserTurn,
} from "@/components/agent/core/types";
import type { ToolOutput } from "@/components/agent/workspace/tool-output";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
// khroma (mermaid's colour library) is incomplete in this shared install, so the
// one plugin that pulls it in is stubbed; streamdown itself stays real so the
// citation / code / snippet overrides are exercised.
vi.mock("@streamdown/mermaid", () => ({ mermaid: {} }));
// media-chrome's store attaches to a real HTMLMediaElement, which jsdom lacks —
// the same boundary mock test/components/ai-elements/audio-player.test.tsx uses.
vi.mock("media-chrome/react", () => {
  const el = (tag: string) => {
    const Comp = ({ children, ...rest }: Record<string, unknown>) => {
      delete rest.seekOffset;
      delete rest.audio;
      return createElement(tag, rest, children as never);
    };
    return Comp;
  };
  return {
    MediaController: el("div"),
    MediaControlBar: el("div"),
    MediaPlayButton: el("button"),
    MediaSeekBackwardButton: el("button"),
    MediaSeekForwardButton: el("button"),
    MediaMuteButton: el("button"),
    MediaTimeDisplay: el("span"),
    MediaDurationDisplay: el("span"),
    MediaTimeRange: el("div"),
    MediaVolumeRange: el("div"),
  };
});
vi.mock("@/components/agent/workspace/run-inline", () => ({
  RunInline: ({ run }: { run: Run }) => <div data-testid="run-inline">{run.goal}</div>,
  RunQueue: () => null,
}));

const caps: TransportCapabilities = { attachments: "none", models: false, approvals: true, branching: true };

function makeTransport(overrides: Partial<AgentTransport> = {}): AgentTransport {
  return {
    turns: [],
    send: vi.fn(),
    abort: vi.fn(),
    reset: vi.fn(),
    isLoading: false,
    error: null,
    isReady: true,
    pendingApprovals: [],
    capabilities: caps,
    runState: EMPTY_RUN_STATE,
    ...overrides,
  };
}

const user: UserTurn = { kind: "user", id: "u1", text: "What changed?", at: 1 };
const text = (id: string, t: string, extra: Partial<TextTurn> = {}): TextTurn => ({ kind: "text", id, text: t, at: 2, ...extra });
const tool = (id: string, extra: Partial<ToolTurn> = {}): ToolTurn => ({
  kind: "tool",
  id,
  name: "lookup",
  params: { q: "x" },
  status: "ok",
  startedAt: 0,
  attempt: 1,
  ...extra,
});
const action = (id: string, extra: Partial<ActionTurn> = {}): ActionTurn => ({
  kind: "action",
  id,
  action: "send_email",
  params: {},
  status: "running",
  startedAt: 0,
  ...extra,
});

type Opts = {
  turns: AgentTurn[];
  busy?: boolean;
  isLast?: boolean;
  transport?: Partial<AgentTransport>;
  onSend?: (t: string) => void;
  speak?: (t: string) => Promise<string>;
  composerEmpty?: boolean;
  run?: Run | null;
  openIn?: OpenInTarget[];
};

function renderReply({ turns, busy = false, isLast = true, transport, onSend = vi.fn(), speak, composerEmpty, run, openIn }: Opts) {
  const all: AgentTurn[] = [user, ...turns];
  const t = makeTransport({ turns: all, ...transport });
  const pair = groupReplies(all, busy)[0];
  const utils = render(
    <WorkspaceReply
      busy={busy}
      composerEmpty={composerEmpty}
      isLast={isLast}
      onSend={onSend}
      openIn={openIn}
      reply={pair.reply}
      run={run}
      speak={speak}
      transport={t}
      user={user}
    />,
  );
  return { ...utils, transport: t, onSend };
}

const out = (o: ToolOutput) => o;

/** Open the chain of thought if the reply did not open it itself. */
function openChain() {
  const header = screen.getByRole("button", { name: /Worked through|Working/ });
  if (header.getAttribute("aria-expanded") !== "true") fireEvent.click(header);
}

beforeEach(() => {
  document.documentElement.style.setProperty("--duration-fast", "150ms");
  vi.clearAllMocks();
});
afterEach(() => {
  vi.useRealTimers();
});

describe("WorkspaceReply — reasoning and steps", () => {
  it("thinking with no tool steps is a Reasoning block, its duration from reasoning.ms", () => {
    renderReply({ turns: [text("t1", "Done.", { reasoning: { steps: ["Look at the diff", "Summarise it"], ms: 2400 } })] });
    expect(screen.getByRole("button", { name: /Thought for 3 seconds/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Worked through/ })).not.toBeInTheDocument();
  });

  it("a reply that uses tools is a ChainOfThought, one step per tool, reasoning steps first", () => {
    renderReply({
      turns: [
        text("t1", "All set.", { reasoning: { steps: ["Plan the lookup"] } }),
        tool("a", { name: "lookup" }),
        tool("b", { name: "summarise" }),
      ],
    });
    expect(screen.getByRole("button", { name: /Worked through 3 steps/ })).toBeInTheDocument();
    openChain();
    expect(screen.getByText("Plan the lookup")).toBeInTheDocument();
    expect(screen.getByText("lookup")).toBeInTheDocument();
    expect(screen.getByText("summarise")).toBeInTheDocument();
    // Reasoning steps open the chain.
    expect(screen.queryByRole("button", { name: /Thought for/ })).not.toBeInTheDocument();
  });

  it("search steps show their results as chips, linked to the page", () => {
    const search = out({
      kind: "search",
      query: "design tokens",
      results: [{ title: "Tokens guide", url: "https://example.com/tokens", domain: "example.com" }],
    });
    renderReply({ turns: [tool("s", { name: "web_search", result: search }), text("t", "Found it.")] });
    openChain();
    expect(screen.getByText(/Searched for “design tokens”/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "example.com" })).toHaveAttribute("href", "https://example.com/tokens");
  });

  it.each([
    ["running", { status: "running" as const }, "Running"],
    ["ok", { status: "ok" as const }, "Completed"],
    ["error", { status: "error" as const, error: "boom" }, "Error"],
  ])("a %s tool shows the %s state", (_n, extra, label) => {
    renderReply({ turns: [tool("a", extra)] });
    openChain();
    // An errored tool opens itself, so its "Error" label shows beside the badge.
    expect(screen.getAllByText(label).length).toBeGreaterThan(0);
  });

  it("a gated action's states are Awaiting Approval, Responded and Denied", () => {
    const { rerender, transport } = renderReply({ turns: [action("g", { approval: "pending" })] });
    expect(screen.getByText("Awaiting Approval")).toBeInTheDocument();
    const next = (a: ActionTurn) => {
      const all: AgentTurn[] = [user, a];
      rerender(
        <WorkspaceReply
          busy={false}
          isLast
          onSend={vi.fn()}
          reply={groupReplies(all, false)[0].reply}
          transport={{ ...transport, turns: all }}
          user={user}
        />,
      );
    };
    next(action("g", { approval: "approved", status: "running" }));
    openChain();
    expect(screen.getByText("Responded")).toBeInTheDocument();
    next(action("g", { approval: "rejected", status: "error", error: "Not today" }));
    openChain();
    expect(screen.getByText("Denied")).toBeInTheDocument();
  });

  it("a failed tool and its retry show as two attempts", () => {
    renderReply({
      turns: [
        tool("a", { name: "fetch", status: "error", error: "timeout", attempt: 1 }),
        tool("b", { name: "fetch", status: "ok", attempt: 2 }),
      ],
    });
    openChain();
    expect(screen.getByText("fetch · attempt 2")).toBeInTheDocument();
    expect(screen.getAllByText("Error").length).toBeGreaterThan(0);
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("timeout")).toBeInTheDocument();
  });
});

describe("WorkspaceReply — approvals", () => {
  const entry = (turnId: string) => ({
    turnId,
    action: "send_email",
    params: {},
    approve: vi.fn<PendingApproval["approve"]>(),
    reject: vi.fn<PendingApproval["reject"]>(),
  });

  it("Approve and Reject call the matching pending approval", async () => {
    const e = entry("g");
    renderReply({ turns: [action("g", { approval: "pending" })], transport: { pendingApprovals: [e] } });
    expect(screen.getByText("Allow the agent to send email?")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(e.approve).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Reject" }));
    expect(e.reject).toHaveBeenCalledTimes(1);
  });

  it("a high-risk action asks for a code: wrong shows an error and clears the field, right is accepted", async () => {
    const approveWithCode = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    renderReply({
      turns: [action("g", { approval: "pending", params: { risk: "high" } })],
      transport: { pendingApprovals: [entry("g")], approveWithCode },
    });
    const field = screen.getByLabelText("Approval code");
    const approve = screen.getByRole("button", { name: "Approve" });
    expect(approve).toBeDisabled();

    await userEvent.type(field, "0000");
    await userEvent.click(approve);
    expect(approveWithCode).toHaveBeenCalledWith("0000");
    expect(await screen.findByText(/That code isn't right/)).toBeInTheDocument();
    expect(field).toHaveValue("");
    expect(field).toHaveAttribute("aria-invalid", "true");

    await userEvent.type(field, "4821");
    expect(screen.queryByText(/That code isn't right/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(approveWithCode).toHaveBeenLastCalledWith("4821");
    await waitFor(() => expect(screen.queryByText(/That code isn't right/)).not.toBeInTheDocument());
  });

  it("an expired or stale approval renders as rejected, with its reason", () => {
    renderReply({
      turns: [action("g", { approval: "rejected", status: "error", error: "The approval expired" })],
    });
    openChain();
    expect(screen.getByText("Rejected: The approval expired")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Approve" })).not.toBeInTheDocument();
  });
});

describe("WorkspaceReply — tool outputs", () => {
  const cases: [string, ToolOutput, () => void][] = [
    [
      "terminal",
      { kind: "terminal", command: "npm test", output: "ok", exitCode: 0 },
      () => expect(screen.getByText(/npm test/)).toBeInTheDocument(),
    ],
    [
      "test-results",
      {
        kind: "test-results",
        summary: { passed: 2, failed: 1, skipped: 0, total: 3, duration: 150 },
        suites: [
          {
            name: "Auth",
            status: "failed",
            tests: [
              { name: "logs in", status: "passed" },
              { name: "refreshes", status: "failed", error: { message: "Expected 200, got 500" } },
            ],
          },
        ],
      },
      () => {
        expect(screen.getByText("2 passed")).toBeInTheDocument();
        expect(screen.getByText("Expected 200, got 500")).toBeInTheDocument();
      },
    ],
    [
      "stack-trace",
      { kind: "stack-trace", trace: "TypeError: x is undefined\n    at run (/app/a.ts:1:2)" },
      () => expect(screen.getByText("TypeError")).toBeInTheDocument(),
    ],
    [
      "file-tree",
      { kind: "file-tree", files: [{ path: "src/app/page.tsx", change: "added" }] },
      () => {
        expect(screen.getByText("page.tsx")).toBeInTheDocument();
        expect(screen.getByText("Added")).toBeInTheDocument();
      },
    ],
    [
      "commit",
      {
        kind: "commit",
        hash: "abcdef1234567",
        message: "feat: add settings",
        author: "Ada Lovelace",
        date: Date.now(),
        files: [{ path: "a.ts", status: "added", additions: 3, deletions: 0 }],
      },
      () => {
        expect(screen.getByText("feat: add settings")).toBeInTheDocument();
        expect(screen.getByText("abcdef1")).toBeInTheDocument();
      },
    ],
    [
      "package-info",
      { kind: "package-info", name: "react", currentVersion: "18.2.0", newVersion: "19.0.0", changeType: "major" },
      () => expect(screen.getByText("react")).toBeInTheDocument(),
    ],
    [
      "environment-variables",
      { kind: "environment-variables", variables: [{ name: "API_KEY", value: "sk-secret", required: true }] },
      () => {
        expect(screen.getByText("API_KEY")).toBeInTheDocument();
        expect(screen.queryByText("sk-secret")).not.toBeInTheDocument();
      },
    ],
    [
      "schema-display",
      { kind: "schema-display", method: "POST", path: "/api/posts", description: "Create a post" },
      () => {
        expect(screen.getByText("/api/posts")).toBeInTheDocument();
        expect(screen.getByText("POST")).toBeInTheDocument();
      },
    ],
    [
      "sandbox",
      { kind: "sandbox", title: "primes.py", language: "python", code: "print(1)", output: "1" },
      () => expect(screen.getByText("primes.py")).toBeInTheDocument(),
    ],
    [
      "artifact",
      { kind: "artifact", title: "Plan.md", description: "Updated just now", content: "# Plan" },
      () => {
        expect(screen.getByText("Plan.md")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Download" })).toBeInTheDocument();
      },
    ],
    [
      "web-preview",
      { kind: "web-preview", url: "https://preview.test/app" },
      () => expect(screen.getByDisplayValue("https://preview.test/app")).toBeInTheDocument(),
    ],
    [
      "jsx-preview",
      { kind: "jsx-preview", jsx: "<p>Rendered from JSX</p>" },
      () => expect(screen.getByText("Rendered from JSX")).toBeInTheDocument(),
    ],
  ];

  it.each(cases)("%s renders its own component", (_kind, output, assertion) => {
    renderReply({ turns: [tool("o", { result: output }), text("t", "Here you go.")] });
    assertion();
  });

  it("a streaming terminal fills in from the running tool's partial output", () => {
    renderReply({
      turns: [tool("o", { status: "running", partial: out({ kind: "terminal", command: "npm i", output: "added 3 packages" }) })],
      busy: true,
    });
    expect(screen.getByText(/added 3 packages/)).toBeInTheDocument();
  });

  it("a tool whose result is not a ToolOutput keeps the plain Tool output inside its step", () => {
    renderReply({ turns: [tool("o", { result: { rows: 3 } }), text("t", "ok")] });
    openChain();
    fireEvent.click(screen.getByRole("button", { name: /lookup/ }));
    expect(screen.getByText("Result")).toBeInTheDocument();
  });

  it("a stack trace's Retry regenerates the answer when the transport can, else resends the text", async () => {
    const regenerate = vi.fn().mockResolvedValue(undefined);
    const crash = out({ kind: "stack-trace", trace: "Error: nope\n    at a (/a.ts:1:1)" });
    const first = renderReply({ turns: [tool("o", { result: crash }), text("t", "x")], transport: { regenerate } });
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(regenerate).toHaveBeenCalledWith("t");
    first.unmount();

    const onSend = vi.fn();
    renderReply({ turns: [tool("o", { result: crash }), text("t", "x")], onSend });
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onSend).toHaveBeenCalledWith("What changed?");
  });

  const png = "data:image/png;base64,iVBORw0KGgo=";
  const image: Attachment = { id: "i1", name: "logo.png", mime: "image/png", kind: "image", size: 1, url: png };

  it("a running image tool develops in a GeneratedImage that announces its stage", () => {
    renderReply({
      turns: [tool("g", { status: "running", partial: out({ kind: "image", stage: "refining" }) })],
      busy: true,
    });
    const frame = screen.getByRole("group", { name: "Generated image" });
    expect(frame.dataset.stage).toBe("refining");
    expect(within(frame).getByRole("status")).toHaveTextContent("Refining");
  });

  it("a finished image tool puts its picture in a complete GeneratedImage", () => {
    renderReply({ turns: [tool("g", { attachments: [image] }), text("t", "Here you go.")] });
    const frame = screen.getByRole("group", { name: "Generated image" });
    expect(frame.dataset.stage).toBe("complete");
    expect(within(frame).getByRole("img", { name: "logo.png" })).toHaveAttribute("src", png);
  });

  it("a tool named generate_image with no image output gets no GeneratedImage: the frame follows the output contract", () => {
    renderReply({ turns: [tool("g", { name: "generate_image", result: { rows: 3 } }), text("t", "ok")] });
    expect(screen.queryByRole("group", { name: "Generated image" })).toBeNull();
  });

  it("a failed image tool says it could not generate and offers Retry", () => {
    renderReply({
      turns: [tool("g", { status: "error", attachments: [{ ...image, url: undefined }] }), text("t", "x")],
    });
    const frame = screen.getByRole("group", { name: "Generated image" });
    expect(frame.dataset.stage).toBe("error");
    expect(within(frame).getByRole("status")).toHaveTextContent("Couldn't generate");
    expect(within(frame).getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("other produced files are Attachments", () => {
    const pdf: Attachment = { id: "p1", name: "report.pdf", mime: "application/pdf", kind: "document", size: 9, url: "blob:x" };
    renderReply({ turns: [tool("g", { attachments: [pdf] }), text("t", "Done.")] });
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
  });
});

describe("WorkspaceReply — one owner for a failure", () => {
  it("a failed tool whose result is a stack trace shows the error and one Retry, both from the StackTrace", () => {
    const crash = out({ kind: "stack-trace", trace: "Error: boom\n    at a (/a.ts:1:1)" });
    renderReply({ turns: [tool("o", { status: "error", error: "boom", result: crash }), text("t", "x")] });
    openChain();
    expect(screen.getAllByRole("button", { name: /Retry|Try again/ })).toHaveLength(1);
    expect(screen.getAllByText(/boom/)).toHaveLength(1);
  });

  it("a failed tool with a terminal output still shows its error and one Try again", () => {
    const term = out({ kind: "terminal", command: "make", output: "building" });
    renderReply({ turns: [tool("o", { status: "error", error: "exit status 2", result: term }), text("t", "x")] });
    expect(screen.getByText("exit status 2")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Try again" })).toHaveLength(1);
  });

  it("a failed plain tool offers 'Try again', which regenerates the whole reply", async () => {
    const regenerate = vi.fn().mockResolvedValue(undefined);
    renderReply({ turns: [tool("o", { status: "error", error: "timeout" })], transport: { regenerate } });
    openChain();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(regenerate).toHaveBeenCalledWith("u1");
  });
});

describe("WorkspaceReply — the chain opens for the reader", () => {
  const header = () => screen.getByRole("button", { name: /Worked through|Working/ });

  it("is open while streaming and says Working… only while a step runs or there is no text yet", () => {
    const running = renderReply({ turns: [tool("a", { status: "running" })], busy: true });
    expect(header()).toHaveAttribute("aria-expanded", "true");
    expect(header()).toHaveTextContent("Working…");
    running.unmount();

    renderReply({ turns: [tool("a"), text("t", "Writing the answer", { streaming: true })], busy: true });
    expect(header()).toHaveTextContent("Worked through 1 step");
  });

  it("opens for an approval waiting on the reader, collapses once the reply is done", () => {
    const waiting = renderReply({ turns: [action("g", { approval: "pending" })] });
    expect(header()).toHaveAttribute("aria-expanded", "true");
    waiting.unmount();

    renderReply({ turns: [tool("a"), text("t", "Done.")] });
    expect(header()).toHaveAttribute("aria-expanded", "false");
  });

  it("a finished reply with a failed step is open with the error visible, and still collapsible", () => {
    renderReply({ turns: [tool("a", { status: "error", error: "disk full" }), text("t", "Sorry.")] });
    expect(header()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("disk full")).toBeInTheDocument();
    fireEvent.click(header());
    expect(header()).toHaveAttribute("aria-expanded", "false");
  });

  it("stays open when the reader opened it", () => {
    renderReply({ turns: [tool("a"), text("t", "Done.")] });
    fireEvent.click(header());
    expect(header()).toHaveAttribute("aria-expanded", "true");
  });
});

describe("WorkspaceReply — order", () => {
  it("runs chain → answer → outputs (images) → run → sources → actions", () => {
    const png = "data:image/png;base64,iVBORw0KGgo=";
    const sources: Source[] = [{ id: "s", n: 1, title: "S", url: "https://s.example/x", domain: "s.example" }];
    const run = { id: "r", goal: "Ship it" } as Run;
    renderReply({
      turns: [
        tool("a", { name: "lookup", attachments: [{ id: "i", name: "pic.png", mime: "image/png", kind: "image", size: 1, url: png }] }),
        tool("t", { name: "shell", result: out({ kind: "terminal", command: "ls", output: "files" }) }),
        text("x", "The answer.", { sources }),
      ],
      run,
    });
    const chain = screen.getByRole("button", { name: /Worked through/ });
    const nodes = [
      chain,
      screen.getByText("The answer."),
      screen.getByText(/files/),
      screen.getByAltText("pic.png"),
      screen.getByTestId("run-inline"),
      screen.getByText("Used 1 source"),
      screen.getByRole("button", { name: "Copy reply" }),
    ];
    nodes.slice(1).forEach((el, i) => {
      expect(nodes[i].compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });
});

describe("WorkspaceReply — the answer", () => {
  const sources: Source[] = [
    { id: "s1", n: 1, title: "First", url: "https://one.example/a", domain: "one.example" },
    { id: "s2", n: 2, title: "Second", url: "https://two.example/b", domain: "two.example" },
  ];

  it("linkCitations links known markers, groups neighbours and leaves code alone", () => {
    expect(linkCitations("Yes [1][2] and [9].", sources)).toBe("Yes [cite](#cite-1-2) and [9].");
    expect(linkCitations("Use `a[1]` here [1]", sources)).toBe("Use `a[1]` here [cite](#cite-1)");
    expect(linkCitations("```\nx[1]\n```", sources)).toBe("```\nx[1]\n```");
  });

  it("[n] markers become InlineCitations and the sources list as 'Used N sources'", async () => {
    renderReply({ turns: [text("t", "It shipped [1][2].", { sources })] });
    expect(await screen.findByText(/one\.example\s+\+1/)).toBeInTheDocument();
    expect(screen.getByText("Used 2 sources")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Used 2 sources"));
    expect(screen.getByRole("link", { name: "First" })).toHaveAttribute("href", "https://one.example/a");
  });

  it("a fenced block is a CodeBlock with a copy button, a one-line shell command is a Snippet", async () => {
    renderReply({
      turns: [text("t", "Run this:\n\n```bash\nnpm install\n```\n\nthen:\n\n```ts\nconst a = 1;\nconst b = 2;\n```")],
    });
    expect(await screen.findByDisplayValue("npm install")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
  });

  it("an error turn is an inline alert; only a fatal one offers Retry", async () => {
    const soft = renderReply({ turns: [{ kind: "error", id: "e", message: "One step slipped", fatal: false }] });
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(screen.getByText("One step slipped")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();
    soft.unmount();

    const onSend = vi.fn();
    renderReply({ turns: [{ kind: "error", id: "e", message: "Connection dropped", fatal: true }], onSend });
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onSend).toHaveBeenCalledWith("What changed?");
  });
});

describe("WorkspaceReply — waiting", () => {
  it("a user turn with no reply yet shows Thinking… while busy", () => {
    const t = makeTransport({ turns: [user] });
    render(<WorkspaceReply busy isLast onSend={vi.fn()} reply={null} transport={t} user={user} />);
    expect(screen.getByText("Thinking…")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copy reply" })).not.toBeInTheDocument();
  });

  it("renders nothing for a reply-less turn when the agent is idle", () => {
    const t = makeTransport({ turns: [user] });
    const { container } = render(<WorkspaceReply busy={false} isLast onSend={vi.fn()} reply={null} transport={t} user={user} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("a lost connection shows Reconnecting… in the latest reply", () => {
    renderReply({
      turns: [text("t", "Half an answ", { streaming: true })],
      busy: true,
      transport: { runState: { ...EMPTY_RUN_STATE, connection: "reconnecting" } },
    });
    expect(screen.getByText("Reconnecting…")).toBeInTheDocument();
    expect(screen.getByText("Half an answ")).toBeInTheDocument();
  });

  it("the reply shell exists for the run's owner even without turns, so RunInline has a home", () => {
    const run = { id: "r", goal: "Ship it" } as Run;
    const t = makeTransport({ turns: [user] });
    render(<WorkspaceReply busy={false} isLast onSend={vi.fn()} reply={null} run={run} transport={t} user={user} />);
    expect(screen.getByTestId("run-inline")).toHaveTextContent("Ship it");
  });

  it("RunInline sits after the answer and tool outputs, before Sources", () => {
    const run = { id: "r", goal: "Ship it" } as Run;
    const sources: Source[] = [{ id: "s", n: 1, title: "S", url: "https://s.example/x", domain: "s.example" }];
    renderReply({ turns: [text("t", "Answer.", { sources })], run });
    const marker = screen.getByTestId("run-inline");
    const answer = screen.getByText("Answer.");
    const used = screen.getByText("Used 1 source");
    expect(answer.compareDocumentPosition(marker) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(marker.compareDocumentPosition(used) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("WorkspaceReply — actions", () => {
  it("none while the reply is streaming, all once it has finished", () => {
    const streaming = renderReply({ turns: [text("t", "Partial", { streaming: true })], busy: true, speak: vi.fn() });
    expect(screen.queryByRole("button", { name: "Copy reply" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Regenerate" })).not.toBeInTheDocument();
    streaming.unmount();

    renderReply({ turns: [text("t", "Whole answer")], transport: { regenerate: vi.fn() }, speak: vi.fn() });
    expect(screen.getByRole("button", { name: "Copy reply" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Regenerate" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Read aloud" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open in…" })).not.toBeInTheDocument();
  });

  it("none, and no follow-ups, while the reply's run is paused or waiting — nothing streams but it is not finished", () => {
    const answer = text("t", "So far", { suggestions: ["Tell me more"] });
    for (const status of ["paused", "waiting_for_approval"] as const) {
      const paused = renderReply({ turns: [answer], run: { id: "r", goal: "Ship it", status } as Run });
      expect(screen.queryByRole("button", { name: "Copy reply" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Tell me more" })).not.toBeInTheDocument();
      paused.unmount();
    }
    renderReply({ turns: [answer], run: { id: "r", goal: "Ship it", status: "completed" } as Run });
    expect(screen.getByRole("button", { name: "Copy reply" })).toBeInTheDocument();
  });

  it("Regenerate needs branching and a regenerate method; Read aloud needs speak", () => {
    renderReply({ turns: [text("t", "Whole answer")], transport: { capabilities: { ...caps, branching: false } } });
    expect(screen.queryByRole("button", { name: "Regenerate" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Read aloud" })).not.toBeInTheDocument();
  });

  it("Copy writes the reply text to the clipboard and confirms with a toast", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    renderReply({ turns: [text("a", "First part."), tool("x"), text("b", "Second part.")] });
    await userEvent.click(screen.getByRole("button", { name: "Copy reply" }));
    expect(writeText).toHaveBeenCalledWith("First part.\n\nSecond part.");
    expect(toast.success).toHaveBeenCalledWith("Copied to clipboard");
  });

  it("Copy says so when the clipboard is blocked", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
      configurable: true,
    });
    renderReply({ turns: [text("a", "Whole answer")] });
    await userEvent.click(screen.getByRole("button", { name: "Copy reply" }));
    expect(toast.error).toHaveBeenCalled();
  });

  it("Regenerate calls transport.regenerate with the answer it rewrites", async () => {
    const regenerate = vi.fn().mockResolvedValue(undefined);
    renderReply({ turns: [text("a", "Whole answer")], transport: { regenerate } });
    await userEvent.click(screen.getByRole("button", { name: "Regenerate" }));
    expect(regenerate).toHaveBeenCalledWith("a");
  });

  it("Read aloud resolves audio for the reply text, plays it under the actions, and stops on a second press", async () => {
    const speak = vi.fn().mockResolvedValue("blob:speech-1");
    const { container } = renderReply({ turns: [text("a", "Whole answer")], speak });
    await userEvent.click(screen.getByRole("button", { name: "Read aloud" }));
    expect(speak).toHaveBeenCalledWith("Whole answer");
    await waitFor(() => expect(container.querySelector("audio")).toHaveAttribute("src", "blob:speech-1"));
    await userEvent.click(screen.getByRole("button", { name: "Stop reading aloud" }));
    await waitFor(() => expect(container.querySelector("audio")).toBeNull());
  });

  it("Read aloud reports a failure instead of staying silent", async () => {
    const speak = vi.fn().mockRejectedValue(new Error("no voice"));
    renderReply({ turns: [text("a", "Whole answer")], speak });
    await userEvent.click(screen.getByRole("button", { name: "Read aloud" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(screen.getByRole("button", { name: "Read aloud" })).toBeInTheDocument();
  });

  it("Open in… is absent when no openIn targets are given, or the list is empty", () => {
    const none = renderReply({ turns: [text("a", "Whole answer")] });
    expect(screen.queryByRole("button", { name: "Open in…" })).not.toBeInTheDocument();
    none.unmount();
    renderReply({ turns: [text("a", "Whole answer")], openIn: [] });
    expect(screen.queryByRole("button", { name: "Open in…" })).not.toBeInTheDocument();
  });

  it("Open in… offers the caller's targets with the user's message as the query", async () => {
    const openIn: OpenInTarget[] = [
      { id: "intranet", title: "Open in Intranet Chat", createUrl: (q) => `/chat?q=${encodeURIComponent(q)}` },
      { id: "notes", title: "Open in Notes", createUrl: (q) => `/notes?text=${encodeURIComponent(q)}` },
    ];
    renderReply({ turns: [text("a", "Whole answer")], openIn });
    await userEvent.click(screen.getByRole("button", { name: "Open in…" }));
    const intranet = await screen.findByRole("menuitem", { name: /Intranet Chat/ });
    expect(intranet.getAttribute("href")).toContain("What%20changed%3F");
    expect(within(screen.getByRole("menu")).getAllByRole("menuitem")).toHaveLength(2);
  });
});

describe("WorkspaceReply — branches and suggestions", () => {
  const regenerated = text("t1", "Take two.", {
    regenerations: [
      { id: "r1", text: "Take one." },
      { id: "r2", text: "Take two." },
    ],
    activeVersion: 1,
  });

  it("pages through regenerations with ‹ n of m ›, calling selectBranch", async () => {
    const selectBranch = vi.fn();
    renderReply({ turns: [regenerated], transport: { selectBranch } });
    expect(screen.getByText("2 of 2")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Previous branch" }));
    expect(selectBranch).toHaveBeenCalledWith("t1", 0);
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
  });

  it("shows no branch selector when the transport cannot select a branch", () => {
    renderReply({ turns: [regenerated] });
    expect(screen.queryByText("2 of 2")).not.toBeInTheDocument();
  });

  const withFollowUps = text("t", "Whole answer", { suggestions: ["Tell me more", "Show an example"] });

  it("offers follow-ups under the last finished reply and sends one on click", async () => {
    const onSend = vi.fn();
    renderReply({ turns: [withFollowUps], onSend });
    await userEvent.click(screen.getByRole("button", { name: "Show an example" }));
    expect(onSend).toHaveBeenCalledWith("Show an example");
  });

  it("hides follow-ups while the user is typing, while streaming, and on an earlier reply", () => {
    const typing = renderReply({ turns: [withFollowUps], composerEmpty: false });
    expect(screen.queryByRole("button", { name: "Tell me more" })).not.toBeInTheDocument();
    typing.unmount();

    const busy = renderReply({ turns: [{ ...withFollowUps, streaming: true }], busy: true });
    expect(screen.queryByRole("button", { name: "Tell me more" })).not.toBeInTheDocument();
    busy.unmount();

    renderReply({ turns: [withFollowUps], isLast: false });
    expect(screen.queryByRole("button", { name: "Tell me more" })).not.toBeInTheDocument();
  });
});

describe("WorkspaceUserMessage", () => {
  const png: Attachment = { id: "i", name: "shot.png", mime: "image/png", kind: "image", size: 1, url: "blob:img" };
  const pdf: Attachment = { id: "d", name: "brief.pdf", mime: "application/pdf", kind: "document", size: 1, url: "blob:pdf" };

  it("shows the text, an image tile and a file chip for its attachments", () => {
    render(<WorkspaceUserMessage transport={makeTransport()} turn={{ ...user, attachments: [png, pdf] }} />);
    expect(screen.getByText("What changed?")).toBeInTheDocument();
    expect(screen.getByAltText("shot.png")).toBeInTheDocument();
    expect(screen.getByText("brief.pdf")).toBeInTheDocument();
  });

  it("Edit opens an inline editor; saving calls editMessage with the new text", async () => {
    const editMessage = vi.fn().mockResolvedValue(undefined);
    render(<WorkspaceUserMessage transport={makeTransport({ editMessage })} turn={user} />);
    await userEvent.click(screen.getByRole("button", { name: "Edit message" }));
    const box = screen.getByRole("textbox", { name: "Edit your message" });
    await userEvent.clear(box);
    await userEvent.type(box, "What changed today?");
    await userEvent.click(screen.getByRole("button", { name: "Save and resend" }));
    expect(editMessage).toHaveBeenCalledWith("u1", "What changed today?");
    await waitFor(() => expect(screen.queryByRole("textbox")).not.toBeInTheDocument());
  });

  it("Cancel leaves the message as it was; Edit needs editMessage and branching", async () => {
    const editMessage = vi.fn();
    const { unmount } = render(<WorkspaceUserMessage transport={makeTransport({ editMessage })} turn={user} />);
    await userEvent.click(screen.getByRole("button", { name: "Edit message" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(editMessage).not.toHaveBeenCalled();
    expect(screen.getByText("What changed?")).toBeInTheDocument();
    unmount();

    render(<WorkspaceUserMessage transport={makeTransport()} turn={user} />);
    expect(screen.queryByRole("button", { name: "Edit message" })).not.toBeInTheDocument();
  });

  it("an edited message pages through its versions with ‹ n of m ›, calling selectBranch", async () => {
    const selectBranch = vi.fn();
    const edited: UserTurn = {
      ...user,
      text: "What changed today?",
      versions: [
        { id: "v1", text: "What changed?" },
        { id: "v2", text: "What changed today?" },
      ],
      activeVersion: 1,
    };
    render(<WorkspaceUserMessage transport={makeTransport({ selectBranch })} turn={edited} />);
    expect(screen.getByText("2 of 2")).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Previous branch" }));
    });
    expect(selectBranch).toHaveBeenCalledWith("u1", 0);
  });
});
