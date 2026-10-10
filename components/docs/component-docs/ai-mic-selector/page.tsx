/**
 * Authored documentation page for `ai-mic-selector`.
 *
 * `MicSelector` reads the browser's audio devices and keeps a value, so every
 * live render goes through `mic-selector-specimen.tsx`.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";
import { MicSelectorCompactSpecimen, MicSelectorSpecimen } from "./mic-selector-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-mic-selector",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A button that opens a searchable list of the microphones this browser reports. The list is your own hardware; if the browser has none, or you refuse access when asked, it shows its empty message.",
      label: "MicSelector",
      render: (
        <Panel label="Mic Selector">
          <MicSelectorSpecimen />
        </Panel>
      ),
      source: `import {
  MicSelector,
  MicSelectorContent,
  MicSelectorEmpty,
  MicSelectorInput,
  MicSelectorItem,
  MicSelectorLabel,
  MicSelectorList,
  MicSelectorTrigger,
  MicSelectorValue,
} from "@/components/ai-elements/mic-selector";

<MicSelector value={deviceId} onValueChange={setDeviceId}>
  <MicSelectorTrigger className="w-72 justify-between">
    <MicSelectorValue />
  </MicSelectorTrigger>
  <MicSelectorContent>
    <MicSelectorInput />
    <MicSelectorEmpty />
    <MicSelectorList>
      {(devices) =>
        devices.map((device) => (
          <MicSelectorItem key={device.deviceId} value={device.deviceId}>
            <MicSelectorLabel device={device} />
          </MicSelectorItem>
        ))
      }
    </MicSelectorList>
  </MicSelectorContent>
</MicSelector>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It sits on the base Popover, Command and Button. It needs a browser with <code>navigator.mediaDevices</code> and a secure context (https or localhost).
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "MicSelector is a Popover that also loads the audio inputs. The value is the chosen device id: pass it to SpeechInput's deviceId so a recording uses that microphone. MicSelectorList takes a render function that receives the device list, so you decide the row; MicSelectorLabel splits a trailing vendor and product id such as (1234:abcd) into a muted suffix. Choosing a row sets the value and closes the popover.",
      language: "tsx",
      code: `const [micId, setMicId] = React.useState<string>();

<SpeechInput deviceId={micId} preferMediaRecorder onAudioRecorded={transcribe} />

<MicSelector value={micId} onValueChange={setMicId}>
  <MicSelectorTrigger aria-label="Choose microphone" size="sm" variant="ghost" />
  <MicSelectorContent popoverOptions={{ align: "end", side: "top" }}>
    <MicSelectorInput />
    <MicSelectorEmpty />
    <MicSelectorList>
      {(devices) =>
        devices.map((device) => (
          <MicSelectorItem key={device.deviceId} value={device.deviceId}>
            <MicSelectorLabel device={device} />
          </MicSelectorItem>
        ))
      }
    </MicSelectorList>
  </MicSelectorContent>
</MicSelector>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Rest and empty depend on the reader's devices; the cells render the real component.",
      blocks: [
        {
          body: (
            <StateGrid cols={2}>
              <StateCell label="rest" note="MicSelectorValue says Select microphone... until a device is chosen">
                <MicSelectorSpecimen />
              </StateCell>
              <StateCell label="compact" note="a bare chevron trigger; the list stays at least min-w-64">
                <MicSelectorCompactSpecimen />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="N/A rows">
              <p>
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong> are the trigger Button&rsquo;s own. <strong>loading</strong> exists only inside <code>useAudioDevices</code> (it returns <code>loading</code>); the component draws no loading visual because the list fills in as soon as the browser answers. <strong>error</strong> is the same: a failed device query is stored as <code>error</code> in the hook and logged, and the list reads as empty. <strong>empty</strong> is real: <code>MicSelectorEmpty</code> shows &ldquo;No microphone found.&rdquo; when the browser reports none, or when search matches nothing. <strong>success</strong> does not apply; choosing a row closes the popover. <strong>disabled</strong> is the trigger&rsquo;s <code>disabled</code>.
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
      description: "Read from components/ai-elements/mic-selector.tsx.",
      blocks: [
        {
          label: "MicSelector",
          anchor: "api-root",
          body: (
            <Meta
              items={[
                { k: "value? / defaultValue?", v: "string | undefined — the chosen device id, controlled or uncontrolled." },
                { k: "onValueChange?", v: "(value: string | undefined) => void" },
                { k: "open? / defaultOpen? / onOpenChange?", v: "Popover open state, controlled or uncontrolled. defaultOpen is false." },
                { k: "…Popover props", v: "Forwarded. When the popover opens without permission, the component asks for microphone access once so device names are filled in." },
              ]}
            />
          ),
        },
        {
          label: "MicSelectorTrigger",
          anchor: "api-trigger",
          body: (
            <Meta
              items={[
                { k: "…Button props", v: 'A Button, variant "outline" by default, that ends with a muted up-down chevron. Children are its label (usually MicSelectorValue). It measures its own width, which the content follows.' },
              ]}
            />
          ),
        },
        {
          label: "MicSelectorContent",
          anchor: "api-content",
          body: (
            <Meta
              items={[
                { k: "popoverOptions?", v: "Props for the PopoverContent, e.g. align and side." },
                { k: "…Command props", v: "Forwarded to the Command inside. The popover is as wide as the trigger but never narrower than min-w-64, so a bare chevron trigger does not draw a sliver." },
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
                { k: "MicSelectorInput", v: 'Command input; placeholder "Search microphones..." by default.' },
                { k: "MicSelectorList children", v: "(devices: MediaDeviceInfo[]) => ReactNode — required; only audio inputs are passed." },
                { k: "MicSelectorEmpty children?", v: 'Default "No microphone found."' },
                { k: "MicSelectorItem", v: "Command item. value is the device id; selecting it sets the value and closes the popover." },
                { k: "MicSelectorLabel device", v: "MediaDeviceInfo — shows the label, with a trailing (vid:pid) in muted text." },
                { k: "MicSelectorValue", v: 'The chosen device\'s label, or "Select microphone..." when nothing is chosen.' },
              ]}
            />
          ),
        },
        {
          label: "useAudioDevices",
          anchor: "api-hook",
          body: (
            <Meta
              items={[
                { k: "returns", v: "{ devices, loading, error, hasPermission, loadDevices } — devices are audio inputs; loadDevices asks for microphone access and then lists again with full labels. It re-lists on the browser's devicechange event." },
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
                { k: "Roles and names", v: "The trigger is a button that opens a popover; its name comes from its content. A trigger with only a chevron has no name: give it aria-label (the composer uses \"Choose microphone\"). The list is a Command listbox with a search combobox." },
                { k: "Keyboard", v: "Enter or Space opens the popover and focuses the search; ArrowUp and ArrowDown move through devices; Enter selects and closes; Escape closes and returns focus to the trigger." },
                { k: "Target sizes", v: "The composer's trigger is size sm (32px) beside the 32px mic button in one toolbar, which is the allowed use of 32px. Elsewhere, use a 40px button." },
                { k: "Permission", v: "Until microphone access is granted, device labels can be blank; the component asks when the popover opens, so a first open may briefly show no names." },
                { k: "Motion", v: "The popover uses the system's enter and exit; reduced motion collapses them." },
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
              Dictation is only useful if it listens to the right microphone, and the browser&rsquo;s speech recogniser cannot choose one, but a recorder can. The AgentWorkspace composer (<code>components/agent/workspace/workspace-composer.tsx</code>) puts a <code>MicSelector</code> beside its mic button as a bare chevron, and only when the transport can transcribe audio, because only then does the chosen device take effect. Vendored changes: the popover is never narrower than <code>min-w-64</code> (a chevron-only trigger drew a sliver), and the first device load is deferred to a microtask so the effect does not set state in its own tick.
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
