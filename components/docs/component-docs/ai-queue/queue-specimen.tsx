"use client";

import { ArrowDownIcon, ArrowUpIcon, SendHorizontalIcon, Trash2Icon } from "lucide-react";
import * as React from "react";

import {
  Queue,
  QueueItem,
  QueueItemAction,
  QueueItemActions,
  QueueItemAttachment,
  QueueItemContent,
  QueueItemDescription,
  QueueItemFile,
  QueueItemImage,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
  type QueueMessage,
  type QueueTodo,
} from "@/components/ai-elements/queue";
import { Icon } from "@/components/ui/icon";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

const MESSAGES: QueueMessage[] = [
  { id: "m1", parts: [{ type: "text", text: "Then export the March invoices as CSV" }] },
  {
    id: "m2",
    parts: [
      { type: "text", text: "Compare against this ledger" },
      { type: "file", filename: "ledger-march.xlsx", mediaType: "application/vnd.ms-excel", url: "" },
      { type: "file", filename: "sample-photo.jpg", mediaType: "image/jpeg", url: "/imgs/sample-photo.jpg" },
    ],
  },
  { id: "m3", parts: [{ type: "text", text: "Email the summary to finance" }] },
];

const TODOS: QueueTodo[] = [
  { id: "t1", title: "Reproduce the rounding bug", description: "Against the staging ledger", status: "completed" },
  { id: "t2", title: "Patch the rounding rule", status: "pending" },
];

function MessageRows({ messages, onChange }: { messages: QueueMessage[]; onChange: (next: QueueMessage[]) => void }) {
  const move = (index: number, by: -1 | 1) => {
    const next = [...messages];
    [next[index], next[index + by]] = [next[index + by], next[index]];
    onChange(next);
  };
  return (
    <ul>
      {messages.map((message, i) => {
        const text = message.parts.find((p) => p.type === "text")?.text ?? "";
        const files = message.parts.filter((p) => p.type === "file");
        return (
          <QueueItem key={message.id}>
            <div className="flex items-center gap-2">
              <QueueItemIndicator />
              <QueueItemContent>{text}</QueueItemContent>
              <QueueItemActions>
                <QueueItemAction aria-label="Move up" className="focus-visible:opacity-100 pointer-coarse:opacity-100" disabled={i === 0} onClick={() => move(i, -1)}>
                  <Icon icon={ArrowUpIcon} size="xs" tone="inherit" />
                </QueueItemAction>
                <QueueItemAction aria-label="Move down" className="focus-visible:opacity-100 pointer-coarse:opacity-100" disabled={i === messages.length - 1} onClick={() => move(i, 1)}>
                  <Icon icon={ArrowDownIcon} size="xs" tone="inherit" />
                </QueueItemAction>
                <QueueItemAction aria-label="Send now" className="focus-visible:opacity-100 pointer-coarse:opacity-100">
                  <Icon icon={SendHorizontalIcon} size="xs" tone="inherit" />
                </QueueItemAction>
                <QueueItemAction
                  aria-label="Remove from queue"
                  className="focus-visible:opacity-100 pointer-coarse:opacity-100"
                  onClick={() => onChange(messages.filter((m) => m.id !== message.id))}
                >
                  <Icon icon={Trash2Icon} size="xs" tone="inherit" />
                </QueueItemAction>
              </QueueItemActions>
            </div>
            {files.length > 0 && (
              <QueueItemAttachment>
                {files.map((file) =>
                  file.mediaType?.startsWith("image/") && file.url ? (
                    <QueueItemImage alt={file.filename ?? "attachment"} key={file.filename} src={file.url} />
                  ) : (
                    <QueueItemFile key={file.filename}>{file.filename}</QueueItemFile>
                  ),
                )}
              </QueueItemAttachment>
            )}
          </QueueItem>
        );
      })}
    </ul>
  );
}

export function QueueShowcase() {
  const [messages, setMessages] = React.useState(MESSAGES);
  return (
    <Panel label="Queue" note={`${messages.length} queued`}>
      <div className="mx-auto w-full max-w-md">
        {messages.length === 0 ? (
          <p className="type-small text-muted-foreground">Nothing queued — the workspace renders no Queue at all.</p>
        ) : (
          <Queue>
            <QueueSection>
              <QueueSectionTrigger>
                <QueueSectionLabel count={messages.length} label="Queued" />
              </QueueSectionTrigger>
              <QueueSectionContent>
                <MessageRows messages={messages} onChange={setMessages} />
              </QueueSectionContent>
            </QueueSection>
          </Queue>
        )}
      </div>
    </Panel>
  );
}

export function QueueStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="rest">
        <div className="w-full">
          <Queue>
            <QueueSection>
              <QueueSectionTrigger>
                <QueueSectionLabel count={1} label="Queued" />
              </QueueSectionTrigger>
              <QueueSectionContent>
                <MessageRows messages={MESSAGES.slice(0, 1)} onChange={() => {}} />
              </QueueSectionContent>
            </QueueSection>
          </Queue>
        </div>
      </StateCell>
      <StateCell label="collapsed" note="QueueSection defaultOpen={false}">
        <div className="w-full">
          <Queue>
            <QueueSection defaultOpen={false}>
              <QueueSectionTrigger>
                <QueueSectionLabel count={3} label="Queued" />
              </QueueSectionTrigger>
              <QueueSectionContent>
                <MessageRows messages={MESSAGES} onChange={() => {}} />
              </QueueSectionContent>
            </QueueSection>
          </Queue>
        </div>
      </StateCell>
      <StateCell label="completed item" note="completed dims and strikes through">
        <div className="w-full">
          <Queue>
            <ul>
              <QueueItem>
                <div className="flex items-center gap-2">
                  <QueueItemIndicator completed />
                  <QueueItemContent completed>Reproduce the rounding bug</QueueItemContent>
                </div>
                <QueueItemDescription completed>Against the staging ledger</QueueItemDescription>
              </QueueItem>
            </ul>
          </Queue>
        </div>
      </StateCell>
    </StateGrid>
  );
}

export function QueueExamples() {
  return (
    <Panel label="Todos in a QueueList">
      <div className="mx-auto w-full max-w-md">
        <Queue>
          <QueueList>
            {TODOS.map((todo) => {
              const completed = todo.status === "completed";
              return (
                <QueueItem key={todo.id}>
                  <div className="flex items-center gap-2">
                    <QueueItemIndicator completed={completed} />
                    <QueueItemContent completed={completed}>{todo.title}</QueueItemContent>
                  </div>
                  {todo.description ? <QueueItemDescription completed={completed}>{todo.description}</QueueItemDescription> : null}
                </QueueItem>
              );
            })}
          </QueueList>
        </Queue>
      </div>
    </Panel>
  );
}
