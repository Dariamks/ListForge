import { ImageResponse } from "next/og";
import { getGuide } from "@/lib/guides";

export const alt = "ListForge — AI Listing Optimizer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FLAME_PATH =
  "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z";

const PLATFORM_LABEL: Record<string, string> = {
  amazon: "Amazon",
  "tiktok-shop": "TikTok Shop",
  shopify: "Shopify",
};

function detectPlatform(slug: string): string | null {
  if (slug.startsWith("amazon-")) return "amazon";
  if (slug.startsWith("tiktok-shop-")) return "tiktok-shop";
  if (slug.startsWith("shopify-")) return "shopify";
  return null;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);

  const title =
    guide?.title ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const platformKey = detectPlatform(slug);
  const platformLabel = platformKey ? PLATFORM_LABEL[platformKey] : null;

  // Truncate long titles for layout
  const displayTitle = title.length > 64 ? title.slice(0, 62) + "…" : title;
  const titleFontSize = displayTitle.length > 48 ? "52px" : "64px";

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
        {/* Top accent line */}
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "72px 88px",
            flex: 1,
          }}
        >
          {/* Top row: logo + platform label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "#ffffff",
                  borderRadius: "9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="28"
                  height="28"
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
                  fontSize: "26px",
                  fontWeight: "700",
                  letterSpacing: "-0.4px",
                  display: "flex",
                }}
              >
                ListForge
              </span>
            </div>

            {platformLabel && (
              <div
                style={{
                  display: "flex",
                  border: "1px solid #44403c",
                  borderRadius: "100px",
                  padding: "8px 22px",
                  color: "#a8a29e",
                  fontSize: "20px",
                  fontWeight: "600",
                  letterSpacing: "-0.2px",
                }}
              >
                {platformLabel}
              </div>
            )}
          </div>

          {/* Guide title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "56px",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: "#fafafa",
                fontSize: titleFontSize,
                fontWeight: "700",
                lineHeight: "1.15",
                letterSpacing: "-1.5px",
                display: "flex",
                flexWrap: "wrap",
                maxWidth: "1000px",
              }}
            >
              {displayTitle}
            </div>

            {/* Eyebrow label below title */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "32px",
                color: "#a8a29e",
                fontSize: "20px",
                fontWeight: "500",
                letterSpacing: "-0.2px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "100px",
                  background: "#d43436",
                  display: "flex",
                }}
              />
              Free AI Listing Optimizer
            </div>
          </div>
        </div>

        {/* Footer URL */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "88px",
            color: "#78716c",
            fontSize: "20px",
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
