/**
 * Authored documentation page for `voice`.
 *
 * Documents the browser's speech synthesis module
 * (`components/agent/voice/speech.ts`): `useBrowserSpeech`, the `SpeechAdapter`
 * seam it satisfies, and `speakableText`. Speech recognition and the listening
 * visuals are not part of the agent family.
 *
 * `voice` has no rendered surface of its own — it is one hook and one pure
 * function. The Examples section is a small live specimen built on top of it,
 * not a component of this item. So the page has no Variants, Sizes or States
 * sections, and no keyboard contract beyond the native <button> and <select>
 * semantics of whatever control a caller builds on it.
 */

import { Code, Meta, Panel } from "@/components/ds/kit";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";
import { SpeechSpecimen } from "./speech-specimen";

export const spec: ComponentDocSpec = {
  name: "voice",
  omitted: {
    preview: "voice is a hook with no rendered surface of its own — there is nothing to place. The Examples section below shows a small control built on top of it.",
    states: "A hook has no interaction state of its own — isSpeaking and isPaused are data useBrowserSpeech returns, consumed and rendered as state by whatever control a caller builds, such as the Speak / Stop button in Examples.",
    keyboard: "The hook renders no element, so it is never focused or reached by Tab. Keyboard behaviour belongs to the control built on top — the native button and select in Examples.",
    responsive: "A hook with no markup has no layout to reflow, zoom or mirror. The specimen under Examples is built from the system's own Button and Select, which carry their own responsive behaviour.",
  },
  sections: [
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          No package to add and nothing to configure — <Code>useBrowserSpeech</Code> reaches the
          browser&rsquo;s own <Code>speechSynthesis</Code> API directly. <Code>agent-workspace</Code>{" "}
          installs the module along with the rest of the workspace — there is no separate, voice-only
          install.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "useBrowserSpeech is the speech seam — one SpeechAdapter, not the only one a product could supply. Pass any adapter to AgentWorkspace's speech prop.",
      language: "tsx",
      code: `import { speakableText, useBrowserSpeech } from "@/components/agent";

function ReadAloud({ answer }: { answer: string }) {
  const speech = useBrowserSpeech();

  if (!speech.isSupported) return null;

  return (
    <button type="button" onClick={() => (speech.isSpeaking ? speech.stop() : speech.speak(speakableText(answer)))}>
      {speech.isSpeaking ? "Stop" : "Read aloud"}
    </button>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "A voice list and a speak button on useBrowserSpeech. The sentence is run through speakableText first, so the markdown asterisks are never read out. Speech is synthesised by your browser and nothing leaves the page.",
      label: "useBrowserSpeech",
      render: (
        <Panel label="useBrowserSpeech">
          <SpeechSpecimen />
        </Panel>
      ),
      source: `const speech = useBrowserSpeech();

<Select value={speech.voiceId ?? undefined} onValueChange={speech.setVoiceId}>
  …one SelectItem per speech.voices entry
</Select>
<Button onClick={() => speech.speak(speakableText(markdown))}>Speak</Button>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Speech synthesis is a browser API with genuinely different support across engines, so the hook states what it can do rather than assuming.",
      blocks: [
        {
          label: "useBrowserSpeech()",
          body: (
            <Meta
              items={[
                { k: "isSupported", v: "boolean — false when this environment cannot speak at all." },
                { k: "isSpeaking / isPaused", v: "boolean" },
                { k: "voices / voiceId / setVoiceId", v: "SpeechVoice[] — local voices are preferred as the default, since a network voice stalls for a beat before the first syllable." },
                { k: "speak(text) / pause() / resume() / stop()", v: "() => void. speak() cancels any utterance already queued rather than reading answers back to back." },
                { k: "analyser", v: "AnalyserNode | null — always null here: speechSynthesis exposes no audio stream. A network adapter that plays through WebAudio can return a real one, with no change to the components that read it." },
              ]}
            />
          ),
        },
        {
          label: "speakableText(markdown)",
          body: (
            <p className="type-small text-muted-foreground">
              (markdown: string) =&gt; string. Strips syntax rather than
              parsing structure — the goal is a sentence that sounds right,
              not a faithful rendering. Fenced code becomes &ldquo;— code
              block —&rdquo;; headings, emphasis, links, quotes and table
              pipes are all reduced to plain words. Exported separately
              because it is a pure function, and a product supplying its own
              adapter still needs it.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "The hook renders nothing, so the accessible behaviour is what it lets a caller build.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Speak control", v: "Build it on a native button whose label changes with isSpeaking (Speak / Stop), so the state is in the name rather than only in an icon." },
                { k: "isSupported: false", v: "A normal, non-error outcome. The workspace omits the read-aloud action entirely rather than showing it disabled with no explanation." },
                { k: "Markdown is not spoken raw", v: "speakableText strips markup and drops code blocks before anything reaches the synthesiser, so a spoken answer never reads out asterisks or pipe characters." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
