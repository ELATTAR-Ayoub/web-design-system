#!/usr/bin/env node
/**
 * Declares what ships in the registry: item names, types, and the exact
 * source files each one owns. `generate-registry.mjs` reads this, parses
 * every listed file's imports, and fills in `dependencies` /
 * `registryDependencies` automatically — so the only thing authored by hand
 * here is "which files belong to which item," not the dependency graph.
 */

export const REGISTRY_NAME = "elattar";
export const REGISTRY_HOMEPAGE = "https://elattar-design-system.dev";
// Single source of truth for the base URL used by installed commands and by
// components.json's registries entry. Overridable for the local rehearsal
// server (npx serve public -l 3200 -> http://127.0.0.1:3200/r).
export const REGISTRY_URL =
  process.env.REGISTRY_URL ?? "http://127.0.0.1:3200/r";

function title(name) {
  return name
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/** One item per distributable file in components/ui, minus foundation-owned files. */
const UI_COMPONENT_NAMES = [
  "accordion",
  "active-indicator",
  "alert-dialog",
  "alert",
  "aspect-ratio",
  "attachment",
  "avatar",
  "badge",
  "breadcrumb",
  "bubble",
  "button-group",
  "button",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "content-change",
  "context-menu",
  "dialog",
  "direction",
  "disabled",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "form",
  "hover-card",
  "input-group",
  "input-otp",
  "input",
  "item",
  "kbd",
  "label",
  "marker",
  "menubar",
  "message-scroller",
  "message",
  "native-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "prose",
  "questionnaire",
  "radio",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "spinner",
  "stat",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toaster",
  "toggle-group",
  "toggle",
  "tooltip",
  "user-menu",
];

const uiItems = UI_COMPONENT_NAMES.map((name) => {
  const ext = "tsx";
  return {
    name,
    type: "registry:ui",
    title: title(name),
    description: `The \`${name}\` base component (shadcn/Radix chassis, restyled through Elattar Design System tokens).`,
    files: [
      { path: `components/ui/${name}.${ext}`, type: "registry:ui" },
      // Component-owned motion travels with its component.
      ...(name === "sheet" ? [{ path: "components/ui/sheet.css", type: "registry:ui" }] : []),
    ],
  };
});

const hookItems = [
  {
    name: "use-mobile",
    title: "Use Mobile",
    description: "Media-query hook that reports whether the viewport is at the mobile breakpoint.",
    file: "hooks/use-mobile.ts",
  },
  {
    name: "use-latest",
    title: "Use Latest",
    description: "Ref hook that always holds the latest value of a prop or callback across renders.",
    file: "hooks/use-latest.ts",
  },
  {
    name: "use-reduced-motion",
    title: "Use Reduced Motion",
    description: "Hook that reads the user's prefers-reduced-motion setting reactively.",
    file: "hooks/use-reduced-motion.ts",
  },
].map((h) => ({
  name: h.name,
  type: "registry:hook",
  title: h.title,
  description: h.description,
  files: [{ path: h.file, type: "registry:hook" }],
}));

/**
 * The foundation item: tokens/typeset/motion/utilities, globals.css, utils,
 * icon primitives.
 *
 * Named `source-foundation`, not `foundation`, to match the shared registry
 * vocabulary. The bare word was ambiguous the moment a second thing in the
 * system could be called a foundation — the token layer, the docs foundations
 * section — and the shared name says which one this is: the SOURCE a consumer
 * installs.
 */
const foundationItem = {
  name: "source-foundation",
  type: "registry:style",
  title: "Source Foundation",
  description:
    "Elattar Design System foundation: the four canonical stylesheets (tokens, typeset, motion, utilities), the globals.css entry, the tailwind-merge config, the stylesheet-driven spring/duration reader, and the Icon/IconSwap primitives every component depends on.",
  files: [
    { path: "styles/tokens.css", type: "registry:file", target: "styles/tokens.css" },
    { path: "styles/typeset.css", type: "registry:file", target: "styles/typeset.css" },
    { path: "styles/motion.css", type: "registry:file", target: "styles/motion.css" },
    { path: "styles/utilities.css", type: "registry:file", target: "styles/utilities.css" },
    { path: "app/globals.css", type: "registry:file", target: "app/globals.css" },
    { path: "lib/utils.ts", type: "registry:lib", target: "lib/utils.ts" },
    { path: "lib/motion/spring.ts", type: "registry:lib", target: "lib/motion/spring.ts" },
    { path: "components/ui/icon.tsx", type: "registry:ui", target: "components/ui/icon.tsx" },
    { path: "components/ui/icon-swap.tsx", type: "registry:ui", target: "components/ui/icon-swap.tsx" },
  ],
  // Binary assets cannot be inlined as JSON string `content` without corrupting
  // them (base64 would be written byte-for-byte by the CLI, not decoded). The
  // Inter font is documented as a manual step instead of a registry:file.
  docs:
    "This item does not ship public/fonts/inter-variable.woff2 (binary — the shadcn registry-item file schema inlines `content` as UTF-8 text, which would corrupt a woff2). After installing, copy that file from the design-system repo's public/fonts/ into your project's public/fonts/ manually; styles/tokens.css already declares the @font-face pointing at it. Geist Mono ships as the `geist` npm dependency and needs no manual step.",
  dependencies: ["tailwind-merge", "clsx", "class-variance-authority", "lucide-react", "geist", "tw-animate-css"],
};

/**
 * components/agent/** + components/ai-elements/** (Apache-2.0, ships with its
 * NOTICE.md) + lib/code-theme.ts + lib/agent/mock-transport.ts as one block.
 */
const agentWorkspaceFiles = [
  "components/agent/agent-workspace.tsx",
  "components/agent/avatar/avatar.css",
  "components/agent/avatar/cube-avatar.tsx",
  "components/agent/avatar/cube.tsx",
  "components/agent/avatar/scenes.ts",
  "components/agent/avatar/types.ts",
  "components/agent/core/attachments.ts",
  "components/agent/core/conversations.ts",
  "components/agent/core/resolve-state.ts",
  "components/agent/core/run.ts",
  "components/agent/core/states.ts",
  "components/agent/core/timeline.ts",
  "components/agent/core/types.ts",
  "components/agent/core/use-container-width.ts",
  "components/agent/core/use-presence.ts",
  "components/agent/index.ts",
  "components/agent/parts/effort-slider.tsx",
  "components/agent/parts/generated-image.tsx",
  "components/agent/parts/spark-field.tsx",
  "components/agent/parts/voice-orb.tsx",
  "components/agent/voice/speech.ts",
  "components/agent/workspace/reply-model.ts",
  "components/agent/workspace/run-inline.tsx",
  "components/agent/workspace/step-status.tsx",
  "components/agent/workspace/tool-output.ts",
  "components/agent/workspace/workflow-dialog.tsx",
  "components/agent/workspace/workspace-composer.tsx",
  "components/agent/workspace/workspace-header.tsx",
  "components/agent/workspace/workspace-history.tsx",
  "components/agent/workspace/workspace-outputs.tsx",
  "components/agent/workspace/workspace-reply.tsx",
  "components/agent/workspace/workspace-settings.tsx",
  "components/agent/workspace/workspace-thread.tsx",
  "components/ai-elements/LICENSE",
  "components/ai-elements/NOTICE.md",
  "components/ai-elements/agent.tsx",
  "components/ai-elements/artifact.tsx",
  "components/ai-elements/attachments.tsx",
  "components/ai-elements/audio-player.tsx",
  "components/ai-elements/canvas.tsx",
  "components/ai-elements/chain-of-thought.tsx",
  "components/ai-elements/checkpoint.tsx",
  "components/ai-elements/code-block.tsx",
  "components/ai-elements/commit.tsx",
  "components/ai-elements/confirmation.tsx",
  "components/ai-elements/connection.tsx",
  "components/ai-elements/context.tsx",
  "components/ai-elements/controls.tsx",
  "components/ai-elements/conversation.tsx",
  "components/ai-elements/edge.tsx",
  "components/ai-elements/environment-variables.tsx",
  "components/ai-elements/file-tree.tsx",
  "components/ai-elements/image.tsx",
  "components/ai-elements/inline-citation.tsx",
  "components/ai-elements/jsx-preview.tsx",
  "components/ai-elements/message.tsx",
  "components/ai-elements/mic-selector.tsx",
  "components/ai-elements/model-selector.tsx",
  "components/ai-elements/node.tsx",
  "components/ai-elements/open-in-chat.tsx",
  "components/ai-elements/package-info.tsx",
  "components/ai-elements/panel.tsx",
  "components/ai-elements/plan.tsx",
  "components/ai-elements/prompt-input.tsx",
  "components/ai-elements/question.tsx",
  "components/ai-elements/queue.tsx",
  "components/ai-elements/reasoning.tsx",
  "components/ai-elements/sandbox.tsx",
  "components/ai-elements/schema-display.tsx",
  "components/ai-elements/shimmer.tsx",
  "components/ai-elements/snippet.tsx",
  "components/ai-elements/sources.tsx",
  "components/ai-elements/speech-input.tsx",
  "components/ai-elements/stack-trace.tsx",
  "components/ai-elements/suggestion.tsx",
  "components/ai-elements/task.tsx",
  "components/ai-elements/terminal.tsx",
  "components/ai-elements/test-results.tsx",
  "components/ai-elements/tool.tsx",
  "components/ai-elements/toolbar.tsx",
  "components/ai-elements/transcription.tsx",
  "components/ai-elements/voice-selector.tsx",
  "components/ai-elements/web-preview.tsx",
  "lib/code-theme.ts",
  "lib/agent/mock-transport.ts",
  "public/samples/release-preview.html",
];

function fileType(repoPath) {
  const base = repoPath.split("/").pop();
  if (repoPath.startsWith("public/")) return "registry:file";
  if (base.startsWith("use-")) return "registry:hook";
  if (base.endsWith(".tsx")) return "registry:component";
  return "registry:lib";
}

function blockItem(name, title_, description, files, devDependencies) {
  return {
    name,
    type: "registry:block",
    title: title_,
    description,
    files: files.map((path) => ({ path, type: fileType(path), target: path })),
    ...(devDependencies ? { devDependencies } : {}),
  };
}

const blockItems = [
  blockItem(
    "agent-workspace",
    "Agent Workspace",
    "The agent workspace: thread, composer, history, outputs, settings and workflow dialog, built on the AI Elements primitives (Apache-2.0, NOTICE.md ships with them) with the cube avatar and a mock transport — product-agnostic.",
    agentWorkspaceFiles,
  ),
];

/**
 * The foundation item's name, exported so nothing has to spell it.
 *
 * `generate-registry.mjs` compared against the literal "foundation" in four
 * places, so renaming the item to `source-foundation` silently produced a
 * self-dependency and an unresolvable `@elattar/foundation` on every other
 * item — a registry that generated cleanly and installed nothing.
 */
export const FOUNDATION_ITEM_NAME = foundationItem.name;

// Explicit foundation-owned files that other items must NOT re-declare a
// registryDependency edge for even though they are imported by @/ alias
// (they resolve to the foundation item itself).
export const FOUNDATION_OWNED_REPO_PATHS = new Set(
  foundationItem.files.map((f) => f.path),
);

export const ITEMS = [foundationItem, ...uiItems, ...hookItems, ...blockItems];
