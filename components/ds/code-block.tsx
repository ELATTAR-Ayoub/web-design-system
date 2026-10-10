"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconSwap } from "@/components/ui/icon-swap";
import { cn } from "@/lib/utils";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);

const LANGUAGE_ALIASES: Record<string, string> = {
  bash: "bash",
  css: "css",
  js: "javascript",
  javascript: "javascript",
  json: "json",
  jsx: "jsx",
  md: "markdown",
  markdown: "markdown",
  py: "python",
  python: "python",
  sh: "bash",
  shell: "bash",
  sql: "sql",
  ts: "typescript",
  tsx: "tsx",
  typescript: "typescript",
};

export const STYLED_PRISM_TOKEN_CLASSES = [
  "keyword",
  "atrule",
  "important",
  "decorator",
  "string",
  "attr-value",
  "url",
  "cdata",
  "plain-text",
  "comment",
  "prolog",
  "doctype",
  "function",
  "number",
  "boolean",
  "constant",
  "regex",
  "unit", // CSS: the "px" in "768px"
  "color", // CSS: a literal colour keyword, e.g. "red"
  "punctuation",
  "operator",
  "entity",
  "class-name",
  "builtin",
  "tag",
  "selector",
  "maybe-class-name", // Prism's own heuristic guess at a type identifier
  "property",
  "parameter",
  "variable",
  "attr-name",
  "imports", // the binding an `import … from` names
] as const;

export type CopyFn = (text: string) => Promise<void>;

const defaultCopy: CopyFn = (text) => navigator.clipboard.writeText(text);

function CopyButton({ code, copy = defaultCopy }: { code: string; copy?: CopyFn }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    copy(code)
      .then(() => {
        setCopied(true);
        toast("Copied to clipboard");
        window.setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {
        toast("Couldn't copy the code", {
          description: "Your browser blocked clipboard access. Select the text and copy it instead.",
        });
      });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      onClick={onCopy}
      aria-label={copied ? "Copied" : "Copy code"}
      className="shrink-0"
    >
      <IconSwap
        active={copied ? "copied" : "idle"}
        icons={{
          idle: <Icon icon={CopyIcon} size="xs" tone="inherit" />,
          copied: <Icon icon={CheckIcon} size="xs" tone="inherit" />,
        }}
      />
    </Button>
  );
}

export function CodeBlock({
  code,
  language,
  copy,
  className,
}: {
  code: string;
  language?: string;
  copy?: CopyFn;
  className?: string;
}) {
  const normalized = language ? LANGUAGE_ALIASES[language.toLowerCase()] : undefined;

  if (!normalized) {
    return (
      <div className={cn("group relative bg-muted", className)}>
        <pre className="scrollbar-thin overflow-x-auto p-3 pr-10">
          <code className="type-code text-foreground">{code}</code>
        </pre>
        <div className="absolute top-2 right-2">
          <CopyButton code={code} copy={copy} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden bg-muted", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="type-small text-muted-foreground">{normalized}</span>
        <CopyButton code={code} copy={copy} />
      </div>
      {/*
        `useInlineStyles={false}` is the whole fix: Prism (via
        react-syntax-highlighter) normally paints each token with an inline
        `style` attribute drawn from the theme object passed as `style` — which
        is how `vscDarkPlus` got in here and why it stayed dark-only regardless
        of `.dark` on the page. With inline styles off, a token instead carries
        its Prism class (`.token.keyword`, `.token.string`, …) and nothing
        else, so the colour comes from `.code-highlight` in
        `styles/utilities.css` — one CSS rule, both themes, instead of a JS
        object holding a single palette. No `style` prop is passed: the
        default is `{}`, and with inline styles off it is never read. */}
      <SyntaxHighlighter
        language={normalized}
        useInlineStyles={false}
        className="code-highlight scrollbar-thin type-code overflow-x-auto"
        codeTagProps={{ className: "type-code" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
