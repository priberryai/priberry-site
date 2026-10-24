import { ImageResponse } from "next/og";

// Shared social card (Open Graph and Twitter), rendered once at build time.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "Priberry: AI breaks where professional work gets hard. We teach it how experts decide.";

// Seven-circle mark from public/brand/priberry-icon.svg, in its own units.
export const MARK = [
  [-40, -69, "#B3265F"],
  [40, -69, "#F29AB9"],
  [-80, 0, "#B3265F"],
  [0, 0, "#8A1B49"],
  [80, 0, "#B3265F"],
  [-40, 69, "#8A1B49"],
  [40, 69, "#B3265F"],
] as const;

/** Absolutely positioned circles for next/og (which renders flexbox, not SVG circles reliably). */
export function Mark({ scale, cx, cy }: { scale: number; cx: number; cy: number }) {
  const r = 38 * scale;
  return (
    <>
      {MARK.map(([x, y, fill], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: cx + x * scale - r,
            top: cy + y * scale - r,
            width: r * 2,
            height: r * 2,
            borderRadius: r,
            background: fill,
          }}
        />
      ))}
    </>
  );
}

export function renderOg() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1E1530",
          padding: "72px 80px",
          position: "relative",
          color: "#FAF8F5",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -200,
            width: 720,
            height: 720,
            borderRadius: 360,
            background: "radial-gradient(circle, rgba(179,38,95,0.45), rgba(30,21,48,0) 65%)",
          }}
        />
        <Mark scale={0.5} cx={1040} cy={150} />
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#F29AB9" }}>PRIBERRY</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 68, lineHeight: 1.06, letterSpacing: -1.5 }}>
          <div style={{ display: "flex" }}>AI breaks where professional</div>
          <div style={{ display: "flex" }}>work gets hard.</div>
          <div style={{ display: "flex", color: "#F29AB9" }}>We teach it how experts decide.</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#C9C1D6" }}>
          Expert-graded evaluation sets and training data · priberry.com
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
