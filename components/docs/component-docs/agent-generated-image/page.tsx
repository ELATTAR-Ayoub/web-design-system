/**
 * Authored documentation page for `agent-generated-image`.
 *
 * The frame is driven by a stage prop, so the switcher lives in
 * `generated-image-specimen.tsx`; the States grid renders the real frame.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { GeneratedImageSpecimen, GeneratedImageStill } from "./generated-image-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "agent-generated-image",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Pick a stage. The picture is blurred and a little desaturated while it is queued or generating, lightly blurred while it is refining, and sharp when it is done. A pill in the corner names the stage and leaves once the image is done. Error dims the picture and offers Retry.",
      label: "GeneratedImage",
      render: (
        <Panel label="Generated Image" note="Switch the stage">
          <GeneratedImageSpecimen />
        </Panel>
      ),
      source: `import { GeneratedImage } from "@/components/agent/parts/generated-image";

<GeneratedImage stage={stage} onRetry={retry}>
  <img src={url} alt="A dusk landscape" />
</GeneratedImage>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Ships with the agent family; there is no generated-image-only install. It is used by the AgentWorkspace reply, and it depends on Button, Spinner and the system&rsquo;s own motion utilities.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Render GeneratedImage as soon as a tool starts making an image, with the stage the tool reports, and hand it the img once there is one. It holds a square the width of its container. With no child it shimmers, except at an error, where it sits on the muted surface; with a child the clarity of the child shows progress. Pass onRetry to offer Retry on an error.",
      language: "tsx",
      code: `// A preview may arrive at the first stage; pass it as soon as you have it.
<GeneratedImage stage={output.stage} onRetry={canRetry ? retry : undefined}>
  {attachment?.url ? <img src={attachment.url} alt={attachment.name} /> : null}
</GeneratedImage>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The five stages are the component's input; each cell renders the real frame at one stage. The last cell has no image yet.",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="queued" note="Heavy blur, desaturated">
                <GeneratedImageStill stage="queued" />
              </StateCell>
              <StateCell label="generating" note="Heavy blur, desaturated">
                <GeneratedImageStill stage="generating" />
              </StateCell>
              <StateCell label="refining" note="Light blur">
                <GeneratedImageStill stage="refining" />
              </StateCell>
              <StateCell label="complete" note="Sharp; the pill has left">
                <GeneratedImageStill stage="complete" />
              </StateCell>
              <StateCell label="error" note="Dimmed, with Retry">
                <GeneratedImageStill stage="error" />
              </StateCell>
              <StateCell label="no image yet" note="Shimmer on the card surface">
                <GeneratedImageStill stage="queued" withImage={false} />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="N/A rows">
              <p>
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong> belong to the Retry button, which is the system&rsquo;s own Button; the frame itself is not a control. <strong>disabled</strong> and <strong>empty</strong> do not apply: a frame with nothing yet is the shimmer state (an error with no picture sits on the muted surface instead).
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
      description: "Read from components/agent/parts/generated-image.tsx.",
      blocks: [
        {
          label: "GeneratedImage",
          anchor: "api-generated-image",
          body: (
            <Meta
              items={[
                { k: "stage", v: "ImageStage — required. \"queued\", \"generating\", \"refining\", \"complete\" or \"error\"." },
                { k: "onRetry?", v: "() => void — shows a Retry button at the error stage. Without it the error shows no button." },
                { k: "children?", v: "React.ReactNode — the img, once there is one. It may arrive at the first stage as a low-quality preview." },
                { k: "className?", v: "string — on the root." },
                { k: "Elements", v: "The root (data-slot=\"generated-image\", data-stage, role=\"group\", aria-label=\"Generated image\") is a square with a card radius that clips its content. It holds the image wrapper (blur-xl and saturate-50 while queued or generating, blur-sm while refining, blur-none when done; opacity-40 on error; transition-[filter] on duration-normal), the stage pill (bg-background/80, a Spinner except on error, text-destructive-ink with an alert icon on error, anim-exit when done), a centred Retry (Button size=\"sm\" variant=\"outline\") and a visually hidden role=\"status\" element. With no child the root is anim-shimmer; otherwise bg-muted." },
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
                { k: "Roles and names", v: "One group named \"Generated image\". A visually hidden status element holds the stage label (Queued, Generating, Refining, Done or Couldn't generate), so a change is announced once. The visible pill is hidden from assistive technology so the label is not read twice." },
                { k: "Keyboard", v: "The frame takes no focus. Retry is a Button, reached by Tab and pressed with Enter or Space." },
                { k: "Reduced motion", v: "The blur change is a CSS transition and the shimmer, spinner and pill exit are the system's animation utilities, so the global reduced-motion rule stops them. The stage still reads from the pill and the announced label." },
                { k: "Contrast", v: "The pill label sits on bg-background/80 in text-foreground, and the error label uses text-destructive-ink, the ink that is tuned per theme." },
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
              A generated image takes time and the reply needs to keep its place while it does. Progress reads from clarity, so a preview can sharpen in front of the reader instead of popping in. The AgentWorkspace reply (<code>components/agent/workspace/workspace-reply.tsx</code>) puts each image tool&rsquo;s output in this frame, from its first stage to the finished picture. It is original to this system and uses only its tokens and motion utilities.
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
