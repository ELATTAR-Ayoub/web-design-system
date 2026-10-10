"use client";

import * as React from "react";

import {
  FileTree,
  FileTreeActions,
  FileTreeFile,
  FileTreeFolder,
  FileTreeIcon,
  FileTreeName,
} from "@/components/ai-elements/file-tree";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";
import { FileIcon, PlusIcon } from "lucide-react";

function Nodes() {
  return (
    <>
      <FileTreeFolder name="src" path="src">
        <FileTreeFolder name="components" path="src/components">
          <FileTreeFile name="invoice.tsx" path="src/components/invoice.tsx" />
          <FileTreeFile name="totals.tsx" path="src/components/totals.tsx" />
        </FileTreeFolder>
        <FileTreeFile name="index.ts" path="src/index.ts" />
      </FileTreeFolder>
      <FileTreeFile name="package.json" path="package.json" />
    </>
  );
}

export function FileTreePreview() {
  const [selected, setSelected] = React.useState<string | undefined>("src/index.ts");
  return (
    <Panel label="FileTree" note={selected ?? "nothing selected"}>
      <FileTree defaultExpanded={new Set(["src", "src/components"])} onSelect={setSelected} selectedPath={selected}>
        <Nodes />
      </FileTree>
    </Panel>
  );
}

export function FileTreeStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="collapsed" note="closed folder glyph, chevron right">
        <div className="w-full">
          <FileTree>
            <Nodes />
          </FileTree>
        </div>
      </StateCell>
      <StateCell label="expanded" note="open folder glyph, chevron down">
        <div className="w-full">
          <FileTree defaultExpanded={new Set(["src"])}>
            <Nodes />
          </FileTree>
        </div>
      </StateCell>
      <StateCell label="selected" note="a muted fill on the row">
        <div className="w-full">
          <FileTree defaultExpanded={new Set(["src"])} selectedPath="src/index.ts">
            <Nodes />
          </FileTree>
        </div>
      </StateCell>
      <StateCell label="empty" note="a tree with no children">
        <div className="w-full">
          <FileTree />
        </div>
      </StateCell>
    </StateGrid>
  );
}

export function FileTreeExamples() {
  return (
    <Panel label="Row actions and custom icon" note="actions do not select the row">
      <FileTree defaultExpanded={new Set(["docs"])}>
        <FileTreeFolder name="docs" path="docs">
          <FileTreeFile name="notes.md" path="docs/notes.md">
            <span className="size-4 shrink-0" />
            <FileTreeIcon>
              <Icon icon={FileIcon} size="sm" tone="info" />
            </FileTreeIcon>
            <FileTreeName>notes.md</FileTreeName>
            <FileTreeActions>
              <Button aria-label="Add a note to notes.md" size="icon" variant="ghost">
                <Icon icon={PlusIcon} size="sm" tone="muted" />
              </Button>
            </FileTreeActions>
          </FileTreeFile>
        </FileTreeFolder>
      </FileTree>
    </Panel>
  );
}
