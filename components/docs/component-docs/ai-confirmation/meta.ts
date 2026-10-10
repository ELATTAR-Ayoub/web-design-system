/**
 * Documentation metadata for `ai-confirmation`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-confirmation",
  description:
    "An approval prompt for a tool call that records the answer in the same place: request text with Approve and Decline actions, then Approved or Declined.",
  dependencies: ["source-foundation"],
  exports: ["ConfirmationProps","Confirmation","ConfirmationTitleProps","ConfirmationTitle","ConfirmationRequestProps","ConfirmationRequest","ConfirmationAcceptedProps","ConfirmationAccepted","ConfirmationRejectedProps","ConfirmationRejected","ConfirmationActionsProps","ConfirmationActions","ConfirmationActionProps","ConfirmationAction"],
  sourcePath: "components/ai-elements/confirmation.tsx",
};
