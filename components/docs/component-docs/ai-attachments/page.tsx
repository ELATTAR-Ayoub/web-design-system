import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import {
  AttachmentHoverSpecimen,
  AttachmentsEmptySpecimen,
  AttachmentsSpecimen,
} from "./attachments-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-attachments",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Four attachments as inline chips: an image, a document, audio and a source page. Hover a chip to reveal its remove button, then press it.",
      label: "Attachments",
      render: (
        <Panel label="Attachments" note="inline">
          <AttachmentsSpecimen variant="inline" />
        </Panel>
      ),
      source: `import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";

<Attachments variant="inline">
  {items.map((item) => (
    <Attachment key={item.id} data={item} onRemove={() => remove(item.id)}>
      <AttachmentPreview />
      <AttachmentInfo />
      <AttachmentRemove />
    </Attachment>
  ))}
</Attachments>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It uses the base Button, Hover Card and Icon, so those ship with it. Its data type comes from the <code>ai</code> package (<code>FileUIPart</code>, <code>SourceDocumentUIPart</code>).
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Attachments sets the variant for everything inside it; each Attachment takes one data item (a file part or a source-document part, plus an id) and decides its layout from that variant. Nest AttachmentPreview, AttachmentInfo and AttachmentRemove inside it. AttachmentRemove renders nothing unless the Attachment has an onRemove. Wrap an Attachment in AttachmentHoverCard to show a larger preview.",
      language: "tsx",
      code: `import {
  Attachment,
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";

<Attachments variant="inline">
  <AttachmentHoverCard>
    <AttachmentHoverCardTrigger asChild>
      <Attachment data={file} onRemove={() => remove(file.id)}>
        <AttachmentPreview />
        <AttachmentInfo />
        <AttachmentRemove label="Remove pack-shot.jpg" />
      </Attachment>
    </AttachmentHoverCardTrigger>
    <AttachmentHoverCardContent>{/* the full image */}</AttachmentHoverCardContent>
  </AttachmentHoverCard>
</Attachments>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "An attachment has a rest, hover and empty state; the cells render the real component.",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="rest" note="grid, inline and list variants (below)">
                <AttachmentsSpecimen items={[{ id: "a", type: "file", mediaType: "application/pdf", filename: "campaign-brief.pdf", url: "data:application/pdf;base64,JVBERi0=" }]} variant="inline" />
              </StateCell>
              <StateCell label="hover" note="the chip fills with the accent and the remove button appears">
                <AttachmentHoverSpecimen />
              </StateCell>
              <StateCell label="empty" note="AttachmentEmpty">
                <AttachmentsEmptySpecimen />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="N/A rows">
              <p>
                <strong>focus-visible</strong> and <strong>pressed</strong> belong to the remove Button, which is the only control inside a chip; the chip itself is not focusable. <strong>loading</strong>, <strong>success</strong> and <strong>error</strong> do not apply: an attachment is a finished object, and upload progress or failure belongs to the code that stages the files. <strong>disabled</strong> does not apply: leave out <code>onRemove</code> and the remove button is not rendered at all.
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
      description: "The grid and list variants. Grid shows only the preview, so it suits images; list adds the file name and its media type.",
      label: "Variants",
      render: (
        <div className="flex flex-col gap-4">
          <Panel label="Grid" note="96px squares, remove in the corner">
            <AttachmentsSpecimen variant="grid" />
          </Panel>
          <Panel label="List" note="showMediaType">
            <div className="w-full max-w-md">
              <AttachmentsSpecimen showMediaType variant="list" />
            </div>
          </Panel>
        </div>
      ),
      source: `<Attachments variant="grid">…</Attachments>

<Attachments variant="list">
  <Attachment data={item} onRemove={remove}>
    <AttachmentPreview />
    <AttachmentInfo showMediaType />
    <AttachmentRemove />
  </Attachment>
</Attachments>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/attachments.tsx.",
      blocks: [
        {
          label: "Attachments",
          anchor: "api-attachments",
          body: (
            <Meta
              items={[
                { k: "variant?", v: '"grid" | "inline" | "list" — default "grid". Grid and inline wrap with gap-2 (grid also right-aligns with ml-auto w-fit); list stacks in a column.' },
                { k: "…div props", v: "Forwarded to the container." },
              ]}
            />
          ),
        },
        {
          label: "Attachment",
          anchor: "api-attachment",
          body: (
            <Meta
              items={[
                { k: "data", v: "AttachmentData — a FileUIPart or SourceDocumentUIPart with an id. Required. It decides the media category: image, video, audio, document (application/ or text/), source or unknown." },
                { k: "onRemove?", v: "() => void — enables AttachmentRemove." },
                { k: "…div props", v: "Forwarded. Grid is a 96px rounded square; inline is a filled h-8 chip (bg-secondary, a border, type-nav) that fills with the accent on hover; list is a bordered row." },
              ]}
            />
          ),
        },
        {
          label: "AttachmentPreview",
          anchor: "api-preview",
          body: (
            <Meta
              items={[
                { k: "fallbackIcon?", v: "ReactNode — replaces the category icon shown when there is no image or video URL." },
                { k: "…div props", v: "Forwarded. An image or video file with a URL renders the media itself; everything else renders the category icon at xs (inline) or md size, muted." },
              ]}
            />
          ),
        },
        {
          label: "AttachmentInfo",
          anchor: "api-info",
          body: (
            <Meta
              items={[
                { k: "showMediaType?", v: "boolean — also print the media type under the name. Default false." },
                { k: "…div props", v: "Forwarded. Renders nothing in the grid variant. The name is the file name, a source's title, or \"Image\" / \"Attachment\"; it truncates." },
              ]}
            />
          ),
        },
        {
          label: "AttachmentRemove",
          anchor: "api-remove",
          body: (
            <Meta
              items={[
                { k: "label?", v: 'string — the accessible name, default "Remove". Name the file: "Remove pack-shot.jpg".' },
                { k: "children?", v: "Replaces the X glyph." },
                { k: "…Button props", v: 'Forwarded; the button is variant "ghost", size "icon". Renders nothing without an onRemove on the Attachment. Its click does not bubble to the chip.' },
                { k: "Confirmation", v: 'Pressing it opens an AlertDialogConfirm naming the attachment; onRemove runs only from its Remove button.' },
              ]}
            />
          ),
        },
        {
          label: "AttachmentHoverCard and AttachmentEmpty",
          anchor: "api-hovercard",
          body: (
            <Meta
              items={[
                { k: "AttachmentHoverCard openDelay? closeDelay?", v: "Base Hover Card; both delays default to 0." },
                { k: "AttachmentHoverCardTrigger / Content", v: 'Base Hover Card parts; Content aligns "start", is w-auto and has p-2.' },
                { k: "AttachmentEmpty children?", v: 'Default "No attachments", centred in muted type-small.' },
              ]}
            />
          ),
        },
        {
          label: "Helpers and hooks",
          anchor: "api-helpers",
          body: (
            <Meta
              items={[
                { k: "getMediaCategory(data)", v: "AttachmentMediaCategory — \"source\" for source documents, otherwise from the media type." },
                { k: "getAttachmentLabel(data)", v: "string — the name a chip shows." },
                { k: "useAttachmentsContext()", v: 'The { variant } of the nearest Attachments, or { variant: "grid" } outside one.' },
                { k: "useAttachmentContext()", v: "The data, category, onRemove and variant of the nearest Attachment — throws outside one." },
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
                { k: "Roles and names", v: 'A chip is a plain div, not a control. Images carry alt text from the file name (or "Image"). The remove button is a real button named by its label plus a screen-reader-only copy of the same text, so give it the file name.' },
                { k: "Keyboard", v: "The remove button is reachable by Tab and acts on Enter or Space. In grid and inline it is invisible until the chip is hovered; it becomes visible on keyboard focus through the Button's own focus ring." },
                { k: "Target sizes", v: "Inline and grid remove buttons are nested controls: the visible pill is 20px (inline) or 24px (grid) and the button around it keeps a 40px hit area, pulled back with a negative margin so the chip does not grow. The list remove is a standalone 40px icon button." },
                { k: "Motion", v: "The remove button fades in with a short opacity transition from the system's motion tokens; reduced motion collapses it to a single frame." },
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
              A message with files needs the same chip in several places, and the three variants cover them: grid for a gallery of images, inline for the row above a text box, list for a manager panel. The AgentWorkspace uses the inline variant in <code>components/agent/workspace/workspace-composer.tsx</code>: each staged file is an <code>Attachment</code> in the composer header, where the preview swaps for the remove button on hover and a hover card shows the full image. Vendored changes: the inline chip is filled (<code>bg-secondary</code>) so it reads as an object in the message box rather than an outline drawn on the box&rsquo;s own surface; the remove button dropped its own rounded classes because Button already ships the pill radius, sizes its icon through <code>Icon</code> instead of a selector hack, and keeps a 40px hit area behind a small visual.
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
