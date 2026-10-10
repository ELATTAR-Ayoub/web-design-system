"use client";

import * as React from "react";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
  Volume2Icon,
  SquareIcon,
} from "lucide-react";
import { toast } from "sonner";
import { bundledLanguages, type BundledLanguage } from "shiki";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconSwap } from "@/components/ui/icon-swap";

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact";
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  Attachments,
  type AttachmentData,
} from "@/components/ai-elements/attachments";
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";
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
import {
  EnvironmentVariable,
  EnvironmentVariableCopyButton,
  EnvironmentVariableGroup,
  EnvironmentVariableName,
  EnvironmentVariableRequired,
  EnvironmentVariableValue,
  EnvironmentVariables,
  EnvironmentVariablesContent,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
} from "@/components/ai-elements/environment-variables";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
  FileTreeIcon,
  FileTreeName,
} from "@/components/ai-elements/file-tree";
import { Image } from "@/components/ai-elements/image";
import {
  JSXPreview,
  JSXPreviewContent,
  JSXPreviewError,
} from "@/components/ai-elements/jsx-preview";
import {
  PackageInfo,
  PackageInfoChangeType,
  PackageInfoContent,
  PackageInfoDependencies,
  PackageInfoDependency,
  PackageInfoDescription,
  PackageInfoHeader,
  PackageInfoName,
  PackageInfoVersion,
} from "@/components/ai-elements/package-info";
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
import { SchemaDisplay } from "@/components/ai-elements/schema-display";
import {
  StackTrace,
  StackTraceActions,
  StackTraceContent,
  StackTraceCopyButton,
  StackTraceError,
  StackTraceErrorMessage,
  StackTraceErrorType,
  StackTraceExpandButton,
  StackTraceFrames,
  StackTraceHeader,
} from "@/components/ai-elements/stack-trace";
import { Terminal } from "@/components/ai-elements/terminal";
import {
  Test,
  TestError,
  TestErrorMessage,
  TestErrorStack,
  TestResults,
  TestResultsContent,
  TestResultsDuration,
  TestResultsHeader,
  TestResultsSummary,
  TestSuite,
  TestSuiteContent,
  TestSuiteName,
} from "@/components/ai-elements/test-results";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview";

import type { Attachment as AgentAttachment } from "@/components/agent/core/types";
import { generatedImage } from "./reply-model";
import { fileTree, isWebUrl, type FileNode, type ToolOutput } from "./tool-output";
import type { ToolState } from "./reply-model";

export function codeLanguage(language: string | undefined): BundledLanguage {
  const name = (language ?? "").toLowerCase();
  return (name in bundledLanguages ? name : "text") as BundledLanguage;
}

export async function copyText(text: string, what = "Copied to clipboard"): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard API not available");
    await navigator.clipboard.writeText(text);
    toast.success(what);
    return true;
  } catch {
    toast.error("Couldn't copy. Your browser blocked clipboard access.");
    return false;
  }
}

export const copyFailed = () => toast.error("Couldn't copy. Your browser blocked clipboard access.");

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "?").slice(0, 2)).toUpperCase();
}

function download(filename: string, text: string, mime = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export type ToolOutputViewProps = {
  output: ToolOutput;
  running: boolean;
  state: ToolState;
  onRetry?: () => void;
  className?: string;
};

export function ToolOutputView({ output, running, state, onRetry, className }: ToolOutputViewProps) {
  switch (output.kind) {
    case "terminal": {
      const prompt = `\u001b[36m$\u001b[0m ${output.command}`;
      const exit = output.exitCode ? `\n\u001b[31mexit ${output.exitCode}\u001b[0m` : "";
      return <Terminal className={className} isStreaming={running} output={`${prompt}\n${output.output}${exit}`} />;
    }

    case "test-results":
      return (
        <TestResults className={className} summary={output.summary}>
          <TestResultsHeader>
            <TestResultsSummary />
            <TestResultsDuration />
          </TestResultsHeader>
          <TestResultsContent>
            {output.suites.map((suite) => (
              <TestSuite defaultOpen={suite.status === "failed"} key={suite.name} name={suite.name} status={suite.status}>
                <TestSuiteName />
                <TestSuiteContent>
                  {suite.tests.map((test) => (
                    <Test duration={test.duration} key={test.name} name={test.name} status={test.status}>
                      {test.error ? (
                        <TestError>
                          <TestErrorMessage>{test.error.message}</TestErrorMessage>
                          {test.error.stack ? <TestErrorStack>{test.error.stack}</TestErrorStack> : null}
                        </TestError>
                      ) : null}
                    </Test>
                  ))}
                </TestSuiteContent>
              </TestSuite>
            ))}
          </TestResultsContent>
        </TestResults>
      );

    case "stack-trace":
      return (
        <div className={className}>
          <div className="flex flex-col gap-2">
            <StackTrace defaultOpen trace={output.trace}>
              <StackTraceHeader>
                <StackTraceError>
                  <StackTraceErrorType />
                  <StackTraceErrorMessage />
                </StackTraceError>
                <StackTraceActions>
                  <StackTraceCopyButton onCopy={() => toast.success("Stack trace copied")} onError={copyFailed} />
                  <StackTraceExpandButton />
                </StackTraceActions>
              </StackTraceHeader>
              <StackTraceContent>
                <StackTraceFrames />
              </StackTraceContent>
            </StackTrace>
            {onRetry ? (
              <div>
                <Button onClick={onRetry} variant="outline">
                  <Icon icon={RotateCcwIcon} size="md" tone="inherit" />
                  Retry
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      );

    case "file-tree": {
      const nodes = fileTree(output.files);
      const folders = new Set<string>();
      const collect = (list: FileNode[]) =>
        list.forEach((n) => {
          if (n.type === "folder") {
            folders.add(n.path);
            collect(n.children);
          }
        });
      collect(nodes);
      return (
        <FileTree className={className} defaultExpanded={folders}>
          {nodes.map((node) => (
            <FileTreeNode key={node.path} node={node} />
          ))}
        </FileTree>
      );
    }

    case "commit":
      return (
        <Commit className={className} defaultOpen>
          <CommitHeader>
            <CommitAuthor>
              <CommitAuthorAvatar initials={initials(output.author)} />
            </CommitAuthor>
            <CommitInfo>
              <CommitMessage>{output.message}</CommitMessage>
              <CommitMetadata>
                <CommitHash>{output.hash.slice(0, 7)}</CommitHash>
                <CommitSeparator />
                <CommitTimestamp date={new Date(output.date)} />
              </CommitMetadata>
            </CommitInfo>
            <CommitActions>
              <CommitCopyButton hash={output.hash} onCopy={() => toast.success("Commit hash copied")} onError={copyFailed} />
            </CommitActions>
          </CommitHeader>
          <CommitContent>
            <CommitFiles>
              {output.files.map((file) => (
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

    case "package-info":
      return (
        <PackageInfo
          changeType={output.changeType}
          className={className}
          currentVersion={output.currentVersion}
          name={output.name}
          newVersion={output.newVersion}
        >
          <PackageInfoHeader>
            <PackageInfoName />
            <PackageInfoChangeType />
          </PackageInfoHeader>
          <PackageInfoVersion />
          {output.description ? <PackageInfoDescription>{output.description}</PackageInfoDescription> : null}
          {output.dependencies?.length ? (
            <PackageInfoContent>
              <PackageInfoDependencies>
                {output.dependencies.map((dep) => (
                  <PackageInfoDependency key={dep.name} name={dep.name} version={dep.version} />
                ))}
              </PackageInfoDependencies>
            </PackageInfoContent>
          ) : null}
        </PackageInfo>
      );

    case "environment-variables":
      return (
        <EnvironmentVariables className={className} defaultShowValues={false}>
          <EnvironmentVariablesHeader>
            <EnvironmentVariablesTitle />
            <EnvironmentVariablesToggle />
          </EnvironmentVariablesHeader>
          <EnvironmentVariablesContent>
            {output.variables.map((variable) => (
              <EnvironmentVariable key={variable.name} name={variable.name} value={variable.value}>
                <EnvironmentVariableGroup>
                  <EnvironmentVariableName />
                  {variable.required ? <EnvironmentVariableRequired /> : null}
                </EnvironmentVariableGroup>
                <EnvironmentVariableGroup>
                  <EnvironmentVariableValue />
                  <EnvironmentVariableCopyButton
                    copyFormat="export"
                    onCopy={() => toast.success(`${variable.name} copied`)}
                    onError={copyFailed}
                  />
                </EnvironmentVariableGroup>
              </EnvironmentVariable>
            ))}
          </EnvironmentVariablesContent>
        </EnvironmentVariables>
      );

    case "schema-display":
      return (
        <SchemaDisplay
          className={className}
          description={output.description}
          method={output.method}
          parameters={output.parameters}
          path={output.path}
          requestBody={output.requestBody}
          responseBody={output.responseBody}
        />
      );

    case "sandbox": {
      const language = codeLanguage(output.language);
      return (
        <Sandbox className={className}>
          <SandboxHeader state={state} title={output.title ?? `${output.language} sandbox`} />
          <SandboxContent>
            <SandboxTabs defaultValue="output">
              <SandboxTabsBar>
                <SandboxTabsList>
                  <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
                  <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
                </SandboxTabsList>
              </SandboxTabsBar>
              <SandboxTabContent value="code">
                <CodeBlock className="border-0" code={output.code} language={language}>
                  <CodeBlockCopyButton
                    className="absolute top-2 right-2"
                    onCopy={() => toast.success("Code copied")}
                    onError={copyFailed}
                    size="icon-sm"
                  />
                </CodeBlock>
              </SandboxTabContent>
              <SandboxTabContent value="output">
                <CodeBlock className="border-0" code={output.output || " "} language={codeLanguage("log")}>
                  <CodeBlockCopyButton
                    className="absolute top-2 right-2"
                    onCopy={() => toast.success("Output copied")}
                    onError={copyFailed}
                    size="icon-sm"
                  />
                </CodeBlock>
              </SandboxTabContent>
            </SandboxTabs>
          </SandboxContent>
        </Sandbox>
      );
    }

    case "artifact":
      return (
        <Artifact className={className}>
          <ArtifactHeader>
            <div>
              <ArtifactTitle>{output.title}</ArtifactTitle>
              {output.description ? <ArtifactDescription>{output.description}</ArtifactDescription> : null}
            </div>
            <ArtifactActions>
              <ArtifactAction
                icon={CopyIcon}
                label="Copy"
                onClick={() => void copyText(output.content, "Copied to clipboard")}
                tooltip="Copy to clipboard"
              />
              <ArtifactAction
                icon={DownloadIcon}
                label="Download"
                onClick={() => {
                  download(output.title, output.content);
                  toast.success(`Downloaded ${output.title}`);
                }}
                tooltip="Download file"
              />
            </ArtifactActions>
          </ArtifactHeader>
          <ArtifactContent className="p-0">
            <CodeBlock className="border-none" code={output.content} language={codeLanguage(output.language)} showLineNumbers />
          </ArtifactContent>
        </Artifact>
      );

    case "web-preview":
      return (
        <WebPreview className={className ?? "h-96"} defaultUrl={output.url}>
          <WebPreviewNavigation>
            <WebPreviewUrl />
            <WebPreviewNavigationButton
              onClick={() => {
                if (isWebUrl(output.url)) window.open(output.url, "_blank", "noopener,noreferrer");
              }}
              tooltip="Open in new tab"
            >
              <Icon icon={ExternalLinkIcon} size="md" tone="inherit" />
            </WebPreviewNavigationButton>
          </WebPreviewNavigation>
          <WebPreviewBody />
          <WebPreviewConsole logs={(output.logs ?? []).map((l) => ({ level: l.level, message: l.message, timestamp: new Date(l.at) }))} />
        </WebPreview>
      );

    case "jsx-preview":
      return (
        <JSXPreview
          className={className ?? "rounded-lg border bg-card p-4"}
          isStreaming={running}
          jsx={output.jsx}
        >
          <JSXPreviewContent />
          <JSXPreviewError className="mt-2" />
        </JSXPreview>
      );

    case "search":
    case "image":
      return null;
  }
}

function FileTreeNode({ node }: { node: FileNode }) {
  if (node.type === "folder") {
    return (
      <FileTreeFolder name={node.name} path={node.path}>
        {node.children.map((child) => (
          <FileTreeNode key={child.path} node={child} />
        ))}
      </FileTreeFolder>
    );
  }
  const change = {
    added: { glyph: PlusIcon, tone: "success", label: "Added" },
    modified: { glyph: PencilIcon, tone: "info", label: "Modified" },
    deleted: { glyph: MinusIcon, tone: "error", label: "Deleted" },
  } as const;
  const { glyph, tone, label } = change[node.change];
  return (
    <FileTreeFile name={node.name} path={node.path}>
      <span className="size-4 shrink-0" />
      <FileTreeIcon>
        <Icon icon={FileIcon} size="sm" tone="muted" />
      </FileTreeIcon>
      <FileTreeName>{node.name}</FileTreeName>
      <span className="ml-auto flex items-center gap-1 type-small text-muted-foreground">
        <Icon icon={glyph} size="xs" tone={tone} />
        {label}
      </span>
    </FileTreeFile>
  );
}

const toData = (a: AgentAttachment): AttachmentData => ({
  id: a.id,
  type: "file",
  url: a.url ?? "",
  mediaType: a.mime,
  filename: a.name,
});

export function ProducedFiles({ attachments, className }: { attachments: AgentAttachment[]; className?: string }) {
  const images: { id: string; alt: string; props: NonNullable<ReturnType<typeof generatedImage>> }[] = [];
  const files: AgentAttachment[] = [];
  for (const a of attachments) {
    const image = a.kind === "image" ? generatedImage(a) : null;
    if (image) images.push({ id: a.id, alt: a.name, props: image });
    else files.push(a);
  }
  return (
    <div className={className}>
      <div className="flex flex-col gap-4">
        {images.map((image) => (
          <Image alt={image.alt} key={image.id} {...image.props} />
        ))}
        {files.length ? (
          <Attachments variant="list">
            {files.map((file) => (
              <Attachment data={toData(file)} key={file.id}>
                <AttachmentPreview />
                <AttachmentInfo showMediaType />
              </Attachment>
            ))}
          </Attachments>
        ) : null}
      </div>
    </div>
  );
}

export function useCopy(text: string) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number>(0);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = React.useCallback(async () => {
    if (await copyText(text)) {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);
  return { copied, copy };
}

export function CopyGlyph({ copied }: { copied: boolean }) {
  return (
    <IconSwap
      active={copied ? "check" : "copy"}
      icons={{
        copy: <Icon icon={CopyIcon} size="sm" tone="inherit" aria-hidden />,
        check: <Icon icon={CheckIcon} size="sm" tone="success" aria-hidden />,
      }}
    />
  );
}

export type ReadAloud = {
  open: boolean;
  loading: boolean;
  url: string | null;
  toggle: () => void;
};

export function useReadAloud(text: string, speak?: (text: string) => Promise<string>): ReadAloud | null {
  const [state, setState] = React.useState<{ open: boolean; loading: boolean; url: string | null }>({
    open: false,
    loading: false,
    url: null,
  });
  const token = React.useRef(0);

  const toggle = React.useCallback(() => {
    if (!speak) return;
    const mine = ++token.current;
    if (state.open || state.loading) {
      setState((s) => ({ ...s, open: false, loading: false }));
      return;
    }
    setState({ open: false, loading: true, url: null });
    speak(text).then(
      (url) => {
        if (token.current === mine) setState({ open: true, loading: false, url });
      },
      () => {
        if (token.current !== mine) return;
        setState({ open: false, loading: false, url: null });
        toast.error("Couldn't read this aloud. Try again in a moment.");
      },
    );
  }, [speak, text, state.open, state.loading]);

  if (!speak) return null;
  return { ...state, toggle };
}

export function ReadAloudGlyph({ active }: { active: boolean }) {
  return (
    <IconSwap
      active={active ? "stop" : "play"}
      icons={{
        play: <Icon icon={Volume2Icon} size="sm" tone="inherit" aria-hidden />,
        stop: <Icon icon={SquareIcon} size="sm" tone="inherit" aria-hidden />,
      }}
    />
  );
}
