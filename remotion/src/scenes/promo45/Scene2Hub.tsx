import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { Phone, Overlay, BG, CARD, YELLOW, WHITE, MUTED, LINE, body, display, glow } from "./_shared";

const messages = [
  { who: "Coach Martinez", text: "Tuesday practice 5pm, bring water 💧", mine: false },
  { who: "You", text: "Got it 💛", mine: true },
  { who: "Coach Martinez", text: "Great work last game! 🔥", mine: false },
];

const roster = [
  { n: "Diego R.", p: "Forward" },
  { n: "Sam K.", p: "Midfield" },
  { n: "Leo M.", p: "Defender" },
  { n: "Aria T.", p: "Goalkeeper" },
];

// SCENE 2 (5-12s) — TEAM HUB. Chat messages, then calendar + roster.
export const Scene2Hub: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // first half: chat (0-95), swipe to calendar after
  const swipe = spring({ frame: frame - 100, fps, config: { damping: 22 } });
  const chatX = interpolate(swipe, [0, 1], [0, -620]);
  const calX = interpolate(swipe, [0, 1], [620, 0]);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <Phone width={560}>
        {/* CHAT screen */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${chatX}px)` }}>
          <div style={{ position: "absolute", top: 70, left: 30, fontFamily: display, color: WHITE, fontSize: 32, fontWeight: 800 }}>
            Team Chat
          </div>
          <div style={{ position: "absolute", top: 150, left: 24, right: 24, display: "flex", flexDirection: "column", gap: 18 }}>
            {messages.map((m, i) => {
              const mp = spring({ frame: frame - 10 - i * 9, fps, config: { damping: 16 } });
              return (
                <div
                  key={i}
                  style={{
                    opacity: mp,
                    transform: `translateX(${interpolate(mp, [0, 1], [m.mine ? 40 : -40, 0])}px)`,
                    alignSelf: m.mine ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  <div style={{ fontFamily: body, color: MUTED, fontSize: 18, marginBottom: 6, textAlign: m.mine ? "right" : "left" }}>{m.who}</div>
                  <div
                    style={{
                      fontFamily: body,
                      fontSize: 24,
                      fontWeight: 600,
                      padding: "16px 20px",
                      borderRadius: 20,
                      borderBottomRightRadius: m.mine ? 4 : 20,
                      borderBottomLeftRadius: m.mine ? 20 : 4,
                      background: m.mine ? YELLOW : CARD,
                      color: m.mine ? "#111" : WHITE,
                      border: m.mine ? "none" : `1px solid ${LINE}`,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CALENDAR + ROSTER screen */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${calX}px)` }}>
          <div style={{ position: "absolute", top: 70, left: 30, fontFamily: display, color: WHITE, fontSize: 32, fontWeight: 800 }}>
            This Week
          </div>
          {/* week calendar */}
          <div style={{ position: "absolute", top: 150, left: 24, right: 24, display: "flex", gap: 8, justifyContent: "space-between" }}>
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
              const active = i === 1 || i === 3 || i === 5;
              const cp = spring({ frame: frame - 110 - i * 4, fps, config: { damping: 18 } });
              return (
                <div key={i} style={{ opacity: cp, flex: 1, textAlign: "center" }}>
                  <div style={{ fontFamily: body, color: MUTED, fontSize: 18, marginBottom: 8 }}>{d}</div>
                  <div
                    style={{
                      height: 60,
                      borderRadius: 14,
                      background: active ? YELLOW : CARD,
                      color: active ? "#111" : MUTED,
                      border: `1px solid ${LINE}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: body,
                      fontWeight: 800,
                      fontSize: 22,
                      boxShadow: active ? glow(YELLOW, 8) : "none",
                    }}
                  >
                    {i + 8}
                  </div>
                </div>
              );
            })}
          </div>
          {/* roster cards */}
          <div style={{ position: "absolute", top: 300, left: 24, right: 24 }}>
            <div style={{ fontFamily: display, color: WHITE, fontSize: 26, fontWeight: 800, marginBottom: 16 }}>Roster</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {roster.map((r, i) => {
                const rp = spring({ frame: frame - 122 - i * 7, fps, config: { damping: 16 } });
                return (
                  <div
                    key={i}
                    style={{
                      opacity: rp,
                      transform: `translateY(${interpolate(rp, [0, 1], [24, 0])}px)`,
                      background: CARD,
                      border: `1px solid ${LINE}`,
                      borderRadius: 18,
                      padding: 18,
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${YELLOW}, ${"#F59E0B"})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontWeight: 800, color: "#111", fontSize: 20 }}>
                      {r.n[0]}
                    </div>
                    <div style={{ fontFamily: body }}>
                      <div style={{ color: WHITE, fontWeight: 700, fontSize: 21 }}>{r.n}</div>
                      <div style={{ color: MUTED, fontSize: 17 }}>{r.p}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Phone>

      <Sequence from={130}>
        <Overlay delay={0} size={58} bottom={110}>
          One place.
          <span style={{ display: "block", color: YELLOW, textShadow: glow(YELLOW, 24) }}>Everything your team needs.</span>
        </Overlay>
      </Sequence>
    </AbsoluteFill>
  );
};
