/**
 * Getting a file from the user to the agent, and back.
 *
 * The honest position, stated once here so no component has to reason about it:
 *
 *   A Lens message is a string. `sendMessage(text, context?)` has no binary
 *   channel, so the only way an attachment reaches the model is inside that
 *   string. Text-bearing files therefore travel in full and the agent can quote
 *   them; an image or a PDF cannot, and its filename travels instead.
 *
 * Both outcomes are recorded on the attachment as `delivery`, and the console
 * renders that distinction rather than showing one paperclip for both. A
 * paperclip that sometimes means "the agent read your spreadsheet" and sometimes
 * means "the agent knows you have a spreadsheet" is worse than no paperclip.
 *
 * The seam for fixing this properly is `TransportCapabilities.attachments`. A
 * transport that advertises `"content"` for binaries — a multimodal endpoint, or
 * Lens once `sendMessage` grows a content-parts overload — supplies its own
 * serialiser and nothing above this file changes.
 */

import { attachmentKind, type Attachment } from "./types";

/**
 * How much of one file we are willing to put in a prompt.
 *
 * 128k characters is roughly 32k tokens: enough for a real CSV export or a long
 * document, and short of the point where one attachment evicts the conversation
 * that motivated it. Truncation is announced in the payload rather than done
 * silently, because a model that reasons over half a file while believing it has
 * all of it produces confidently wrong answers.
 */
export const MAX_INLINE_CHARS = 128_000;

/** Above this, the picker refuses the file outright rather than reading it. */
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

/** Kinds whose bytes are meaningfully text. */
const TEXTUAL = new Set(["data", "code", "other"]);

export function isTextual(attachment: Attachment): boolean {
  if (attachment.mime.startsWith("text/")) return true;
  if (attachment.mime === "application/json") return true;
  return TEXTUAL.has(attachment.kind) && attachment.kind !== "audio";
}

/**
 * Read what a File actually is, without trusting the picker's MIME.
 *
 * Browsers report `application/octet-stream` for plenty of ordinary text files
 * depending on the OS and the extension registry, so kind is derived from both
 * the MIME and the filename and the two are allowed to disagree.
 */
export async function readAttachment(file: File): Promise<Attachment> {
  const kind = attachmentKind(file.type, file.name);
  const base: Attachment = {
    id: `att-${crypto.randomUUID()}`,
    name: file.name,
    mime: file.type || "application/octet-stream",
    kind,
    size: file.size,
    url: URL.createObjectURL(file),
  };

  if (!isTextual(base)) return base;

  try {
    const text = await file.text();
    return { ...base, text };
  } catch {
    // An unreadable file still deserves to appear in the tray — the user picked
    // it, and silently dropping it looks like the picker is broken.
    return base;
  }
}

/**
 * Fold attachments into the message the agent receives.
 *
 * Returns the text to send plus the same attachments with `delivery` stamped on
 * each, so the transcript can say which ones actually made it.
 *
 * The block is delimited and named rather than pasted raw: a 3,000-line CSV
 * dropped into the middle of a sentence reads to the model as the user's own
 * words. The fences tell it where the user stops and the file starts.
 */
export function serialiseAttachments(
  text: string,
  attachments: Attachment[],
): { text: string; attachments: Attachment[] } {
  if (!attachments.length) return { text, attachments };

  const stamped: Attachment[] = [];
  const blocks: string[] = [];
  const referenced: string[] = [];

  for (const attachment of attachments) {
    // An image that has been through a vision pass carries its transcription on
    // `text`. It is fenced as an <image> rather than a <file> and labelled as a
    // reading, because the agent is receiving a description of a picture and not
    // the picture — and a model that believes it saw the thing itself will
    // answer questions the transcription cannot actually support.
    if (attachment.kind === "image" && attachment.text) {
      blocks.push(
        [
          `<image name="${escapeAttribute(attachment.name)}" type="${escapeAttribute(attachment.mime)}">`,
          "A vision model read this image on your behalf. Its reading follows.",
          attachment.text,
          "</image>",
        ].join("\n"),
      );
      stamped.push({ ...attachment, delivery: { sent: "content" } });
      continue;
    }

    if (attachment.text !== undefined && isTextual(attachment)) {
      const truncated = attachment.text.length > MAX_INLINE_CHARS;
      const body = truncated ? attachment.text.slice(0, MAX_INLINE_CHARS) : attachment.text;
      blocks.push(
        [
          `<file name="${escapeAttribute(attachment.name)}" type="${escapeAttribute(attachment.mime)}"${
            truncated ? ` truncated="true" of-bytes="${attachment.size}"` : ""
          }>`,
          body,
          "</file>",
        ].join("\n"),
      );
      stamped.push({ ...attachment, delivery: { sent: "content" } });
      continue;
    }

    referenced.push(`${attachment.name} (${attachment.mime}, ${formatBytes(attachment.size)})`);
    stamped.push({
      ...attachment,
      delivery: {
        sent: "reference",
        reason:
          attachment.kind === "image"
            ? "This agent's protocol carries text, so the image itself was not sent."
            : "This file is not text, so its contents could not be inlined.",
      },
    });
  }

  const parts = [text.trim()];
  if (blocks.length) parts.push(blocks.join("\n\n"));
  if (referenced.length) {
    // Stated as a fact about the conversation rather than as content, so the
    // model does not attempt to reason about bytes it was never given.
    parts.push(
      `<attached-but-not-readable>\n${referenced.join(
        "\n",
      )}\n</attached-but-not-readable>\nThe files above were attached by the user but their contents are not available to you. Ask the user to paste the relevant part if you need it.`,
    );
  }

  return { text: parts.filter(Boolean).join("\n\n"), attachments: stamped };
}

/**
 * Pull attachments back out of a tool result.
 *
 * The agent side of the same street: a tool that generates a report, a chart or
 * an export returns it under a known key, and the console renders it in the
 * transcript with a download. The key is namespaced so an ordinary result that
 * happens to have an `attachments` field is not mistaken for one.
 */
const PRODUCED_KEY = "__attachments";

export type ProducedAttachment = {
  name: string;
  mime: string;
  /** Inline content. One of `text` or `dataUrl` is required. */
  text?: string;
  dataUrl?: string;
};

export function extractProduced(result: unknown): Attachment[] {
  if (!result || typeof result !== "object") return [];
  const raw = (result as Record<string, unknown>)[PRODUCED_KEY];
  if (!Array.isArray(raw)) return [];

  const out: Attachment[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const { name, mime, text, dataUrl } = item as ProducedAttachment;
    if (typeof name !== "string" || typeof mime !== "string") continue;
    if (typeof text !== "string" && typeof dataUrl !== "string") continue;

    const url =
      typeof dataUrl === "string"
        ? dataUrl
        : URL.createObjectURL(new Blob([text as string], { type: mime }));

    out.push({
      id: `att-${crypto.randomUUID()}`,
      name,
      mime,
      kind: attachmentKind(mime, name),
      size: typeof text === "string" ? new Blob([text]).size : 0,
      url,
      ...(typeof text === "string" ? { text } : {}),
      delivery: { sent: "produced" },
    });
  }
  return out;
}

/** Strip the attachment envelope so the generative renderers see a clean result. */
export function withoutProduced(result: unknown): unknown {
  if (!result || typeof result !== "object") return result;
  if (!(PRODUCED_KEY in (result as Record<string, unknown>))) return result;
  const clone = { ...(result as Record<string, unknown>) };
  delete clone[PRODUCED_KEY];
  return clone;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
