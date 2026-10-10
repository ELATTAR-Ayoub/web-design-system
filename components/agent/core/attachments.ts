import { attachmentKind, type Attachment } from "./types";

export const MAX_INLINE_CHARS = 128_000;

export const MAX_FILE_BYTES = 25 * 1024 * 1024;

const TEXTUAL = new Set(["data", "code", "other"]);

export function isTextual(attachment: Attachment): boolean {
  if (attachment.mime.startsWith("text/")) return true;
  if (attachment.mime === "application/json") return true;
  return TEXTUAL.has(attachment.kind) && attachment.kind !== "audio";
}

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
    return base;
  }
}

export function serialiseAttachments(
  text: string,
  attachments: Attachment[],
): { text: string; attachments: Attachment[] } {
  if (!attachments.length) return { text, attachments };

  const stamped: Attachment[] = [];
  const blocks: string[] = [];
  const referenced: string[] = [];

  for (const attachment of attachments) {
    // A vision transcription is fenced as <image> and labelled a reading: the agent never saw the picture.
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
    parts.push(
      `<attached-but-not-readable>\n${referenced.join(
        "\n",
      )}\n</attached-but-not-readable>\nThe files above were attached by the user but their contents are not available to you. Ask the user to paste the relevant part if you need it.`,
    );
  }

  return { text: parts.filter(Boolean).join("\n\n"), attachments: stamped };
}

const PRODUCED_KEY = "__attachments";

export type ProducedAttachment = {
  name: string;
  mime: string;
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
