import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.shortName} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 78% 40%, rgba(139,92,246,0.55), transparent 45%), radial-gradient(circle at 92% 85%, rgba(34,211,238,0.35), transparent 40%), #050507",
          color: "#ededf2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#9a9aae" }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#34d399" }} />
          {profile.availability}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -6, lineHeight: 1 }}>{profile.shortName}</div>
          <div
            style={{
              marginTop: 24,
              fontSize: 44,
              fontWeight: 700,
              backgroundImage: "linear-gradient(90deg, #c4b5fd, #8b5cf6, #22d3ee)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {profile.role}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9a9aae" }}>{profile.tagline}</div>
      </div>
    ),
    size,
  );
}
