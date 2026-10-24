// The seven-circle Priberry mark as a progress display. Geometry comes from
// public/brand/priberry-icon.svg. Six berry circles map to the six rubric rows;
// the blush circle lights only when the whole answer is sendable as-is.

const R = 38;
// [cx, cy, fill] in the brand file's order.
const CIRCLES = [
  [-40, -69, "#B3265F"],
  [40, -69, "#F29AB9"],
  [-80, 0, "#B3265F"],
  [0, 0, "#8A1B49"],
  [80, 0, "#B3265F"],
  [-40, 69, "#8A1B49"],
  [40, 69, "#B3265F"],
] as const;

/** Index of the blush circle, reserved for the overall verdict. */
const VERDICT_INDEX = 1;
/** Circle used for each rubric row, in reading order. */
const ROW_TO_CIRCLE = [0, 2, 3, 4, 5, 6];

type BerryMarkProps = {
  /** One entry per rubric row: true = filled, false = empty. */
  filled: boolean[];
  verdictFilled: boolean;
  className?: string;
  /** Lighter empty rings for use on the ink background. */
  onInk?: boolean;
};

export function BerryMark({ filled, verdictFilled, className, onInk }: BerryMarkProps) {
  const on = new Set<number>();
  filled.forEach((f, row) => {
    const idx = ROW_TO_CIRCLE[row];
    if (f && idx !== undefined) on.add(idx);
  });
  if (verdictFilled) on.add(VERDICT_INDEX);

  return (
    <svg viewBox="-120 -109 240 218" className={className} aria-hidden="true" focusable="false">
      {CIRCLES.map(([cx, cy, fill], i) => (
        <g key={i}>
          {/* Empty state: a quiet ring */}
          <circle
            cx={cx}
            cy={cy}
            r={R - 1.5}
            fill="none"
            stroke={onInk ? "rgb(250 248 245 / 0.22)" : "rgb(30 21 48 / 0.16)"}
            strokeWidth={onInk ? 2 : 3}
          />
          {/* Filled state: scales in from the centre */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill={fill}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              transform: on.has(i) ? "scale(1)" : "scale(0.4)",
              opacity: on.has(i) ? 1 : 0,
              transition: "transform 600ms var(--ease-brand), opacity 400ms var(--ease-brand)",
            }}
          />
        </g>
      ))}
    </svg>
  );
}
