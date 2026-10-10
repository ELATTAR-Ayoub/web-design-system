/**
 * Authored documentation page for `ai-package-info`.
 *
 * Every live specimen renders the real component from `components/ai-elements/package-info.tsx`.
 * Anything interactive lives in the companion client file
 * `package-info-specimen.tsx` (a spec module cannot carry "use client").
 */

import { PackageInfoPreview, PackageInfoStateGrid, PackageInfoChangeTypes } from "./package-info-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-package-info",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A minor upgrade with its description and dependencies, composed from the parts.",
      label: "PackageInfo",
      render: <PackageInfoPreview />,
      source: "import {\n  PackageInfo,\n  PackageInfoChangeType,\n  PackageInfoContent,\n  PackageInfoDependencies,\n  PackageInfoDependency,\n  PackageInfoDescription,\n  PackageInfoHeader,\n  PackageInfoName,\n  PackageInfoVersion,\n} from \"@/components/ai-elements/package-info\";\n\n<PackageInfo changeType=\"minor\" currentVersion=\"18.2.0\" name=\"react-dom\" newVersion=\"18.3.1\">\n  <PackageInfoHeader>\n    <PackageInfoName />\n    <PackageInfoChangeType />\n  </PackageInfoHeader>\n  <PackageInfoVersion />\n  <PackageInfoDescription>React package for working with the DOM.</PackageInfoDescription>\n  <PackageInfoContent>\n    <PackageInfoDependencies>\n      <PackageInfoDependency name=\"react\" version=\"^18.3.1\" />\n    </PackageInfoDependencies>\n  </PackageInfoContent>\n</PackageInfo>",
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
            {"It uses Badge and Icon from components/ui; the change-type colours are Badge's own semantic variants."}
          </p>
        </>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "Set name, currentVersion, newVersion and changeType on PackageInfo; the name, change-type and version parts read them from context so you do not repeat them. With no children it draws a header and a version row for you. Compose children when you want a description or a dependency list.",
      language: "tsx",
      code: "<PackageInfo\n  changeType={output.changeType}\n  currentVersion={output.currentVersion}\n  name={output.name}\n  newVersion={output.newVersion}\n>\n  <PackageInfoHeader>\n    <PackageInfoName />\n    <PackageInfoChangeType />\n  </PackageInfoHeader>\n  <PackageInfoVersion />\n  {output.description ? <PackageInfoDescription>{output.description}</PackageInfoDescription> : null}\n</PackageInfo>",
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "A read-only card. The visible variations are which pieces are present and which change-type badge shows.",
      blocks: [
        {
          body: <PackageInfoStateGrid />,
        },
        {
          label: "Every state, classified",
          body: (
            <Meta
              items={[
                { k: "rest", v: "A rounded-lg bordered card on bg-card with p-4: the header row with the package icon and name, then the version row." },
                { k: "hover", v: "N/A: nothing in it is interactive." },
                { k: "focus-visible", v: "N/A: nothing focusable." },
                { k: "pressed", v: "N/A: nothing pressable." },
                { k: "loading", v: "N/A: it renders the data it is given. The workspace only draws it once the tool output is complete." },
                { k: "success", v: "The patch change type uses the success Badge variant, meaning a safe update; it is a classification of the change, not the result of an operation." },
                { k: "error", v: "The major change type uses the destructive Badge variant, a breaking change; again a classification, not a failure. Minor is warning, added is info and removed is secondary." },
                { k: "disabled", v: "N/A: no controls." },
                { k: "empty", v: "With no changeType the badge is omitted, and with no versions the version row is omitted, leaving the name alone. PackageInfoVersion and PackageInfoChangeType each render null when their data is missing." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description: "The five change types and the Badge variant each takes.",
      label: "Change types",
      render: <PackageInfoChangeTypes />,
      source: "<PackageInfo changeType=\"major\" currentVersion=\"1.9.4\" name=\"left-pad\" newVersion=\"2.0.0\" />\n<PackageInfo changeType=\"minor\" currentVersion=\"4.1.0\" name=\"zod\" newVersion=\"4.2.0\" />\n<PackageInfo changeType=\"patch\" currentVersion=\"3.0.1\" name=\"clsx\" newVersion=\"3.0.2\" />\n<PackageInfo changeType=\"added\" name=\"vitest\" newVersion=\"3.2.0\" />\n<PackageInfo changeType=\"removed\" currentVersion=\"2.4.0\" name=\"moment\" />",
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/package-info.tsx.",
      blocks: [
        {
          label: "PackageInfo",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "Base classes: rounded-lg border bg-card p-4." },
                { k: "name", v: "string, required. Shown by PackageInfoName." },
                { k: "currentVersion?", v: "string. The version being moved from." },
                { k: "newVersion?", v: "string. The version being moved to." },
                { k: "changeType?", v: "\"major\" | \"minor\" | \"patch\" | \"added\" | \"removed\". Chooses the badge variant and glyph." },
                { k: "children?", v: "ReactNode. Replaces the default header and version row." },
              ]}
            />
          ),
        },
        {
          label: "PackageInfoHeader",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "A flex row with justify-between." },
              ]}
            />
          ),
        },
        {
          label: "PackageInfoName",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode. Defaults to the name from context, in the type-identifier role beside a package icon." },
              ]}
            />
          ),
        },
        {
          label: "PackageInfoChangeType",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode. Defaults to the change type text, capitalised in a Badge. Renders null when changeType is not set." },
              ]}
            />
          ),
        },
        {
          label: "PackageInfoVersion",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode. Defaults to current, an arrow and new. Renders null when neither version is set." },
              ]}
            />
          ),
        },
        {
          label: "PackageInfoDescription",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLParagraphElement>", v: "A p in type-body, muted, with mt-2." },
              ]}
            />
          ),
        },
        {
          label: "PackageInfoContent",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "A region separated by a top border: mt-3 border-t pt-3." },
              ]}
            />
          ),
        },
        {
          label: "PackageInfoDependencies",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "The \"Dependencies\" heading in type-small and a list area for PackageInfoDependency rows." },
              ]}
            />
          ),
        },
        {
          label: "PackageInfoDependency",
          body: (
            <Meta
              items={[
                { k: "name", v: "string, required." },
                { k: "version?", v: "string." },
                { k: "children?", v: "ReactNode. Replaces the name and version pair." },
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
      description: "Static text and a badge. Nothing is interactive, so the work is in what is read and how colour is backed up.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: "No roles. The Dependencies heading is a span, not a heading element, and the dependency rows are divs, not a list. The card reads as running text: name, change type, then versions." },
                { k: "Colour is not the only signal", v: "The change type is always the badge text (Major, Minor, Patch, Added, Removed) beside a glyph, so the severity colour is reinforcement. The versions are text; the arrow between them is decorative." },
                { k: "Keyboard", v: "None: not interactive." },
                { k: "Target size", v: "N/A: no controls." },
                { k: "Motion", v: "None." },
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
              {"A dependency change is read by two questions: what package, and how risky is the jump. A fixed card with the version pair and a severity badge answers both at a glance. The AgentWorkspace draws its \"package-info\" tool output with it (components/agent/workspace/workspace-outputs.tsx): the header with name and change type, the version row, the description when present, and the dependency list in PackageInfoContent when the output has any."}
            </Note>
          ),
        },
        {
          label: "Vendored changes",
          body: (
            <Note tone="action">
              {"The upstream hardcoded palette classes for each change type are replaced with the system's semantic Badge variants, keeping the same severity mapping (major destructive, minor warning, patch success, added info, removed secondary). The Dependencies heading drops its font-medium, wide tracking and uppercase and becomes quiet type-small text, because it is a row heading and not a badge."}
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
