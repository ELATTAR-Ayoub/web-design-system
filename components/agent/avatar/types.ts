/**
 * The avatar contract.
 *
 * The console never imports a specific avatar. It takes an `AvatarRenderer` and
 * calls it, which is what makes the face genuinely swappable: a different art
 * direction — a mascot, a video, a Lottie, a photograph — is one module that
 * satisfies this type, and nothing in the state machine, the transcript or the
 * transport moves.
 *
 * The four props are the whole surface, and each earns its place:
 *   `state`  the only required one — which of the twenty-six to draw
 *   `size`   the console needs it at three scales; a renderer may ignore this
 *   `accent` the brand hook, so one avatar set serves several products
 *   `speed`  a global multiplier, for tuning the whole set at once
 */

import type { AgentState } from "../core/states";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export type AvatarRendererProps = {
  state: AgentState;
  size?: AvatarSize;
  /**
   * Any CSS colour. Passed straight through to `--agent-cube-accent`, so
   * `var(--agent)` works as well as a literal — and is what the console uses by
   * default, which is how the avatar follows a retheme.
   */
  accent?: string;
  /** Multiplier. Every duration in the set divides by this. */
  speed?: number;
  className?: string;
};

export type AvatarRenderer = (props: AvatarRendererProps) => React.ReactNode;
