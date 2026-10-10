/**
 * The motion vocabulary map — Motion Vocabulary Parity, Task 1.
 *
 * The single machine-readable source for the motion vocabulary: the scale,
 * the 11 system keyframes, the 7 surface keyframes, the utilities, and every
 * retired name. Consumed by the tests and scripts listed below.
 *
 * Consumed by:
 *   - `test/foundation/motion-names.test.ts` — the contract (this task, RED)
 *   - `scripts/check-tokens.mjs`'s `retired-motion-name` rule (Task 2+)
 *   - `scripts/rename-motion.mjs`, the one-pass anchored rename (Task 2+)
 *   - `docs/contracts/flutter-web-foundation-parity.md` §Motion (Task 5)
 *
 * `before` is the retired name an entry replaces — absent when the name is
 * unchanged. `flutter` is the Flutter symbol carrying the same role:
 * `MotionDurations.*` for durations, `MotionCurves.*` for easings, and for
 * the vocabulary the recipe class of the same name under
 * `lib/src/components/ui/keyframes.dart` — Flutter cut to the same fourteen
 * on 2026-09-22, so `anim-enter` is `EnterMotion`, `anim-open` is
 * `OpenMotion`, and so on. The two transitions are `Press` and
 * `ActiveIndicator`. A surface keyframe has no widget-level counterpart and
 * carries `—` plus the `MotionDurations` constant that times it. Every
 * `flutter` value here is verified against the Flutter tree by
 * `scripts/verify-flutter-symbols.mjs` — no placeholder or invented name
 * survives past that script's exit code.
 */

export const RETIRED_MOTION_NAMES = [
  // September 2026 rename (kept so the old guard keeps holding)
  // anim-shimmer left this list on 2026-09-22 — it is the live name again.
  "anim-jelly-in", "anim-jelly-out", "anim-jelly", "anim-spring-up", "anim-pop-in",
  "anim-ratchet", "anim-sign-on", "anim-pulse-live", "anim-unfold", "anim-fold",
  "--duration-jelly", "--duration-base", "--duration-overlay", "--ease-spring",
  // Vocabulary → fourteen (this plan). Utilities:
  "anim-fade-up", "anim-entrance", "anim-spring-entrance", "anim-reveal", "anim-swap-in",
  "anim-row-in", "anim-row-out", "anim-panel-in", "anim-fade-in", "anim-confirm-in",
  "anim-confirm-out", "anim-blur-in", "anim-blur-out", "anim-state-change",
  "anim-check-draw", "anim-dash-draw", "anim-dot-pop", "anim-loading-shimmer",
  "anim-live-pulse", "anim-discrete-progress", "anim-text-reveal",
  "click-spring", "press-spring", "press-key", "btn-spring", "lift", "slide-pill",
  // Keyframes:
  "ds-fade-up", "ds-entrance", "ds-spring-entrance", "ds-reveal", "ds-swap-in",
  "ds-row-in", "ds-row-out", "ds-panel-in", "ds-fade-in", "ds-confirm-in",
  "ds-confirm-out", "ds-blur-in", "ds-blur-out", "ds-state-change", "ds-collapse",
  "check-draw", "dash-draw", "dot-pop", "ds-loading-shimmer", "ds-live-pulse",
  "ds-discrete-progress", "ds-text-reveal",
  // Duration tokens nothing reads any more (Task 8):
  "--duration-pop-in", "--duration-spring-up", "--duration-sign-on",
  "--duration-check-draw", "--duration-dash-draw", "--duration-dot-pop",
  "--duration-ratchet", "--duration-press-spring-up", "--duration-reward",
] as const;

export const RETIRED_KEYFRAME_PREFIXES = ["pulls-"] as const;

/** Many-to-one renames. `before` is a retired class that becomes `name`.
 * Consumed by `scripts/rename-motion.mjs` beside the one-to-one `before`
 * fields on the entries below. Order does not matter; the script sorts by
 * length so `press-spring` cannot be rewritten as `press` + `-spring`. */
export const MOTION_MERGES: ReadonlyArray<{ before: string; name: string }> = [
  { before: "anim-fade-up", name: "anim-enter" },
  { before: "anim-entrance", name: "anim-enter" },
  { before: "anim-spring-entrance", name: "anim-enter" },
  { before: "anim-reveal", name: "anim-enter" },
  { before: "anim-swap-in", name: "anim-enter" },
  { before: "anim-row-in", name: "anim-enter" },
  { before: "anim-panel-in", name: "anim-enter" },
  { before: "anim-fade-in", name: "anim-enter" },
  { before: "anim-confirm-in", name: "anim-enter" },
  { before: "anim-blur-in", name: "anim-enter" },
  { before: "anim-row-out", name: "anim-exit" },
  { before: "anim-confirm-out", name: "anim-exit" },
  { before: "anim-blur-out", name: "anim-exit" },
  { before: "anim-state-change", name: "anim-change" },
  { before: "anim-check-draw", name: "anim-change" },
  { before: "anim-dash-draw", name: "anim-change" },
  { before: "anim-dot-pop", name: "anim-change" },
  { before: "anim-loading-shimmer", name: "anim-shimmer" },
  { before: "anim-live-pulse", name: "anim-pulse" },
  { before: "click-spring", name: "press" },
  { before: "press-spring", name: "press" },
  { before: "press-key", name: "press" },
  { before: "btn-spring", name: "press" },
  { before: "lift", name: "press" },
  { before: "slide-pill", name: "toggle-slide" },
];

export interface MotionNameEntry {
  name: string;
  flutter: string;
  before?: string;
}

/** `--duration-*` — the scale (renamed) plus the new tokens that replace
 * literals written by hand inside `styles/motion.css` / `styles/utilities.css`
 * utilities. Values are byte-identical to what the file already declares —
 * see the report for the literal-by-literal confirmation. */
export const DURATION_TOKENS: ReadonlyArray<MotionNameEntry> = [
  { name: "--duration-tick", flutter: "MotionDurations.tick" },
  { name: "--duration-fast", flutter: "MotionDurations.fast" },
  { name: "--duration-normal", flutter: "MotionDurations.normal", before: "--duration-base" },
  { name: "--duration-slow", flutter: "MotionDurations.slow" },
  { name: "--duration-overlay-enter", flutter: "MotionDurations.overlayEnter", before: "--duration-overlay" },
  { name: "--duration-open", flutter: "MotionDurations.open", before: "--duration-jelly" },
  { name: "--duration-bloom", flutter: "MotionDurations.bloom" },
  { name: "--duration-sway", flutter: "MotionDurations.sway" },
  { name: "--duration-sway-alt", flutter: "MotionDurations.swayAlt" },
  // New tokens replacing literals inside utilities — value unchanged, name new.
  { name: "--duration-state-change", flutter: "MotionDurations.stateChange" },
  { name: "--duration-spin", flutter: "MotionDurations.spin" },
  { name: "--duration-caret", flutter: "MotionDurations.caret" },
  { name: "--duration-shimmer", flutter: "MotionDurations.shimmer" },
  { name: "--duration-shimmer-text", flutter: "MotionDurations.shimmerText" },
  { name: "--duration-pulse-live", flutter: "MotionDurations.pulseLive" },
  { name: "--duration-press-in", flutter: "MotionDurations.pressIn" },
  { name: "--duration-beat-hover", flutter: "MotionDurations.beatHover" },
  { name: "--duration-beat-press", flutter: "MotionDurations.beatPress" },
  { name: "--duration-foil-drift", flutter: "MotionDurations.foilDrift" },
  { name: "--duration-glint", flutter: "MotionDurations.glint" },
  {
    name: "--duration-glint-hover",
    flutter: "— (hover speed-up; Flutter has no hover state)",
  },
  { name: "--duration-cosmic-drift-deep", flutter: "MotionDurations.cosmicDriftDeep" },
  { name: "--duration-cosmic-drift-near", flutter: "MotionDurations.cosmicDriftNear" },
];

/** `--ease-*` — the four renamed curves plus the three unchanged. The three
 * Tailwind vocabulary repoints (`--ease-in`, `--ease-out`, `--ease-in-out`)
 * are NOT listed here: they are aliases, not roles, exactly like
 * `--text-sm: var(--text-small)`, and the contract test adds them back in by
 * hand when comparing against what `styles/*.css` declares. */
export const EASE_TOKENS: ReadonlyArray<MotionNameEntry> = [
  { name: "--ease-emphasized", flutter: "MotionCurves.emphasized", before: "--ease-spring" },
  { name: "--ease-enter", flutter: "MotionCurves.enter", before: "--ease-out" },
  { name: "--ease-exit", flutter: "MotionCurves.exit", before: "--ease-in" },
  { name: "--ease-move", flutter: "MotionCurves.move", before: "--ease-in-out" },
  { name: "--ease-out-flex", flutter: "MotionCurves.outFlex" },
  { name: "--ease-settle", flutter: "MotionCurves.settle" },
  { name: "--ease-standard", flutter: "MotionCurves.standard" },
];

/** `@utility anim-*` (plus the five non-`anim-` motion utilities). The eleven
 * renamed entries carry `before`; the rest are unchanged. Every Flutter
 * symbol below is verified against the Flutter tree by
 * `scripts/verify-flutter-symbols.mjs` — a `MotionDurations.*` constant, a
 * public or private class that really exists under `lib/src/components/ui/`,
 * or `—` with a one-line note when nothing on the Flutter side corresponds. */
export const MOTION_UTILITIES: ReadonlyArray<MotionNameEntry> = [
  { name: "anim-enter", flutter: "EnterMotion" },
  { name: "anim-exit", flutter: "ExitMotion" },
  { name: "anim-open", flutter: "OpenMotion" },
  { name: "anim-close", flutter: "CloseMotion" },
  { name: "anim-expand", flutter: "ExpandMotion" },
  { name: "anim-collapse", flutter: "ExpandMotion (reversed)" },
  { name: "anim-change", flutter: "ChangeMotion" },
  { name: "anim-spin", flutter: "SpinMotion" },
  { name: "anim-shimmer", flutter: "ShimmerMotion" },
  { name: "anim-shimmer-text", flutter: "ShimmerMotion (textDuration)" },
  { name: "anim-progress-indeterminate", flutter: "ProgressMotion" },
  { name: "anim-pulse", flutter: "PulseMotion" },
  { name: "anim-caret", flutter: "CaretMotion" },
  { name: "press", flutter: "Press" },
  { name: "toggle-slide", flutter: "ActiveIndicator" },
  { name: "swap-roll", flutter: "SwapRollMotion" },
];

/** `@keyframes` — the 11 system keyframes `styles/motion.css` declares for
 * the vocabulary above, plus the 7 surface keyframes whose timelines
 * motion.css still owns even though they are not motion vocabulary (value
 * foil/glint, the action beat, the cosmic drift pair, the star sway pair).
 *
 * Each system keyframe's `flutter` symbol matches the utility it spends —
 * the widget class that ports it, or `—` with a `MotionDurations` symbol
 * when Flutter has no keyframe concept for it. Each surface keyframe carries
 * `—` and names the `MotionDurations` constant that times it, since none of
 * the seven has a widget-level Flutter counterpart.
 *
 * The avatar's 15 cube keyframes and the docs site's landing-intro / demo
 * keyframes (`ds-sweep`, `ds-travel`, …) are NOT in this table: they moved to
 * `components/agent/avatar/avatar.css` and `components/docs/docs-motion.css`
 * respectively — one component's signature and one site's decoration, never
 * part of the vocabulary a consumer inherits through `source-foundation`. */
export const MOTION_KEYFRAMES: ReadonlyArray<MotionNameEntry> = [
  { name: "ds-enter", flutter: "EnterMotion" },
  { name: "ds-exit", flutter: "ExitMotion" },
  { name: "ds-open", flutter: "OpenMotion" },
  { name: "ds-close", flutter: "CloseMotion" },
  { name: "ds-expand", flutter: "ExpandMotion" },
  { name: "ds-change", flutter: "ChangeMotion" },
  { name: "ds-spin", flutter: "SpinMotion" },
  { name: "ds-shimmer", flutter: "ShimmerMotion" },
  { name: "ds-progress-indeterminate", flutter: "ProgressMotion" },
  { name: "ds-pulse", flutter: "PulseMotion" },
  { name: "ds-caret", flutter: "CaretMotion" },
  // Surfaces. Not motion vocabulary; listed because motion.css still owns their timelines.
  { name: "value-foil-drift", flutter: "— (MotionDurations.foilDrift times it)" },
  { name: "value-glint", flutter: "— (MotionDurations.glint times it)" },
  { name: "action-beat", flutter: "— (MotionDurations.beatHover / beatPress time it)" },
  { name: "cosmic-drift-deep", flutter: "— (MotionDurations.cosmicDriftDeep times it)" },
  { name: "cosmic-drift-near", flutter: "— (MotionDurations.cosmicDriftNear times it)" },
  { name: "star-sway", flutter: "— (MotionDurations.sway times it)" },
  { name: "star-sway-alt", flutter: "— (MotionDurations.swayAlt times it)" },
];
