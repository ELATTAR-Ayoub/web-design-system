import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ai-elements/file-tree";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

// Trimmed from ae-src/packages/examples/src/file-tree-selection.tsx
const tree = (props: {
  defaultExpanded?: Set<string>;
  selectedPath?: string;
  onSelect?: (path: string) => void;
}) => (
  <FileTree {...props}>
    <FileTreeFolder name="src" path="src">
      <FileTreeFolder name="components" path="src/components">
        <FileTreeFile name="button.tsx" path="src/components/button.tsx" />
      </FileTreeFolder>
      <FileTreeFile name="index.ts" path="src/index.ts" />
    </FileTreeFolder>
  </FileTree>
);

describe("FileTree", () => {
  it("renders the root as a tree and speaks the type/colour roles", () => {
    render(tree({}));
    const root = screen.getByRole("tree");
    expect(root.className).toMatch(/\btype-code\b/);
    expect(root.className).toMatch(/\bbg-card\b/);
  });

  it("starts collapsed by default", () => {
    render(tree({}));
    expect(screen.queryByText("index.ts")).not.toBeInTheDocument();
  });

  it("expands a folder when its chevron is clicked, and the chevron wears press", async () => {
    const user = setup();
    render(tree({}));

    const folderRow = screen.getByText("src").closest('[role="treeitem"]') as HTMLElement;
    const chevronButton = folderRow.querySelector("button") as HTMLElement;
    expect(chevronButton.className).toMatch(/\bpress\b/);

    await user.click(chevronButton);
    expect(screen.getByText("index.ts")).toBeInTheDocument();
  });

  it("expands via defaultExpanded and reveals nested files", () => {
    render(tree({ defaultExpanded: new Set(["src", "src/components"]) }));
    expect(screen.getByText("index.ts")).toBeInTheDocument();
    expect(screen.getByText("button.tsx")).toBeInTheDocument();
  });

  it("calls onSelect when a file row is clicked, and the row wears press", async () => {
    const user = setup();
    const onSelect = vi.fn();
    render(tree({ defaultExpanded: new Set(["src"]), onSelect }));

    const fileRow = screen.getByText("index.ts").closest('[role="treeitem"]');
    expect(fileRow?.className).toMatch(/\bpress\b/);

    await user.click(fileRow as Element);
    expect(onSelect).toHaveBeenCalledWith("src/index.ts");
  });

  it("selects a file via keyboard (Enter)", async () => {
    const user = setup();
    const onSelect = vi.fn();
    render(tree({ defaultExpanded: new Set(["src"]), onSelect }));

    const fileRow = screen.getByText("index.ts").closest(
      '[role="treeitem"]'
    ) as HTMLElement;
    fileRow.focus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("src/index.ts");
  });

  it("highlights the selected file with the muted surface", () => {
    render(
      tree({ defaultExpanded: new Set(["src"]), selectedPath: "src/index.ts" })
    );
    const fileRow = screen.getByText("index.ts").closest('[role="treeitem"]');
    expect(fileRow?.className).toMatch(/\bbg-muted\b/);
  });

  it("sizes follow RULES: rows keep 44px, the nested chevron is small with its hit area restored", () => {
    render(tree({ defaultExpanded: new Set(["src"]) }));
    const folderRow = screen.getByText("src").closest('[role="treeitem"]') as HTMLElement;
    const chevron = folderRow.querySelector("button") as HTMLElement;
    // Hit box = 14px icon (size="sm") + 2 x p-3.5 (14px) = 42px, above the 40px
    // floor; -m-3.5 cancels the same 14px per side so the row does not grow.
    expect(chevron).toHaveClass("-m-3.5", "p-3.5");
    expect(chevron.className).not.toContain("size-target-min");
    const fileRow = screen.getByText("index.ts").closest('[role="treeitem"]');
    expect(fileRow).toHaveClass("min-h-(--size-target-min)");
  });
});

describe("FileTree — the tree pattern", () => {
  it("folders report aria-expanded, name their chevron, and wrap children in a group", async () => {
    const user = setup();
    render(tree({}));
    const src = screen.getByRole("treeitem", { name: "src" });
    expect(src).toHaveAttribute("aria-expanded", "false");
    await user.click(screen.getByRole("button", { name: "Expand src" }));
    expect(src).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Collapse src" })).toHaveAttribute("tabindex", "-1");
    expect(src.querySelector('[role="group"]')).toContainElement(screen.getByRole("treeitem", { name: "index.ts" }));
  });

  it("Right opens and steps in, Down/Up move, Left steps out and closes, Enter selects", async () => {
    const user = setup();
    const onSelect = vi.fn();
    render(tree({ onSelect }));
    const src = screen.getByRole("treeitem", { name: "src" });
    src.focus();
    await user.keyboard("{ArrowRight}");
    expect(src).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("treeitem", { name: "components" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("treeitem", { name: "index.ts" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenLastCalledWith("src/index.ts");
    await user.keyboard("{ArrowLeft}");
    expect(src).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(src).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{End}");
    expect(src).toHaveFocus();
  });
});
