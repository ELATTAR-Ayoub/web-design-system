/**
 * Documentation metadata for `agent-core`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `agent-core` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "agent-core",
  description:
    "The transport-agnostic types for turns, attachments, events and transport capabilities that every agent surface renders from, with no interface of its own.",
  dependencies: [],
  exports: ["ActionTurn", "AgentEvent", "AgentSignals", "AgentTransport", "AgentTurn", "Attachment", "AttachmentDelivery", "AttachmentKind", "ErrorTurn", "PendingApproval", "SendOptions", "TextTurn", "ToolTurn", "TransportCapabilities", "TurnStatus", "UserTurn", "attachmentKind"],
  sourcePath: "components/agent/core/types.ts",
};
