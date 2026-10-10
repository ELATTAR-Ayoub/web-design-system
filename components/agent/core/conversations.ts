import type { Attachment } from "./types";

export type ConversationSummary = {
  id: string;
  title: string;
  updatedAt: string;
  preview?: string;
  pinned?: boolean;
};

export type RestoredMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
};

export type ConversationStore = {
  conversations: ConversationSummary[];
  activeId: string | null;
  isLoading: boolean;
  error: string | null;
  open: (id: string) => void;
  create: () => void;
  rename: (id: string, title: string) => void;
  remove: (id: string) => void;
  refresh: () => void;
  pin?: (id: string, pinned: boolean) => void;
  share?: (id: string) => void;
};
