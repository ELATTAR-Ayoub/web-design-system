import { EnvironmentVariablesPreview, EnvironmentVariablesStateGrid } from "./environment-variables-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-environment-variables",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "Values start masked as bullets. Use the switch to reveal them and the copy button to put an export line on the clipboard. The values are placeholders.",
      label: "EnvironmentVariables",
      render: <EnvironmentVariablesPreview />,
      source: "import {\n  EnvironmentVariable,\n  EnvironmentVariableCopyButton,\n  EnvironmentVariableGroup,\n  EnvironmentVariableName,\n  EnvironmentVariableRequired,\n  EnvironmentVariableValue,\n  EnvironmentVariables,\n  EnvironmentVariablesContent,\n  EnvironmentVariablesHeader,\n  EnvironmentVariablesTitle,\n  EnvironmentVariablesToggle,\n} from \"@/components/ai-elements/environment-variables\";\n\n<EnvironmentVariables>\n  <EnvironmentVariablesHeader>\n    <EnvironmentVariablesTitle />\n    <EnvironmentVariablesToggle />\n  </EnvironmentVariablesHeader>\n  <EnvironmentVariablesContent>\n    <EnvironmentVariable name=\"DATABASE_URL\" value={url}>\n      <EnvironmentVariableGroup>\n        <EnvironmentVariableName />\n        <EnvironmentVariableRequired />\n      </EnvironmentVariableGroup>\n      <EnvironmentVariableGroup>\n        <EnvironmentVariableValue />\n        <EnvironmentVariableCopyButton aria-label=\"Copy DATABASE_URL\" copyFormat=\"export\" />\n      </EnvironmentVariableGroup>\n    </EnvironmentVariable>\n  </EnvironmentVariablesContent>\n</EnvironmentVariables>",
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <>
          <p className="type-small text-muted-foreground">
            Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry.
          </p>
          <p className="type-small mt-2 text-muted-foreground">
            {"It uses Badge, Button, Icon and Switch from components/ui. Treat the values you show as secrets: this component masks them on screen, it does not protect them in the page's data or in the clipboard."}
          </p>
        </>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "EnvironmentVariables owns the show or hide switch and shares it with every row. Each EnvironmentVariable takes name and value and shares them with its parts. With no children a row draws the name and the masked value; compose children to add a Required badge or a copy button. The copy button reads from the row, and copyFormat chooses name, value or an export line.",
      language: "tsx",
      code: "<EnvironmentVariables defaultShowValues={false} onShowValuesChange={track}>\n  <EnvironmentVariablesHeader>\n    <EnvironmentVariablesTitle />\n    <EnvironmentVariablesToggle />\n  </EnvironmentVariablesHeader>\n  <EnvironmentVariablesContent>\n    {variables.map((variable) => (\n      <EnvironmentVariable key={variable.name} name={variable.name} value={variable.value}>\n        <EnvironmentVariableGroup>\n          <EnvironmentVariableName />\n          {variable.required ? <EnvironmentVariableRequired /> : null}\n        </EnvironmentVariableGroup>\n        <EnvironmentVariableGroup>\n          <EnvironmentVariableValue />\n          <EnvironmentVariableCopyButton\n            aria-label={`Copy ${variable.name}`}\n            copyFormat=\"export\"\n            onCopy={() => toast.success(`${variable.name} copied`)}\n          />\n        </EnvironmentVariableGroup>\n      </EnvironmentVariable>\n    ))}\n  </EnvironmentVariablesContent>\n</EnvironmentVariables>",
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The masked and revealed value states are the point of the component; the switch and the copy button inherit Switch and Button states.",
      blocks: [
        {
          body: <EnvironmentVariablesStateGrid />,
        },
        {
          label: "Every state, classified",
          body: (
            <Meta
              items={[
                { k: "rest", v: "A rounded-lg bordered card with a header (title and a switch with an eye glyph), then rows divided by hairlines. Values are masked: one bullet per character, capped at 20, and not selectable." },
                { k: "hover", v: "The switch and the copy button take their own hover states from Switch and the ghost Button. The rows do not react." },
                { k: "focus-visible", v: "Inherited: the switch and each copy button show the system focus ring." },
                { k: "pressed", v: "Inherited from Switch and Button." },
                { k: "loading", v: "N/A: values are passed in, not fetched. The component has no pending state." },
                { k: "success", v: "After a copy succeeds the button's glyph changes from copy to a check for timeout milliseconds (default 2000), then returns, and onCopy is called. Revealed values (the switch on) are the other settled state." },
                { k: "error", v: "If the clipboard is unavailable or the write is rejected, nothing visible changes and onError is called with the error; the caller should show the failure (the workspace toasts it)." },
                { k: "disabled", v: "The switch takes disabled through its props and the copy button takes disabled through Button; the value then stays in whichever state it was in." },
                { k: "empty", v: "With no EnvironmentVariable children the content area is empty and only the header shows; the component draws no empty message." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/environment-variables.tsx.",
      blocks: [
        {
          label: "EnvironmentVariables",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "Base classes: rounded-lg border bg-card." },
                { k: "showValues?", v: "boolean. Controlled visibility. When set, it wins over the internal state." },
                { k: "defaultShowValues?", v: "boolean, default false. Initial visibility when uncontrolled." },
                { k: "onShowValuesChange?", v: "(show: boolean) => void. Called when the switch is toggled, in both modes." },
              ]}
            />
          ),
        },
        {
          label: "EnvironmentVariablesHeader",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "A flex row with a bottom border." },
              ]}
            />
          ),
        },
        {
          label: "EnvironmentVariablesTitle",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode, default \"Environment Variables\". An h3 in the type-h4 role." },
              ]}
            />
          ),
        },
        {
          label: "EnvironmentVariablesToggle",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof Switch>", v: "Wrapped with an eye or eye-off glyph. checked and onCheckedChange are set from context before your props. aria-label defaults to \"Toggle value visibility\"." },
              ]}
            />
          ),
        },
        {
          label: "EnvironmentVariablesContent",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "The row container, divide-y." },
              ]}
            />
          ),
        },
        {
          label: "EnvironmentVariable",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "A flex row, justify-between, px-4 py-3." },
                { k: "name", v: "string, required." },
                { k: "value", v: "string, required." },
                { k: "children?", v: "ReactNode. Replaces the default name and masked value." },
              ]}
            />
          ),
        },
        {
          label: "EnvironmentVariableGroup",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "A flex row with gap-2 to group parts on one side of the row." },
              ]}
            />
          ),
        },
        {
          label: "EnvironmentVariableName",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode. Defaults to the row's name, in type-identifier." },
              ]}
            />
          ),
        },
        {
          label: "EnvironmentVariableValue",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode. Defaults to the value, or bullets while masked. Passing children shows them whatever the switch says, so do not pass the secret here." },
              ]}
            />
          ),
        },
        {
          label: "EnvironmentVariableCopyButton",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof Button>", v: "A ghost icon Button, size fixed to \"icon\". Named “Copy <NAME>”, then “<NAME> copied”; an aria-label you pass wins." },
                { k: "copyFormat?", v: "\"name\" | \"value\" | \"export\", default \"value\". export copies `export NAME=\"value\"`." },
                { k: "timeout?", v: "number, default 2000. How long the check glyph stays." },
                { k: "onCopy?", v: "() => void." },
                { k: "onError?", v: "(error: Error) => void. Called when the Clipboard API is missing or rejects." },
                { k: "children?", v: "ReactNode. Replaces the glyph." },
              ]}
            />
          ),
        },
        {
          label: "EnvironmentVariableRequired",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof Badge>", v: "A ghost Button, size defaults to \"icon\" (40px). There is no default accessible name: pass aria-label." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description: "The switch and the copy button are the controls. The switch has a built-in name; the copy button needs one from you.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Switch", v: "EnvironmentVariablesToggle is a Switch (role=switch, aria-checked) with aria-label \"Toggle value visibility\"; the eye glyph beside it is decorative. Space toggles it." },
                { k: "Masked values", v: "While masked the value text is a run of bullets and select-none, so a screen reader reads bullets, not the secret. Revealing it is a deliberate switch." },
                { k: "Copy button", v: "The button shows only a glyph and has no default name. Pass aria-label such as \"Copy DATABASE_URL\" so each row is distinguishable. The change from a copy to a check glyph is not announced; pair onCopy with a toast or live region." },
                { k: "Target size", v: "The copy button is the standard icon size (40px) with a smaller glyph, which meets the icon-only minimum; the switch keeps its own hit area." },
                { k: "Motion", v: "The glyph swap has no animation here. Any transition on the switch comes from Switch and is covered by the blanket prefers-reduced-motion rule." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why this exists",
      blocks: [
        {
          body: (
            <Note tone="action">
              {"Showing configuration to a reader is a risk if the secrets are on screen by default, so the value is hidden until asked for. The AgentWorkspace draws its \"environment-variables\" tool output with it (components/agent/workspace/workspace-outputs.tsx): defaultShowValues is false, each row has a Required badge when the variable is required, and the copy button copies an export line and toasts the result or the failure."}
            </Note>
          ),
        },
        {
          label: "Vendored changes",
          body: (
            <Note tone="action">
              {"The source carries no Vendored change comments. It is the upstream composition with its structural classes on the system's tokens and its glyphs drawn through the Icon component."}
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
