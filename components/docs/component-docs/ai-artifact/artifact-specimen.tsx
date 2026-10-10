"use client";

import { CopyIcon, DownloadIcon } from "lucide-react";

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

const CONTENT = `export function total(items: number[]) {
  return items.reduce((sum, n) => sum + n, 0);
}`;

export function ArtifactPreview() {
  return (
    <Panel label="Artifact" note="title, description, two actions">
      <Artifact>
        <ArtifactHeader>
          <div>
            <ArtifactTitle>total.ts</ArtifactTitle>
            <ArtifactDescription>Created by the agent, 4 lines</ArtifactDescription>
          </div>
          <ArtifactActions>
            <ArtifactAction icon={CopyIcon} label="Copy" tooltip="Copy to clipboard" />
            <ArtifactAction icon={DownloadIcon} label="Download" tooltip="Download file" />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent>
          <pre className="type-code text-foreground">{CONTENT}</pre>
        </ArtifactContent>
      </Artifact>
    </Panel>
  );
}

export function ArtifactStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="rest" note="header + content">
        <Artifact className="w-full">
          <ArtifactHeader>
            <ArtifactTitle>notes.md</ArtifactTitle>
            <ArtifactActions>
              <ArtifactAction icon={CopyIcon} label="Copy" tooltip="Copy to clipboard" />
            </ArtifactActions>
          </ArtifactHeader>
          <ArtifactContent>
            <p className="type-small text-muted-foreground">Three decisions, one open question.</p>
          </ArtifactContent>
        </Artifact>
      </StateCell>
      <StateCell label="with close" note="ArtifactClose, default X">
        <Artifact className="w-full">
          <ArtifactHeader>
            <ArtifactTitle>notes.md</ArtifactTitle>
            <ArtifactClose />
          </ArtifactHeader>
        </Artifact>
      </StateCell>
      <StateCell label="empty" note="no content yet">
        <Artifact className="w-full">
          <ArtifactHeader>
            <ArtifactTitle>untitled</ArtifactTitle>
          </ArtifactHeader>
          <ArtifactContent>
            <p className="type-small text-muted-foreground">Nothing generated yet.</p>
          </ArtifactContent>
        </Artifact>
      </StateCell>
    </StateGrid>
  );
}
