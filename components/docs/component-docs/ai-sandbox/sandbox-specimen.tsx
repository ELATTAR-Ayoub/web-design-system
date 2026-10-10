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

const CODE = `const nums = [3, 5, 8];
console.log(nums.reduce((a, b) => a + b, 0));`;

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
