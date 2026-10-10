import { AudioPlayerPreview, AudioPlayerStateGrid } from "./audio-player-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-audio-player",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A one-second inline tone with every control the part set offers. Play it, seek, change the volume. Nothing is fetched and nothing plays on its own.",
      label: "AudioPlayer",
      render: <AudioPlayerPreview />,
      source: "import {\n  AudioPlayer,\n  AudioPlayerControlBar,\n  AudioPlayerDurationDisplay,\n  AudioPlayerElement,\n  AudioPlayerMuteButton,\n  AudioPlayerPlayButton,\n  AudioPlayerTimeDisplay,\n  AudioPlayerTimeRange,\n} from \"@/components/ai-elements/audio-player\";\n\n<AudioPlayer>\n  <AudioPlayerElement src={url} />\n  <AudioPlayerControlBar>\n    <AudioPlayerPlayButton />\n    <AudioPlayerTimeDisplay />\n    <AudioPlayerTimeRange />\n    <AudioPlayerDurationDisplay />\n    <AudioPlayerMuteButton />\n  </AudioPlayerControlBar>\n</AudioPlayer>",
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <>
          <p className="type-small text-muted-foreground">
            Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry.
          </p>
          <p className="type-small mt-2 text-muted-foreground">
            {"It needs the media-chrome package, which supplies the controls as web components. AudioPlayerElement takes either a src URL or the AI SDK's speech audio object (base64 and mediaType). Wrap the player in your own border and padding, as the specimens do; it has none."}
          </p>
        </>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "AudioPlayer is the media-chrome controller. Put one AudioPlayerElement inside it (it renders the audio element in the media slot) and an AudioPlayerControlBar with the controls you want, in the order you want them. Autoplay and preload are plain audio attributes on AudioPlayerElement.",
      language: "tsx",
      code: "<div className=\"rounded-lg border bg-card p-2\">\n  <AudioPlayer>\n    <AudioPlayerElement autoPlay src={readAloud.url} />\n    <AudioPlayerControlBar>\n      <AudioPlayerPlayButton />\n      <AudioPlayerTimeDisplay />\n      <AudioPlayerTimeRange />\n      <AudioPlayerDurationDisplay />\n      <AudioPlayerMuteButton />\n    </AudioPlayerControlBar>\n  </AudioPlayer>\n</div>",
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Playback state lives in the media-chrome controls and the audio element, not in this wrapper; the visible states are theirs.",
      blocks: [
        {
          body: <AudioPlayerStateGrid />,
        },
        {
          label: "Every state, classified",
          body: (
            <Meta
              items={[
                { k: "rest", v: "Paused at 0:00: a row of small outline icon buttons, a time label, a range for position, the duration and a mute control, all in one ButtonGroup." },
                { k: "hover", v: "The play and seek buttons take Button's outline hover; the other controls take the accent fill through the --media-control-hover-background variable." },
                { k: "focus-visible", v: "The play and seek buttons use Button's focus ring; the other media-chrome controls use their own focus styling, themed through the same variables." },
                { k: "pressed", v: "Inherited from Button for the play and seek buttons. The ranges drag natively." },
                { k: "loading", v: "N/A: this wrapper adds no loading state. Until metadata loads the duration shows the media-chrome default and the position range cannot be dragged. The specimens use preload=\"metadata\"." },
                { k: "success", v: "N/A: playback has no success state. The play button's glyph changes between play and pause with the audio state." },
                { k: "error", v: "N/A: the wrapper adds no error display. A source that cannot play leaves the controls inert; the caller decides how to report it." },
                { k: "disabled", v: "N/A: no part sets disabled. Without a media element, media-chrome controls do nothing." },
                { k: "empty", v: "N/A: AudioPlayerElement requires either src or data. The workspace mounts the player only when a read-aloud URL exists." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/audio-player.tsx.",
      blocks: [
        {
          label: "AudioPlayer",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof MediaController> (without audio)", v: "The media-chrome controller. audio is always set. style is merged after the theme variables." },
                { k: "style?", v: "CSSProperties. Merged over the --media-* variables that point media-chrome at the system's colour, font, radius and spacing tokens." },
              ]}
            />
          ),
        },
        {
          label: "AudioPlayerElement",
          body: (
            <Meta
              items={[
                { k: "src", v: "string. A URL or data URL. Use this or data." },
                { k: "data", v: "SpeechResult[\"audio\"]. An AI SDK audio object; becomes a data URL from mediaType and base64. Use this or src." },
                { k: "...ComponentProps<\"audio\"> (without src)", v: "autoPlay, preload, onEnded and so on. Rendered in slot=\"media\"." },
              ]}
            />
          ),
        },
        {
          label: "AudioPlayerControlBar",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof MediaControlBar>", v: "The media-chrome control bar, with children wrapped in a horizontal ButtonGroup." },
              ]}
            />
          ),
        },
        {
          label: "AudioPlayerPlayButton",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof MediaPlayButton>", v: "An outline icon-sm Button (as child) around the media-chrome play button." },
              ]}
            />
          ),
        },
        {
          label: "AudioPlayerSeekBackwardButton / AudioPlayerSeekForwardButton",
          body: (
            <Meta
              items={[
                { k: "seekOffset?", v: "number, default 10. Seconds to jump. Other props go to the media-chrome button, rendered as an outline icon-sm Button." },
              ]}
            />
          ),
        },
        {
          label: "AudioPlayerTimeDisplay / AudioPlayerDurationDisplay",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof MediaTimeDisplay>", v: "Time labels in a ButtonGroupText with tabular numerals." },
              ]}
            />
          ),
        },
        {
          label: "AudioPlayerTimeRange",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof MediaTimeRange>", v: "The position range, with min-h-(--size-target-min)." },
              ]}
            />
          ),
        },
        {
          label: "AudioPlayerMuteButton",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof MediaMuteButton>", v: "The mute control in a ButtonGroupText." },
              ]}
            />
          ),
        },
        {
          label: "AudioPlayerVolumeRange",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof MediaVolumeRange>", v: "The volume range, with min-h-(--size-target-min)." },
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
      description: "The controls are media-chrome web components. They provide their own roles, names and keyboard handling.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: "media-chrome sets a button role and a label on its buttons (play, seek, mute) and a slider role with a label on its ranges, and updates the labels as state changes. This wrapper does not add or override names." },
                { k: "Captions", v: "AudioPlayerElement renders an audio element with no track, and the source carries an exception for the missing-captions lint rule because captions are left to the consumer. For speech, supply a transcript beside the player." },
                { k: "Keyboard", v: "The controls are focusable; media-chrome handles Space or Enter on buttons and the arrow keys on the ranges." },
                { k: "Target size", v: "The play, seek and mute buttons are 32px because they sit together in one toolbar group; the two ranges keep min-h-(--size-target-min) so the draggable track has a full 44px hit height." },
                { k: "Motion and sound", v: "No animation is added. autoPlay is the caller's decision: an unrequested sound is disruptive, so use it only when the user has just asked for the audio, as read-aloud does." },
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
              {"A spoken reply needs a player that looks like the rest of the system and not a browser default, without writing a player. media-chrome supplies the behaviour and this file points its variables at the system's tokens and its buttons at Button. The AgentWorkspace uses it for read-aloud (components/agent/workspace/workspace-reply.tsx): an AudioPlayer in a bordered card under the reply, with play, time, a time range, the duration and mute, autoplaying the clip the user just asked for."}
            </Note>
          ),
        },
        {
          label: "Vendored changes",
          body: (
            <Note tone="action">
              {"The source carries no Vendored change comments. The theming is its own: --media-* variables are set from the system's colour, font, radius and spacing variables instead of media-chrome's defaults, and the play and seek controls are the system's outline Button used as the wrapper element."}
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
