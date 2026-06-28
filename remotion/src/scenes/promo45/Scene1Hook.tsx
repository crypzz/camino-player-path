import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { Phone, Overlay, BG, CARD, YELLOW, WHITE, MUTED, LINE, body, display, glow } from "./_shared";

// SCENE 1 (0-5s) — THE HOOK. Phone slides in, notification ping, schedule.
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({ frame, fps, config: { damping: 22 }, durationInFrames: 30 });
  const phoneX = interpolate(slideIn, [0, 1], [500, 0]);
  const phoneRot = interpolate(slideIn, [0, 1], [8, 0]);

  // notification appears
  const notif = spring({ frame: frame - 32, fps, config: { damping: 16 } });
  // schedule transition (slides up over notification area)
  const schedule = spring({ frame: frame - 70, fps, config: { damping: 22 } });

  const times = ["Tuesday · 5:00 PM", "Thursday · 4:00 PM", "Saturday · 1:00 PM"];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `translateX(${phoneX}px) rotate(${phoneRot}deg)`, opacity: slideIn }}>
        <Phone width={560}>
          {/* App header */}
          <div style={{ position: "absolute", top: 70, left: 0, right: 0, padding: "0 30px", fontFamily: display, color: WHITE, fontSize: 34, fontWeight: 800 }}>
            <span style={{ color: YELLOW }}>Camino</span>
          </div>

          {/* Notification banner */}
          <div
            style={{
              position: "absolute",
              top: 130,
              left: 24,
              right: 24,
              opacity: notif,
              transform: `translateY(${interpolate(notif, [0, 1], [-40, 0])}px) scale(${interpolate(notif, [0, 1], [0.96, 1])})`,
              background: "rgba(30,30,30,0.96)",
              border: `1px solid ${YELLOW}55`,
              borderRadius: 22,
              padding: "20px 22px",
              display: "flex",
              gap: 16,
              alignItems: "center",
              boxShadow: glow(YELLOW, 10),
              zIndex: 20,
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: YELLOW, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>📣</div>
            <div style={{ fontFamily: body }}>
              <div style={{ color: WHITE, fontWeight: 800, fontSize: 24 }}>Coach Martinez</div>
              <div style={{ color: MUTED, fontSize: 21, marginTop: 2 }}>Posted practice schedule</div>
            </div>
          </div>

          {/* Schedule screen slides up */}
          <div
            style={{
              position: "absolute",
              top: 300,
              left: 24,
              right: 24,
              opacity: schedule,
              transform: `translateY(${interpolate(schedule, [0, 1], [60, 0])}px)`,
            }}
          >
            <div style={{ fontFamily: display, color: WHITE, fontSize: 30, fontWeight: 800, marginBottom: 18 }}>This Week</div>
            {times.map((t, i) => {
              const tp = spring({ frame: frame - 84 - i * 10, fps, config: { damping: 16 } });
              return (
                <div
                  key={t}
                  style={{
                    opacity: tp,
                    transform: `translateX(${interpolate(tp, [0, 1], [-30, 0])}px)`,
                    background: CARD,
                    border: `1px solid ${LINE}`,
                    borderRadius: 18,
                    padding: "20px 22px",
                    marginBottom: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    fontFamily: body,
                  }}
                >
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: YELLOW, boxShadow: glow(YELLOW, 8) }} />
                  <div style={{ color: WHITE, fontWeight: 700, fontSize: 25 }}>{t}</div>
                  <div style={{ marginLeft: "auto", color: MUTED, fontSize: 20 }}>Practice</div>
                </div>
              );
            })}
          </div>
        </Phone>
      </div>

      <Sequence from={95}>
        <Overlay delay={0} highlight="It starts with visibility" size={66} bottom={120}>
          
        </Overlay>
      </Sequence>
    </AbsoluteFill>
  );
};
