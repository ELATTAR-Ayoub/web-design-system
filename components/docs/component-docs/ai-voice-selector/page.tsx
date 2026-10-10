import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";
import { VoicePreviewStates, VoiceSelectorSpecimen } from "./voice-selector-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-voice-selector",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A button that opens a search dialog of voices. Each row shows a preview button, the name, a description, accent, age and gender. Type to filter; Escape or a press outside closes it, and there is no corner close button.",
      label: "VoiceSelector",
      render: (
        <Panel label="Voice Selector">
          <VoiceSelectorSpecimen />
        </Panel>
      ),
      source: `import {
  VoiceSelector,
  VoiceSelectorAccent,
  VoiceSelectorAge,
  VoiceSelectorAttributes,
  VoiceSelectorBullet,
  VoiceSelectorContent,
  VoiceSelectorDescription,
  VoiceSelectorEmpty,
  VoiceSelectorGender,
  VoiceSelectorInput,
  VoiceSelectorItem,
  VoiceSelectorList,
  VoiceSelectorName,
  VoiceSelectorPreview,
  VoiceSelectorTrigger,
} from "@/components/ai-elements/voice-selector";

<VoiceSelector open={open} onOpenChange={setOpen} value={voiceId} onValueChange={setVoiceId}>
  <VoiceSelectorTrigger asChild>
    <Button variant="outline">{selected.name}</Button>
  </VoiceSelectorTrigger>
  <VoiceSelectorContent title="Choose a voice">
    <VoiceSelectorInput placeholder="Search voices..." />
    <VoiceSelectorList>
      <VoiceSelectorEmpty>No voices found.</VoiceSelectorEmpty>
      <VoiceSelectorItem value="Ada" onSelect={() => choose("ada")}>
        <VoiceSelectorPreview playing={playing === "ada"} onPlay={() => toggle("ada")} />
        <VoiceSelectorName>Ada</VoiceSelectorName>
        <VoiceSelectorAttributes>
          <VoiceSelectorBullet />
          <VoiceSelectorAccent value="british" />
          <VoiceSelectorBullet />
          <VoiceSelectorAge>30-40</VoiceSelectorAge>
          <VoiceSelectorBullet />
          <VoiceSelectorGender value="female" />
        </VoiceSelectorAttributes>
      </VoiceSelectorItem>
    </VoiceSelectorList>
  </VoiceSelectorContent>
</VoiceSelector>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It sits on the base Dialog, Command, Button and Spinner.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "VoiceSelector is a Dialog that also holds the chosen voice (value, onValueChange) and its open state; useVoiceSelector() reads both from any part inside it. VoiceSelectorContent supplies the Command around its children. Choosing a row does not close the dialog or set the value by itself: do both in onSelect, as the workspace settings do. Voice rows are free-form: use only the attribute parts you have data for. VoiceSelectorPreview only draws the control; you play the sound and set playing and loading yourself. Give each item a value that contains the text a user would search for.",
      language: "tsx",
      code: `<VoiceSelector open={open} onOpenChange={setOpen} value={voice ?? undefined}>
  <VoiceSelectorTrigger asChild>
    <Button variant="outline" aria-label={\`Read-aloud voice: \${selected?.label}\`}>
      {selected?.label ?? "System default"}
    </Button>
  </VoiceSelectorTrigger>
  <VoiceSelectorContent title="Read-aloud voice">
    <VoiceSelectorInput placeholder="Search voices..." />
    <VoiceSelectorList>
      <VoiceSelectorEmpty>No voices found.</VoiceSelectorEmpty>
      {voices.map((v) => (
        <VoiceSelectorItem
          key={v.id}
          value={\`\${v.label} \${v.lang} \${v.id}\`}
          onSelect={() => {
            onVoiceChange(v.id);
            setOpen(false);
          }}
        >
          <VoiceSelectorName>{v.label}</VoiceSelectorName>
          <VoiceSelectorDescription>{v.lang}</VoiceSelectorDescription>
        </VoiceSelectorItem>
      ))}
    </VoiceSelectorList>
  </VoiceSelectorContent>
</VoiceSelector>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The preview button has idle, playing and loading faces; the picker has rest and empty. The cells render the real components.",
      blocks: [
        {
          body: (
            <StateGrid cols={2}>
              <StateCell label="rest" note="closed; the trigger names the current voice">
                <VoiceSelectorSpecimen />
              </StateCell>
              <StateCell label="preview: idle, playing, loading" note="play icon, pause icon, spinner (loading also disables it)">
                <VoicePreviewStates />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="N/A rows">
              <p>
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong> are the trigger Button&rsquo;s and the Command row&rsquo;s own (the highlighted row fills with the accent). <strong>empty</strong> is <code>VoiceSelectorEmpty</code>, shown when a search matches nothing (type zzz in the preview). <strong>disabled</strong> is the trigger&rsquo;s own, plus <code>disabled</code> on a row. <strong>success</strong> and <strong>error</strong> do not apply: the list is data the caller already has, and choosing a row closes the dialog without a request. A failed preview is the caller&rsquo;s to show.
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
      description: "Read from components/ai-elements/voice-selector.tsx.",
      blocks: [
        {
          label: "VoiceSelector and VoiceSelectorTrigger",
          anchor: "api-root",
          body: (
            <Meta
              items={[
                { k: "value? / defaultValue?", v: "string — the chosen voice id, controlled or uncontrolled." },
                { k: "onValueChange?", v: "(value: string | undefined) => void" },
                { k: "open? / defaultOpen? / onOpenChange?", v: "Dialog open state, controlled or uncontrolled. defaultOpen is false." },
                { k: "VoiceSelectorTrigger", v: "Dialog trigger. Use asChild with your own button." },
                { k: "useVoiceSelector()", v: "{ value, setValue, open, setOpen } — throws outside VoiceSelector." },
              ]}
            />
          ),
        },
        {
          label: "VoiceSelectorContent and VoiceSelectorDialog",
          anchor: "api-content",
          body: (
            <Meta
              items={[
                { k: "title?", v: 'ReactNode — the dialog\'s accessible name, rendered screen-reader-only. Default "Voice Selector".' },
                { k: "showCloseButton?", v: "boolean — default false. A search dialog has no corner close: it would sit on the search field. Escape and a press outside close it." },
                { k: "…DialogContent props", v: "Forwarded; no padding, and the children are wrapped in a Command." },
                { k: "VoiceSelectorDialog", v: "The Command dialog (CommandDialog) with its props, for a palette-style picker without a trigger." },
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
                { k: "VoiceSelectorInput", v: "Command input; padded with py-3.5." },
                { k: "VoiceSelectorList / Empty / Group / Separator", v: "The base Command list, empty message, group (heading) and separator." },
                { k: "VoiceSelectorItem", v: "Command item with px-4 py-2. value is the filter text; onSelect(value); disabled is supported." },
                { k: "VoiceSelectorShortcut", v: "Right-aligned muted text on a row." },
              ]}
            />
          ),
        },
        {
          label: "Row content",
          anchor: "api-row",
          body: (
            <Meta
              items={[
                { k: "VoiceSelectorName", v: "span in type-nav, flex-1, truncates." },
                { k: "VoiceSelectorDescription / VoiceSelectorAge", v: "Muted type-small spans; the age is tabular-nums." },
                { k: "VoiceSelectorAttributes", v: "type-small flex row that holds the attributes and their bullets." },
                { k: "VoiceSelectorBullet", v: "A separator dot, hidden from assistive technology." },
                { k: "VoiceSelectorGender value?", v: '"male" | "female" | "transgender" | "androgyne" | "non-binary" | "intersex" — an icon each; a small circle when unset. children replace the icon.' },
                { k: "VoiceSelectorAccent value?", v: 'A named accent ("american", "british", "japanese", and about thirty more) or any string — draws that region\'s flag; an unknown value draws nothing. children replace it. The flag is a symbol and carries no accessible name of its own, so name the accent in the description too.' },
              ]}
            />
          ),
        },
        {
          label: "VoiceSelectorPreview",
          anchor: "api-preview",
          body: (
            <Meta
              items={[
                { k: "playing?", v: 'boolean — shows a pause icon and the name "Pause preview"; otherwise a play icon named "Play preview".' },
                { k: "loading?", v: "boolean — shows a spinner and disables the button." },
                { k: "onPlay?", v: "() => void — called on press, after onClick. The press does not bubble, so it does not also select the row." },
                { k: "…button props", v: 'A Button, variant "outline", size "icon-sm", drawn 24px with a hit area extended by 10px on every side.' },
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
                { k: "Roles and names", v: "The dialog is named by its title; the search input is a combobox over a listbox of options (the Command pattern). The preview button is named \"Play preview\" or \"Pause preview\" to match what a press does. The trigger needs its own name: visible text is enough, an icon-only trigger needs aria-label." },
                { k: "Keyboard", v: "Enter or Space on the trigger opens the dialog and focuses the search; ArrowUp and ArrowDown move the highlight; Enter selects; Escape closes and returns focus to the trigger. The preview button is a separate Tab stop inside the row." },
                { k: "Target sizes", v: "The preview button is a nested control: a 24px visual with an after:-inset-2.5 hit area, so the pressable area is 44px square although the control looks small. Rows are the Command item height." },
                { k: "Motion", v: "The spinner is the only motion besides the dialog's own enter and exit; reduced motion collapses both." },
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
              A voice is chosen by ear and by description, so a plain select is too thin; this gives search, a preview button and the usual attributes. The AgentWorkspace uses it in <code>components/agent/workspace/workspace-settings.tsx</code>, in the Voice section of the settings sheet: the rows are the real voices of the reader&rsquo;s machine from the speech adapter (name, language, on this device or online), so it uses only <code>VoiceSelectorName</code> and <code>VoiceSelectorDescription</code> and no preview button, since the browser gives no sample audio. The vendored change is that the content shows no corner close button (<code>showCloseButton</code> defaults to false): the button sat on top of the search field, and Escape and an outside press close it, as the system&rsquo;s Command dialog does. The preview button also keeps a small 24px visual with a larger hit area, and the row text uses the system&rsquo;s type roles.
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
