"use client";

import { CopyIcon, RefreshCcwIcon } from "lucide-react";

import {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from "@/components/ai-elements/message";
import { Icon } from "@/components/ui/icon";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

export const REPLY_MARKDOWN = `## Renewal summary

The contract renews on **1 March**. Two things need a decision:

- the seat count (\`seats\`) went up by 12
- the discount lapses unless it is signed this month

\`\`\`ts
const total = seats * unitPrice - discount;
\`\`\`

See the [pricing page](https://example.com/pricing) for the rate card.`;

export function MessagePreview() {
  return (
    <Panel label="Message" note="user + assistant">
      <div className="flex flex-col gap-6">
        <Message from="user">
          <MessageContent>Summarise the renewal and tell me what to decide.</MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent>
            <MessageResponse>{REPLY_MARKDOWN}</MessageResponse>
          </MessageContent>
          <MessageToolbar>
            <MessageActions>
              <MessageAction label="Copy reply" tooltip="Copy reply">
                <Icon icon={CopyIcon} size="sm" tone="inherit" />
              </MessageAction>
              <MessageAction label="Regenerate reply" tooltip="Regenerate reply">
                <Icon icon={RefreshCcwIcon} size="sm" tone="inherit" />
              </MessageAction>
            </MessageActions>
          </MessageToolbar>
        </Message>
      </div>
    </Panel>
  );
}

export function MessageBranchSpecimen() {
  return (
    <Panel label="MessageBranch" note="2 versions">
      <Message from="assistant">
        <MessageBranch defaultBranch={0}>
          <MessageBranchContent>
            <MessageContent key="a">
              <MessageResponse>The renewal needs **two** decisions.</MessageResponse>
            </MessageContent>
            <MessageContent key="b">
              <MessageResponse>Decide the **seat count** and the **discount**, both this month.</MessageResponse>
            </MessageContent>
          </MessageBranchContent>
          <MessageToolbar>
            <MessageBranchSelector>
              <MessageBranchPrevious />
              <MessageBranchPage />
              <MessageBranchNext />
            </MessageBranchSelector>
          </MessageToolbar>
        </MessageBranch>
      </Message>
    </Panel>
  );
}

export function MessageStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="rest" note="user bubble">
        <Message from="user">
          <MessageContent>Draft a reply</MessageContent>
        </Message>
      </StateCell>
      <StateCell label="rest" note="assistant, plain">
        <Message from="assistant">
          <MessageContent>Here is a draft.</MessageContent>
        </Message>
      </StateCell>
      <StateCell label="hover, focus, pressed" note="inherited from Button ghost">
        <MessageActions>
          <MessageAction label="Copy reply">
            <Icon icon={CopyIcon} size="sm" tone="inherit" />
          </MessageAction>
        </MessageActions>
      </StateCell>
      <StateCell label="disabled" note="MessageAction passes disabled to Button">
        <MessageActions>
          <MessageAction disabled label="Regenerate reply">
            <Icon icon={RefreshCcwIcon} size="sm" tone="inherit" />
          </MessageAction>
        </MessageActions>
      </StateCell>
      <StateCell label="loading" note="isAnimating on MessageResponse">
        <Message from="assistant">
          <MessageContent>
            <MessageResponse isAnimating>{"Checking the **rate card**"}</MessageResponse>
          </MessageContent>
        </Message>
      </StateCell>
      <StateCell label="empty" note="no children: an empty bubble">
        <Message from="assistant">
          <MessageContent>{null}</MessageContent>
        </Message>
      </StateCell>
    </StateGrid>
  );
}
