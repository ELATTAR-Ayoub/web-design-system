/**
 * Authored documentation page for `ai-model-selector`.
 *
 * The dialog's open state and the picked model need state, so every live
 * render goes through `model-selector-specimen.tsx`.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";
import { MODELS } from "./model-data";
import { ModelSelectorSpecimen } from "./model-selector-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-model-selector",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A button that opens a search dialog of models grouped by provider. Type to filter, arrow to a row and press Enter. Escape or a press outside closes it; there is no corner close button.",
      label: "ModelSelector",
      render: (
        <Panel label="Model Selector">
          <ModelSelectorSpecimen />
        </Panel>
      ),
      source: `import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";

<ModelSelector open={open} onOpenChange={setOpen}>
  <ModelSelectorTrigger asChild>
    <Button variant="outline">{selected.name}</Button>
  </ModelSelectorTrigger>
  <ModelSelectorContent title="Choose a model">
    <ModelSelectorInput placeholder="Search models..." />
    <ModelSelectorList>
      <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
      <ModelSelectorGroup heading="Anthropic">
        <ModelSelectorItem value="Sonnet sonnet" onSelect={() => choose("sonnet")}>
          <ModelSelectorName>Sonnet</ModelSelectorName>
        </ModelSelectorItem>
      </ModelSelectorGroup>
    </ModelSelectorList>
  </ModelSelectorContent>
</ModelSelector>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It sits on the base Dialog and Command, so those ship with it. <code>ModelSelectorLogo</code> draws a local monogram and makes no network request; pass <code>src</code> to show your own approved logo.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "ModelSelector is a Dialog: control it with open and onOpenChange when the selection should close it, as the workspace composer does. ModelSelectorContent supplies the Command around its children, so the input, list, groups and items go directly inside it. Give each item a unique value that includes the text a user would type, because the Command filters on that string (the name and the id here). Pass a title: it is the dialog's accessible name and is not shown.",
      language: "tsx",
      code: `<ModelSelector open={open} onOpenChange={setOpen}>
  <ModelSelectorTrigger asChild>
    <PromptInputButton type="button">
      <ModelSelectorLogo provider="anthropic" />
      <ModelSelectorName>{selected.name}</ModelSelectorName>
    </PromptInputButton>
  </ModelSelectorTrigger>
  <ModelSelectorContent title="Choose a model">
    <ModelSelectorInput placeholder="Search models..." />
    <ModelSelectorList>
      <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
      {providers.map((provider) => (
        <ModelSelectorGroup heading={provider} key={provider}>
          {modelsOf(provider).map((m) => (
            <ModelSelectorItem
              key={m.id}
              value={\`\${m.name} \${m.id}\`}
              onSelect={() => {
                onModelChange(m.id);
                setOpen(false);
              }}
            >
              <ModelSelectorName>{m.name}</ModelSelectorName>
            </ModelSelectorItem>
          ))}
        </ModelSelectorGroup>
      ))}
    </ModelSelectorList>
  </ModelSelectorContent>
</ModelSelector>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The trigger is whatever you pass; the dialog has an open and a no-results state. The cells render the real component.",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="rest" note="closed; the trigger names the current model">
                <ModelSelectorSpecimen />
              </StateCell>
              <StateCell label="empty (two models)" note="open it and type zzz: ModelSelectorEmpty shows">
                <ModelSelectorSpecimen models={MODELS.slice(0, 2)} />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="N/A rows">
              <p>
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong> are the trigger&rsquo;s own and the Command row&rsquo;s own (the highlighted row fills with the accent); this component draws neither. <strong>disabled</strong> is the trigger&rsquo;s <code>disabled</code>; a disabled row takes <code>disabled</code> on <code>ModelSelectorItem</code>. <strong>loading</strong>, <strong>success</strong> and <strong>error</strong> do not apply: the list is data the caller already has, and choosing a row closes the dialog without a request.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/model-selector.tsx.",
      blocks: [
        {
          label: "ModelSelector and ModelSelectorTrigger",
          anchor: "api-root",
          body: (
            <Meta
              items={[
                { k: "ModelSelector", v: "Dialog root. open, defaultOpen, onOpenChange, modal." },
                { k: "ModelSelectorTrigger", v: "Dialog trigger. Use asChild with your own button." },
              ]}
            />
          ),
        },
        {
          label: "ModelSelectorContent",
          anchor: "api-content",
          body: (
            <Meta
              items={[
                { k: "title?", v: 'ReactNode — the dialog\'s accessible name, rendered screen-reader-only. Default "Model Selector".' },
                { k: "showCloseButton?", v: "boolean — default false. A search dialog has no corner close: it would sit on the search field. Escape and a press outside close it." },
                { k: "…DialogContent props", v: "Forwarded. The content has no padding and an outlined border, and wraps its children in a Command." },
              ]}
            />
          ),
        },
        {
          label: "ModelSelectorDialog",
          anchor: "api-dialog",
          body: (
            <Meta
              items={[
                { k: "ModelSelectorDialog", v: "The Command dialog (CommandDialog) with its props, for a palette-style picker that is not built from a Dialog and a trigger." },
              ]}
            />
          ),
        },
        {
          label: "List parts",
          anchor: "api-list",
          body: (
            <Meta
              items={[
                { k: "ModelSelectorInput", v: "Command input; padded with py-3.5, height from its content. placeholder, value, onValueChange." },
                { k: "ModelSelectorList / Empty / Group / Separator", v: "The base Command list, empty message, group (heading) and separator." },
                { k: "ModelSelectorItem", v: "Command item. value is the filter text; onSelect(value) fires on Enter or click; disabled is supported." },
                { k: "ModelSelectorShortcut", v: "Right-aligned muted text on a row, for a note such as a speed tier." },
                { k: "ModelSelectorName", v: "span, flex-1 truncate text-left, the row's label." },
              ]}
            />
          ),
        },
        {
          label: "Logos",
          anchor: "api-logos",
          body: (
            <Meta
              items={[
                { k: "ModelSelectorLogo provider", v: "string — a provider id such as \"anthropic\" or \"openai\". Draws a local monogram (the first letter in a round chip) and makes no network request. Pass src for your own approved logo: it then renders a 12px img (inverted in dark mode) with alt text \"<provider> logo\"." },
                { k: "ModelSelectorLogoGroup", v: "div that overlaps several logos with a negative space, each in a round chip." },
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
                { k: "Roles and names", v: "The dialog is named by its title; the search input is a combobox over a listbox of options (the Command pattern). Group headings label their options. The trigger needs its own accessible name: visible text such as the model's name is enough." },
                { k: "Keyboard", v: "Enter or Space on the trigger opens the dialog and puts focus in the search. Type to filter, ArrowUp and ArrowDown move the highlight, Enter selects, Escape closes and returns focus to the trigger." },
                { k: "Closing", v: "There is no corner close button on purpose; Escape and an outside press close the dialog, as the system's own Command dialog does." },
                { k: "Target sizes", v: "Rows are the Command item height, above the 40px floor for a standalone list; the trigger is whatever Button you pass." },
                { k: "Motion", v: "The dialog uses the Dialog's own enter and exit; reduced motion collapses them." },
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
              A model list grows past what a select can hold, and a searchable dialog scales. The AgentWorkspace uses it in <code>components/agent/workspace/workspace-composer.tsx</code> as the model chip in the tools row, grouped by provider; choosing a row calls <code>onModelChange</code> and closes the dialog. The vendored change is that the content shows no corner close button (<code>showCloseButton</code> defaults to false): the button sat on top of the search field, and Escape and an outside press already close it, as the system&rsquo;s Command dialog does.
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
