import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "agent-core",
  description:
    "The transport-agnostic types for turns, attachments, events and transport capabilities that every agent surface renders from, with no interface of its own.",
  dependencies: [],
  exports: ["ActionTurn", "AgentEvent", "AgentSignals", "AgentTransport", "AgentTurn", "Attachment", "AttachmentDelivery", "AttachmentKind", "ErrorTurn", "PendingApproval", "SendOptions", "TextTurn", "ToolTurn", "TransportCapabilities", "TurnStatus", "UserTurn", "attachmentKind"],
  sourcePath: "components/agent/core/types.ts",
};
