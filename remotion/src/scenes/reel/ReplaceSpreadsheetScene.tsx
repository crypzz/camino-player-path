import { ReplaceTemplate } from "./ReplaceVeoScene";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily: body } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });
const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });

const CPIDashMock = () => (
  <div style={{ padding: 28, fontFamily: body }}>
    <div style={{ fontSize: 22, color: "#E8B400", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Squad CPI Dashboard</div>

    <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
      {[{ l: "Avg CPI", v: "74" }, { l: "Top", v: "89" }, { l: "Improving", v: "12" }].map((s) => (
        <div key={s.l} style={{ flex: 1, padding: 16, background: "linear-gradient(135deg, rgba(232,180,0,0.15), transparent)", border: "1px solid rgba(232,180,0,0.3)", borderRadius: 12 }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 48, color: "#E8B400" }}>{s.v}</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{s.l}</div>
        </div>
      ))}
    </div>

    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 80px 80px", padding: "10px 16px", background: "rgba(232,180,0,0.1)", fontSize: 14, color: "#E8B400", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
        <div>#</div><div>Player</div><div>CPI</div><div>Δ</div>
      </div>
      {[
        { n: 1, p: "M. Rivera", cpi: 89, d: "+4" },
        { n: 2, p: "J. Chen", cpi: 84, d: "+2" },
        { n: 3, p: "A. Diallo", cpi: 81, d: "+6" },
        { n: 4, p: "K. Park", cpi: 78, d: "+1" },
        { n: 5, p: "T. Silva", cpi: 76, d: "+3" },
        { n: 6, p: "L. Brown", cpi: 73, d: "−1" },
      ].map((r) => (
        <div key={r.n} style={{ display: "grid", gridTemplateColumns: "60px 1fr 80px 80px", padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: 20, color: "#fff" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>{r.n}</div>
          <div style={{ fontWeight: 600 }}>{r.p}</div>
          <div style={{ color: "#E8B400", fontWeight: 800, fontFamily: display }}>{r.cpi}</div>
          <div style={{ color: r.d.startsWith("+") ? "#10B981" : "#DC2626", fontWeight: 700 }}>{r.d}</div>
        </div>
      ))}
    </div>

    <div style={{ marginTop: 16, padding: 14, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, fontSize: 18, color: "#10B981", fontWeight: 600 }}>
      ✓ Auto-synced. No more spreadsheets.
    </div>
  </div>
);

export const ReplaceSpreadsheetScene = () => (
  <ReplaceTemplate
    brandName="Sheets + WhatsApp"
    brandColor="#16A34A"
    brandTagline="Stats & Messy Tracking"
    caminoTitle="CPI Dashboard"
    caminoSubtitle="Real metrics. Real ranking. Real time."
    mockContent={<CPIDashMock />}
  />
);
