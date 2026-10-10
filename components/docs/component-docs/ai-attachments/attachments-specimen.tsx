"use client";

/**
 * Live specimens for the `ai-attachments` page. Removal needs state, so the
 * set of chips lives here rather than in the plain-data spec module.
 */

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Attachment,
  AttachmentEmpty,
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  getAttachmentLabel,
  type AttachmentData,
  type AttachmentVariant,
} from "@/components/ai-elements/attachments";

const PHOTO = "/imgs/sample-photo.jpg";

export const SAMPLE_ATTACHMENTS: AttachmentData[] = [
  { id: "photo", type: "file", mediaType: "image/jpeg", filename: "pack-shot.jpg", url: PHOTO },
  { id: "brief", type: "file", mediaType: "application/pdf", filename: "campaign-brief.pdf", url: "data:application/pdf;base64,JVBERi0=" },
  { id: "memo", type: "file", mediaType: "audio/mpeg", filename: "voice-memo.mp3", url: "data:audio/mpeg;base64,AA==" },
  { id: "page", type: "source-document", mediaType: "text/html", title: "Pricing page", sourceId: "pricing" },
];

/** A removable set of attachments in one variant. */
export function AttachmentsSpecimen({
  variant = "inline",
  items = SAMPLE_ATTACHMENTS,
  showMediaType = false,
}: {
  variant?: AttachmentVariant;
  items?: AttachmentData[];
  showMediaType?: boolean;
}) {
  const [shown, setShown] = React.useState(items);

  if (shown.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2">
        <AttachmentEmpty />
        <Button onClick={() => setShown(items)} size="sm" variant="outline">
          Restore the sample set
        </Button>
      </div>
    );
  }

  return (
    <Attachments className={variant === "grid" ? "ml-0" : undefined} variant={variant}>
      {shown.map((item) => (
        <Attachment
          data={item}
          key={item.id}
          onRemove={() => setShown((prev) => prev.filter((p) => p.id !== item.id))}
        >
          <AttachmentPreview />
          <AttachmentInfo showMediaType={showMediaType} />
          <AttachmentRemove label={`Remove ${getAttachmentLabel(item)}`} />
        </Attachment>
      ))}
    </Attachments>
  );
}

/** Inline chips with a hover card that shows the full image, as the workspace composer does. */
export function AttachmentHoverSpecimen() {
  const photo = SAMPLE_ATTACHMENTS[0];
  return (
    <Attachments variant="inline">
      <AttachmentHoverCard>
        <AttachmentHoverCardTrigger asChild>
          <Attachment data={photo}>
            <AttachmentPreview />
            <AttachmentInfo />
          </Attachment>
        </AttachmentHoverCardTrigger>
        <AttachmentHoverCardContent>
          <div className="space-y-1 p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="pack-shot.jpg" className="max-h-48 rounded-md object-contain" height={192} src={PHOTO} width={256} />
            <p className="type-nav">pack-shot.jpg</p>
            <p className="type-identifier text-muted-foreground">image/jpeg</p>
          </div>
        </AttachmentHoverCardContent>
      </AttachmentHoverCard>
    </Attachments>
  );
}

/** Nothing staged. */
export function AttachmentsEmptySpecimen() {
  return <AttachmentEmpty />;
}
