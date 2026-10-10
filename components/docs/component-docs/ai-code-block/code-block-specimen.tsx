"use client";

import * as React from "react";

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockLanguageSelector,
  CodeBlockLanguageSelectorContent,
  CodeBlockLanguageSelectorItem,
  CodeBlockLanguageSelectorTrigger,
  CodeBlockLanguageSelectorValue,
  CodeBlockTitle,
} from "@/components/ai-elements/code-block";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

const TS = `type Plan = { seats: number; tier: "team" | "business" };

// Price per seat per month
export function price(plan: Plan): number {
  const base = plan.tier === "team" ? 12 : 24;
  return base * plan.seats;
}`;

const PY = `def price(seats: int, tier: str) -> int:
    # Price per seat per month
    base = 12 if tier == "team" else 24
    return base * seats`;

const SAMPLES = { typescript: TS, python: PY } as const;
type Lang = keyof typeof SAMPLES;

export function CodeBlockPreview() {
  return (
    <Panel label="CodeBlock" note="tokens are coloured by the system's --code-* roles">
      <CodeBlock code={TS} language="typescript">
        <CodeBlockHeader>
          <CodeBlockTitle>
            <CodeBlockFilename>price.ts</CodeBlockFilename>
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton />
          </CodeBlockActions>
        </CodeBlockHeader>
      </CodeBlock>
    </Panel>
  );
}

export function CodeBlockStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="rest" note="highlighted, no chrome">
        <div className="w-full">
          <CodeBlock code={'const answer = 42;'} language="typescript" />
        </div>
      </StateCell>
      <StateCell label="with header and copy" note="copy swaps to a check for 2s">
        <div className="w-full">
          <CodeBlock code={'npm run build'} language="bash">
            <CodeBlockHeader>
              <CodeBlockTitle>
                <CodeBlockFilename>shell</CodeBlockFilename>
              </CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton />
              </CodeBlockActions>
            </CodeBlockHeader>
          </CodeBlock>
        </div>
      </StateCell>
      <StateCell label="line numbers" note="showLineNumbers">
        <div className="w-full">
          <CodeBlock code={PY} language="python" showLineNumbers />
        </div>
      </StateCell>
      <StateCell label="empty" note="an empty string is one blank line">
        <div className="w-full">
          <CodeBlock code="" language="typescript" />
        </div>
      </StateCell>
    </StateGrid>
  );
}

export function CodeBlockExamples() {
  const [lang, setLang] = React.useState<Lang>("typescript");
  return (
    <Panel label="Language selector" note="the code and the grammar change together">
      <CodeBlock code={SAMPLES[lang]} language={lang} showLineNumbers>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <CodeBlockLanguageSelector onValueChange={(v) => setLang(v as Lang)} value={lang}>
              <CodeBlockLanguageSelectorTrigger aria-label="Language">
                <CodeBlockLanguageSelectorValue />
              </CodeBlockLanguageSelectorTrigger>
              <CodeBlockLanguageSelectorContent>
                <CodeBlockLanguageSelectorItem value="typescript">TypeScript</CodeBlockLanguageSelectorItem>
                <CodeBlockLanguageSelectorItem value="python">Python</CodeBlockLanguageSelectorItem>
              </CodeBlockLanguageSelectorContent>
            </CodeBlockLanguageSelector>
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton />
          </CodeBlockActions>
        </CodeBlockHeader>
      </CodeBlock>
    </Panel>
  );
}
