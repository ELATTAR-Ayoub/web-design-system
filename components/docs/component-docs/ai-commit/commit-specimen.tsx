"use client";

import * as React from "react";

import {
  Commit,
  CommitActions,
  CommitAuthor,
  CommitAuthorAvatar,
  CommitContent,
  CommitCopyButton,
  CommitFile,
  CommitFileAdditions,
  CommitFileChanges,
  CommitFileDeletions,
  CommitFileIcon,
  CommitFileInfo,
  CommitFilePath,
  CommitFileStatus,
  CommitFiles,
  CommitHash,
  CommitHeader,
  CommitInfo,
  CommitMessage,
  CommitMetadata,
  CommitSeparator,
  CommitTimestamp,
} from "@/components/ai-elements/commit";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

/**
 * Live specimens for the `ai-commit` page — one fixed commit, the same
 * composition the AgentWorkspace draws for a commit result.
 */

const HASH = "9fceb02d0ae598e95dc970b74767f19372d61af8";
const FILES = [
  { path: "src/invoices.ts", status: "modified", additions: 14, deletions: 3 },
  { path: "src/tax.ts", status: "added", additions: 38, deletions: 0 },
  { path: "src/legacy-tax.ts", status: "deleted", additions: 0, deletions: 52 },
  { path: "docs/invoices.md", status: "renamed", additions: 2, deletions: 2 },
] as const;

function Header({ date, withCopy = true }: { date: Date; withCopy?: boolean }) {
  return (
    <CommitHeader>
      <CommitAuthor>
        <CommitAuthorAvatar initials="AE" />
      </CommitAuthor>
      <CommitInfo>
        <CommitMessage>Move tax rules out of the invoice builder</CommitMessage>
        <CommitMetadata>
          <CommitHash>{HASH.slice(0, 7)}</CommitHash>
          <CommitSeparator />
          <CommitTimestamp date={date} />
        </CommitMetadata>
      </CommitInfo>
      {withCopy ? (
        <CommitActions>
          <CommitCopyButton aria-label="Copy commit hash" hash={HASH} />
        </CommitActions>
      ) : null}
    </CommitHeader>
  );
}

function Files({ files = FILES }: { files?: readonly (typeof FILES)[number][] }) {
  return (
    <CommitContent>
      <CommitFiles>
        {files.map((file) => (
          <CommitFile key={file.path}>
            <CommitFileInfo>
              <CommitFileStatus status={file.status} />
              <CommitFileIcon />
              <CommitFilePath>{file.path}</CommitFilePath>
            </CommitFileInfo>
            <CommitFileChanges>
              <CommitFileAdditions count={file.additions} />
              <CommitFileDeletions count={file.deletions} />
            </CommitFileChanges>
          </CommitFile>
        ))}
      </CommitFiles>
    </CommitContent>
  );
}

function useTwoDaysAgo() {
  const [date] = React.useState(() => new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));
  return date;
}

export function CommitPreview() {
  const date = useTwoDaysAgo();
  return (
    <Panel label="Commit" note="click the header to show the files">
      <Commit defaultOpen>
        <Header date={date} />
        <Files />
      </Commit>
    </Panel>
  );
}

export function CommitStateGrid() {
  const date = useTwoDaysAgo();
  return (
    <StateGrid cols={2}>
      <StateCell label="collapsed" note="header only">
        <Commit className="w-full">
          <Header date={date} />
          <Files />
        </Commit>
      </StateCell>
      <StateCell label="open" note="files with status and counts">
        <Commit className="w-full" defaultOpen>
          <Header date={date} />
          <Files />
        </Commit>
      </StateCell>
      <StateCell label="no copy action" note="CommitActions omitted">
        <Commit className="w-full">
          <Header date={date} withCopy={false} />
        </Commit>
      </StateCell>
      <StateCell label="empty" note="no changed files">
        <Commit className="w-full" defaultOpen>
          <Header date={date} />
          <Files files={[]} />
        </Commit>
      </StateCell>
    </StateGrid>
  );
}

export function CommitExamples() {
  return (
    <Panel label="Counts" note="a zero count renders nothing">
      <Commit defaultOpen>
        <CommitContent className="border-t-0">
          <CommitFiles>
            <CommitFile>
              <CommitFileInfo>
                <CommitFileStatus status="added" />
                <CommitFilePath>src/tax.ts</CommitFilePath>
              </CommitFileInfo>
              <CommitFileChanges>
                <CommitFileAdditions count={38} />
                <CommitFileDeletions count={0} />
              </CommitFileChanges>
            </CommitFile>
          </CommitFiles>
        </CommitContent>
      </Commit>
    </Panel>
  );
}
