import { ReplaceTemplate } from "./ReplaceVeoScene";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily: body } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });
const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });

const ProfileMock = () => (
  <div style={{ padding: 28, fontFamily: body }}>
    <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24 }}>
      <div style={{
        width: 110, height: 110, borderRadius: "50%",
        background: "linear-gradient(135deg, #E8B400, #B88800)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: display, fontWeight: 800, fontSize: 50, color: "#0D1117",
      }}>JD</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: "#fff" }}>Jamie Doe</div>
        <div style={{ fontSize: 20, color: "rgba(255,255,255,0.6)" }}>CM • U16 • Camino FC</div>
        <div style={{ marginTop: 6, display: "inline-block", padding: "4px 12px", background: "#E8B400", color: "#0D1117", fontWeight: 700, fontSize: 16, borderRadius: 6 }}>LEVEL 7 — RISING STAR</div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
      {[{ l: "CPI", v: 78, c: "#E8B400" }, { l: "Pace", v: 84, c: "#10B981" }, { l: "Vision", v: 72, c: "#3B82F6" }, { l: "Mental", v: 81, c: "#A855F7" }].map((s) => (
        <div key={s.l} style={{ padding: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{s.l}</div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: s.c }}>{s.v}</div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, marginTop: 4 }}>
            <div style={{ width: `${s.v}%`, height: "100%", background: s.c, borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>

    <div style={{ padding: 16, background: "rgba(232,180,0,0.08)", border: "1px solid rgba(232,180,0,0.3)", borderRadius: 12 }}>
      <div style={{ fontSize: 18, color: "#E8B400", fontWeight: 700, marginBottom: 8 }}>Highlight Reel</div>
      <div style={{ display: "flex", gap: 8 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: 1, aspectRatio: "9/16", background: "linear-gradient(135deg, #1F2937, #0D1117)", borderRadius: 8, position: "relative" }}>
            <div style={{ position: "absolute", bottom: 6, left: 6, fontSize: 12, color: "#E8B400", fontWeight: 700 }}>0:{10 + i * 4}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ marginTop: 14, padding: 16, background: "rgba(255,255,255,0.04)", borderRadius: 12, fontSize: 18, color: "#fff" }}>
      📈 <span style={{ color: "#10B981", fontWeight: 700 }}>+8 CPI</span> over the last 30 days
    </div>
  </div>
);

export const ReplaceHudlScene = () => (
  <ReplaceTemplate
    brandName="Hudl"
    brandColor="#FF6600"
    brandTagline="Player Profiles"
    caminoTitle="Player Passport"
    caminoSubtitle="Profile + highlights + verified stats"
    mockContent={<ProfileMock />}
  />
);
