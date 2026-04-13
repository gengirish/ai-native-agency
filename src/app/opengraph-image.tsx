import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "AgencyOS — The operating system for AI-native agencies"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 55%, #a855f7 100%)",
            marginBottom: 48,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div style={{ fontSize: 108, lineHeight: 1, display: "flex" }}>⚡</div>
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: -3,
            lineHeight: 1.05,
            marginBottom: 18,
          }}
        >
          AgencyOS
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 400,
            color: "#94a3b8",
            lineHeight: 1.3,
            textAlign: "center",
            maxWidth: 900,
            paddingLeft: 48,
            paddingRight: 48,
          }}
        >
          The operating system for AI-native agencies
        </div>
      </div>
    ),
    { ...size }
  )
}
