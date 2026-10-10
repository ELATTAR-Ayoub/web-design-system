import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";
import { TranscriptionSpecimen } from "./transcription-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-transcription",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A seven-word transcript at 2.2 seconds: the word being said is in the action ink, words already said are muted, and words to come are fainter. Press a word to jump to it, or use the buttons to move the time.",
      label: "Transcription",
      render: (
        <Panel label="Transcription" note="no audio, the time is a number">
          <TranscriptionSpecimen />
        </Panel>
      ),
      source: `import { Transcription, TranscriptionSegment } from "@/components/ai-elements/transcription";

<Transcription segments={segments} currentTime={time} onSeek={setTime}>
  {(segment, index) => (
    <TranscriptionSegment key={index} segment={segment} index={index} />
  )}
</Transcription>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. Its segment type is the <code>ai</code> package&rsquo;s transcription result segment (<code>text</code>, <code>startSecond</code>, <code>endSecond</code>).
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Transcription takes the segments and a render function, so you choose how each one is drawn; TranscriptionSegment is the ready-made button. Feed currentTime from your audio element's timeupdate and pass onSeek to set audio.currentTime: the same callback fires when a segment is pressed. Without currentTime the time stays at 0, because a press only calls onSeek and never moves the component's own time; so always control it. Segments whose text is blank are skipped.",
      language: "tsx",
      code: `const [time, setTime] = React.useState(0);

<audio
  ref={audioRef}
  src={url}
  onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
/>

<Transcription
  segments={result.segments}
  currentTime={time}
  onSeek={(t) => {
    if (audioRef.current) audioRef.current.currentTime = t;
    setTime(t);
  }}
>
  {(segment, index) => (
    <TranscriptionSegment key={index} segment={segment} index={index} />
  )}
</Transcription>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Each segment is past, active or upcoming against the current time, and it is pressable only when onSeek is given. The cells render the real component.",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="rest (upcoming)" note="time 0: the first word is active, the rest are faint">
                <TranscriptionSpecimen initialTime={0} />
              </StateCell>
              <StateCell label="active and past" note="time 2.2: earlier words muted, this one in the action ink">
                <TranscriptionSpecimen />
              </StateCell>
              <StateCell label="read only" note="no onSeek: no pointer cursor, no hover">
                <TranscriptionSpecimen seekable={false} />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="N/A rows">
              <p>
                <strong>hover</strong> exists only with <code>onSeek</code>: the segment goes to the foreground colour. <strong>focus-visible</strong> and <strong>pressed</strong> are the browser&rsquo;s own on a plain button; the segment draws no ring of its own, so place it where the page&rsquo;s global focus style applies. <strong>loading</strong>, <strong>success</strong> and <strong>error</strong> do not apply: a transcript is finished text. <strong>disabled</strong> does not apply; drop <code>onSeek</code> for a read-only transcript. <strong>empty</strong>: an empty list or all-blank segments renders an empty container, and the host should show its own message.
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
      description: "Read from components/ai-elements/transcription.tsx.",
      blocks: [
        {
          label: "Transcription",
          anchor: "api-transcription",
          body: (
            <Meta
              items={[
                { k: "segments", v: "{ text: string; startSecond: number; endSecond: number }[] — required. Segments with blank text are skipped." },
                { k: "children", v: "(segment, index) => ReactNode — required; renders each segment (use TranscriptionSegment)." },
                { k: "currentTime?", v: "number — the playback time in seconds, controlled. Without it the time stays at 0." },
                { k: "onSeek?", v: "(time: number) => void — called with a segment's start time when it is pressed. Providing it makes segments pressable." },
                { k: "…div props", v: "Forwarded (not children). The container is type-body, wraps, and has gap-1." },
              ]}
            />
          ),
        },
        {
          label: "TranscriptionSegment",
          anchor: "api-segment",
          body: (
            <Meta
              items={[
                { k: "segment", v: "The segment to draw. Required." },
                { k: "index", v: "number — required; written to data-index." },
                { k: "onClick?", v: "Called after onSeek when pressed." },
                { k: "…button props", v: 'Forwarded. A type="button" that is active when currentTime is inside its range (action ink), past when after it (muted) and upcoming otherwise (fainter muted). data-active reflects the active state.' },
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
                { k: "Roles and names", v: "Every segment is a button named by its word. With onSeek that gives a long tab sequence, one stop per word; for a long transcript, consider rendering segments without onSeek and exposing seek through the audio controls instead." },
                { k: "State not by colour alone", v: "Active, past and upcoming are told apart by colour only, and the component sets data-active but no aria-current. Where it matters, pair it with the audio player's own position display; the specimen prints the time." },
                { k: "Keyboard", v: "Tab moves between segments; Enter or Space seeks to that segment." },
                { k: "Colour", v: "The active word uses text-action-ink, the only coloured text token for actions; past and upcoming use muted foreground, upcoming at 60% of it." },
                { k: "Target size", v: "Segments are inline text, so their hit area is the word. They are not standalone controls; keep the audio player's own controls at 40px." },
                { k: "Motion", v: "None: colours change without a transition." },
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
              A transcript that follows the audio is the usual way to review a recording, and AI Elements ships one tied to the AI SDK&rsquo;s segment type. The AgentWorkspace composer (<code>components/agent/workspace/workspace-composer.tsx</code>) imports <code>Transcription</code> and <code>TranscriptionSegment</code> for the live dictation transcript it shows in the message header while the mic is on, with <code>currentTime</code> pinned just inside the last segment so the newest words read as active. The vendored copy&rsquo;s changes are style only: the container uses the <code>type-body</code> role in place of ad-hoc text sizing, and the active word uses the system&rsquo;s action ink.
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
