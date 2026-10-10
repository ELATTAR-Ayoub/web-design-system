"use client";

import { useState } from "react";

import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Message, MessageContent } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";

type Turn = { id: string; from: "agent" | "user"; text: string };

const SCRIPT: Turn[] = [
  { id: "m1", from: "agent", text: "Morning. Three sets on your watchlist moved overnight." },
  { id: "m2", from: "user", text: "Which three?" },
  { id: "m3", from: "agent", text: "Eclipse Vault, Origin Pulse and Nightfall. Eclipse is the outlier — up 14% on twice the usual volume." },
  { id: "m4", from: "user", text: "Anything unusual about the volume?" },
  { id: "m5", from: "agent", text: "It is concentrated. Four accounts account for most of it, and all four bought within the same eleven minutes." },
  { id: "m6", from: "user", text: "Show me what I hold in that set." },
  { id: "m7", from: "agent", text: "Six cards, two of them graded. At this morning's mark that is $2,481.00, up $312.00 since Friday." },
  { id: "m8", from: "user", text: "Leave it. What about Nightfall?" },
  { id: "m9", from: "agent", text: "Flat on price, but the float shrank — nine sealed packs left listed, down from thirty-one." },
];

export function MessageScrollerAddDemo() {
  const [shown, setShown] = useState(2);
  const turns = SCRIPT.slice(0, shown);
  const done = shown >= SCRIPT.length;

  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="start">
      <div className="flex h-full flex-col">
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="p-6">
              {turns.map((t) => (
                <MessageScrollerItem key={t.id} messageId={t.id}>
                  <Message align={t.from === "user" ? "end" : "start"}>
                    <MessageContent>
                      <Bubble
                        variant={t.from === "user" ? "default" : "muted"}
                        align={t.from === "user" ? "end" : "start"}
                      >
                        <BubbleContent>{t.text}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="end" />
        </MessageScroller>
        <div className="flex justify-center border-t border-border p-3">
          <Button size="sm" variant="outline" disabled={done} onClick={() => setShown((n) => n + 1)}>
            {done ? "That's the whole conversation" : "Add message"}
          </Button>
        </div>
      </div>
    </MessageScrollerProvider>
  );
}
