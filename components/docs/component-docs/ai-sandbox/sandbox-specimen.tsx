"use client";

import {
  Sandbox,
  SandboxContent,
  SandboxHeader,
  SandboxTabContent,
  SandboxTabs,
  SandboxTabsBar,
  SandboxTabsList,
  SandboxTabsTrigger,
} from "@/components/ai-elements/sandbox";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

/**
 * Live specimens for the `ai-sandbox` documentation page. The code and output
 * panes are plain `pre` blocks; the workspace puts a `CodeBlock` in each.
 */

const CODE = `const nums = [3, 5, 8];
console.log(nums.reduce((a, b) => a + b, 0));`;

/** The Preview: a Code / Output tab pair under a status header. */
export function SandboxPreview() {
  return (
    <Panel label="Sandbox" note="header badge + Code / Output tabs">
      <Sandbox>
        <SandboxHeader state="output-available" title="javascript sandbox" />
        <SandboxContent>
          <SandboxTabs defaultValue="output">
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
                <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
            <SandboxTabContent value="code">
              <pre className="type-code p-4 text-foreground">{CODE}</pre>
            </SandboxTabContent>
            <SandboxTabContent value="output">
              <pre className="type-code p-4 text-foreground">16</pre>
            </SandboxTabContent>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    </Panel>
  );
}

/** The States grid: the four tool states the header badge reports, each collapsed. */
export function SandboxStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="input-streaming" note="pending">
        <Sandbox defaultOpen={false}>
          <SandboxHeader state="input-streaming" title="python sandbox" />
        </Sandbox>
      </StateCell>
      <StateCell label="input-available" note="running">
        <Sandbox defaultOpen={false}>
          <SandboxHeader state="input-available" title="python sandbox" />
        </Sandbox>
      </StateCell>
      <StateCell label="output-available" note="completed">
        <Sandbox defaultOpen={false}>
          <SandboxHeader state="output-available" title="python sandbox" />
        </Sandbox>
      </StateCell>
      <StateCell label="output-error" note="error">
        <Sandbox defaultOpen={false}>
          <SandboxHeader state="output-error" title="python sandbox" />
        </Sandbox>
      </StateCell>
    </StateGrid>
  );
}
