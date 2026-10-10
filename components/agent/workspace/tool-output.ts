import type { ToolTurn } from "@/components/agent/core/types";

export type TestStatus = "passed" | "failed" | "skipped" | "running";

export type ToolOutput =
  | { kind: "terminal"; command: string; output: string; exitCode?: number }
  | {
      kind: "test-results";
      summary: { passed: number; failed: number; skipped: number; total: number; duration?: number };
      suites: {
        name: string;
        status: TestStatus;
        tests: { name: string; status: TestStatus; duration?: number; error?: { message: string; stack?: string } }[];
      }[];
    }
  | { kind: "stack-trace"; trace: string }
  | { kind: "file-tree"; files: { path: string; change: "added" | "modified" | "deleted" }[] }
  | {
      kind: "commit";
      hash: string;
      message: string;
      author: string;
      date: number;
      files: { path: string; status: "added" | "modified" | "deleted" | "renamed"; additions: number; deletions: number }[];
    }
  | {
      kind: "package-info";
      name: string;
      currentVersion?: string;
      newVersion?: string;
      changeType?: "major" | "minor" | "patch" | "added" | "removed";
      description?: string;
      dependencies?: { name: string; version: string }[];
    }
  | { kind: "environment-variables"; variables: { name: string; value: string; required?: boolean }[] }
  | {
      kind: "schema-display";
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      path: string;
      description?: string;
      parameters?: { name: string; type: string; required?: boolean; description?: string; location?: "path" | "query" | "header" }[];
      requestBody?: SchemaProperty[];
      responseBody?: SchemaProperty[];
    }
  | { kind: "sandbox"; title?: string; language: string; code: string; output: string }
  | { kind: "artifact"; title: string; description?: string; language?: string; content: string }
  | { kind: "web-preview"; url: string; logs?: { level: "log" | "warn" | "error"; message: string; at: number }[] }
  | { kind: "jsx-preview"; jsx: string }
  | { kind: "search"; query: string; results: { title: string; url: string; domain: string }[] }
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
export const isWebUrl = (url: string): boolean => /^https?:\/\//i.test(url.trim());

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
  // Only http(s): a javascript: or data: url would run script in the host page.
  "web-preview": (v) => isStr(v.url) && isWebUrl(v.url),
  "jsx-preview": (v) => isStr(v.jsx),
  search: (v) => isStr(v.query) && isArr(v.results),
  image: (v) => isStr(v.stage) && IMAGE_STAGES.includes(v.stage),
};

export function asToolOutput(value: unknown): ToolOutput | null {
  if (!isObj(value) || !isStr(value.kind) || !(value.kind in VALID)) return null;
  return VALID[value.kind as ToolOutputKind](value) ? (value as ToolOutput) : null;
}

export function toolOutput(turn: ToolTurn): ToolOutput | null {
  return asToolOutput(turn.status === "running" ? turn.partial : turn.result);
}

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
