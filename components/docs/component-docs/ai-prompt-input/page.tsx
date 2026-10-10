import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";
import { PromptInputSpecimen, SubmitStatuses } from "./prompt-input-specimen";

const COMPOSITION = `import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { TooltipProvider } from "@/components/ui/tooltip";

<TooltipProvider>
  <PromptInputProvider>
    <PromptInput maxFiles={4} onSubmit={(message) => send(message.text, message.files)}>
      <PromptInputHeader>{/* attachment chips */}</PromptInputHeader>
      <PromptInputBody>
        <PromptInputTextarea aria-label="Message" />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger aria-label="Add" />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit status={status} onStop={stop} />
      </PromptInputFooter>
    </PromptInput>
  </PromptInputProvider>
</TooltipProvider>`;

export const spec: ComponentDocSpec = {
  name: "ai-prompt-input",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A message box with a + menu that adds files, a web-search toggle, a model select and a submit button. Add a file from the + menu to see it staged as a chip above the text; press Enter to send.",
      label: "PromptInput",
      render: (
        <Panel label="Prompt Input">
          <PromptInputSpecimen />
        </Panel>
      ),
      source: `<PromptInputProvider>
  <PromptInput onSubmit={(message) => setSent(message)} maxFiles={4}>
    <PromptInputBody>
      <PromptInputTextarea aria-label="Message" />
    </PromptInputBody>
    <PromptInputFooter>
      <PromptInputTools>{/* + menu, search toggle, model select */}</PromptInputTools>
      <PromptInputSubmit status="ready" />
    </PromptInputFooter>
  </PromptInput>
</PromptInputProvider>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It sits on the base Input Group, Dropdown Menu, Select, Command, Hover Card and Tooltip, so those ship with it; wrap the page in a <code>TooltipProvider</code> before using <code>PromptInputButton</code>&rsquo;s <code>tooltip</code> prop.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "PromptInput is a form. Its children are laid out inside one Input Group: a header row (chips) ordered first, the textarea in the body, then a footer with the tools on the left and the submit button on the right. Wrap it in PromptInputProvider only when something outside the form must read or set the draft or the staged files; without a provider the form keeps both itself. onSubmit receives { text, files } and the form clears itself once it returns, or once the promise it returns resolves; a rejection keeps the draft so the user can retry.",
      language: "tsx",
      code: COMPOSITION,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "The submit button carries the chat status (ready, submitted, streaming, error); the textarea and tools take disabled. The cells below render the real component.",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="rest" note="empty draft, status ready">
                <PromptInputSpecimen withSelect={false} />
              </StateCell>
              <StateCell label="disabled" note="textarea, tools and submit">
                <PromptInputSpecimen disabled withSelect={false} />
              </StateCell>
              <StateCell label="loading / streaming" note="ready, submitted (spinner), streaming (stop), error">
                <SubmitStatuses />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="N/A rows">
              <p>
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong> belong to the Input Group (the box takes the focus ring when the textarea is focused) and to the buttons inside it, not to the form. <strong>success</strong> is the cleared draft after a resolved <code>onSubmit</code>; there is no success visual. <strong>error</strong> is the submit status <code>error</code> (an X icon) and a rejected <code>onSubmit</code>, which keeps the draft; <code>onError</code> reports a rejected file (too many, too large, wrong type). <strong>empty</strong> is the rest state: the placeholder shows and nothing is staged.
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
      description: "With a draft already in the box and no model select, the minimum shape for a single-model assistant.",
      label: "PromptInput — pre-filled",
      render: (
        <Panel label="Prompt Input" note="initialInput, no select">
          <PromptInputSpecimen initialInput="Summarise the open invoices" withSelect={false} />
        </Panel>
      ),
      source: `<PromptInputProvider initialInput="Summarise the open invoices">
  <PromptInput onSubmit={handleSubmit}>…</PromptInput>
</PromptInputProvider>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/prompt-input.tsx.",
      blocks: [
        {
          label: "PromptInput",
          anchor: "api-prompt-input",
          body: (
            <Meta
              items={[
                { k: "onSubmit", v: "(message: { text: string; files: FileUIPart[] }, event) => void | Promise<void> — required. Blob URLs are converted to data URLs first. The form clears after it returns or resolves." },
                { k: "accept?", v: 'string — the file input\'s accept list, e.g. "image/*". Default: any.' },
                { k: "multiple?", v: "boolean — allow several files in one pick." },
                { k: "globalDrop?", v: "boolean — accept files dropped anywhere on the document. Default false." },
                { k: "syncHiddenInput?", v: "boolean — render a hidden input kept in sync, for native form posts. Default false." },
                { k: "maxFiles? / maxFileSize?", v: "number — most files, and the size limit in bytes. A breach calls onError instead of staging." },
                { k: "onError?", v: '(err: { code: "max_files" | "max_file_size" | "accept"; message: string }) => void' },
                { k: "…form props", v: "Everything else goes to the form element, except onSubmit and onError." },
              ]}
            />
          ),
        },
        {
          label: "PromptInputProvider and hooks",
          anchor: "api-provider",
          body: (
            <Meta
              items={[
                { k: "PromptInputProvider initialInput?", v: 'string — lifts the draft and the staged files out of PromptInput so outside code can reach them. Default "".' },
                { k: "usePromptInputController()", v: "{ textInput: { value, setInput, clear }, attachments, … } — throws outside a provider." },
                { k: "useProviderAttachments()", v: "The provider's attachments (files, add, remove, clear, openFileDialog, fileInputRef) — throws outside a provider." },
                { k: "usePromptInputAttachments()", v: "The same attachments API from inside a PromptInput, with or without a provider; add is validated against accept, maxFiles and maxFileSize." },
                { k: "usePromptInputReferencedSources()", v: "Source documents referenced by this form — throws outside PromptInput." },
                { k: "AttachmentsContext / TextInputContext / PromptInputControllerProps / ReferencedSourcesContext", v: "The shapes behind those hooks. LocalReferencedSourcesContext is the provider PromptInput mounts." },
              ]}
            />
          ),
        },
        {
          label: "PromptInputTextarea",
          anchor: "api-textarea",
          body: (
            <Meta
              items={[
                { k: "placeholder?", v: 'string — default "What would you like to know?".' },
                { k: "…textarea props", v: 'Forwarded to the input group textarea (name is "message"; it grows with its content between min-h-16 and max-h-48). Inside a provider the value and change handler are controlled for you.' },
                { k: "Keyboard", v: "Enter submits unless the submit button is disabled or an IME composition is running; Shift+Enter is a newline; Backspace on an empty box removes the last staged file; pasting files stages them." },
              ]}
            />
          ),
        },
        {
          label: "Layout parts: Body, Header, Footer, Tools",
          anchor: "api-layout",
          body: (
            <Meta
              items={[
                { k: "PromptInputBody", v: "div with display: contents — a grouping wrapper that adds no box of its own." },
                { k: "PromptInputHeader", v: "Input group addon on the block-end edge, ordered first so it renders above the text; wraps with gap-1. Takes addon props except align." },
                { k: "PromptInputFooter", v: "Input group addon on the block-end edge with justify-between, tools left and submit right. Takes addon props except align." },
                { k: "PromptInputTools", v: "div, flex min-w-0 items-center gap-1 — the group of tool buttons." },
              ]}
            />
          ),
        },
        {
          label: "PromptInputButton and the action menu",
          anchor: "api-buttons",
          body: (
            <Meta
              items={[
                { k: "PromptInputButton variant?", v: 'Input group button variant — default "ghost". type is always "button", so it never submits.' },
                { k: "PromptInputButton size?", v: 'Default "icon-sm" with a single child, "sm" when it has several (icon plus label).' },
                { k: "PromptInputButton tooltip?", v: "string | { content: ReactNode; shortcut?: string; side?: Side } — wraps the button in a Tooltip. Needs a TooltipProvider above it." },
                { k: "PromptInputActionMenu", v: "Dropdown Menu root; takes its props." },
                { k: "PromptInputActionMenuTrigger", v: "A PromptInputButton as the menu trigger; children default to a plus icon. Give it an aria-label." },
                { k: "PromptInputActionMenuContent / PromptInputActionMenuItem", v: 'Dropdown Menu content (align="start") and item.' },
                { k: "PromptInputActionAddAttachments label?", v: 'Menu item that opens the file dialog; default "Add photos or files".' },
                { k: "PromptInputActionAddScreenshot label? onSelect?", v: 'Menu item that captures the screen and stages it as a file; default "Take screenshot". A denied or aborted capture is ignored; calling event.preventDefault() in onSelect skips the capture.' },
              ]}
            />
          ),
        },
        {
          label: "PromptInputSubmit",
          anchor: "api-submit",
          body: (
            <Meta
              items={[
                { k: "status?", v: '"ready" | "submitted" | "streaming" | "error" — the icon: corner-down-left, spinner, stop square, X.' },
                { k: "onStop?", v: '() => void — while submitted or streaming, a press calls this instead of submitting, and the button becomes type="button".' },
                { k: "variant? / size?", v: 'Default "default" and "icon-sm".' },
                { k: "children?", v: "Replaces the status icon." },
              ]}
            />
          ),
        },
        {
          label: "PromptInputSelect parts",
          anchor: "api-select",
          body: (
            <Meta
              items={[
                { k: "PromptInputSelect / Content / Item / Value", v: "The base Select parts, unchanged in props." },
                { k: "PromptInputSelectTrigger", v: "Select trigger restyled for the tools row: type-nav, no border, transparent, muted text; hover and open fill with the accent." },
              ]}
            />
          ),
        },
        {
          label: "PromptInputHoverCard and Tabs parts",
          anchor: "api-hovercard-tabs",
          body: (
            <Meta
              items={[
                { k: "PromptInputHoverCard openDelay? closeDelay?", v: 'Both default to 0. Trigger and Content are the base Hover Card parts; Content aligns "start".' },
                { k: "PromptInputTabsList / Tab / TabBody", v: "Plain divs for a tabbed picker panel; TabBody spaces its children." },
                { k: "PromptInputTabLabel", v: "h3 in type-nav, muted, for a panel heading." },
                { k: "PromptInputTabItem", v: "div row in type-small that fills with the accent on hover." },
              ]}
            />
          ),
        },
        {
          label: "PromptInputCommand parts",
          anchor: "api-command",
          body: (
            <Meta
              items={[
                { k: "PromptInputCommand / Input / List / Empty / Group / Item / Separator", v: "The base Command parts, passed through with their props, for a searchable list in a popover (sources, skills)." },
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
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: 'The wrapper is a form. The textarea has no label of its own: pass aria-label="Message" (the specimen does). The hidden file input is labelled "Upload files". The submit button is named "Submit", or "Stop" while submitted or streaming, so its name always matches what it does.' },
                { k: "Icon-only buttons", v: "PromptInputButton and the + trigger are icon-only: give each an aria-label. A tooltip is a visual hint and does not name the button." },
                { k: "Keyboard", v: "Tab reaches the textarea, each tool, then submit. Enter submits (not during IME composition), Shift+Enter breaks the line, Backspace on an empty box removes the last staged file. The + menu and select use the Dropdown Menu and Select keyboard models: arrows, Enter, Escape." },
                { k: "Target sizes", v: "The tools row uses icon-sm (32px) buttons: that size is allowed here because they sit together in one toolbar beside other small controls. A standalone control outside such a row must be 40px or more." },
                { k: "Motion", v: "The spinner is the only motion, from the Spinner component, and reduced motion collapses it with the rest of the system's animation." },
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
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              The message box is where a chat surface starts, and AI Elements ships one that already handles the parts that are easy to get subtly wrong: IME composition, paste-to-attach, drop, validation, blob-to-data URL conversion and clearing only on success. The AgentWorkspace builds its composer from it in <code>components/agent/workspace/workspace-composer.tsx</code>: the + menu (files, sources to tick, skills), attachment chips in the header, the tools row, a mic beside Send, and the submit button. The vendored copy&rsquo;s changes are restyles onto the system&rsquo;s tokens and type roles: the select trigger, tab label and tab item use <code>.type-*</code> roles, and the submit and tool buttons ride the system&rsquo;s Input Group button. The composer adds what upstream does not have, such as the <code>@</code> and <code>/</code> palettes, on top rather than inside it.
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
