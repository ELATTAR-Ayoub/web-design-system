import {
  CircleAlertIcon,
  FileTextIcon,
  ImageIcon,
  SheetIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Code, Meta, Note, Panel, Row, StateCell, StateGrid } from "@/components/ds/kit";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

const ATTACHMENT_STATES = [
  { state: "idle", label: "idle", note: "dashed — nothing chosen yet" },
  { state: "uploading", label: "uploading", note: "spinner + shimmer" },
  { state: "processing", label: "processing", note: "sent, being read" },
  { state: "error", label: "error", note: "border and media turn" },
  { state: "done", label: "done", note: "the resting state" },
] as const;

export const spec: ComponentDocSpec = {
  name: "attachment",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A file in a conversation, with its remove control — the interactive part most call sites actually use. AttachmentMedia's preview dialog and AttachmentAction's download behaviour are shown under Examples.",
      render: (
        <Row>
          <Attachment>
            <AttachmentMedia>
              <Icon icon={FileTextIcon} size="md" tone="inherit" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>eclipse-vault-notes.pdf</AttachmentTitle>
              <AttachmentDescription>2.1 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove eclipse-vault-notes.pdf">
                <Icon icon={XIcon} size="xs" tone="inherit" />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </Row>
      ),
      source: `<Attachment>
  <AttachmentMedia>
    <Icon icon={FileTextIcon} size="md" tone="inherit" />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>eclipse-vault-notes.pdf</AttachmentTitle>
    <AttachmentDescription>2.1 MB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove eclipse-vault-notes.pdf">
      <Icon icon={XIcon} size="xs" tone="inherit" />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "The minimal import and call.",
      language: "tsx",
      code: `import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { FileTextIcon } from "lucide-react";
import { Icon } from "@/components/ui/icon";

export function PickedFile() {
  return (
    <Attachment>
      <AttachmentMedia>
        <Icon icon={FileTextIcon} size="md" tone="inherit" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>eclipse-vault-notes.pdf</AttachmentTitle>
        <AttachmentDescription>2.1 MB</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "orientation is horizontal (a row) or vertical (a tile); AttachmentMedia's own variant is icon or image, and image dims itself until the file is done or idle — what makes an upload look like it is still arriving.",
      label: "Media: icon and image",
      render: (
        <Panel note="the image variant dims itself until the state is done">
          <Row align="start">
            <Attachment orientation="vertical">
              <AttachmentMedia variant="image">
                <Image
                  src="/imgs/sample-image.png"
                  alt=""
                  width={96}
                  height={96}
                />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>sample-image.png</AttachmentTitle>
                <AttachmentDescription>412 KB</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment orientation="vertical">
              <AttachmentMedia>
                <Icon icon={ImageIcon} size="md" tone="inherit" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>slab-front.heic</AttachmentTitle>
                <AttachmentDescription>No preview</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment>
              <AttachmentMedia>
                <Icon icon={FileTextIcon} size="md" tone="inherit" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>grading-report.pdf</AttachmentTitle>
                <AttachmentDescription>horizontal · icon</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </Row>
        </Panel>
      ),
      source: `<Attachment orientation="vertical">
  <AttachmentMedia variant="image">
    <Image src="/imgs/sample-image.png" alt="" width={96} height={96} />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>sample-image.png</AttachmentTitle>
    <AttachmentDescription>412 KB</AttachmentDescription>
  </AttachmentContent>
</Attachment>

<Attachment>
  <AttachmentMedia>
    <Icon icon={FileTextIcon} size="md" tone="inherit" />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>grading-report.pdf</AttachmentTitle>
    <AttachmentDescription>horizontal · icon</AttachmentDescription>
  </AttachmentContent>
</Attachment>`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description:
        "default (40px well) · sm (32px) · xs (28px, a tighter radius). The type does not change: all three write text-xs, and styles/tokens.css remaps --text-xs to --text-small, so every size renders at the 14px floor.",
      label: "Horizontal, at all three sizes",
      render: (
        <Panel>
          <Row align="start" className="flex-col sm:flex-row">
            {(["default", "sm", "xs"] as const).map((size) => (
              <Attachment key={size} size={size}>
                <AttachmentMedia>
                  <Icon icon={FileTextIcon} size="md" tone="inherit" />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>eclipse-vault-notes.pdf</AttachmentTitle>
                  <AttachmentDescription>size={size}</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction aria-label="Remove eclipse-vault-notes.pdf">
                    <Icon icon={XIcon} size="xs" tone="inherit" />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </Row>
        </Panel>
      ),
      source: `<Attachment size="sm">
  <AttachmentMedia>
    <Icon icon={FileTextIcon} size="md" tone="inherit" />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>eclipse-vault-notes.pdf</AttachmentTitle>
    <AttachmentDescription>size=sm</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove eclipse-vault-notes.pdf">
      <Icon icon={XIcon} size="xs" tone="inherit" />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "AttachmentMedia's src makes a thumbnail expandable in a Dialog by default; AttachmentAction's href makes a control download by default. Both are parameters on components that already existed. AttachmentGroup lays a row of files out as a sideways-scrolling, snapping strip.",
      label: "preview, download and grouping",
      render: (
        <div className="space-y-6">
          <Panel label="preview and download" note="two props, not two components">
            <Row align="start">
              <Attachment orientation="vertical">
                <AttachmentMedia
                  variant="image"
                  src="/imgs/sample-image.png"
                  previewName="sample-image.png"
                  previewDescription="412 KB"
                >
                  <Image
                    src="/imgs/sample-image.png"
                    alt=""
                    width={96}
                    height={96}
                  />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>sample-image.png</AttachmentTitle>
                  <AttachmentDescription>412 KB · press to expand</AttachmentDescription>
                </AttachmentContent>
              </Attachment>

              <Attachment>
                <AttachmentMedia>
                  <Icon icon={FileTextIcon} size="md" tone="inherit" />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>grading-report.pdf</AttachmentTitle>
                  <AttachmentDescription>2.6 MB</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    href="/imgs/sample-image.png"
                    downloadName="grading-report.pdf"
                  />
                </AttachmentActions>
              </Attachment>
            </Row>

            <Note tone="action" title="Both are parameters on components that already existed" className="mt-5">
              <p>
                <Code>AttachmentMedia</Code> takes <Code>src</Code> and
                previews it by default; pass <Code>preview={"{false}"}</Code>{" "}
                only when the well must remain static. The media opens in a{" "}
                <Code>Dialog</Code> over the dimmed page rather than a new
                tab, which would hand the reader to the browser&rsquo;s own
                viewer and lose whatever they were reading. §5&rsquo;s table
                calls a dialog the reversible one, and there is nothing here
                to decide. The close control is a <Code>secondary</Code>{" "}
                Button, not the stock ghost ✕ — this panel has no header band
                for the ✕ to sit on, and a ghost control disappears into
                whatever pixel of the photograph it lands on. The trigger is{" "}
                <Code>AttachmentTrigger</Code>, the overlay control this
                component already had, so the thumbnail is never wrapped in a
                button that would inherit padding and a variant it does not
                want.
              </p>
              <p className="mt-3">
                <Code>AttachmentAction</Code> takes <Code>href</Code> and
                downloads by default; pass{" "}
                <Code>download={"{false}"}</Code> only when it should
                navigate instead. The save control carries both signals §5
                demands: the glyph rolls to a check through{" "}
                <Code>IconSwap</Code> so the control confirms it heard you,
                and a toast reports the outcome. It says <em>Saving</em>,
                never <em>Saved</em> — a plain <Code>download</Code> anchor
                gives the page no completion event, so claiming the bytes
                reached the disk would assert a capability this component
                does not have.
              </p>
              <p className="mt-3">
                Both were briefly written as new exports and then folded
                back. §5 grows a base component with a variant or a
                parameter — that is how <Code>Button</Code>, <Code>Badge</Code>{" "}
                and <Code>Alert</Code> already work — and a new component for
                one more branch is the wrong direction.
              </p>
            </Note>
          </Panel>

          <Panel label="AttachmentGroup" note="scrolls sideways, snaps, and fades its edge">
            <AttachmentGroup>
              {[
                "rarity-table.csv",
                "eclipse-vault-notes.pdf",
                "grading-report.pdf",
                "pull-rates-q3.csv",
                "slab-front.png",
                "slab-back.png",
              ].map((name) => (
                <Attachment key={name} size="sm">
                  <AttachmentMedia>
                    <Icon icon={FileTextIcon} size="md" tone="inherit" />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{name}</AttachmentTitle>
                    <AttachmentDescription>Ready</AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
              ))}
            </AttachmentGroup>
          </Panel>
        </div>
      ),
      source: `<AttachmentMedia
  variant="image"
  src="/imgs/sample-image.png"
  previewName="sample-image.png"
>
  <Image src="/imgs/sample-image.png" alt="" width={96} height={96} />
</AttachmentMedia>

<AttachmentAction href="/files/grading-report.pdf" downloadName="grading-report.pdf" />

<AttachmentGroup>
  <Attachment size="sm">{/* ... */}</Attachment>
  <Attachment size="sm">{/* ... */}</Attachment>
</AttachmentGroup>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "Five states, because a file being uploaded, a file being read and a file that failed are three different things and a spinner alone says none of them.",
      blocks: [
        {
          body: (
            <StateGrid cols={5}>
              {ATTACHMENT_STATES.map((s) => (
                <StateCell key={s.state} label={s.label} note={s.note}>
                  <Attachment state={s.state} orientation="vertical" size="sm">
                    <AttachmentMedia>
                      {s.state === "uploading" || s.state === "processing" ? (
                        <Spinner aria-hidden />
                      ) : s.state === "error" ? (
                        <Icon icon={CircleAlertIcon} size="md" tone="inherit" />
                      ) : (
                        <Icon icon={SheetIcon} size="md" tone="inherit" />
                      )}
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>rarity-table.csv</AttachmentTitle>
                      <AttachmentDescription>
                        {s.state === "error" ? "Upload failed" : "18 KB"}
                      </AttachmentDescription>
                    </AttachmentContent>
                  </Attachment>
                </StateCell>
              ))}
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the state model">
              <Code>idle</Code> draws a dashed border — nothing chosen yet.{" "}
              <Code>uploading</Code> and <Code>processing</Code> put the
              title on a shimmer, distinct states because a file mid-upload
              and a file already received but still being read are different
              claims about where the bytes are. <Code>error</Code> tints the
              border and the media well and switches the description to
              &ldquo;Upload failed&rdquo;. <Code>done</Code> is the resting
              state a picked or produced file settles into.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Attachment and its slots.",
      blocks: [
        {
          label: "Attachment",
          body: (
            <Meta
              items={[
                {
                  k: "state",
                  v: "\"idle\" | \"uploading\" | \"processing\" | \"error\" | \"done\", optional, defaults to \"done\".",
                },
                { k: "size", v: "\"default\" | \"sm\" | \"xs\", optional, defaults to \"default\"." },
                { k: "orientation", v: "\"horizontal\" | \"vertical\", optional, defaults to \"horizontal\"." },
              ]}
            />
          ),
        },
        {
          label: "AttachmentMedia",
          body: (
            <Meta
              items={[
                { k: "variant", v: "\"icon\" | \"image\", optional, defaults to \"icon\". image expects a real <img> child and holds it at 60% opacity until the state is done or idle." },
                { k: "src", v: "string, optional. Makes the thumbnail expandable in a Dialog." },
                { k: "preview", v: "boolean, optional, defaults to true. Opts a src out of the expand behaviour." },
                { k: "previewName", v: "string, optional. Accessible title for the dialog; defaults to the URL's own filename." },
                { k: "previewVideo", v: "boolean, optional, defaults to false. Renders a <video controls> rather than an <img> inside the dialog." },
                { k: "previewDescription", v: "ReactNode, optional. A second, screen-reader-only line under the dialog title." },
              ]}
            />
          ),
        },
        {
          label: "AttachmentAction",
          body: (
            <Meta
              items={[
                { k: "href", v: "string, optional. Turns the control into a save action, downloading by default." },
                { k: "download", v: "boolean, optional, defaults to true. Set false to make href a plain navigation link instead." },
                { k: "downloadName", v: "string, optional. The filename the browser saves it as; defaults to the URL's own name." },
                { k: "size", v: "Forwarded to Button, defaults to \"icon-xs\"." },
              ]}
            />
          ),
        },
        {
          label: "AttachmentTrigger / AttachmentGroup",
          body: (
            <Meta
              items={[
                {
                  k: "AttachmentTrigger",
                  v: "asChild (boolean, optional, defaults to false). An absolutely positioned button covering the whole tile, for when the tile itself opens the file — exists so an action can still sit on top without a button nesting inside a button.",
                },
                {
                  k: "AttachmentGroup",
                  v: "No required props. A horizontally scrolling, snapping strip with a faded edge.",
                },
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
      description:
        "What is actually wired up, verified against attachment.tsx rather than assumed from its name.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "State exposure",
                  v: "data-state, data-size and data-orientation drive the visual variants directly — there is no separate ARIA state kept in sync with them.",
                },
                {
                  k: "AttachmentTrigger",
                  v: "A real <button> absolutely positioned over the tile so the whole card is pressable without nesting a button inside a button.",
                },
                {
                  k: "AttachmentAction",
                  v: "Each action is a ghost icon button and needs its own aria-label, since an icon alone has no accessible name. When it wraps a download link, the accessible name defaults to \"Download {name}\" (or \"Open {name}\" when download is false) unless one is given explicitly.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Tab / Shift+Tab", v: "Moves focus to AttachmentTrigger, then each AttachmentAction, in document order." },
                { k: "Space / Enter", v: "Activates a trigger or an action — native <button> behaviour." },
                {
                  k: "Inside the preview dialog",
                  v: "Radix's Dialog primitive underlies the expanded-media view (AttachmentMedia's src), so Escape closes it and focus is trapped inside while it is open — see the Dialog page for the primitive's own keyboard contract.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "A tile has no breakpoint classes of its own — every size is fixed regardless of viewport. What actually adapts to width is AttachmentGroup, which is a scroll container rather than a wrap-and-reflow grid.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Attachment sizing",
                  v: "size (default/sm/xs) and orientation are caller-chosen props, not viewport-driven — a tile does not shrink itself at a narrow width; a caller reaching for a smaller footprint on mobile passes size=\"sm\" explicitly, same as at any width.",
                },
                {
                  k: "AttachmentGroup",
                  v: "flex min-w-0 gap-3 overflow-x-auto with scroll-fade-x, snap-x snap-mandatory and scrollbar-none — a horizontally scrolling, snapping strip at every width rather than a grid that wraps to more rows on a wide screen. The row overflows sideways by design; nothing about it is expected to fit without scrolling once there are enough files.",
                },
                {
                  k: "Titles and descriptions",
                  v: "AttachmentTitle and AttachmentDescription both truncate (block min-w-0 truncate) rather than wrap, at every size and width — a long filename ellipsises instead of growing the tile's height.",
                },
                {
                  k: "Preview dialog",
                  v: "The expanded-media Dialog (AttachmentMedia's src) is max-w-3xl sm:max-w-3xl — capped the same both below and above the sm breakpoint, so it never grows past a readable width on a large monitor.",
                },
                {
                  k: "RTL / 200% zoom",
                  v: "Measured with no overflow under RTL or 200% text zoom — the tile's fixed-width media well and truncating text columns hold their footprint in both.",
                },
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
