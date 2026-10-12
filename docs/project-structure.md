# Project structure

What each folder holds and what each file does, in plain English.

## How the pieces fit

- **`styles/`**: the design system itself. Every colour, font size, spacing step, radius, shadow and animation is defined here, and nowhere else.
- **`components/ui/`**: the base components (buttons, inputs, dialogs, tables…), built on those tokens.
- **`components/agent/`** and **`components/ai-elements/`**: a complete AI chat surface (the AgentWorkspace) and the AI building blocks it uses.
- **`components/ds/`**: helpers for the design-system website (charts, swatches, layout kit).
- **`components/docs/`**: the documentation website: one folder per component page.
- **`app/`**: the website's routes (URLs).
- **`lib/`**: shared logic (utilities, the docs catalogue, the mock agent).
- **`hooks/`**: shared React hooks.
- **`scripts/`**: the build checks and the registry builder.
- **`test/`** and **`e2e/`**: the automated tests.
- **`public/`**: static files and the published component registry.
- **`docs/`**: written documentation and audit records.

Run `npm run dev` and open `/design-system` to see everything live.

## Top-level files

| File | What it does |
| --- | --- |
| `README.md` | Start here: what the system is, how to run it, and where things live. |
| `RULES.md` | The full rulebook for writing UI here: colour, type, spacing, motion, components, accessibility and copy. |
| `AGENTS.md` / `CLAUDE.md` | Instructions for AI coding assistants working in this repo (CLAUDE.md just points to AGENTS.md). |
| `CHANGELOG.md` | What changed, release by release. |
| `LICENSE` | The project's licence: MIT, © Ayoub Elattar. |
| `THIRD_PARTY_NOTICES.md` | Credits and licences for code that came from elsewhere (shadcn/ui, Vercel AI Elements, the fonts) and a summary of npm dependency licences. |
| `package.json` / `package-lock.json` | The npm dependencies and the commands (`dev`, `build`, `verify`, tests). The lock file pins exact versions. |
| `components.json` | shadcn CLI settings: where components and utilities live, and the registry URL. |
| `registry.json` | The list of installable components (generated from `scripts/registry-manifest.mjs`). |
| `next.config.ts` | Next.js settings (currently the defaults). |
| `tsconfig.json` | TypeScript settings, including the `@/` import alias. |
| `eslint.config.mjs` | Lint rules, and the folders lint ignores. |
| `postcss.config.mjs` | Hooks Tailwind into the CSS build. |
| `vitest.config.ts` | Unit test runner settings (jsdom). |
| `playwright.config.ts` | End-to-end test settings: browsers, themes and the server it starts. |
| `playwright.registry.config.ts` | Settings for the one e2e test that installs the registry into a fresh app. |
| `.gitignore` | Files git never tracks (node_modules, builds, test output, env files). |
| `.claude/launch.json` | Dev-server presets for the Claude desktop preview. |
| `plugins/elattar-uiux-design/` | The UI/UX Claude plugin: the skill (rules, system knowledge, page patterns, evals), its checks (`checks/run.mjs`), four slash commands and an after-edit hook. Listed by `.claude-plugin/marketplace.json`. |

## components/ui

The base components every screen is built from: buttons, inputs, dialogs, menus, tables, tabs and similar. Most began as shadcn/ui (MIT) on Radix and were restyled so they read colour, type, spacing and motion from the design tokens only. A few are original to this system (for example `icon`, `icon-swap`, `active-indicator`, `content-change`, `disabled`, `stat`, `user-menu`). Product-specific pieces do not go here; they live beside this folder.

| File | What it does |
| --- | --- |
| `accordion.tsx` | Stacked sections that expand and collapse one at a time or several at once; `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`. |
| `active-indicator.tsx` | A sliding highlight that follows whichever item is currently selected inside a row of controls; `useActiveIndicator` measures the active item and `ActiveIndicator` draws the pill. Used by tabs and toggle groups. |
| `alert-dialog.tsx` | A modal that interrupts to ask for confirmation of a risky action, with Cancel and Action buttons. The buttons show a tooltip when their label is cut off, and Action can show a loading spinner. |
| `alert.tsx` | An inline message box for default, error, success, warning and info notices, with a title, description and optional action. Error and warning are announced to screen readers as alerts. |
| `aspect-ratio.tsx` | Keeps its content at a fixed width-to-height ratio, for example a 16:9 image frame. |
| `attachment.tsx` | A file or media chip (icon or thumbnail, name, status, actions) for uploads and message attachments. It has idle, uploading, processing, error and done states, an optional full-size preview in a dialog, and a download button that confirms with a toast. |
| `avatar.tsx` | A round user picture with an initials fallback, a small status badge, and a group that overlaps several avatars with a "+N" count. |
| `badge.tsx` | A small pill label for status or category, in neutral, action, premium, success, warning, info and error styles. |
| `breadcrumb.tsx` | The trail of links showing where the user is in a hierarchy, with separators and a "more" ellipsis. |
| `bubble.tsx` | A chat bubble in several colour variants, aligned to either side, plus a reactions strip (emoji toggles with counts). |
| `button-group.tsx` | Joins several buttons into one connected bar, with optional text segments and dividers. |
| `button.tsx` | The standard button: variants (default, premium, secondary, outline, ghost, destructive, link), sizes including icon-only, a loading state with a spinner, and a `ButtonLabel` that truncates long text. |
| `calendar.tsx` | A month calendar for picking dates or ranges, built on react-day-picker and styled with the system's buttons. |
| `card.tsx` | A bordered surface for grouping content, with header, title, description, action, content and footer parts. |
| `carousel.tsx` | A swipeable, scrollable row or column of slides with previous and next buttons, built on Embla. |
| `chart.tsx` | Wrapper that themes Recharts charts from the system colours in light and dark, with a styled tooltip and legend; configured through `ChartConfig`. |
| `checkbox.tsx` | A tick box with checked, unchecked and mixed states and a drawn-in check mark. Exports its look so other components can reuse it. |
| `collapsible.tsx` | A single show/hide region with a trigger and animated height. |
| `combobox.tsx` | A text field with a dropdown list of options to search and pick from, including multi-select chips; built on Base UI. |
| `command.tsx` | A searchable command palette (cmdk) with groups, items and keyboard shortcuts, also available inside a dialog. |
| `content-change.tsx` | Replays a short enter animation when a value changes: `ContentChange` for a block keyed to its content, `useReplayOnStateChange` for elements that flip a `data-state` attribute. |
| `context-menu.tsx` | The menu that opens on right-click or long-press, with items, checkboxes, radio items, submenus and shortcuts. |
| `dialog.tsx` | A centred modal window with overlay, header, title, description, footer and close button. Toast notifications stay clickable while it is open. |
| `direction.tsx` | Sets left-to-right or right-to-left reading direction for the components inside it; `DirectionProvider`, `useDirection`. |
| `disabled.tsx` | Wraps a control that can be disabled and, when given a reason, shows an info button that explains why. Works either with the native disabled attribute or an accessible "aria" mode that still lets the user try. |
| `drawer.tsx` | A panel that slides in from an edge and can be dragged closed, built on vaul; used mostly for bottom sheets on phones. |
| `dropdown-menu.tsx` | The menu that opens from a button, with items, checkboxes, radio items, submenus, labels and shortcuts. |
| `empty.tsx` | The "nothing here yet" block: icon or illustration, title, description and a call-to-action area. |
| `field.tsx` | The building blocks of a form row: label, description, error message, grouping, fieldset and legend, with horizontal and vertical layouts. |
| `form.tsx` | Connects react-hook-form to the field components so labels, hints and error messages are wired up for screen readers. Also provides `useFormRecovery`, which scrolls to and focuses the first invalid field after a failed submit. |
| `hover-card.tsx` | A small preview card that appears when hovering or focusing a link or trigger. |
| `icon-swap.tsx` | Rolls from one icon to another with a short animation, for example a download arrow turning into a tick. |
| `icon.tsx` | The one way to draw a Lucide icon: fixed size steps (`xs` to `3xl`), colour tones taken from the semantic palette, and correct hiding or labelling for screen readers. |
| `input-group.tsx` | A single field frame that holds an input or textarea together with leading or trailing text, icons, buttons and keyboard hints. |
| `input-otp.tsx` | A one-time-code entry with separate boxes per digit, a blinking caret and grouping. |
| `input.tsx` | The standard single-line text input, with focus and invalid styling. |
| `item.tsx` | A flexible list row with media, title, description, actions, header and footer, in default, outline and muted styles and several sizes. |
| `kbd.tsx` | Shows a keyboard key such as Ctrl or K, and a group for key combinations. |
| `label.tsx` | The text label tied to a form control. |
| `marker.tsx` | A quiet inline divider line of text, such as "Today" in a chat, with optional icon and rule lines on either side. |
| `menubar.tsx` | A horizontal application menu bar (File, Edit, View) whose menus open in place, with the same item types as a dropdown menu. |
| `message-scroller.tsx` | The scrolling area of a chat thread: keeps the view pinned to new messages, fades the edges, and shows a "scroll to end" button when the user has scrolled up. Wraps the `@shadcn/react` message scroller. |
| `message.tsx` | The layout of one chat message: avatar, header, content and footer, aligned to the start or end, plus a group that spaces messages. |
| `native-select.tsx` | A styled browser-native dropdown (`<select>`), for when the system picker is the better choice, for example on phones. |
| `navigation-menu.tsx` | A site navigation bar whose items open large content panels, with a shared viewport and an arrow indicator. |
| `pagination.tsx` | Page-number navigation with previous, next, current-page marking and an ellipsis. |
| `popover.tsx` | A floating panel that opens from a trigger. It names itself from its title and description parts automatically for screen readers. |
| `progress.tsx` | A horizontal progress bar, with tones for default, premium, success, warning and error, and a moving "indeterminate" mode when the amount is unknown. |
| `prose.tsx` | Wraps long-form text (articles, markdown output) so headings, paragraphs, lists, tables and code get the system's reading styles. |
| `questionnaire.tsx` | A step-by-step survey or onboarding flow: question, single or multiple choices with number-key shortcuts, free-text answer, error, progress and Previous/Skip/Next/Submit buttons. Wraps the `@shadcn/react` questionnaire. |
| `radio.tsx` | A radio group where one option can be chosen, with the same look exported for reuse. |
| `resizable.tsx` | Side-by-side or stacked panels separated by a draggable handle, built on react-resizable-panels. |
| `scroll-area.tsx` | A scrollable region with a custom thin scrollbar. It stays keyboard-focusable so content can be reached without a mouse. |
| `select.tsx` | A custom dropdown for choosing one option from a list, with groups, labels and scroll buttons. |
| `separator.tsx` | A thin horizontal or vertical dividing line. |
| `sheet.css` | The slide-in and slide-out animation for sheets, driven by which edge the sheet comes from. |
| `sheet.tsx` | A panel that slides in from the left, right, top or bottom over the page, with header, body, footer and close button. The sidebar uses it on mobile. |
| `sidebar.tsx` | The full app side navigation: provider, collapsible desktop rail, mobile sheet, groups, menu items with tooltips when collapsed, badges, sub-menus, loading skeleton, and a Ctrl/Cmd+B shortcut. It remembers open or closed in a cookie. |
| `skeleton.tsx` | A shimmering grey placeholder shown while content loads. |
| `slider.tsx` | A draggable slider for a number or a range, with a labelled thumb for each value. |
| `spinner.tsx` | A spinning loading icon that announces "Loading" to screen readers unless it is marked decorative. |
| `stat.tsx` | A key figure with a label, a value, a change indicator (up, down, flat) and a hint. Handles ready, loading, error and empty states; `Stat`, `StatDeltaMark`. |
| `switch.tsx` | An on/off toggle switch. |
| `table.tsx` | Styled table parts: header, body, footer, rows, heads, cells and caption. |
| `tabs.tsx` | Tabbed navigation with a sliding selection pill, in a filled style or an underlined style. |
| `textarea.tsx` | The standard multi-line text input. |
| `toaster.tsx` | The container that shows pop-up notifications (Sonner), following the current light or dark theme and using the system's toast look and icons. |
| `toggle-group.tsx` | A row of buttons where one or several can be on, sharing a sliding highlight. |
| `toggle.tsx` | A single button that stays pressed or not pressed, in default and outline styles. |
| `tooltip.tsx` | A small dark label that appears on hover or focus. It also opens on a touch tap and closes when the user taps elsewhere. |
| `user-menu.tsx` | The account block at the bottom of the sidebar: avatar, name and email that open a menu of actions, with destructive actions such as sign-out set apart. Collapses to just the avatar. |

## hooks

Small shared React hooks that more than one component relies on. They hold behaviour only and draw nothing.

| File | What it does |
| --- | --- |
| `use-latest.ts` | `useLatest` returns a ref that always holds the newest value of what it is given, so callbacks and listeners can read current data without re-subscribing. |
| `use-mobile.ts` | `useIsMobile` reports whether the screen is narrower than 768px and updates when the window resizes. |
| `use-reduced-motion.ts` | `usePrefersReducedMotion` reports whether the user's device is set to reduce motion, so code can skip animated scrolling and similar effects. |

## styles

The design-system foundation. `app/globals.css` imports these four files in order and holds nothing else. Each value is chosen in exactly one of them and every component reads it by name, so nothing in the components is hardcoded.

| File | What it does |
| --- | --- |
| `tokens.css` | The single place values are chosen. Owns the Inter and Geist Mono font setup; the dark-mode variant; the brand colour ramps (action and value roles); the neutral grey scale; the light and dark colour themes mapped to shadcn's semantic names (background, foreground, card, primary, border, ring, destructive and so on) plus success, warning and info; chart, sidebar, agent, code-syntax and media-overlay colours; radius, shadow and glow-depth tokens; font families and weights; type sizes, line heights and letter spacing, which step up at the 768px and 1024px breakpoints; layout widths, heights and minimum touch-target size; and the base document styles (focus ring, tabular numbers). |
| `typeset.css` | The type roles and long-form text styles. Owns the nineteen `.type-*` classes (display, headings h1-h5, lead, body, small, nav, cta, badge, code, identifier, and the five numeric sizes), which set family, size, line height, weight and tracking only, and the `.prose` flow for articles that reuses the same heading styles. |
| `motion.css` | Everything that involves time. Owns the duration and easing scales; all keyframes (enter, exit, change, shimmer, pulse, spin, caret, expand, collapse, progress, cosmic drift, foil, glint, orb and star effects); the animation utilities (`anim-*`, `press`, `toggle-slide`, `swap-roll`, `width-transition`, `move-transition`, `effort-glide`); and the reduced-motion override that switches animation off for users who ask for it. |
| `utilities.css` | The sanctioned visual effects and special surfaces. Owns glow (action and value), the ramp chip, glass panel and control surfaces, colour blooms and the cosmic bloom, the value foil, the action sheen, the aurora, the starfield, thin scrollbar rails, toast styling, device safe-area padding, media scrims, code-highlight and terminal colours, theming for xyflow node-and-edge diagrams (`xy-tokens`), Streamdown markdown chrome, and the voice-orb look. |

## components/agent/

This folder holds `AgentWorkspace`, a complete AI chat surface: header with an animated face, conversation thread, message composer, optional history sidebar and settings panel. It knows nothing about any one product; it talks to your backend through a single `AgentTransport` object and is built from the AI Elements pieces in `components/ai-elements/` plus the base components in `components/ui/`. The work is split in five sub-folders. `core/` holds the data shapes and the plain logic (no screens). `workspace/` holds the screens that make up the chat. `parts/` holds small self-contained visuals and controls the workspace borrows. `voice/` handles reading replies aloud. `avatar/` draws the agent's animated face.

| File | What it does |
| --- | --- |
| `agent-workspace.tsx` | The finished chat surface (`AgentWorkspace`). It takes a transport plus optional models, commands, history and voice, keeps the composer and settings state, works out the agent's current state, and lays out the header, thread and composer. |
| `index.ts` | The public entry point: re-exports the workspace, the shared types and helpers, the avatar (as `AgentAvatar`), the speech hook and the effort and spark controls, so apps import from one place. |

## components/agent/core/

The data model and logic behind the chat, with no screen code except two small hooks. Everything the workspace shows is derived from the types and functions here.

| File | What it does |
| --- | --- |
| `types.ts` | Defines the shapes the chat runs on: attachments, the events a backend sends, the turn types (user, text, tool, action, error), `AgentTransport` (the one interface a backend must provide) and its capability flags. |
| `timeline.ts` | Turns a stream of backend events into the list of conversation turns (`reduceEvent`), and updates turns for approvals and finished actions. Also strips internal protocol tags from text. |
| `run.ts` | Defines a multi-step "run" (plan steps, side effects, checkpoints, queue, hand-off) and the function that updates it from events. Also maps a run's status to an avatar state and works out the undo order. |
| `states.ts` | Lists the 26 agent states (idle, thinking, searching, awaiting approval, offline and so on), their on-screen labels, and helpers to tell busy states from resting ones and to map a tool name to a state. |
| `resolve-state.ts` | Picks the one state the agent should show right now by checking connection, declared state, run status, errors, approvals, running tools and streaming text in priority order. |
| `attachments.ts` | Reads files the user adds, decides what is sent as text and what is sent as a reference, enforces size limits, and picks out files the agent produced in a tool result. |
| `conversations.ts` | Types for the saved-conversation list (summary, restored message, and the store a host app provides to open, create, rename and delete chats). |
| `use-presence.ts` | Hook that keeps an element mounted long enough to play its exit animation, then removes it (`usePresence`). |
| `use-container-width.ts` | Hook that tracks an element's width as it resizes, plus a helper that converts a CSS rem variable to pixels. |

## components/agent/workspace/

The visible parts of the chat. `agent-workspace.tsx` assembles these; each file here is one region or one kind of content.

| File | What it does |
| --- | --- |
| `workspace-header.tsx` | Top bar with the agent's animated face, its name and title, a voice indicator while dictating, and the button that opens settings. |
| `workspace-thread.tsx` | The scrolling conversation area: shows the empty state with starter suggestions, each user message with its reply, restore-point markers, and the scroll-to-latest button. |
| `workspace-reply.tsx` | Renders one user message (with edit and version browsing) and one agent reply: reasoning, step-by-step tool activity, approval prompts, markdown answer with citations and sources, generated images, and actions such as copy, retry and read aloud. |
| `workspace-composer.tsx` | The message box: text entry, file attachments, `@` and `/` pickers, model and effort choice, web-search toggle, dictation and microphone choice, a context-usage meter with summarise, and the send and stop button. |
| `workspace-outputs.tsx` | Draws structured tool results (terminal output, test results, stack traces, file changes, commits, packages, API schemas, code, previews) with the matching AI Elements component. Also holds copy and read-aloud helpers and the list of files the agent produced. |
| `workspace-settings.tsx` | The settings side panel: how much the agent may do on its own, response length, temperature, voice choice and an "about this agent" summary, with a reset button. |
| `workspace-history.tsx` | The sidebar list of past conversations grouped by Today, Yesterday, Previous 7 days and Older, with new chat, archive and delete (with undo). |
| `run-inline.tsx` | Shows a multi-step run inside the chat: the proposed plan to approve or edit, step progress with pause, resume, cancel and undo, error and hand-off notices, and the queue of messages waiting to send (`RunInline`, `RunQueue`). |
| `workflow-dialog.tsx` | A pop-up diagram of a run's plan as connected step boxes, with optional step renaming (`WorkflowDialog`). |
| `reply-model.ts` | Pure helpers that group turns into user-and-reply pairs, map turns onto the tool states AI Elements expects, and prepare queue, checkpoint, context-usage and generated-image data for display. |
| `tool-output.ts` | Describes the 14 kinds of structured tool result the workspace can draw and checks incoming data against them, so malformed or unsafe results (for example a non-web preview address) are ignored. |
| `step-status.tsx` | Small status mark and label for a plan step (waiting, running, done, failed, skipped) and a duration formatter. |

## components/agent/parts/

Self-contained widgets used by the workspace that do not depend on chat data.

| File | What it does |
| --- | --- |
| `effort-slider.tsx` | A notched slider for choosing how hard the agent thinks (Low to Max), usable by pointer or arrow keys (`EffortSlider`). |
| `spark-field.tsx` | A canvas of small rising sparks behind the composer that speed up as the user types and calm down when they stop (`SparkField`). |
| `voice-orb.tsx` | A round glass-style indicator with five states (idle, listening, thinking, speaking, asleep), shown in the header during voice input (`VoiceOrb`). |
| `generated-image.tsx` | Frame for an AI-generated image that shows blur and a status pill while it is queued, generating or refining, and a retry button if it fails (`GeneratedImage`). |

## components/agent/voice/

Reading replies aloud.

| File | What it does |
| --- | --- |
| `speech.ts` | Read-aloud support using the browser's built-in speech: voice list, speak, pause, resume and stop (`useBrowserSpeech`), plus `speakableText`, which strips markdown so replies read naturally. |

## components/agent/avatar/

The agent's face: an animated cube drawn in CSS, with a different scene for each agent state.

| File | What it does |
| --- | --- |
| `cube-avatar.tsx` | The default avatar (`CubeAvatar`, exported as `AgentAvatar`). Shows a spinning cube when idle and an isometric cube scene for other states, cross-fading when the state changes, in four sizes. |
| `cube.tsx` | Low-level drawing for the isometric cubes: coordinates, face colours and the animation helpers (bob, appear, drop) that scenes use. |
| `scenes.ts` | One cube arrangement and animation per agent state (queued, planning, searching, error and so on), returned by `sceneFor`. |
| `avatar.css` | The keyframe animations for the cubes, and rules that stop the motion for people who prefer reduced motion. |
| `types.ts` | The avatar contract (`AvatarRenderer`, its props and sizes) so an app can swap in its own face. |

## components/ai-elements/

Chat and agent building blocks adapted from Vercel AI Elements (Apache-2.0), restyled to this system's tokens with accessibility fixes. Each file is a set of small pieces you combine, for example `Message` with `MessageContent`. `components/agent/` is assembled from these. `NOTICE.md` and `LICENSE` carry the required attribution and licence text.

| File | What it does |
| --- | --- |
| `NOTICE.md` | Third-party notice: says these files come from Vercel AI Elements under Apache-2.0 and have all been modified, and carries the upstream copyright. |
| `LICENSE` | Full text of the Apache License, Version 2.0. |
| `agent.tsx` | Card describing an agent: name and model, its instructions, its tools and its expected output (`Agent`, `AgentTools`). |
| `artifact.tsx` | Titled panel for a generated document or code, with header, actions and close button (`Artifact`). |
| `attachments.tsx` | Shows attached files and images in grid, inline or list layout, with preview, info and remove button (`Attachments`, `Attachment`). |
| `audio-player.tsx` | Audio player with play, seek, time and mute controls, fed by generated speech (`AudioPlayer`). |
| `canvas.tsx` | Pan-and-select flow-diagram surface built on React Flow that follows the light or dark theme (`Canvas`). |
| `chain-of-thought.tsx` | Collapsible list of the agent's reasoning steps with search results and images (`ChainOfThought`). |
| `checkpoint.tsx` | Divider marking a point in a conversation that can be restored (`Checkpoint`, `CheckpointTrigger`). |
| `code-block.tsx` | Syntax-highlighted code with filename, copy button and language selector, using theme-aware colours (`CodeBlock`). |
| `commit.tsx` | Display of a git commit: hash, message, author, time and changed files with copy button (`Commit`). |
| `confirmation.tsx` | Approval prompt for a tool call, with request, accepted and rejected states and approve and reject buttons (`Confirmation`). |
| `connection.tsx` | Line drawn while dragging a new link between nodes in a `Canvas` diagram (`Connection`). |
| `context.tsx` | Gauge showing how much of the model's context window is used, with a breakdown of input, output, reasoning and cached tokens (`Context`). |
| `controls.tsx` | Zoom and fit buttons for a `Canvas` diagram, restyled to this system (`Controls`). |
| `conversation.tsx` | The scrolling message area that sticks to the newest message, with empty state, scroll-to-bottom button and a markdown download (`Conversation`). |
| `edge.tsx` | Link styles between diagram nodes: a dashed temporary one and an animated one (`Edge`). |
| `environment-variables.tsx` | List of environment variables with names, values hidden by default, a reveal toggle and copy (`EnvironmentVariables`). |
| `file-tree.tsx` | Expandable folder and file tree with icons and optional actions (`FileTree`). |
| `image.tsx` | Renders an AI-generated image from base64 data (`Image`). |
| `inline-citation.tsx` | Numbered source marker inside text that opens a hover card with a carousel of sources (`InlineCitation`). |
| `jsx-preview.tsx` | Renders streamed JSX markup as live components, with a shown error if it is invalid (`JSXPreview`). |
| `message.tsx` | A chat message with its content, action buttons, version branching and markdown rendering of the response (`Message`, `MessageResponse`). |
| `mic-selector.tsx` | Searchable picker for the microphone to use, plus a hook that lists audio input devices (`MicSelector`, `useAudioDevices`). |
| `model-selector.tsx` | Searchable picker for the AI model, with provider logos and grouping (`ModelSelector`). |
| `node.tsx` | A card used as a node in a `Canvas` diagram, with optional connection points on each side (`Node`). |
| `open-in-chat.tsx` | Menu that opens the current question in another chat service; the caller supplies the targets (`OpenIn`). |
| `package-info.tsx` | Shows a software package with its version change (major, minor, patch, added, removed), description and dependencies (`PackageInfo`). |
| `panel.tsx` | Floating box placed on top of a `Canvas` diagram (`Panel`). |
| `plan.tsx` | Collapsible card presenting a plan, with title, description, content and footer (`Plan`). |
| `prompt-input.tsx` | The full message input kit: text area, attachments by button, drop or paste, action menu, command list, tools and submit button with state (`PromptInput`). It is the largest file in this folder. |
| `question.tsx` | Question the agent asks the user, with single or multiple choice options, optional free text and a submit button (`Question`). |
| `queue.tsx` | List of queued messages or to-dos, grouped in sections, with per-item actions and attachments (`Queue`). |
| `reasoning.tsx` | Collapsible "thinking" block that opens while the model reasons and closes when it finishes (`Reasoning`). |
| `sandbox.tsx` | Collapsible code-execution panel with status and tabs for code and output (`Sandbox`). |
| `schema-display.tsx` | Shows an API endpoint: method, path, parameters, and request and response fields as expandable trees (`SchemaDisplay`). |
| `shimmer.tsx` | Text with a moving highlight, used for "working" status lines (`Shimmer`). |
| `snippet.tsx` | A short read-only text such as a command, with a copy button (`Snippet`). |
| `sources.tsx` | Collapsible "Used N sources" list of links (`Sources`). |
| `speech-input.tsx` | Microphone button that dictates text, using the browser's speech recognition or by recording audio for a server to transcribe (`SpeechInput`). |
| `stack-trace.tsx` | Parses and shows an error stack trace with the error type, message, expandable frames and copy (`StackTrace`). |
| `suggestion.tsx` | Row of clickable starter prompts (`Suggestions`, `Suggestion`). |
| `task.tsx` | Collapsible task with a title and a list of items and file chips (`Task`). |
| `terminal.tsx` | Terminal output panel with coloured text, streaming indicator, copy and clear (`Terminal`). |
| `test-results.tsx` | Test run report with pass, fail and skip counts, progress, suites, individual tests and error details (`TestResults`). |
| `tool.tsx` | Collapsible record of a tool call with status badge, input and output (`Tool`, `getStatusBadge`). |
| `toolbar.tsx` | Small bar that appears under a selected diagram node (`Toolbar`). |
| `transcription.tsx` | Transcript text split into timed segments that highlight and seek as audio plays (`Transcription`). |
| `voice-selector.tsx` | Searchable picker for a text-to-speech voice, with name, details and selection (`VoiceSelector`). |
| `web-preview.tsx` | Browser-like frame with address bar, navigation buttons, an embedded page and a console log (`WebPreview`). |

## components/ds

The building blocks of this documentation site itself: page headers, navigation, code samples, colour swatches and live demos. They are not part of the installable design system; they only present it. Chart demos live in the `charts/` sub-folder below.

| File | What it does |
| --- | --- |
| `chart-motion.ts` | The `useChartMotion` hook gives every demo chart its animation settings, reading the duration from the motion token and switching animation off when the visitor prefers reduced motion. |
| `code-block.tsx` | `CodeBlock` shows a syntax-highlighted code sample with a copy button that confirms with a toast; used wherever the docs show code. |
| `danger-zone-demo.tsx` | `DangerZone` is a worked example of a destructive "delete" area with a confirmation dialog and idle, deleting, deleted, failed, loading and unavailable states. |
| `data-table-demo.tsx` | `DataTableDemo` is a sample sales table with sorting, search, row selection, paging, a loading skeleton and an empty state. |
| `ds-breadcrumb.tsx` | `DsBreadcrumb` shows "Design System / current page" above the content of each docs page, looked up from the navigation tree. |
| `ds-nav.tsx` | `DsSidebar` and `DsMobileNav` draw the docs navigation tree, as a side rail on desktop and as a slide-out menu on phones. |
| `icon-swap-demo.tsx` | Four small interactive examples of `IconSwap` (grid/list, play/pause, favourite, mute) for the icon-swap doc page. |
| `kit.tsx` | The shared layout pieces for docs pages: page header, section, panel, state grid, do/don't pair, note, index cards, footer navigation and `CommandBlock` (an install command with a copy button). |
| `logo.tsx` | `LogoMark` and `Logo` draw the "ELATTAR.DS" mark and wordmark used in site headers. |
| `sidebar-demos.tsx` | Three boxed Sidebar examples: one showing the live sidebar state values, one with the rail and inset layout, and one that lets you switch side, variant and collapse mode. |
| `sidebar-headers.tsx` | Three ready-made Sidebar header examples: a team switcher, a version switcher and a search box. |
| `sidebar-specimens.tsx` | Shared sample data and boxed stages (`PartStage`, `ContextStage`, `ShellStage`) that the Sidebar docs use to show the component outside a full page. |
| `theme-provider.tsx` | `ThemeProvider` wraps the app so the light or dark theme can be switched, defaulting to dark. |
| `theme-toggle.tsx` | `ThemeToggle` is the three-way Light / System / Dark switch shown in the site header. |
| `toast-preview.tsx` | `ToastPreview` draws a static copy of a toast notification so docs can show each toast type without firing a real one. |
| `token-swatch.tsx` | Swatches and readouts that show a design token's live value and measured contrast ratio in the current theme (`TokenSwatch`, `ContrastBadge`, `SpacingStep`). |
| `typeset-catalog.tsx` | `TypesetCatalog` lists all nineteen text roles with a live sample, what each is for, and its sizes, weight and font. |

## components/ds/charts

Sample charts for the Charts docs, built on the recharts library and the `components/ui/chart` wrapper. Each file holds one chart family in many variants, all fed from the same sample data.

| File | What it does |
| --- | --- |
| `area.tsx` | Area chart variants: default, linear, step, stacked, legend, icons, gradient, axes and an interactive one. |
| `bar.tsx` | Bar chart variants: vertical, horizontal, multiple, stacked, labelled, mixed colours, active bar, negative values and an interactive one. |
| `conversion-funnel.tsx` | `ConversionFunnelChart` shows how many people reach each step of a sign-up flow, as bars of small units with percentages. |
| `data.ts` | The sample numbers, colour/label configs and the shared chart height (`PLOT`) used by every chart demo. |
| `line.tsx` | Line chart variants: default, linear, step, multiple series, dots, labels and an interactive one. |
| `pie.tsx` | Pie and donut chart variants: labels, legend, active slice, centre text, stacked and an interactive one. |
| `radar.tsx` | Radar chart variants: dots, lines only, several grid styles, multiple series, legend, icons and radius options. |
| `radial.tsx` | Radial (ring) bar chart variants: simple, grid, labelled, centre text, custom shape and stacked. |
| `skeletons.tsx` | `ChartSkeleton` draws a grey loading placeholder shaped like each chart type. |
| `state.tsx` | `ChartStates` wraps a chart with a toggle to preview its Empty, Loading, Error and Ready states. |
| `tooltip.tsx` | Tooltip variants on a bar chart: indicator styles, custom labels and formatters, icons and an advanced layout. |
| `unit-activity.tsx` | `UnitActivityChart` is a week-by-time grid of stacked units showing activity against the previous period. |

## lib

Small shared code used across the app that is not a component: class-name helper, docs navigation data, the platform contract, motion names and the scripted mock agent. Most files are plain data and helpers.

| File | What it does |
| --- | --- |
| `code-theme.ts` | Defines the code-highlighting theme (`SYSTEM_CODE_THEME`) so code colours come from CSS variables and follow light and dark. |
| `motion-names.ts` | The list of every duration, easing, animation class and keyframe name in the motion system, plus the retired old names and what they became; read by the docs and by the check scripts. |
| `terminal-text.tsx` | `TerminalText` turns text containing terminal colour codes into styled spans (and optionally clickable links), replacing a third-party library. |
| `utils.ts` | `cn()` merges class names and resolves conflicts, taught about this system's custom text-size and shadow names. |

## lib/agent

Support code for the Agent Workspace demos.

| File | What it does |
| --- | --- |
| `mock-transport.ts` | `useMockTransport` is a fake agent backend that plays scripted conversations (chat, tools, planning, approvals, run control, recovery, long session) so the Agent Workspace works in the docs without a real AI. |

## lib/docs

Data for the public marketing pages.

| File | What it does |
| --- | --- |
| `nav.ts` | The link lists for the home page footer: Support, Company and the legal links (`SITE_FOOTER`, `SITE_LEGAL`). |

## lib/ds

The data that drives the documentation site: the full list of pages, the catalog of components, the platform contract and the icon list.

| File | What it does |
| --- | --- |
| `families.ts` | The four component families (components, effects, agent, charts): display names, page-label text, order, and the landing page for agent and charts. |
| `icons.ts` | The curated icon set shown on the Icons page, grouped, with a note on what each icon is for (`ICON_GROUPS`, `ICON_COUNT`). |
| `nav.ts` | The single source of truth for the docs navigation tree: foundations, component families and documentation pages, with helpers to build links and find the previous and next page. |
| `platform-contract.ts` | The written specification of what the system ships: every component's name, family and how it is delivered, the renames and removals, and the type scale per screen size. |
| `registry.ts` | Reads the built registry files (`public/r`) so install commands shown in the docs always come from the real registry. |

## lib/ds/docs

Code behind the per-component documentation pages.

| File | What it does |
| --- | --- |
| `catalog.ts` | The catalog of documented components (`COMPONENT_DOCS`) joined to the platform contract, with lookups by name, family and route. |
| `description.ts` | Helpers that strip or split the back-tick code marks in component descriptions for plain or styled display. |
| `section-order.ts` | The fixed order of sections on a component page (preview, installation, variants, states, sizes, examples, usage) and which start open. |
| `specs.ts` | Maps each component name to a loader that fetches its documentation page content on demand. |
| `types.ts` | The `ComponentDocMeta` type: name, description, dependencies, exports and source path of a documented component. |

## lib/motion

| File | What it does |
| --- | --- |
| `spring.ts` | Turns the motion tokens (durations, easings, spring roles) into numbers that JavaScript animation code can use, with a zero-duration `INSTANT` for reduced motion. |

## app

The website routes, built with the Next.js App Router: a folder with a `page.tsx` is a URL. The public landing page is at the top; everything else is the design-system documentation under `/design-system`.

| File | What it does |
| --- | --- |
| `globals.css` | The CSS entry point: loads Tailwind, then the four stylesheets in `styles/` in order; holds no styling of its own. |
| `icon.svg` | The site's browser-tab icon. |
| `layout.tsx` | The root layout wrapping every page: fonts, theme provider, tooltip provider and the toast area. |
| `page.tsx` | Serves `/`: the public landing page with headline, install command, links to the docs, and footer. |

## app/sidebar-demo

| File | What it does |
| --- | --- |
| `page.tsx` | Serves `/sidebar-demo`: a full-screen live Sidebar for trying collapse, the rail, the mobile sheet and saved open state at real viewport size. |

## app/design-system

| File | What it does |
| --- | --- |
| `layout.tsx` | Wraps every `/design-system/*` page with the skip link, docs header, left navigation rail and breadcrumb. |
| `page.tsx` | Serves `/design-system`: the docs home with cards for the foundations and component families, and the six rules that outrank taste. |

## app/design-system/colors

| File | What it does |
| --- | --- |
| `page.tsx` | Serves `/design-system/colors` (titled Theming): every colour token as a live swatch with measured contrast, in the current theme. |

## app/design-system/typography

| File | What it does |
| --- | --- |
| `page.tsx` | Serves `/design-system/typography` (titled Typeset): the two typefaces, the nineteen text roles at real size, prose styling and the rules. |

## app/design-system/spacing

| File | What it does |
| --- | --- |
| `page.tsx` | Serves `/design-system/spacing`: the spacing scale, corner-radius ladder, elevation levels, 12-column grid, breakpoints and minimum touch-target size. |

## app/design-system/shadows

| File | What it does |
| --- | --- |
| `page.tsx` | Serves `/design-system/shadows`: ambient shadows, raised and recessed "machine" surfaces, the limited use of glow, and glass. |

## app/design-system/motion

| File | What it does |
| --- | --- |
| `page.tsx` | Serves `/design-system/motion`: live demos of durations, easing curves, the animation classes, reveal choreography and reduced-motion behaviour. |

## app/design-system/icons

| File | What it does |
| --- | --- |
| `page.tsx` | Serves `/design-system/icons`: the `Icon` component, its sizes and tones, icons inside controls, and the full curated icon set. |

## app/design-system/components

| File | What it does |
| --- | --- |
| `page.tsx` | Serves `/design-system/components`: the catalog index, one card per component, grouped by family. |
| `[component]/page.tsx` | Serves `/design-system/components/<name>` for every documented component (for example `button`): loads that component's doc spec and renders it. |

## app/design-system/components/agent

| File | What it does |
| --- | --- |
| `page.tsx` | Serves `/design-system/components/agent`: the Agent family overview, with the four pieces a caller supplies (transport, avatar, speech, tool states) and links to every agent part. |

## app/design-system/components/charts

| File | What it does |
| --- | --- |
| `page.tsx` | Serves `/design-system/components/charts`: the Charts gallery, with a family picker (area, bar, line, pie, radar, radial, tooltips) showing live charts and their code. |

## app/design-system/components/agent-workspace

| File | What it does |
| --- | --- |
| `why/page.tsx` | Serves `/design-system/components/agent-workspace/why`: one card per part of the Agent Workspace saying what it is, where it is used, why it was chosen and what was changed, with its licence. |
| `live/page.tsx` | Serves `/design-system/components/agent-workspace/live`: the page wrapper for the full-screen workspace demo. |
| `live/full-screen-workspace.tsx` | The full-viewport live Agent Workspace with a conversation picker and a back link, used to test layouts at real desktop width. |

## app/design-system/docs

| File | What it does |
| --- | --- |
| `page.tsx` | Serves `/design-system/docs`: the index of documentation guides. |
| `introduction/page.tsx` | Serves `/design-system/docs/introduction`: what the system is, its three core ideas and where things live in the repository. |
| `installation/page.tsx` | Serves `/design-system/docs/installation`: requirements and the steps to initialise, install the foundation and add a first component. |
| `cli/page.tsx` | Serves `/design-system/docs/cli`: how to use the shadcn CLI commands (`init`, `add`, `diff`, `search`) with this system. |
| `registry/page.tsx` | Serves `/design-system/docs/registry`: the install registry, its namespaces and every install command, read from the built registry files. |
| `skills/page.tsx` | Serves `/design-system/docs/skills`: the `elattar-uiux-design` plugin, what it checks and how to install it. |
| `changelog/page.tsx` | Serves `/design-system/docs/changelog`: dated list of notable changes. |
| `theming/page.tsx` | Redirects `/design-system/docs/theming` permanently to `/design-system/colors`. |
| `typeset/page.tsx` | Redirects `/design-system/docs/typeset` permanently to `/design-system/typography`. |

## scripts

Command-line scripts (Node) that build the install registry and guard the codebase. Those wired into `package.json` run through the npm scripts named below; `npm run verify` chains the guards before a build.

| File | What it does |
| --- | --- |
| `build-audit-inventory.mjs` | Prints a table of every component module and its exports, for the web component audit document. No npm script; run directly with `node`. |
| `build-registry.mjs` | Builds the shadcn-compatible install registry into `public/r` and checks for duplicate paths, dependency cycles and broken `@/` imports. Run by `npm run registry:build`. |
| `check-refs.mjs` | Fails on any CSS class or `var(--token)` that is used but never defined, which would otherwise fail silently. Run by `npm run check:refs`. |
| `check-tokens.mjs` | Fails on any hand-written colour, size, spacing, radius or duration outside the four `styles/*.css` files. Run by `npm run check:tokens`. |
| `generate-registry.mjs` | Writes `registry.json` from the manifest, filling in each item's package and item dependencies by reading its real imports. No npm script; run directly with `node`. |
| `next.mjs` | Starts the Next.js command line with anonymous telemetry turned off. Run by `npm run dev`, `build` and `start`. |
| `registry-lib.mjs` | Shared helpers for the registry scripts, such as reading a file's imports and resolving `@/` paths. Not run by itself. |
| `registry-manifest.mjs` | Declares which files belong to which registry item, the registry name and the base URL (`REGISTRY_URL`). Not run by itself. |
| `registry-static-server.mjs` | A tiny local web server for `public/r`, used to rehearse registry installs; used by the registry-consumer end-to-end test. |
| `validate-docs.mjs` | Checks that every nav route has a page, doc links resolve, install commands match the registry, and regenerates `public/llms.txt`. Run by `npm run docs:validate`. |

## components/docs/

The documentation website's own components. They are not part of what consumers install.

### components/docs/component-docs/

One folder per documented component: 149 folders, about 395 files, all following the same pattern. The folder name is the page's URL slug (`button` → `/design-system/components/button`; `ai-terminal` → `/design-system/components/ai-terminal`).

| File (in each folder) | What it does |
| --- | --- |
| `meta.ts` | The component's catalogue entry: name, one-line description, dependencies, exports and source path. |
| `page.tsx` | The page itself, as a `spec`: preview, installation, states, usage, API reference, accessibility, "why" and source sections. |
| `*-specimen.tsx` / `*-showcase.tsx` | Live, interactive demos the page renders (state switchers, worked examples). |

### components/docs/component-page/

| File | What it does |
| --- | --- |
| `component-doc-page.tsx` | `ComponentDocPage`: renders a component's `spec` as a full docs page. |
| `doc-section.tsx` | `CollapsibleDocSection` and the section list, and remembers which sections the reader expanded. |
| `preview-code.tsx` | `PreviewCode`: the Preview / Code toggle around every demo. |
| `sections.tsx` | `DocSectionBody` renders each section kind; `SourceMeta` shows the source path and exports. |
| `table-of-contents.tsx` | `TableOfContents` and `AnchorStrip`: the on-page navigation. |
| `types.ts` | The types a docs page `spec` is written in (showcase, install, snippet, disclosure sections…). |

### components/docs/chrome/

| File | What it does |
| --- | --- |
| `site-header.tsx` | `SiteHeader`: the top bar with logo, main navigation, search and theme toggle. |
| `docs-shell.tsx` | `DocsShell`: the docs layout — skip link, header, rail and main column — left out on full-screen pages such as the live workspace. |
| `docs-header.tsx` | `DocsHeader`: the docs top bar — mobile navigation, logo, search and theme toggle. |
| `docs-rail.tsx` | `DocsRail`: the left-hand navigation tree. |
| `docs-search.tsx` | `DocsSearch`: the ⌘K search over every page. |
| `announcement-bar.tsx` | `AnnouncementBar`: a dismissible notice strip that remembers being dismissed. |
| `site-footer.tsx` | `SiteFooter`: the footer links. |
| `skip-link.tsx` | `SkipLink`: "skip to content" for keyboard users. |

### components/docs/layout/, page/, charts-gallery/ and docs-motion.css

| File | What it does |
| --- | --- |
| `layout/page-container.tsx` | The page width and gutter measures every docs page uses. |
| `layout/page-section.tsx` | A page section with standard spacing and surface options. |
| `page/landing-hero.tsx` | The landing page hero and its staged intro animation. |
| `page/family-landing.tsx` | The landing layout for a component family (e.g. all agent parts). |
| `page/fourteen-motions.tsx` | The Motion page's live demo of the system's motion vocabulary. |
| `charts-gallery/chart-family-tabs.tsx` | Tabs that switch between chart families on the Charts page. |
| `docs-motion.css` | Animations used only by the docs website (landing intro, motion-page instruments), not shipped to consumers. |

## test/

Unit and component tests (Vitest + Testing Library, run with `npm run test:unit`). The folders mirror the source.

| Folder | What it tests |
| --- | --- |
| `components/ui`, `components/agent`, `components/ai-elements` | Each component's behaviour, states, accessibility (axe) and DOM contract. |
| `agent/` | The mock agent transport and its scripted conversations. |
| `charts/` | Chart components and their geometry. |
| `compositions/` | Multi-component patterns (forms, validation). |
| `docs/` | That every docs page renders and lists what it claims. |
| `effects/` | Effect utilities (glass, press, scrim, hover). |
| `foundation/` | The design-system contract: token sources, motion names, keyframe registry, telemetry off. |
| `hooks/` | The shared hooks. |
| `licence/` | The licence files and the guard that fails the build if third-party material comes back. |
| `registry/` | The registry: schema, file paths, dependencies, install commands. |
| `setup.ts` / `vitest-axe.d.ts` | Test setup (jsdom polyfills, matchers) and the axe matcher types. |

## e2e/

Browser tests (Playwright, `npm run test:e2e`), run in dark, light and reduced-motion projects.

| File | What it tests |
| --- | --- |
| `design-system.spec.ts` | Every page loads cleanly: one h1, no overflow at phone width, no console errors. |
| `agent-workspace.spec.ts` | The seven scripted agent conversations end to end. |
| `agent-gallery.spec.ts` | The Agent landing's live workspace answers a sent message. |
| `component-interactions.spec.ts` | Real interaction with controls and overlays (keyboard, pointer, focus). |
| `doc-sections.spec.ts` | Docs page sections expand, collapse and remember the choice. |
| `charts-gallery.spec.ts` | The charts gallery and its family tabs. |
| `typography.spec.ts` | The type scale changes only at the 768px and 1024px breakpoints. |
| `gaps-disabled.spec.ts` / `gaps-interaction.spec.ts` | Touch-target sizes, disabled reasons and interaction details for specific components. |
| `batch4.spec.ts` / `batch5.spec.ts` / `helpers-batch4.ts` | Structural and visual checks for groups of components, and their shared helpers. |
| `registry-consumer.spec.ts` | Installs the registry into a fresh Next.js app and builds it, the way a consumer would. |

## public/

| File | What it does |
| --- | --- |
| `fonts/inter-variable.woff2` | The Inter typeface, self-hosted (no font CDN). |
| `fonts/OFL.txt` | Inter's licence (SIL Open Font License), shipped with the font. |
| `imgs/sample-photo.jpg`, `imgs/sample-image.png` | Original abstract sample images used in demos. |
| `samples/release-preview.html` | A small page the agent demo's web preview loads from this site. |
| `llms.txt` | A plain-text map of the site for AI tools. |
| `r/` | The published component registry: one JSON file per installable item (generated by `npm run registry:build`). |

## docs/

| File / folder | What it holds |
| --- | --- |
| `design-system.md` | The short orientation: where things are and the three ideas behind the system. |
| `agent-workspace.md` | How the AgentWorkspace works and how to connect it to a real agent. |
| `known-issues.md` | Known, accepted issues (the remaining low-severity npm advisories). |
| `component-certification.md` | The evidence behind the component system's certification: what was audited and how to reproduce it. |
| `project-structure.md` | This file. |
| `references/rules-rationale.md` | The history and reasoning behind the rules, kept out of RULES.md so the rulebook stays short. |
| `audits/` | Component audits: what was checked, found and fixed. |
| `superpowers/` | Internal planning notes (plans and specs). Not shipped to the published repo. |
