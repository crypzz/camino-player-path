import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const posts = [
  { name: "Lucas M.", handle: "Forward · Calgary", text: "New PR on the 30m sprint 🔥 4.1s down from 4.5s", likes: 24, comments: 8, color: "#E8B400" },
  { name: "Sofia C.", handle: "Midfielder · Calgary", text: "Just hit Level 12 on the beep test 💪 CPI climbing!", likes: 31, comments: 12, color: "#1DB870" },
  { name: "Jake R.", handle: "Forward · Calgary", text: "Match day highlights dropping soon 🎬 #CaminoPath", likes: 18, comments: 5, color: "#2B7FE8" },
];

export const FeedShowcaseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleSpring = spring({ frame, fps, config: { damping: 14 } });
  const titleOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const titleX = interpolate(titleSpring, [0, 1], [-60, 0]);

  // Fade out
  const fadeOut = interpolate(frame, [110, 125], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, width: 920, padding: "0 40px" }}>
        {/* Title */}
        <div style={{
          fontFamily, fontSize: 52, fontWeight: 800, color: "#FFFFFF",
          letterSpacing: "-0.03em", marginBottom: 14,
          opacity: titleOpacity, transform: `translateX(${titleX}px)`,
        }}>
          📱 <span style={{ color: "#E8B400" }}>Social</span> Feed
        </div>
        <div style={{
          fontFamily: bodyFont, fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.4)",
          marginBottom: 45, opacity: titleOpacity,
        }}>
          Share wins. Celebrate progress. Build your brand.
        </div>

        {/* Post cards */}
        {posts.map((post, i) => {
          const delay = 14 + i * 18;
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 110 } });
          const cardY = interpolate(cardSpring, [0, 1], [80, 0]);
          const cardOpacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          // Like counter animation
          const likeDelay = delay + 20;
          const likeSpring = spring({ frame: frame - likeDelay, fps, config: { damping: 20 } });
          const likeCount = Math.round(interpolate(likeSpring, [0, 1], [0, post.likes]));

          return (
            <div key={i} style={{
              marginBottom: 16, opacity: cardOpacity, transform: `translateY(${cardY}px)`,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20, padding: "28px 30px",
            }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${post.color}, ${post.color}66)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily, fontSize: 18, fontWeight: 700, color: "#0D0F14",
                }}>
                  {post.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontFamily: bodyFont, fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>{post.name}</div>
                  <div style={{ fontFamily: bodyFont, fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.35)" }}>{post.handle}</div>
                </div>
              </div>

              {/* Content */}
              <div style={{ fontFamily: bodyFont, fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.85)", lineHeight: 1.4, marginBottom: 16 }}>
                {post.text}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 28 }}>
                <span style={{ fontFamily: bodyFont, fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
                  ❤️ {likeCount}
                </span>
                <span style={{ fontFamily: bodyFont, fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
                  💬 {post.comments}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
