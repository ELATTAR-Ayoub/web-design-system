import { ImagePreview, ImageStateGrid } from "./image-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-image",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A generated image from base64. The specimen uses a small inline SVG so nothing is fetched.",
      label: "Image",
      render: <ImagePreview />,
      source: "import { Image } from \"@/components/ai-elements/image\";\n\n<Image\n  alt=\"Abstract mountains under a low sun\"\n  base64={image.base64}\n  mediaType={image.mediaType}\n  uint8Array={image.uint8Array}\n/>",
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
            {"It takes the shape of the AI SDK's experimental GeneratedImage type, so the result of an image generation call can be spread straight onto it. There is no component dependency beyond the cn helper."}
          </p>
        </>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "Spread a generated image onto Image, or pass base64 and mediaType by hand. The uint8Array field is required by the type but not used: the picture is built from base64 and mediaType. Always pass alt; the component does not invent one.",
      language: "tsx",
      code: "import { Image } from \"@/components/ai-elements/image\";\n\n<Image alt={image.alt} className=\"w-full\" {...image.props} />",
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "A plain image element. It has no interactive state and no loading state of its own.",
      blocks: [
        {
          body: <ImageStateGrid />,
        },
        {
          label: "Every state, classified",
          body: (
            <Meta
              items={[
                { k: "rest", v: "An img with a data URL source, h-auto and max-w-full so it scales down with its container, and rounded-md with overflow hidden." },
                { k: "hover", v: "N/A: not interactive." },
                { k: "focus-visible", v: "N/A: an img is not focusable and the component adds no button or link." },
                { k: "pressed", v: "N/A: not interactive." },
                { k: "loading", v: "N/A: the bytes are already inline, so the data URL decodes immediately. The workspace shows its own skeleton or progress while an image is still being generated." },
                { k: "success", v: "N/A: no operation of its own." },
                { k: "error", v: "N/A: no onError handling. Invalid base64 or a wrong media type leaves a broken image." },
                { k: "disabled", v: "N/A: nothing to disable." },
                { k: "empty", v: "N/A: base64 and mediaType are required. An empty base64 string renders a broken image rather than nothing." },
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
      description: "Read from components/ai-elements/image.tsx.",
      blocks: [
        {
          label: "Image",
          body: (
            <Meta
              items={[
                { k: "base64", v: "string, required. The image bytes, base64 encoded, without a data: prefix." },
                { k: "mediaType", v: "string, required. For example image/png. Used to build the data URL." },
                { k: "uint8Array", v: "Uint8Array, required by the type. Accepted and discarded; it is not rendered." },
                { k: "alt?", v: "string. The alternative text. Not defaulted: leave it out and the picture has no description." },
                { k: "className?", v: "string. Merged after h-auto max-w-full overflow-hidden rounded-md." },
                { k: "...img attributes", v: "Any other img attribute (width, height, loading, onLoad) is spread onto the element." },
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
      description: "One img element, so the whole of its accessibility is its alt text.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role and name", v: "A native img. The name is the alt prop. There is no fallback, so an Image without alt is read as an unnamed image by some screen readers and skipped by others; pass alt for every generated picture, or alt=\"\" if it is purely decorative." },
                { k: "Keyboard", v: "None: it is not interactive." },
                { k: "Target size", v: "N/A: not a control." },
                { k: "Motion", v: "None." },
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
              {"The AI SDK returns generated pictures as base64 plus a media type, and every surface that shows one would otherwise build the data URL and the sizing by hand. The AgentWorkspace renders generated image attachments through Image (components/agent/workspace/workspace-outputs.tsx, via generatedImage from reply-model.ts) so they scale to the column and share one radius."}
            </Note>
          ),
        },
        {
          label: "Vendored changes",
          body: (
            <Note tone="action">
              {"The source carries no Vendored change comments. The only deviation from the upstream file is that the unused uint8Array prop is destructured away so it never reaches the DOM, with an eslint exception for the unused name."}
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
