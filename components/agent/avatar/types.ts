import type { AgentState } from "../core/states";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export type AvatarRendererProps = {
  state: AgentState;
  size?: AvatarSize;
  accent?: string;
  speed?: number;
  className?: string;
};

export type AvatarRenderer = (props: AvatarRendererProps) => React.ReactNode;
