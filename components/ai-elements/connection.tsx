import type { ConnectionLineComponent } from "@xyflow/react";

const HALF = 0.5;

export const Connection: ConnectionLineComponent = ({
  fromX,
  fromY,
  toX,
  toY,
}) => (
  <g>
    <path
      className="animated"
      d={`M${fromX},${fromY} C ${fromX + (toX - fromX) * HALF},${fromY} ${fromX + (toX - fromX) * HALF},${toY} ${toX},${toY}`}
      fill="none"
      stroke="var(--color-ring)"
      strokeWidth={1}
    />
    {/* Vendored change: the hardcoded `#fff` endpoint fill is banned by §0
        (no hex outside styles/*.css). Swapped for `var(--color-action-ink)`
        — same reasoning as `Edge.Animated`'s travelling dot: a mark with no
        foreground of its own is judged on contrast with `--muted`, per RULES
        §1.3, and this is the same in-progress-connection indicator. */}
    <circle
      cx={toX}
      cy={toY}
      fill="var(--color-action-ink)"
      r={3}
      stroke="var(--color-ring)"
      strokeWidth={1}
    />
  </g>
);
