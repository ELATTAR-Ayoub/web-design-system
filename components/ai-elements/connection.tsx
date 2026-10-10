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
    {/* Vendored change: the hardcoded `#fff` endpoint fill is replaced with `var(--color-action-ink)`. */}
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
