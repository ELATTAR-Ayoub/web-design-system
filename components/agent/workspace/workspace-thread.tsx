"use client";

import * as React from "react";
import { toast } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
} from "@/components/ai-elements/checkpoint";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import type { OpenInTarget } from "@/components/ai-elements/open-in-chat";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";

import type { Checkpoint as CheckpointData } from "@/components/agent/core/run";
import type { AgentTransport } from "@/components/agent/core/types";

import { checkpointsByTurn, groupReplies, runOwner } from "./reply-model";
import { WorkspaceReply, WorkspaceUserMessage } from "./workspace-reply";

export type WorkspaceThreadProps = {
  transport: AgentTransport;
  busy: boolean;
  starters?: string[];
  onSend: (text: string) => void;
  speak?: (text: string) => Promise<string>;
  openIn?: OpenInTarget[];
  composerEmpty?: boolean;
  className?: string;
};

type Restore = { label: string; tooltip: string; onRestore: () => void };

function TurnCheckpoints({ restores }: { restores: (Restore & { id: string })[] }) {
  return restores.map((r) => (
    <Checkpoint key={r.id}>
      <CheckpointIcon />
      <CheckpointTrigger aria-label={`Restore to ${r.label}`} onClick={r.onRestore} tooltip={r.tooltip}>
        {r.label}
      </CheckpointTrigger>
    </Checkpoint>
  ));
}

export function WorkspaceThread({
  transport,
  busy,
  starters,
  onSend,
  speak,
  openIn,
  composerEmpty = true,
  className,
}: WorkspaceThreadProps) {
  const pairs = React.useMemo(() => groupReplies(transport.turns, busy), [transport.turns, busy]);
  const run = transport.runState?.run ?? null;
  const owner = run ? runOwner(pairs, run.startedAt) : null;

  const chatPoints = React.useMemo(() => checkpointsByTurn(transport.restorePoints ?? []), [transport.restorePoints]);
  const runPoints = React.useMemo(() => checkpointsByTurn(run?.checkpoints ?? []), [run?.checkpoints]);

  const { restoreTo, resume } = transport;
  const canRestoreChat = Boolean(restoreTo);
  const canRestoreRun = Boolean(resume && transport.capabilities.checkpoints);

  const restoresAfter = (turnIds: string[]) => {
    const out: (Restore & { id: string })[] = [];
    const chat = (cp: CheckpointData) => ({
      id: `chat-${cp.id}`,
      label: cp.label,
      tooltip: "Restores the conversation to this point",
      onRestore: () => {
        restoreTo?.(cp.turnId);
        toast.success(`Restored to “${cp.label}”`);
      },
    });
    const task = (cp: CheckpointData) => ({
      id: `run-${cp.id}`,
      label: cp.label,
      tooltip: "Resumes the run from this point",
      onRestore: () => {
        void Promise.resolve(resume?.(cp.id)).then(
          () => toast.success(`Resumed from “${cp.label}”`),
          () => toast.error("Couldn't resume from that checkpoint. Try again."),
        );
      },
    });
    for (const id of turnIds) {
      if (canRestoreChat) out.push(...(chatPoints.get(id) ?? []).map(chat));
      if (canRestoreRun) out.push(...(runPoints.get(id) ?? []).map(task));
    }
    return out;
  };

  return (
    <TooltipProvider>
      <Conversation aria-label="Conversation" className={cn("min-h-0", className)}>
        <ConversationContent className="mx-auto w-full max-w-3xl gap-10 p-4">
          {pairs.length === 0 ? (
            <ConversationEmptyState>
              <h2 className="type-h4">How can I help you today?</h2>
              {starters?.length ? (
                <Suggestions className="w-full flex-wrap justify-center">
                  {starters.map((s) => (
                    <Suggestion key={s} onClick={onSend} suggestion={s} />
                  ))}
                </Suggestions>
              ) : null}
            </ConversationEmptyState>
          ) : (
            pairs.map(({ user, reply }, i) => (
              <div className="flex flex-col gap-6" key={user.id}>
                <WorkspaceUserMessage transport={transport} turn={user} />
                <WorkspaceReply
                  busy={busy}
                  composerEmpty={composerEmpty}
                  isLast={i === pairs.length - 1}
                  onSend={onSend}
                  reply={reply}
                  openIn={openIn}
                  run={owner === user.id ? run : null}
                  speak={speak}
                  transport={transport}
                  user={user}
                />
                <TurnCheckpoints restores={restoresAfter([user.id, ...(reply?.turns.map((t) => t.id) ?? [])])} />
              </div>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    </TooltipProvider>
  );
}
