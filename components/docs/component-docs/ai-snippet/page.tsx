import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { SnippetExamples, SnippetPreview, SnippetStateGrid } from "./snippet-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-snippet",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A one-line command or value in a read-only field with a copy button. Press copy; the note reports the result.",
      label: "Snippet",
      render: <SnippetPreview />,
      source: `import { Snippet, SnippetAddon, SnippetCopyButton, SnippetInput, SnippetText } from "@/components/ai-elements/snippet";

<Snippet code="npm run check:tokens">
  <SnippetAddon>
    <SnippetText>$</SnippetText>
  </SnippetAddon>
  <SnippetInput aria-label="Command" />
  <SnippetAddon align="inline-end">
    <SnippetCopyButton />
  </SnippetAddon>
</Snippet>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It is a thin composition of the system&apos;s InputGroup, so it needs nothing beyond it.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Snippet takes the string to show as code and shares it with its parts: SnippetInput shows it in a read-only field (you cannot pass value or readOnly), and SnippetCopyButton copies it. SnippetText is a muted prefix such as a prompt glyph. Place the prefix in a SnippetAddon and the button in a SnippetAddon with align=\"inline-end\".",
      language: "tsx",
      code: `<Snippet code={command}>
  <SnippetAddon>
    <SnippetText>$</SnippetText>
  </SnippetAddon>
  <SnippetInput aria-label="Command" />
  <SnippetAddon align="inline-end">
    <SnippetCopyButton onCopy={() => toast.success("Copied")} />
  </SnippetAddon>
</Snippet>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Snippet is an InputGroup, so it inherits the group's focus and disabled treatment.",
      blocks: [
        { body: <SnippetStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: a pill-shaped field with the code in the code type role and a copy button. <strong>hover</strong> and <strong>pressed</strong>: the copy button inherits InputGroupButton and Button; the field has no hover of its own. <strong>focus-visible</strong>: the group draws the focus ring when its input is focused, and the button takes its own. <strong>loading</strong>: N/A — the code is a prop, nothing is fetched. <strong>success</strong>: the copy button swaps to a success-tone check and its name to Copied for <code className="type-code">timeout</code> ms (default 2000); clicking again while Copied does nothing. <strong>error</strong>: when the Clipboard API is missing or refuses, <code className="type-code">onError</code> is called and the button stays as it was — the component shows nothing itself, so wire <code className="type-code">onError</code> to a toast. <strong>disabled</strong>: set <code className="type-code">disabled</code> on the input and the button; the group dims. <strong>empty</strong>: an empty code string shows an empty field and still copies an empty string.
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
      description: "A value with no prefix and a specific name on the copy button.",
      label: "Examples",
      render: <SnippetExamples />,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/snippet.tsx.",
      blocks: [
        {
          label: "Snippet",
          body: (
            <Meta
              items={[
                { k: "code", v: "string, required — what SnippetInput shows and SnippetCopyButton copies." },
                { k: "…InputGroup props", v: 'className and the rest; the code type role is added to the group.' },
              ]}
            />
          ),
        },
        {
          label: "SnippetAddon, SnippetText",
          body: (
            <Meta
              items={[
                { k: "SnippetAddon", v: 'InputGroupAddon props, notably align ("inline-start" by default, "inline-end" for the button).' },
                { k: "SnippetText", v: "InputGroupText props; muted, regular weight, left padding." },
              ]}
            />
          ),
        },
        {
          label: "SnippetInput",
          body: <Meta items={[{ k: "…InputGroupInput props", v: "Everything except value and readOnly, which are fixed: the field always shows the code and is always read-only. Pass aria-label." }]} />,
        },
        {
          label: "SnippetCopyButton",
          body: (
            <Meta
              items={[
                { k: "onCopy?", v: "() => void — after the write succeeds." },
                { k: "onError?", v: "(error: Error) => void — Clipboard API unavailable or the write failed. The button's own DOM onError is omitted from the props, so an inline (error) => … types its parameter as Error." },
                { k: "timeout?", v: "number, default 2000 — how long the check stays." },
                { k: "aria-label?", v: 'string — default "Copy", "Copied" after a copy; the title attribute follows.' },
                { k: "…InputGroupButton props", v: "Always icon-sm (32px); children replace the glyph." },
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
      description: "A read-only text field and one named button.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles", v: "The group is role=group (InputGroup), the field a read-only textbox, and the button a button. The prefix glyph is text and is announced as part of the group." },
                { k: "Accessible names", v: 'The field has no visible label, so pass aria-label to SnippetInput. The copy button is named "Copy" and "Copied" (also its title).' },
                { k: "Keyboard", v: "Tab reaches the field, where the text can be selected and read, then the button; Enter or Space copies." },
                { k: "Target size", v: "The copy button is 32px (icon-sm), sitting inside a 40px-tall field beside the input, which RULES allows for a small control nested in a larger one whose own hit area is the field." },
                { k: "Motion and reduced motion", v: "The only motion is the glyph swap on copy; the blanket prefers-reduced-motion rule collapses it." },
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
              A command or key someone must copy exactly is better in a field than in a paragraph: selectable, one click to copy, no trailing whitespace. The AgentWorkspace does not use Snippet today — its tool results map to Terminal, CodeBlock and the other output components (<code className="type-code">workspace-outputs.tsx</code>) — so this is part of the vendored set for hosts that need it. Vendored changes: the copy glyph swap goes through IconSwap with the success tone, the group takes the code type role instead of a raw mono class.
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
