import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "ListForge — Free AI Listing Optimizer for Amazon, TikTok Shop & Shopify";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Flame SVG path — identical to the Header / Footer / favicon glyph so the
// brand stays unified across every surface (browser tab, iOS home screen,
// social-share preview cards).
const FLAME_PATH =
  "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top accent line — Nuwa-style single warm-red signal */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#d43436",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "80px 88px",
            flex: 1,
          }}
        >
          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                background: "#ffffff",
                borderRadius: "11px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={FLAME_PATH} />
              </svg>
            </div>
            <span
              style={{
                color: "#fafafa",
                fontSize: "30px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
                display: "flex",
              }}
            >
              ListForge
            </span>
          </div>

          {/* Main headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "72px",
            }}
          >
            <div
              style={{
                color: "#fafafa",
                fontSize: "84px",
                fontWeight: "700",
                lineHeight: "1.0",
                letterSpacing: "-3px",
                display: "flex",
              }}
            >
              Forge listings that
            </div>
            <div
              style={{
                fontSize: "84px",
                fontWeight: "700",
                lineHeight: "1.05",
                letterSpacing: "-3px",
                display: "flex",
                marginTop: "8px",
                color: "#d43436",
              }}
            >
              actually convert
            </div>
          </div>

          {/* Subline */}
          <div
            style={{
              display: "flex",
              marginTop: "40px",
              color: "#a8a29e",
              fontSize: "26px",
              fontWeight: "500",
              letterSpacing: "-0.3px",
            }}
          >
            Amazon · TikTok Shop · Shopify · Open-source prompts · Free
          </div>
        </div>

        {/* Footer URL */}
        <div
          style={{
            position: "absolute",
            bottom: "56px",
            right: "88px",
            color: "#78716c",
            fontSize: "22px",
            fontWeight: "600",
            display: "flex",
          }}
        >
          listforge.dev
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
