import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { FileTreeExamples, FileTreePreview, FileTreeStateGrid } from "./file-tree-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-file-tree",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A project tree. Fold a folder with its chevron, select a file or folder by clicking its name; the note shows the selected path.",
      label: "FileTree",
      render: <FileTreePreview />,
      source: `import { FileTree, FileTreeFile, FileTreeFolder } from "@/components/ai-elements/file-tree";

<FileTree defaultExpanded={new Set(["src"])} selectedPath={selected} onSelect={setSelected}>
  <FileTreeFolder name="src" path="src">
    <FileTreeFile name="index.ts" path="src/index.ts" />
  </FileTreeFolder>
  <FileTreeFile name="package.json" path="package.json" />
</FileTree>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "You build the tree by nesting: a FileTreeFolder holds folders and files, and each needs a unique path (the key for expansion and selection) and a name (the label). Expansion is a Set of folder paths — uncontrolled with defaultExpanded, or controlled with expanded and onExpandedChange. Selection is controlled by selectedPath and reported by onSelect for both files and folders. Give a FileTreeFile children to draw your own row; then include the alignment spacer yourself.",
      language: "tsx",
      code: `const [selected, setSelected] = useState<string>();
const [expanded, setExpanded] = useState(new Set(["src"]));

<FileTree
  expanded={expanded}
  onExpandedChange={setExpanded}
  selectedPath={selected}
  onSelect={setSelected}
>
  {nodes.map((node) => <Node key={node.path} node={node} />)}
</FileTree>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "A folder is collapsed or expanded; any row can be selected.",
      blocks: [
        { body: <FileTreeStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: folder rows with a chevron and a folder glyph, file rows with a file glyph. <strong>hover</strong>: the row takes a faint muted fill. <strong>focus-visible</strong>: each row is focusable and takes the browser focus ring, as do the two buttons inside a folder row. <strong>pressed</strong>: the row buttons and file rows carry the shared press feel. <strong>selected</strong>: a stronger muted fill and <code className="type-code">aria-selected</code>. <strong>expanded</strong>: the chevron turns 90 degrees, the glyph becomes an open folder and the children appear indented under a left rule. <strong>loading</strong>, <strong>success</strong>, <strong>error</strong>: N/A — the tree renders what it is given, and a host that loads children lazily draws its own placeholder rows. <strong>disabled</strong>: N/A — there is no disabled prop; a row that must not be chosen is left out or drawn with your own children. <strong>empty</strong>: a FileTree with no children draws an empty bordered box.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description: "A row composed by hand, with a trailing action that does not select the row.",
      label: "Examples",
      render: <FileTreeExamples />,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/file-tree.tsx.",
      blocks: [
        {
          label: "FileTree",
          body: (
            <Meta
              items={[
                { k: "expanded?", v: "Set<string> — controlled set of expanded folder paths." },
                { k: "defaultExpanded?", v: "Set<string> — initial set when uncontrolled; default empty." },
                { k: "onExpandedChange?", v: "(expanded: Set<string>) => void — called with a new Set on every toggle." },
                { k: "selectedPath?", v: "string — the selected file or folder path." },
                { k: "onSelect?", v: "(path: string) => void — a click on a row's name, or Enter or Space on a file row." },
                { k: "className?", v: 'string, plus div props except onSelect. The root is role="tree" and uses the code type role.' },
              ]}
            />
          ),
        },
        {
          label: "FileTreeFolder",
          body: (
            <Meta
              items={[
                { k: "path", v: "string, required — unique key for expansion and selection." },
                { k: "name", v: "string, required — the label." },
                { k: "children?", v: "ReactNode — nested folders and files, shown when expanded." },
                { k: "…div props", v: "On the treeitem wrapper." },
              ]}
            />
          ),
        },
        {
          label: "FileTreeFile",
          body: (
            <Meta
              items={[
                { k: "path", v: "string, required." },
                { k: "name", v: "string, required." },
                { k: "icon?", v: "ReactNode — replaces the default file glyph in the default row." },
                { k: "children?", v: "ReactNode — replaces the whole default row (spacer, icon, name)." },
                { k: "…div props", v: "On the treeitem row." },
              ]}
            />
          ),
        },
        {
          label: "FileTreeIcon, FileTreeName, FileTreeActions",
          body: (
            <Meta
              items={[
                { k: "FileTreeIcon", v: "span props; a non-shrinking wrapper for the glyph." },
                { k: "FileTreeName", v: "span props; truncates long names." },
                { k: "FileTreeActions", v: 'div props; role="group", pushed to the end of the row, and it stops clicks and key presses so an action does not select the row.' },
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
      description: "The WAI-ARIA tree pattern: treeitems with selection, folders with aria-expanded and a role=\"group\" of children, and arrow-key navigation.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles", v: 'The root is role="tree"; every folder wrapper and file row is role="treeitem" with aria-selected. Child lists are not wrapped in role="group" and rows carry no aria-expanded, so a screen reader announces the structure by reading order and the open or closed folder glyph is not exposed as a state.' },
                { k: "Accessible names", v: "A file row's name is its text; a folder row is named by its folder name (aria-label), not by everything inside it. The chevron is named “Expand <name>” / “Collapse <name>”. The chevron and the folder's name button are tabIndex -1 — the row owns the keys. Keys: Up / Down / Home / End move between visible rows; Right opens a folder or steps into it; Left closes it or steps out to the parent; Enter and Space select." },
                { k: "Keyboard", v: "Every row is in the tab order (tabIndex 0). Enter or Space selects a file row; in a folder row the chevron and the name are two buttons, each reachable by Tab, the chevron toggling and the name selecting. Arrow-key navigation, Home and End are not implemented." },
                { k: "Target size", v: "File rows and the folder name button have a 44px minimum height. The chevron keeps a small 14px glyph and restores its hit area with matching negative margin and padding." },
                { k: "Motion and reduced motion", v: "The chevron rotation uses a transition and a folder's children use the shared expand/collapse height animation; the blanket prefers-reduced-motion rule collapses both." },
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
              When an agent touches files, the useful answer is a tree with each change marked. The AgentWorkspace maps a <code className="type-code">file-tree</code> tool result to this component in <code className="type-code">ToolOutputView</code> (<code className="type-code">components/agent/workspace/workspace-outputs.tsx</code>): the flat path list is turned into nested nodes by <code className="type-code">tool-output.ts</code>, every folder starts expanded, and each file row is composed by hand (spacer, glyph, name) with an Added, Modified or Deleted marker at the end in a success, info or error ink. Vendored changes: the treeitem role requires <code className="type-code">aria-selected</code>, so both row types carry it; the glyphs are system Icons in the muted tone; the press feel and the 44px row floor were added, and the small chevron keeps a visual size with a restored hit area.
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
