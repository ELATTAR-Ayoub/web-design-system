import { PLATFORM_CONTRACT, type ContractEntry, type DocFamily } from "@/lib/ds/platform-contract";
import type { ComponentDocMeta } from "@/lib/ds/docs/types";

import { meta as accordionDoc } from "@/components/docs/component-docs/accordion/meta";
import { meta as actionFeedbackDoc } from "@/components/docs/component-docs/action-feedback/meta";
import { meta as activeIndicatorDoc } from "@/components/docs/component-docs/active-indicator/meta";
import { meta as agentAvatarDoc } from "@/components/docs/component-docs/agent-avatar/meta";
import { meta as agentCoreDoc } from "@/components/docs/component-docs/agent-core/meta";
import { meta as agentWorkspaceDoc } from "@/components/docs/component-docs/agent-workspace/meta";
import { meta as aiAgentDoc } from "@/components/docs/component-docs/ai-agent/meta";
import { meta as aiArtifactDoc } from "@/components/docs/component-docs/ai-artifact/meta";
import { meta as aiAttachmentsDoc } from "@/components/docs/component-docs/ai-attachments/meta";
import { meta as aiAudioPlayerDoc } from "@/components/docs/component-docs/ai-audio-player/meta";
import { meta as aiCanvasDoc } from "@/components/docs/component-docs/ai-canvas/meta";
import { meta as aiChainOfThoughtDoc } from "@/components/docs/component-docs/ai-chain-of-thought/meta";
import { meta as aiCheckpointDoc } from "@/components/docs/component-docs/ai-checkpoint/meta";
import { meta as aiCodeBlockDoc } from "@/components/docs/component-docs/ai-code-block/meta";
import { meta as aiCommitDoc } from "@/components/docs/component-docs/ai-commit/meta";
import { meta as aiConfirmationDoc } from "@/components/docs/component-docs/ai-confirmation/meta";
import { meta as aiConnectionDoc } from "@/components/docs/component-docs/ai-connection/meta";
import { meta as aiContextDoc } from "@/components/docs/component-docs/ai-context/meta";
import { meta as aiControlsDoc } from "@/components/docs/component-docs/ai-controls/meta";
import { meta as aiConversationDoc } from "@/components/docs/component-docs/ai-conversation/meta";
import { meta as aiEdgeDoc } from "@/components/docs/component-docs/ai-edge/meta";
import { meta as aiEnvironmentVariablesDoc } from "@/components/docs/component-docs/ai-environment-variables/meta";
import { meta as aiFileTreeDoc } from "@/components/docs/component-docs/ai-file-tree/meta";
import { meta as aiImageDoc } from "@/components/docs/component-docs/ai-image/meta";
import { meta as aiInlineCitationDoc } from "@/components/docs/component-docs/ai-inline-citation/meta";
import { meta as aiJsxPreviewDoc } from "@/components/docs/component-docs/ai-jsx-preview/meta";
import { meta as aiMessageDoc } from "@/components/docs/component-docs/ai-message/meta";
import { meta as aiMicSelectorDoc } from "@/components/docs/component-docs/ai-mic-selector/meta";
import { meta as aiModelSelectorDoc } from "@/components/docs/component-docs/ai-model-selector/meta";
import { meta as aiNodeDoc } from "@/components/docs/component-docs/ai-node/meta";
import { meta as aiOpenInChatDoc } from "@/components/docs/component-docs/ai-open-in-chat/meta";
import { meta as aiPackageInfoDoc } from "@/components/docs/component-docs/ai-package-info/meta";
import { meta as aiPanelDoc } from "@/components/docs/component-docs/ai-panel/meta";
import { meta as aiPlanDoc } from "@/components/docs/component-docs/ai-plan/meta";
import { meta as aiPromptInputDoc } from "@/components/docs/component-docs/ai-prompt-input/meta";
import { meta as aiQuestionDoc } from "@/components/docs/component-docs/ai-question/meta";
import { meta as aiQueueDoc } from "@/components/docs/component-docs/ai-queue/meta";
import { meta as aiReasoningDoc } from "@/components/docs/component-docs/ai-reasoning/meta";
import { meta as aiSandboxDoc } from "@/components/docs/component-docs/ai-sandbox/meta";
import { meta as aiSchemaDisplayDoc } from "@/components/docs/component-docs/ai-schema-display/meta";
import { meta as aiShimmerDoc } from "@/components/docs/component-docs/ai-shimmer/meta";
import { meta as aiSnippetDoc } from "@/components/docs/component-docs/ai-snippet/meta";
import { meta as aiSourcesDoc } from "@/components/docs/component-docs/ai-sources/meta";
import { meta as aiSpeechInputDoc } from "@/components/docs/component-docs/ai-speech-input/meta";
import { meta as aiStackTraceDoc } from "@/components/docs/component-docs/ai-stack-trace/meta";
import { meta as aiSuggestionDoc } from "@/components/docs/component-docs/ai-suggestion/meta";
import { meta as aiTaskDoc } from "@/components/docs/component-docs/ai-task/meta";
import { meta as aiTerminalDoc } from "@/components/docs/component-docs/ai-terminal/meta";
import { meta as aiTestResultsDoc } from "@/components/docs/component-docs/ai-test-results/meta";
import { meta as aiToolDoc } from "@/components/docs/component-docs/ai-tool/meta";
import { meta as aiToolbarDoc } from "@/components/docs/component-docs/ai-toolbar/meta";
import { meta as aiTranscriptionDoc } from "@/components/docs/component-docs/ai-transcription/meta";
import { meta as aiVoiceSelectorDoc } from "@/components/docs/component-docs/ai-voice-selector/meta";
import { meta as aiWebPreviewDoc } from "@/components/docs/component-docs/ai-web-preview/meta";
import { meta as agentEffortSliderDoc } from "@/components/docs/component-docs/agent-effort-slider/meta";
import { meta as agentGeneratedImageDoc } from "@/components/docs/component-docs/agent-generated-image/meta";
import { meta as agentVoiceOrbDoc } from "@/components/docs/component-docs/agent-voice-orb/meta";
import { meta as agentSparkFieldDoc } from "@/components/docs/component-docs/agent-spark-field/meta";
import { meta as alertDoc } from "@/components/docs/component-docs/alert/meta";
import { meta as alertDialogDoc } from "@/components/docs/component-docs/alert-dialog/meta";
import { meta as ambientPatternDoc } from "@/components/docs/component-docs/ambient-pattern/meta";
import { meta as aspectRatioDoc } from "@/components/docs/component-docs/aspect-ratio/meta";
import { meta as attachmentDoc } from "@/components/docs/component-docs/attachment/meta";
import { meta as avatarDoc } from "@/components/docs/component-docs/avatar/meta";
import { meta as backgroundEffectDoc } from "@/components/docs/component-docs/background-effect/meta";
import { meta as badgeDoc } from "@/components/docs/component-docs/badge/meta";
import { meta as breadcrumbDoc } from "@/components/docs/component-docs/breadcrumb/meta";
import { meta as bubbleDoc } from "@/components/docs/component-docs/bubble/meta";
import { meta as buttonDoc } from "@/components/docs/component-docs/button/meta";
import { meta as buttonGroupDoc } from "@/components/docs/component-docs/button-group/meta";
import { meta as calendarDoc } from "@/components/docs/component-docs/calendar/meta";
import { meta as cardDoc } from "@/components/docs/component-docs/card/meta";
import { meta as carouselDoc } from "@/components/docs/component-docs/carousel/meta";
import { meta as chartDoc } from "@/components/docs/component-docs/chart/meta";
import { meta as chartCartesianDoc } from "@/components/docs/component-docs/chart-cartesian/meta";
import { meta as chartGeometryDoc } from "@/components/docs/component-docs/chart-geometry/meta";
import { meta as chartPolarDoc } from "@/components/docs/component-docs/chart-polar/meta";
import { meta as checkboxDoc } from "@/components/docs/component-docs/checkbox/meta";
import { meta as collapsibleDoc } from "@/components/docs/component-docs/collapsible/meta";
import { meta as comboboxDoc } from "@/components/docs/component-docs/combobox/meta";
import { meta as commandDoc } from "@/components/docs/component-docs/command/meta";
import { meta as contentChangeDoc } from "@/components/docs/component-docs/content-change/meta";
import { meta as contextMenuDoc } from "@/components/docs/component-docs/context-menu/meta";
import { meta as dialogDoc } from "@/components/docs/component-docs/dialog/meta";
import { meta as directionDoc } from "@/components/docs/component-docs/direction/meta";
import { meta as disabledDoc } from "@/components/docs/component-docs/disabled/meta";
import { meta as drawerDoc } from "@/components/docs/component-docs/drawer/meta";
import { meta as dropdownMenuDoc } from "@/components/docs/component-docs/dropdown-menu/meta";
import { meta as emptyDoc } from "@/components/docs/component-docs/empty/meta";
import { meta as feedbackSurfaceDoc } from "@/components/docs/component-docs/feedback-surface/meta";
import { meta as fieldDoc } from "@/components/docs/component-docs/field/meta";
import { meta as formDoc } from "@/components/docs/component-docs/form/meta";
import { meta as glassDoc } from "@/components/docs/component-docs/glass/meta";
import { meta as hoverBuilderDoc } from "@/components/docs/component-docs/hover-builder/meta";
import { meta as hoverCardDoc } from "@/components/docs/component-docs/hover-card/meta";
import { meta as iconDoc } from "@/components/docs/component-docs/icon/meta";
import { meta as iconSwapDoc } from "@/components/docs/component-docs/icon-swap/meta";
import { meta as inputDoc } from "@/components/docs/component-docs/input/meta";
import { meta as inputGroupDoc } from "@/components/docs/component-docs/input-group/meta";
import { meta as inputOtpDoc } from "@/components/docs/component-docs/input-otp/meta";
import { meta as itemDoc } from "@/components/docs/component-docs/item/meta";
import { meta as kbdDoc } from "@/components/docs/component-docs/kbd/meta";
import { meta as keyframesDoc } from "@/components/docs/component-docs/keyframes/meta";
import { meta as labelDoc } from "@/components/docs/component-docs/label/meta";
import { meta as markerDoc } from "@/components/docs/component-docs/marker/meta";
import { meta as mediaScrimDoc } from "@/components/docs/component-docs/media-scrim/meta";
import { meta as menuDoc } from "@/components/docs/component-docs/menu/meta";
import { meta as menubarDoc } from "@/components/docs/component-docs/menubar/meta";
import { meta as messageDoc } from "@/components/docs/component-docs/message/meta";
import { meta as messageScrollerDoc } from "@/components/docs/component-docs/message-scroller/meta";
import { meta as nativeSelectDoc } from "@/components/docs/component-docs/native-select/meta";
import { meta as navigationMenuDoc } from "@/components/docs/component-docs/navigation-menu/meta";
import { meta as paginationDoc } from "@/components/docs/component-docs/pagination/meta";
import { meta as popoverDoc } from "@/components/docs/component-docs/popover/meta";
import { meta as premiumSurfaceDoc } from "@/components/docs/component-docs/premium-surface/meta";
import { meta as pressDoc } from "@/components/docs/component-docs/press/meta";
import { meta as progressDoc } from "@/components/docs/component-docs/progress/meta";
import { meta as proseDoc } from "@/components/docs/component-docs/prose/meta";
import { meta as questionnaireDoc } from "@/components/docs/component-docs/questionnaire/meta";
import { meta as radioDoc } from "@/components/docs/component-docs/radio/meta";
import { meta as resizableDoc } from "@/components/docs/component-docs/resizable/meta";
import { meta as revealBloomDoc } from "@/components/docs/component-docs/reveal-bloom/meta";
import { meta as safeAreaDoc } from "@/components/docs/component-docs/safe-area/meta";
import { meta as scrollAreaDoc } from "@/components/docs/component-docs/scroll-area/meta";
import { meta as selectDoc } from "@/components/docs/component-docs/select/meta";
import { meta as selectionControlDoc } from "@/components/docs/component-docs/selection-control/meta";
import { meta as separatorDoc } from "@/components/docs/component-docs/separator/meta";
import { meta as sheetDoc } from "@/components/docs/component-docs/sheet/meta";
import { meta as sidebarDoc } from "@/components/docs/component-docs/sidebar/meta";
import { meta as skeletonDoc } from "@/components/docs/component-docs/skeleton/meta";
import { meta as sliderDoc } from "@/components/docs/component-docs/slider/meta";
import { meta as sourceFoundationDoc } from "@/components/docs/component-docs/source-foundation/meta";
import { meta as spinnerDoc } from "@/components/docs/component-docs/spinner/meta";
import { meta as statDoc } from "@/components/docs/component-docs/stat/meta";
import { meta as surfaceDoc } from "@/components/docs/component-docs/surface/meta";
import { meta as switchDoc } from "@/components/docs/component-docs/switch/meta";
import { meta as tableDoc } from "@/components/docs/component-docs/table/meta";
import { meta as tabsDoc } from "@/components/docs/component-docs/tabs/meta";
import { meta as textareaDoc } from "@/components/docs/component-docs/textarea/meta";
import { meta as toasterDoc } from "@/components/docs/component-docs/toaster/meta";
import { meta as toggleDoc } from "@/components/docs/component-docs/toggle/meta";
import { meta as toggleGroupDoc } from "@/components/docs/component-docs/toggle-group/meta";
import { meta as tooltipDoc } from "@/components/docs/component-docs/tooltip/meta";
import { meta as useLatestDoc } from "@/components/docs/component-docs/use-latest/meta";
import { meta as useMobileDoc } from "@/components/docs/component-docs/use-mobile/meta";
import { meta as useReducedMotionDoc } from "@/components/docs/component-docs/use-reduced-motion/meta";
import { meta as userMenuDoc } from "@/components/docs/component-docs/user-menu/meta";
import { meta as validationRuleDoc } from "@/components/docs/component-docs/validation-rule/meta";
import { meta as voiceDoc } from "@/components/docs/component-docs/voice/meta";

export const COMPONENT_DOCS: readonly ComponentDocMeta[] = [
  accordionDoc,
  actionFeedbackDoc,
  activeIndicatorDoc,
  agentAvatarDoc,
  agentCoreDoc,
  agentWorkspaceDoc,
  aiAgentDoc,
  aiArtifactDoc,
  aiAttachmentsDoc,
  aiAudioPlayerDoc,
  aiCanvasDoc,
  aiChainOfThoughtDoc,
  aiCheckpointDoc,
  aiCodeBlockDoc,
  aiCommitDoc,
  aiConfirmationDoc,
  aiConnectionDoc,
  aiContextDoc,
  aiControlsDoc,
  aiConversationDoc,
  aiEdgeDoc,
  aiEnvironmentVariablesDoc,
  aiFileTreeDoc,
  aiImageDoc,
  aiInlineCitationDoc,
  aiJsxPreviewDoc,
  aiMessageDoc,
  aiMicSelectorDoc,
  aiModelSelectorDoc,
  aiNodeDoc,
  aiOpenInChatDoc,
  aiPackageInfoDoc,
  aiPanelDoc,
  aiPlanDoc,
  aiPromptInputDoc,
  aiQuestionDoc,
  aiQueueDoc,
  aiReasoningDoc,
  aiSandboxDoc,
  aiSchemaDisplayDoc,
  aiShimmerDoc,
  aiSnippetDoc,
  aiSourcesDoc,
  aiSpeechInputDoc,
  aiStackTraceDoc,
  aiSuggestionDoc,
  aiTaskDoc,
  aiTerminalDoc,
  aiTestResultsDoc,
  aiToolDoc,
  aiToolbarDoc,
  aiTranscriptionDoc,
  aiVoiceSelectorDoc,
  aiWebPreviewDoc,
  agentEffortSliderDoc,
  agentSparkFieldDoc,
  agentGeneratedImageDoc,
  agentVoiceOrbDoc,
  alertDoc,
  alertDialogDoc,
  ambientPatternDoc,
  aspectRatioDoc,
  attachmentDoc,
  avatarDoc,
  backgroundEffectDoc,
  badgeDoc,
  breadcrumbDoc,
  bubbleDoc,
  buttonDoc,
  buttonGroupDoc,
  calendarDoc,
  cardDoc,
  carouselDoc,
  chartDoc,
  chartCartesianDoc,
  chartGeometryDoc,
  chartPolarDoc,
  checkboxDoc,
  collapsibleDoc,
  comboboxDoc,
  commandDoc,
  contentChangeDoc,
  contextMenuDoc,
  dialogDoc,
  directionDoc,
  disabledDoc,
  drawerDoc,
  dropdownMenuDoc,
  emptyDoc,
  feedbackSurfaceDoc,
  fieldDoc,
  formDoc,
  glassDoc,
  hoverBuilderDoc,
  hoverCardDoc,
  iconDoc,
  iconSwapDoc,
  inputDoc,
  inputGroupDoc,
  inputOtpDoc,
  itemDoc,
  kbdDoc,
  keyframesDoc,
  labelDoc,
  markerDoc,
  mediaScrimDoc,
  menuDoc,
  menubarDoc,
  messageDoc,
  messageScrollerDoc,
  nativeSelectDoc,
  navigationMenuDoc,
  paginationDoc,
  popoverDoc,
  premiumSurfaceDoc,
  pressDoc,
  progressDoc,
  proseDoc,
  questionnaireDoc,
  radioDoc,
  resizableDoc,
  revealBloomDoc,
  safeAreaDoc,
  scrollAreaDoc,
  selectDoc,
  selectionControlDoc,
  separatorDoc,
  sheetDoc,
  sidebarDoc,
  skeletonDoc,
  sliderDoc,
  sourceFoundationDoc,
  spinnerDoc,
  statDoc,
  surfaceDoc,
  switchDoc,
  tableDoc,
  tabsDoc,
  textareaDoc,
  toasterDoc,
  toggleDoc,
  toggleGroupDoc,
  tooltipDoc,
  useLatestDoc,
  useMobileDoc,
  useReducedMotionDoc,
  userMenuDoc,
  validationRuleDoc,
  voiceDoc,
];

const byName = new Map(COMPONENT_DOCS.map((m) => [m.name, m]));

export function docRoute(name: string): string {
  return `/design-system/components/${name}`;
}

export function docMeta(name: string): ComponentDocMeta | undefined {
  return byName.get(name);
}

export function docContract(name: string): ContractEntry | undefined {
  return PLATFORM_CONTRACT.find((e) => e.name === name);
}

export type CatalogEntry = {
  readonly meta: ComponentDocMeta;
  readonly contract: ContractEntry;
};

export function catalogEntries(): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const meta of COMPONENT_DOCS) {
    const contract = docContract(meta.name);
    // Skip rather than throw so one bad name cannot blank every docs route.
    if (contract) out.push({ meta, contract });
  }
  out.sort((a, b) => a.contract.title.localeCompare(b.contract.title));
  return out;
}

export function catalogEntriesIn(family: DocFamily): CatalogEntry[] {
  return catalogEntries().filter((e) => e.contract.family === family);
}

export function railEntriesIn(family: DocFamily): CatalogEntry[] {
  return catalogEntriesIn(family).filter((e) => e.meta.showInRail !== false);
}

export function undocumentedContractEntries(): readonly ContractEntry[] {
  return PLATFORM_CONTRACT.filter((e) => !byName.has(e.name));
}
