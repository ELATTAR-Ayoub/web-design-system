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

/**
 * Every Prism token class `code-highlight` (`styles/utilities.css`) has a
 * colour rule for.
 *
 * The ten registered grammars above between them emit far more than
 * `keyword`/`string`/`comment`/`function`/`number`/`punctuation` — real
 * JS/TS/JSX emits `class-name`, `tag`, `attr-name`, `regex`, `boolean`…, and
 * real CSS emits `selector`/`atrule`/`important`. Any of those left
 * unstyled falls back to plain `--foreground`, which is how a first pass at
 * this file shipped real code rendering mostly monochrome — six classes
 * styled, twenty-odd others invisible. Kept here, once, so the CSS and this
 * repo's own tests are written from the same list rather than two that can
 * drift apart; `test/components/ds/code-block.test.tsx` renders a real
 * TSX sample and asserts every token class it emits is in this set.
 */
export const STYLED_PRISM_TOKEN_CLASSES = [
  // keyword-like — control flow, declarations, meta directives, decorators
  "keyword",
  "atrule",
  "important",
  "decorator",
  // string-like — literal text, quoted attribute values, URLs, CDATA, and a
  // JSX tag's literal text content ("plain-text" — Prism/refractor's JSX
  // grammar wraps a tag's children in this even when they are plain prose,
  // not markup)
  "string",
  "attr-value",
  "url",
  "cdata",
  "plain-text",
  // comment-like — prose the engine ignores
  "comment",
  "prolog",
  "doctype",
  // calls and declarations
  "function",
  // number-like — literal values
  "number",
  "boolean",
  "constant",
  "regex",
  "unit", // CSS: the "px" in "768px"
  "color", // CSS: a literal colour keyword, e.g. "red"
  // punctuation-like — structural marks with no meaning of their own
  "punctuation",
  "operator",
  "entity",
  // type-like — names of a KIND of thing
  "class-name",
  "builtin",
  "tag",
  "selector",
  "maybe-class-name", // Prism's own heuristic guess at a type identifier
  // identifier-like — names of a SPECIFIC thing
  "property",
  "parameter",
  "variable",
  "attr-name",
  "imports", // the binding an `import … from` names
] as const;

/**
 * Copies `code` to the clipboard.
 *
 * A seam rather than a hardcoded `navigator.clipboard.writeText` call, for two
 * reasons that both matter here: jsdom has no clipboard, so the unit suite has
 * nothing to drive without one, and `navigator.clipboard` genuinely rejects on
 * an insecure origin or a denied permission — RULES §5 requires the failure
 * path ship, not only the happy one, and a seam is what lets a specimen force
 * it on demand rather than only when a browser happens to refuse.
 */
export type CopyFn = (text: string) => Promise<void>;

const defaultCopy: CopyFn = (text) => navigator.clipboard.writeText(text);

/**
 * The copy control every fenced block carries.
 *
 * Two signals, per RULES §5: the glyph rolls from a clipboard to a check
 * through `IconSwap` — the control confirming it heard the click — and a toast
 * reports the outcome, including the failure `navigator.clipboard` can
 * genuinely produce. `Button` already carries the press feel, so nothing here
 * adds a second one.
 */
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
  /** Overrides the clipboard write. Exposed so a specimen can force the failure path. */
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
