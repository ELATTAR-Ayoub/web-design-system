"use client";

import type { UIMessage } from "ai";
import { MessageSquareIcon } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Icon } from "@/components/ui/icon";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

export const SAMPLE_MESSAGES: UIMessage[] = [
  { id: "m1", role: "user", parts: [{ type: "text", text: "What changed in the renewal?" }] },
  { id: "m2", role: "assistant", parts: [{ type: "text", text: "Seats went up by 12 and the discount lapses on 31 March." }] },
  { id: "m3", role: "user", parts: [{ type: "text", text: "Who has to sign?" }] },
  { id: "m4", role: "assistant", parts: [{ type: "text", text: "The account owner, then finance for anything over the limit." }] },
  { id: "m5", role: "user", parts: [{ type: "text", text: "Draft the email to finance." }] },
  { id: "m6", role: "assistant", parts: [{ type: "text", text: "Done. It names the seat change, the lapse date and the amount." }] },
];

function textOf(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

export function ConversationPreview() {
  return (
    <Panel flush label="Conversation" note="role=log">
      <div className="flex h-80 flex-col">
        <Conversation aria-label="Renewal thread">
          <ConversationContent>
            {SAMPLE_MESSAGES.map((m) => (
              <Message from={m.role} key={m.id}>
                <MessageContent>{textOf(m)}</MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationDownload aria-label="Download conversation" messages={SAMPLE_MESSAGES} />
          <ConversationScrollButton aria-label="Scroll to latest message" />
        </Conversation>
      </div>
    </Panel>
  );
}

export function ConversationStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="empty" note="the default ConversationEmptyState">
        <div className="flex h-48 w-full flex-col">
          <Conversation aria-label="Empty thread">
            <ConversationContent className="h-full">
              <ConversationEmptyState />
            </ConversationContent>
          </Conversation>
        </div>
      </StateCell>
      <StateCell label="empty, custom" note="icon, title and description">
        <div className="flex h-48 w-full flex-col">
          <Conversation aria-label="Custom empty thread">
            <ConversationContent className="h-full">
              <ConversationEmptyState
                description="Ask about a contract to begin."
                icon={<Icon icon={MessageSquareIcon} tone="inherit" />}
                title="No questions yet"
              />
            </ConversationContent>
          </Conversation>
        </div>
      </StateCell>
    </StateGrid>
  );
}
