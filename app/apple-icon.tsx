import { ImageResponse } from "next/og";
import { Mark } from "@/lib/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS home-screen icon: the app icon (plum square, seven circles) at 180px.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#1E1530" }}>
        <Mark scale={0.39} cx={90} cy={90} />
      </div>
    ),
    size,
  );
}
