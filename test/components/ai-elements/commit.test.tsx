import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

const hash = "a1b2c3d4e5f6";
const timestamp = new Date();

const files: Array<{
  path: string;
  status: "added" | "modified" | "deleted" | "renamed";
  additions: number;
  deletions: number;
}> = [
  { additions: 12, deletions: 0, path: "src/new-file.ts", status: "added" },
  { additions: 3, deletions: 1, path: "src/existing.ts", status: "modified" },
  { additions: 0, deletions: 40, path: "src/gone.ts", status: "deleted" },
  { additions: 0, deletions: 0, path: "src/moved.ts", status: "renamed" },
];

// Trimmed from ae-src/packages/examples/src/commit.tsx
const commitCard = (onCopy?: () => void, open = true) => (
  <Commit defaultOpen={open}>
    <CommitHeader>
      <CommitAuthor>
        <CommitAuthorAvatar initials="HB" />
      </CommitAuthor>
      <CommitInfo>
        <CommitMessage>feat: Add user authentication flow</CommitMessage>
        <CommitMetadata>
          <CommitHash>{hash.slice(0, 7)}</CommitHash>
          <CommitSeparator />
          <CommitTimestamp date={timestamp} />
        </CommitMetadata>
      </CommitInfo>
      <CommitActions>
        <CommitCopyButton hash={hash} onCopy={onCopy} />
      </CommitActions>
    </CommitHeader>
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
  </Commit>
);

describe("Commit", () => {
  it("speaks the card, identifier and body type roles", () => {
    render(commitCard());
    const hashEl = screen.getByText(hash.slice(0, 7)).closest("span");
    expect(hashEl?.className).toMatch(/\btype-identifier\b/);
    expect(screen.getByText("feat: Add user authentication flow").className).toMatch(
      /\btype-body\b/
    );
    expect(screen.getByText("src/new-file.ts").className).toMatch(
      /\btype-identifier\b/
    );
  });

  it("collapses file content by default and expands the header wears press", async () => {
    const user = setup();
    render(commitCard(undefined, false));
    expect(screen.queryByText("src/new-file.ts")).not.toBeInTheDocument();

    const header = screen
      .getByText("feat: Add user authentication flow")
      .closest('[data-slot="collapsible-trigger"]') as HTMLElement;
    expect(header.className).toMatch(/\bpress\b/);

    await user.click(header);
    expect(screen.getByText("src/new-file.ts")).toBeInTheDocument();
  });

  it("the header is reachable by keyboard and opens on Enter", async () => {
    const user = setup();
    render(commitCard(undefined, false));
    const header = screen
      .getByText("feat: Add user authentication flow")
      .closest("[role=button]") as HTMLElement;
    header.focus();
    expect(header).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("src/new-file.ts")).toBeInTheDocument();
  });

  it("colours each file status with its semantic -ink token", () => {
    render(commitCard());
    expect(screen.getByText("A").className).toMatch(/\btext-success-ink\b/);
    expect(screen.getByText("M").className).toMatch(/\btext-warning-ink\b/);
    expect(screen.getByText("D").className).toMatch(/\btext-destructive-ink\b/);
    expect(screen.getByText("R").className).toMatch(/\btext-info-ink\b/);
  });

  it("renders additions in success-ink and deletions in destructive-ink, hiding zero counts", () => {
    render(commitCard());
    expect(screen.getByText("12").closest("span")?.className).toMatch(
      /\btext-success-ink\b/
    );
    expect(screen.getByText("40").closest("span")?.className).toMatch(
      /\btext-destructive-ink\b/
    );
    // The "added" file has 0 deletions — CommitFileDeletions renders null.
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("copies the hash and reports success, without a double press animation", async () => {
    const user = setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const onCopy = vi.fn();

    const { container } = render(commitCard(onCopy));
    const copyButton = container.querySelector("button") as HTMLElement;
    // Button already carries exactly one `press` (RULES §4); the copy action
    // does not stack a second one on top of it.
    expect(copyButton.className.match(/\bpress\b/g)).toHaveLength(1);

    await user.click(copyButton);
    await waitFor(() => expect(onCopy).toHaveBeenCalled());
    expect(writeText).toHaveBeenCalledWith(hash);
  });

  it("reports failure when the Clipboard API is unavailable", async () => {
    const user = setup();
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    const onError = vi.fn();

    const { container } = render(
      <Commit>
        <CommitHeader>
          <CommitActions>
            <CommitCopyButton hash={hash} onError={onError} />
          </CommitActions>
        </CommitHeader>
      </Commit>
    );

    await user.click(container.querySelector("button") as HTMLElement);
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });
});
