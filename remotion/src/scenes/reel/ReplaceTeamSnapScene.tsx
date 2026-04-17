import { ReplaceTemplate } from "./ReplaceVeoScene";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: body } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const CommsMock = () => (
  <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, fontFamily: body }}>
    <div style={{ fontSize: 22, color: "#E8B400", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>This Week</div>
    {[
      { day: "MON", time: "5:30 PM", title: "Training — Tactical", color: "#E8B400" },
      { day: "WED", time: "5:30 PM", title: "Training — Fitness", color: "#10B981" },
      { day: "SAT", time: "10:00 AM", title: "Match vs FC United", color: "#DC2626" },
    ].map((s) => (
      <div key={s.day} style={{ display: "flex", gap: 14, padding: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}>
        <div style={{ width: 70, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: s.color, fontWeight: 700 }}>{s.day}</div>
          <div style={{ fontSize: 22, color: "#fff", fontWeight: 700 }}>{s.time}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, color: "#fff", fontWeight: 600 }}>{s.title}</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Camino Park • Pitch 2</div>
        </div>
      </div>
    ))}
    <div style={{ marginTop: 12, padding: 16, background: "rgba(232,180,0,0.1)", border: "1px solid #E8B400", borderRadius: 12 }}>
      <div style={{ fontSize: 18, color: "#E8B400", fontWeight: 700, marginBottom: 6 }}>📢 Coach Mike</div>
      <div style={{ fontSize: 20, color: "#fff" }}>"Great session today — recovery on Tuesday."</div>
    </div>
    <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
      {[{ l: "Attendance", v: "94%" }, { l: "Messages", v: "12" }, { l: "Events", v: "8" }].map((s) => (
        <div key={s.l} style={{ flex: 1, padding: 14, background: "rgba(255,255,255,0.04)", borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 28, color: "#E8B400", fontWeight: 800 }}>{s.v}</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{s.l}</div>
        </div>
      ))}
    </div>
  </div>
);

export const ReplaceTeamSnapScene = () => (
  <ReplaceTemplate
    brandName="TeamSnap"
    brandColor="#0066CC"
    brandTagline="Schedules & Chat"
    caminoTitle="Comms + Schedule"
    caminoSubtitle="Messages • Attendance • Events — built in"
    mockContent={<CommsMock />}
  />
);
