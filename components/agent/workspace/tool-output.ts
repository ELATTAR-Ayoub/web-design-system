/**
 * What a tool's result means, so the thread can draw the AI Elements
 * component made for it.
 *
 * `ToolTurn.result` is `unknown` on purpose — the transcript does not know
 * what a tool returns. A result that carries one of these `kind`s is
 * promising a shape, and `toolOutput` checks the promise before the thread
 * trusts it: a malformed result falls back to the plain `Tool` output, never
 * to a crash. The same shapes are what a running tool reports through
 * `tool_progress` (`ToolTurn.partial`), so a terminal or a test run fills in
 * while it works.
 *
 * Pure: no React, no DOM.
 */

import type { ToolTurn } from "@/components/agent/core/types";

export type TestStatus = "passed" | "failed" | "skipped" | "running";

export type ToolOutput =
  /** Terminal: a command's output, ANSI and all. */
  | { kind: "terminal"; command: string; output: string; exitCode?: number }
  /** TestResults. `duration` in ms. */
  | {
      kind: "test-results";
      summary: { passed: number; failed: number; skipped: number; total: number; duration?: number };
      suites: {
        name: string;
        status: TestStatus;
        tests: { name: string; status: TestStatus; duration?: number; error?: { message: string; stack?: string } }[];
      }[];
    }
  /** StackTrace: the raw trace text; the component parses it. */
  | { kind: "stack-trace"; trace: string }
  /** FileTree: the files a step touched. Paths use "/". */
  | { kind: "file-tree"; files: { path: string; change: "added" | "modified" | "deleted" }[] }
  /** Commit. `date` is epoch ms. */
  | {
      kind: "commit";
      hash: string;
      message: string;
      author: string;
      date: number;
      files: { path: string; status: "added" | "modified" | "deleted" | "renamed"; additions: number; deletions: number }[];
    }
  /** PackageInfo. */
  | {
      kind: "package-info";
      name: string;
      currentVersion?: string;
      newVersion?: string;
      changeType?: "major" | "minor" | "patch" | "added" | "removed";
      description?: string;
      dependencies?: { name: string; version: string }[];
    }
  /** EnvironmentVariables. `value` is what masking hides. */
  | { kind: "environment-variables"; variables: { name: string; value: string; required?: boolean }[] }
  /** SchemaDisplay. */
  | {
      kind: "schema-display";
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      path: string;
      description?: string;
      parameters?: { name: string; type: string; required?: boolean; description?: string; location?: "path" | "query" | "header" }[];
      requestBody?: SchemaProperty[];
      responseBody?: SchemaProperty[];
    }
  /** Sandbox: code the agent ran and what it printed. */
  | { kind: "sandbox"; title?: string; language: string; code: string; output: string }
  /** Artifact: a generated document or file. */
  | { kind: "artifact"; title: string; description?: string; language?: string; content: string }
  /** WebPreview: a generated page. */
  | { kind: "web-preview"; url: string; logs?: { level: "log" | "warn" | "error"; message: string; at: number }[] }
  /** JSXPreview: a generated component, rendered live. */
  | { kind: "jsx-preview"; jsx: string }
  /** ChainOfThought search step: the query and the results found. */
  | { kind: "search"; query: string; results: { title: string; url: string; domain: string }[] }
  /** What a running image tool reports through `tool_progress`; the finished picture is an attachment. */
  | { kind: "image"; stage: ImageStage };

export type ImageStage = "queued" | "generating" | "refining" | "complete" | "error";
const IMAGE_STAGES: readonly string[] = ["queued", "generating", "refining", "complete", "error"];

export type SchemaProperty = {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  properties?: SchemaProperty[];
  items?: SchemaProperty;
};

export type ToolOutputKind = ToolOutput["kind"];

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const isStr = (v: unknown): v is string => typeof v === "string";
const isNum = (v: unknown): v is number => typeof v === "number";
const isArr = Array.isArray;
/** An absolute http(s) url — the only kind a generated page may be previewed or opened from. */
export const isWebUrl = (url: string): boolean => /^https?:\/\//i.test(url.trim());

/** The minimum each kind must carry to be drawn by its component. */
const VALID: Record<ToolOutputKind, (v: Record<string, unknown>) => boolean> = {
  terminal: (v) => isStr(v.command) && isStr(v.output),
  "test-results": (v) =>
    isObj(v.summary) && ["passed", "failed", "skipped", "total"].every((k) => isNum((v.summary as Record<string, unknown>)[k])) && isArr(v.suites),
  "stack-trace": (v) => isStr(v.trace),
  "file-tree": (v) => isArr(v.files) && v.files.every((f) => isObj(f) && isStr(f.path)),
  commit: (v) => isStr(v.hash) && isStr(v.message) && isStr(v.author) && isNum(v.date) && isArr(v.files),
  "package-info": (v) => isStr(v.name),
  "environment-variables": (v) => isArr(v.variables) && v.variables.every((x) => isObj(x) && isStr(x.name) && isStr(x.value)),
  "schema-display": (v) => isStr(v.method) && isStr(v.path),
  sandbox: (v) => isStr(v.language) && isStr(v.code) && isStr(v.output),
  artifact: (v) => isStr(v.title) && isStr(v.content),
  // Only http(s): the url lands in an iframe and window.open, and a javascript: or
  // data: url from a tool result would run script in the host page.
  "web-preview": (v) => isStr(v.url) && isWebUrl(v.url),
  "jsx-preview": (v) => isStr(v.jsx),
  search: (v) => isStr(v.query) && isArr(v.results),
  image: (v) => isStr(v.stage) && IMAGE_STAGES.includes(v.stage),
};

/** `value` as a `ToolOutput`, or null when it does not keep the promise its `kind` makes. */
export function asToolOutput(value: unknown): ToolOutput | null {
  if (!isObj(value) || !isStr(value.kind) || !(value.kind in VALID)) return null;
  return VALID[value.kind as ToolOutputKind](value) ? (value as ToolOutput) : null;
}

/**
 * What to draw for a tool call: its settled result, or — while it runs — what
 * it has reported so far. Null means "no special component; plain Tool output".
 */
export function toolOutput(turn: ToolTurn): ToolOutput | null {
  return asToolOutput(turn.status === "running" ? turn.partial : turn.result);
}

/**
 * A flat path list as the nested tree `FileTree` draws: folders first, then
 * files, each alphabetical. `path` on a folder is its full path, which is
 * what `FileTree`'s `expanded` set holds.
 */
export type FileNode =
  | { type: "folder"; name: string; path: string; children: FileNode[] }
  | { type: "file"; name: string; path: string; change: "added" | "modified" | "deleted" };

export function fileTree(files: { path: string; change: "added" | "modified" | "deleted" }[]): FileNode[] {
  const root: FileNode[] = [];
  for (const file of files) {
    const parts = file.path.split("/").filter(Boolean);
    let level = root;
    parts.forEach((name, i) => {
      const path = parts.slice(0, i + 1).join("/");
      if (i === parts.length - 1) {
        level.push({ type: "file", name, path, change: file.change });
        return;
      }
      let folder = level.find((n): n is Extract<FileNode, { type: "folder" }> => n.type === "folder" && n.name === name);
      if (!folder) {
        folder = { type: "folder", name, path, children: [] };
        level.push(folder);
      }
      level = folder.children;
    });
  }
  const sort = (nodes: FileNode[]): FileNode[] =>
    nodes
      .map((n) => (n.type === "folder" ? { ...n, children: sort(n.children) } : n))
      .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "folder" ? -1 : 1));
  return sort(root);
}
