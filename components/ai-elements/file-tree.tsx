"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface FileTreeContextType {
  expandedPaths: Set<string>;
  togglePath: (path: string) => void;
  selectedPath?: string;
  onSelect?: (path: string) => void;
}

// oxlint-disable-next-line eslint(no-empty-function)
const noop = () => {};

const FileTreeContext = createContext<FileTreeContextType>({
  // oxlint-disable-next-line eslint-plugin-unicorn(no-new-builtin)
  expandedPaths: new Set(),
  togglePath: noop,
});

/* Vendored change: implements the WAI-ARIA tree pattern (aria-expanded, role="group", arrow/Home/End keys), which upstream only named. */
const ROW = '[role="treeitem"]';

const parentRow = (row: HTMLElement) =>
  row.parentElement?.closest<HTMLElement>(ROW) ?? null;

const moveInTree = (event: React.KeyboardEvent<HTMLElement>) => {
  const rows = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ROW));
  const at = rows.indexOf(document.activeElement as HTMLElement);
  if (at === -1) return;
  const to =
    event.key === "ArrowDown" ? at + 1
    : event.key === "ArrowUp" ? at - 1
    : event.key === "Home" ? 0
    : event.key === "End" ? rows.length - 1
    : null;
  if (to === null) return;
  event.preventDefault();
  rows[Math.max(0, Math.min(rows.length - 1, to))]?.focus();
};

export type FileTreeProps = Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> & {
  expanded?: Set<string>;
  defaultExpanded?: Set<string>;
  selectedPath?: string;
  onSelect?: (path: string) => void;
  onExpandedChange?: (expanded: Set<string>) => void;
};

export const FileTree = ({
  expanded: controlledExpanded,
  defaultExpanded = new Set(),
  selectedPath,
  onSelect,
  onExpandedChange,
  className,
  children,
  ...props
}: FileTreeProps) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expandedPaths = controlledExpanded ?? internalExpanded;

  const togglePath = useCallback(
    (path: string) => {
      const newExpanded = new Set(expandedPaths);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      setInternalExpanded(newExpanded);
      onExpandedChange?.(newExpanded);
    },
    [expandedPaths, onExpandedChange]
  );

  const contextValue = useMemo(
    () => ({ expandedPaths, onSelect, selectedPath, togglePath }),
    [expandedPaths, onSelect, selectedPath, togglePath]
  );

  return (
    <FileTreeContext.Provider value={contextValue}>
      <div
        className={cn(
          "type-code rounded-lg border bg-card",
          className
        )}
        onKeyDown={moveInTree}
        role="tree"
        {...props}
      >
        <div className="p-2">{children}</div>
      </div>
    </FileTreeContext.Provider>
  );
};

export type FileTreeIconProps = HTMLAttributes<HTMLSpanElement>;

export const FileTreeIcon = ({
  className,
  children,
  ...props
}: FileTreeIconProps) => (
  <span className={cn("shrink-0", className)} {...props}>
    {children}
  </span>
);

export type FileTreeNameProps = HTMLAttributes<HTMLSpanElement>;

export const FileTreeName = ({
  className,
  children,
  ...props
}: FileTreeNameProps) => (
  <span className={cn("truncate", className)} {...props}>
    {children}
  </span>
);

interface FileTreeFolderContextType {
  path: string;
  name: string;
  isExpanded: boolean;
}

const FileTreeFolderContext = createContext<FileTreeFolderContextType>({
  isExpanded: false,
  name: "",
  path: "",
});

export type FileTreeFolderProps = HTMLAttributes<HTMLDivElement> & {
  path: string;
  name: string;
};

export const FileTreeFolder = ({
  path,
  name,
  className,
  children,
  ...props
}: FileTreeFolderProps) => {
  const { expandedPaths, togglePath, selectedPath, onSelect } =
    useContext(FileTreeContext);
  const isExpanded = expandedPaths.has(path);
  const isSelected = selectedPath === path;

  const handleOpenChange = useCallback(() => {
    togglePath(path);
  }, [togglePath, path]);

  const handleSelect = useCallback(() => {
    onSelect?.(path);
  }, [onSelect, path]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;
      const row = event.currentTarget;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect?.(path);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (!isExpanded) togglePath(path);
        else row.querySelector<HTMLElement>('[role="group"] [role="treeitem"]')?.focus();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (isExpanded) togglePath(path);
        else parentRow(row)?.focus();
      }
    },
    [isExpanded, onSelect, path, togglePath]
  );

  const folderContextValue = useMemo(
    () => ({ isExpanded, name, path }),
    [isExpanded, name, path]
  );

  return (
    <FileTreeFolderContext.Provider value={folderContextValue}>
      <Collapsible onOpenChange={handleOpenChange} open={isExpanded}>
        <div
          className={cn("", className)}
          aria-expanded={isExpanded}
          aria-label={name}
          onKeyDown={handleKeyDown}
          role="treeitem"
          // Vendored change: `aria-selected` — the treeitem role requires it (jsx-a11y).
          aria-selected={isSelected}
          tabIndex={0}
          {...props}
        >
          <div
            className={cn(
              "flex w-full items-center gap-1 rounded px-2 py-1 text-left transition-colors hover:bg-muted/50",
              isSelected && "bg-muted"
            )}
          >
            <CollapsibleTrigger asChild>
              {/* Vendored change: raw <button> replaced by the system Button (ghost). */}
              <Button
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${name}`}
                className="-m-3.5 h-auto min-h-0 rounded-none bg-transparent p-3.5 hover:bg-transparent active:bg-transparent"
                tabIndex={-1}
                type="button"
                variant="ghost"
              >
                <Icon
                  className={cn(
                    "transition-transform",
                    isExpanded && "rotate-90"
                  )}
                  icon={ChevronRightIcon}
                  size="sm"
                  tone="muted"
                />
              </Button>
            </CollapsibleTrigger>
            {/* Vendored change: raw <button> replaced by the system Button (ghost). */}
            <Button
              className="h-auto min-h-(--size-target-min) min-w-0 flex-1 justify-start gap-1 rounded-none bg-transparent p-0 text-left hover:bg-transparent active:bg-transparent"
              onClick={handleSelect}
              tabIndex={-1}
              type="button"
              variant="ghost"
            >
              <FileTreeIcon>
                {isExpanded ? (
                  <Icon icon={FolderOpenIcon} size="sm" tone="muted" />
                ) : (
                  <Icon icon={FolderIcon} size="sm" tone="muted" />
                )}
              </FileTreeIcon>
              <FileTreeName>{name}</FileTreeName>
            </Button>
          </div>
          <CollapsibleContent>
            <div className="ml-4 border-l pl-2" role="group">
              {children}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </FileTreeFolderContext.Provider>
  );
};

interface FileTreeFileContextType {
  path: string;
  name: string;
}

const FileTreeFileContext = createContext<FileTreeFileContextType>({
  name: "",
  path: "",
});

export type FileTreeFileProps = HTMLAttributes<HTMLDivElement> & {
  path: string;
  name: string;
  icon?: ReactNode;
};

export const FileTreeFile = ({
  path,
  name,
  icon,
  className,
  children,
  ...props
}: FileTreeFileProps) => {
  const { selectedPath, onSelect } = useContext(FileTreeContext);
  const isSelected = selectedPath === path;

  const handleClick = useCallback(() => {
    onSelect?.(path);
  }, [onSelect, path]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect?.(path);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        parentRow(e.currentTarget)?.focus();
      }
    },
    [onSelect, path]
  );

  const fileContextValue = useMemo(() => ({ name, path }), [name, path]);

  return (
    <FileTreeFileContext.Provider value={fileContextValue}>
      <div
        className={cn(
          "press flex min-h-(--size-target-min) cursor-pointer items-center gap-1 rounded px-2 py-1 transition-colors hover:bg-muted/50",
          isSelected && "bg-muted",
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="treeitem"
        // Vendored change: `aria-selected` — the treeitem role requires it (jsx-a11y).
        aria-selected={isSelected}
        tabIndex={0}
        {...props}
      >
        {children ?? (
          <>
            <span className="size-4 shrink-0" />
            <FileTreeIcon>
              {icon ?? <Icon icon={FileIcon} size="sm" tone="muted" />}
            </FileTreeIcon>
            <FileTreeName>{name}</FileTreeName>
          </>
        )}
      </div>
    </FileTreeFileContext.Provider>
  );
};

export type FileTreeActionsProps = HTMLAttributes<HTMLDivElement>;

const stopPropagation = (e: React.SyntheticEvent) => e.stopPropagation();

export const FileTreeActions = ({
  className,
  children,
  ...props
}: FileTreeActionsProps) => (
  <div
    className={cn("ml-auto flex items-center gap-1", className)}
    onClick={stopPropagation}
    onKeyDown={stopPropagation}
    role="group"
    {...props}
  >
    {children}
  </div>
);
