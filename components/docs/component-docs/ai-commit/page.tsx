/**
 * Authored documentation page for `ai-commit`.
 *
 * Specimens live in `commit-specimen.tsx` (a spec module cannot carry
 * `"use client"`).
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { CommitExamples, CommitPreview, CommitStateGrid } from "./commit-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-commit",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A git commit: author, message, short hash and age, with the changed files and their line counts one click away.",
      label: "Commit",
      render: <CommitPreview />,
      source: `import {
  Commit, CommitAuthor, CommitAuthorAvatar, CommitContent, CommitFile, CommitFileAdditions, CommitFileChanges,
  CommitFileDeletions, CommitFileInfo, CommitFilePath, CommitFileStatus, CommitFiles, CommitHash, CommitHeader,
  CommitInfo, CommitMessage, CommitMetadata, CommitSeparator, CommitTimestamp,
} from "@/components/ai-elements/commit";

<Commit defaultOpen>
  <CommitHeader>
    <CommitAuthor><CommitAuthorAvatar initials="AE" /></CommitAuthor>
    <CommitInfo>
      <CommitMessage>Move tax rules out of the invoice builder</CommitMessage>
      <CommitMetadata>
        <CommitHash>9fceb02</CommitHash>
        <CommitSeparator />
        <CommitTimestamp date={new Date(commit.date)} />
      </CommitMetadata>
    </CommitInfo>
  </CommitHeader>
  <CommitContent>
    <CommitFiles>
      <CommitFile>
        <CommitFileInfo>
          <CommitFileStatus status="modified" />
          <CommitFilePath>src/invoices.ts</CommitFilePath>
        </CommitFileInfo>
        <CommitFileChanges>
          <CommitFileAdditions count={14} />
          <CommitFileDeletions count={3} />
        </CommitFileChanges>
      </CommitFile>
    </CommitFiles>
  </CommitContent>
</Commit>`,
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
        "Commit is a Collapsible: CommitHeader is the trigger and CommitContent the body, so open, defaultOpen and onOpenChange work as on any Collapsible. CommitCopyButton needs the hash to copy and is placed in CommitActions, which keeps its clicks from toggling the commit. CommitTimestamp takes a Date and prints a relative day count (today, 2 days ago); it renders empty on the server and fills in on the client to avoid a hydration mismatch.",
      language: "tsx",
      code: `<Commit defaultOpen>
  <CommitHeader>
    <CommitInfo>
      <CommitMessage>{commit.message}</CommitMessage>
      <CommitMetadata>
        <CommitHash>{commit.hash.slice(0, 7)}</CommitHash>
        <CommitSeparator />
        <CommitTimestamp date={new Date(commit.date)} />
      </CommitMetadata>
    </CommitInfo>
    <CommitActions>
      <CommitCopyButton hash={commit.hash} onCopy={() => toast.success("Copied")} />
    </CommitActions>
  </CommitHeader>
  <CommitContent>…</CommitContent>
</Commit>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Open or closed, with each file's status and counts in the body.",
      blocks: [
        { body: <CommitStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: avatar, message, hash and age, with the copy button. <strong>hover</strong>: the header dims slightly (opacity), and a file row takes a faint muted fill. <strong>focus-visible</strong>: the copy button takes the focus ring; the header is not focusable (see Accessibility). <strong>pressed</strong>: the header and the copy Button carry the shared press feel. <strong>loading</strong>: N/A — a commit is complete data. <strong>success</strong>: the copy button swaps its glyph to a check for <code className="type-code">timeout</code> ms (default 2000). <strong>error</strong>: a failed or unavailable clipboard calls <code className="type-code">onError</code>; file status is not an error state — a deleted file is error-toned text, an added file success, modified warning and renamed info (A, M, D, R). <strong>disabled</strong>: N/A — nothing on a commit is disabled; copy accepts <code className="type-code">disabled</code> as any Button does. <strong>empty</strong>: with no files, the body is an empty bordered area; a zero addition or deletion count renders nothing.
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
      description: "A single added file: only the non-zero count shows.",
      label: "Examples",
      render: <CommitExamples />,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/commit.tsx.",
      blocks: [
        {
          label: "Commit, CommitHeader, CommitContent",
          body: (
            <Meta
              items={[
                { k: "Commit", v: "Collapsible props (open, defaultOpen, onOpenChange); className is merged onto a bordered card." },
                { k: "CommitHeader", v: "CollapsibleTrigger props; rendered as a div (asChild) with a 44px minimum height, the press feel and a hover dim." },
                { k: "CommitContent", v: "CollapsibleContent props; a top border and padding; opens with the shared height animation." },
              ]}
            />
          ),
        },
        {
          label: "CommitAuthor, CommitAuthorAvatar, CommitInfo, CommitMessage, CommitMetadata, CommitHash, CommitSeparator, CommitTimestamp",
          body: (
            <Meta
              items={[
                { k: "CommitAuthor", v: "div props." },
                { k: "CommitAuthorAvatar initials", v: "string, required — shown in the Avatar fallback; plus Avatar props, default size-8." },
                { k: "CommitInfo", v: "div props; the flexible column for message and metadata." },
                { k: "CommitMessage", v: "span props; the body type role." },
                { k: "CommitMetadata", v: "div props; the small, muted row." },
                { k: "CommitHash", v: "span props; the identifier role with a commit glyph before the children." },
                { k: "CommitSeparator", v: 'span props; children default to a bullet.' },
                { k: "CommitTimestamp date", v: "Date, required — also written to dateTime as an ISO string. Children replace the relative text." },
              ]}
            />
          ),
        },
        {
          label: "CommitActions, CommitCopyButton",
          body: (
            <Meta
              items={[
                { k: "CommitActions", v: 'div props; role="group", and it stops click and key events so pressing a button does not toggle the commit.' },
                { k: "CommitCopyButton hash", v: "string, required — what is copied." },
                { k: "onCopy?, onError?, timeout?", v: "() => void, (error: Error) => void, number (default 2000)." },
                { k: "…Button props", v: "A ghost icon Button (40px); children replace the glyph. It sets no aria-label of its own, so pass aria-label." },
              ]}
            />
          ),
        },
        {
          label: "CommitFiles, CommitFile, CommitFileInfo, CommitFileStatus, CommitFileIcon, CommitFilePath",
          body: (
            <Meta
              items={[
                { k: "CommitFiles, CommitFile, CommitFileInfo", v: "div props; the list, a row (space between, hover fill) and the left cluster." },
                { k: "CommitFileStatus status", v: '"added" | "modified" | "deleted" | "renamed", required — the letter A, M, D or R in success, warning, error or info ink. Children replace the letter.' },
                { k: "CommitFileIcon", v: "A muted file glyph; Icon-style props pass through." },
                { k: "CommitFilePath", v: "span props; the identifier role, truncated." },
              ]}
            />
          ),
        },
        {
          label: "CommitFileChanges, CommitFileAdditions, CommitFileDeletions",
          body: (
            <Meta
              items={[
                { k: "CommitFileChanges", v: "div props; the number role, non-shrinking." },
                { k: "CommitFileAdditions count", v: "number, required — renders nothing at zero or below; otherwise a plus glyph and the count in success ink." },
                { k: "CommitFileDeletions count", v: "number, required — the same with a minus glyph in error ink." },
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
      description: "Text for every fact; the header toggle is pointer-only as vendored.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Structure", v: "CommitTimestamp is a time element with an ISO dateTime. The author avatar shows initials only, so the author's name is not in the accessible text unless you put it in the message or metadata." },
                { k: "Accessible names", v: "CommitCopyButton is icon-only and has no default aria-label — always pass one, such as Copy commit hash. The file status letters (A, M, D, R) are abbreviations; a page that needs them spoken should pass children with the full word." },
                { k: "Keyboard", v: "The header is a focusable element with the button role (it holds the copy button, so it cannot be a <button>): Tab reaches it, Enter or Space toggles the file list, and it reports aria-expanded. Keys pressed on the copy button inside it stay the copy button's. The copy button is named “Copy commit hash”, then “Commit hash copied”." },
                { k: "Target size", v: "The header has a 44px minimum height and is the pointer target; the copy button is a 40px icon Button." },
                { k: "Colour", v: "File status and counts use the -ink roles and also carry a letter or a plus and minus glyph, so colour is never the only cue." },
                { k: "Motion and reduced motion", v: "The body uses the shared expand/collapse height animation and the copy glyph changes on copy; the blanket prefers-reduced-motion rule collapses these." },
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
              A commit the agent made should read like one: who, what, which files and how much. The AgentWorkspace maps a <code className="type-code">commit</code> tool result to this component in <code className="type-code">ToolOutputView</code> (<code className="type-code">components/agent/workspace/workspace-outputs.tsx</code>): it opens by default, shows the seven-character hash, the author&apos;s initials and the relative age, and its copy button copies the full hash and toasts; <code className="type-code">tool-output.ts</code> validates the shape first. Vendored changes: file status and counts use the -ink roles instead of raw hues; the timestamp fills in through a client-only snapshot instead of setting state in an effect, which keeps server and client markup equal; the copy glyph is a system Icon; the header and row text use the type roles and the header got the 44px floor and the press feel.
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
