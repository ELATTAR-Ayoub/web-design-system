/**
 * Chat history, as an interface.
 *
 * The fourth seam. `AgentTransport` says what the console talks to,
 * `AvatarRenderer` what it looks like, `SpeechAdapter` what it sounds like — and
 * this says where its conversations live. A caller with Prisma, localStorage, an
 * API, or nothing at all satisfies the same type, and `ChatHistory` renders
 * identically over any of them.
 *
 * Nothing here is async-aware on purpose. The store owns its own loading and
 * error state and exposes the result; a component that had to await a rename
 * would need its own pending state for something the store already knows.
 */

import type { Attachment } from "./types";

export type ConversationSummary = {
  id: string;
  title: string;
  /** ISO timestamp. Rendered relative — "2 hours ago" — by the list. */
  updatedAt: string;
  /** First line of the opening message. Optional; the list degrades without it. */
  preview?: string;
  /**
   * Held at the top of the list, above the time-ordered rest.
   *
   * Optional because pinning is a capability rather than a guarantee: a store
   * that cannot persist the flag simply never sets it, and the list renders one
   * section instead of two. `ChatHistory` decides whether to draw the pin
   * affordance from whether `pin` exists on the store, never from whether this
   * happens to be true on some row.
   */
  pinned?: boolean;
};

/** A restored message. Deliberately narrower than AgentTurn — history is prose. */
export type RestoredMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
};

export type ConversationStore = {
  conversations: ConversationSummary[];
  /** The conversation on screen, or null for an unsaved new one. */
  activeId: string | null;
  isLoading: boolean;
  error: string | null;
  /** Load a conversation into the console. */
  open: (id: string) => void;
  /** Clear the console and start an unsaved conversation. */
  create: () => void;
  rename: (id: string, title: string) => void;
  remove: (id: string) => void;
  /** Re-read the list. Called after the console stores a turn. */
  refresh: () => void;
  /**
   * Hold a conversation at the top of the list, or release it.
   *
   * Optional, and the list reads its own affordances off that: no `pin` on the
   * store means no pin button on a card and no pinned section above the list.
   * A control that cannot do anything should not be drawn, and a store that
   * cannot persist a preference should not be asked to pretend.
   */
  pin?: (id: string, pinned: boolean) => void;
  /**
   * Produce a shareable reference to a conversation.
   *
   * Optional for the same reason, and deliberately vague about what "share"
   * means: a link, a copied transcript, an export. That is the product's
   * decision, and the menu item only needs to know whether the product has one.
   */
  share?: (id: string) => void;
};
