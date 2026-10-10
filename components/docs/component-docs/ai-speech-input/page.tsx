/**
 * Authored documentation page for `ai-speech-input`.
 *
 * Every live render goes through `speech-input-specimen.tsx`: the component
 * listens through the reader's browser and the result needs state to show.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";
import { SpeechInputSpecimen } from "./speech-input-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-speech-input",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A dictation button. Press it and speak: the browser asks for the microphone, and what it hears is appended below. Press it again to stop. In a browser with neither a speech recogniser nor a recorder the button is disabled.",
      label: "SpeechInput",
      render: (
        <Panel label="Speech Input">
          <SpeechInputSpecimen />
        </Panel>
      ),
      source: `import { SpeechInput } from "@/components/ai-elements/speech-input";

<SpeechInput
  onTranscriptionChange={(text) => setDraft((prev) => prev + text)}
  onAudioRecorded={async (blob) => (await transcribe(blob)).text}
/>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It uses the base Button, Icon and Spinner. Speech recognition and recording need a secure context (https or localhost) and the reader&rsquo;s permission for the microphone.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "SpeechInput is one button, and it picks its own method. Where the browser has the Web Speech API (Chrome, Edge), it streams recognised text to onTranscriptionChange, final results only. Elsewhere it records with MediaRecorder and hands the audio to onAudioRecorded, which must return the transcribed text; that text then reaches onTranscriptionChange. Pass preferMediaRecorder to record even where the recogniser exists. That is the only way a chosen microphone (deviceId) takes effect, because the Web Speech API cannot select one. Inside a form, pass type=\"button\" or a press will submit it.",
      language: "tsx",
      code: `const [micId, setMicId] = React.useState<string>();
const [listening, setListening] = React.useState(false);

<SpeechInput
  type="button"
  size="icon-sm"
  deviceId={micId}
  preferMediaRecorder
  onAudioRecorded={async (blob) => (await transport.transcribe(blob)).text}
  onListeningChange={setListening}
  onTranscriptionChange={(text) => setDraft((prev) => \`\${prev} \${text}\`.trim())}
/>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The button changes its icon, variant and name as it moves between idle, listening and transcribing. The cells render the real component.",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="rest" note="mic icon, default variant, named Start dictation">
                <SpeechInputSpecimen />
              </StateCell>
              <StateCell label="disabled" note="no method available, still initialising, or transcribing">
                <SpeechInputSpecimen disabled />
              </StateCell>
              <StateCell label="compact" note="size icon-sm, for a toolbar">
                <SpeechInputSpecimen compact />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Driven by the browser, and N/A rows">
              <p>
                <strong>listening</strong> and <strong>loading</strong> are reached by using the button above: listening swaps the mic for a stop square, switches the Button to its destructive variant and renames it &ldquo;Stop dictation&rdquo;; transcribing (the recorder path while <code>onAudioRecorded</code> runs) shows a spinner, names it &ldquo;Transcribing&rdquo; and disables it. They cannot be forced from outside, so no cell fakes them. <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong> are the Button&rsquo;s own. <strong>success</strong> is the text arriving through <code>onTranscriptionChange</code>; the button draws nothing. <strong>error</strong> is silent: a refused microphone or a recorder error returns the button to idle, and a failed <code>onAudioRecorded</code> is left to the caller. <strong>empty</strong> does not apply.
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
      description: "Read from components/ai-elements/speech-input.tsx.",
      blocks: [
        {
          label: "SpeechInput",
          anchor: "api-speech-input",
          body: (
            <Meta
              items={[
                { k: "onTranscriptionChange?", v: "(text: string) => void — called with each final piece of recognised text, or the text returned by onAudioRecorded." },
                { k: "onAudioRecorded?", v: "(audio: Blob) => Promise<string> — the recorder path: receives a webm blob and returns the transcript. Without it the recorder path leaves the button disabled." },
                { k: "lang?", v: 'string — the recogniser language. Default "en-US". Changing it recreates the recogniser.' },
                { k: "deviceId?", v: "string — the input device for the recorder path (a MicSelector value). Ignored by the Web Speech path." },
                { k: "onListeningChange?", v: "(listening: boolean) => void — called on every start and stop, on both paths, only when the value changes." },
                { k: "preferMediaRecorder?", v: "boolean — record even where SpeechRecognition exists. Falls back to the recogniser when recording is unavailable." },
                { k: "size?", v: 'Button size — default "icon" (40px). Pass "icon-sm" inside a toolbar.' },
                { k: "variant?", v: 'The variant at rest, default "default". While listening the button is always "destructive", whatever was passed — so the composer\'s ghost microphone still turns red while it records.' },
                { k: "…Button props", v: "Forwarded to the Button. disabled adds to the component's own disabling." },
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
                { k: "Roles and names", v: 'A button whose name follows its state: "Start dictation", "Stop dictation", "Transcribing". The name always says what a press does next, so there is no aria-pressed: a pressed state on a label that changes would be read twice.' },
                { k: "Keyboard", v: "Tab to it, Enter or Space toggles. Nothing else is needed." },
                { k: "Recording indicator", v: "Recording is carried by three things at once, not by colour alone: the destructive variant, the stop icon and the changed name. There are no pulsing rings." },
                { k: "Result", v: "Text arrives through your callback. Announce it where it lands, for example in the message box, which a screen reader already reads; the specimen's status line is an aria-live region." },
                { k: "Target size", v: "The default is the 40px icon size for a standalone main action; icon-sm (32px) is for a toolbar beside other small controls." },
                { k: "Motion", v: "The spinner is the only motion, and reduced motion collapses it." },
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
              Dictation should be one button, whatever the browser can do. The AgentWorkspace composer (<code>components/agent/workspace/workspace-composer.tsx</code>) puts it beside Send with the microphone chevron next to it: with a transport that can transcribe, it records from the chosen device through <code>onAudioRecorded</code>; without one it uses the browser&rsquo;s recogniser and hides the picker. Its <code>onListeningChange</code> feeds the header&rsquo;s voice orb, which shows listening while it records. Vendored changes: <code>deviceId</code>, <code>onListeningChange</code> and <code>preferMediaRecorder</code> were added so a picked microphone can take effect and the listening state can leave the button; the ping rings were removed because the system has no ring motion, and its pulse is the green live-dot glow, which is wrong on a destructive button; the record button now rides the Button&rsquo;s own variants and sizes; and effects that set state in the render tick were deferred to a microtask.
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
