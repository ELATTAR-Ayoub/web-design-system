"use client";

import { useState } from "react";

import { AGENT_STATES, AGENT_STATE_LABEL, AgentAvatar, type AgentState } from "@/components/agent";
import { Button } from "@/components/ui/button";

/** Every state in the machine, drawn at once. */
export function AvatarMatrix({ accent }: { accent?: string }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4 lg:grid-cols-5">
      {AGENT_STATES.map((state) => (
        <div key={state} className="flex flex-col items-center gap-3 bg-background p-5">
          <AgentAvatar state={state} size="lg" accent={accent} />
          <p className="type-small text-center text-muted-foreground">{AGENT_STATE_LABEL[state]}</p>
        </div>
      ))}
    </div>
  );
}

/** The face plus its state named in words, cycling under the reader's control. */
export function AvatarPlayground() {
  const [state, setState] = useState<AgentState>("thinking");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-5 rounded-lg border border-border bg-background p-6">
        <AgentAvatar state={state} size="xl" />
        <p className="type-body text-foreground" role="status">
          {AGENT_STATE_LABEL[state]}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {AGENT_STATES.map((s) => (
          <Button key={s} size="sm" variant={s === state ? "default" : "outline"} onClick={() => setState(s)}>
            {s}
          </Button>
        ))}
      </div>
    </div>
  );
}
