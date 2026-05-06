import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
export const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

export const NAVY = "#0A0C12";
export const NAVY_2 = "#141821";
export const NAVY_3 = "#1C2230";
export const GOLD = "#E8B400";
export const GOLD_SOFT = "rgba(232,180,0,0.15)";
export const IVORY = "#F5F5F5";
export const MUTED = "rgba(245,245,245,0.55)";
export const GREEN = "#10B981";
export const RED = "#DC2626";

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{
    background: "linear-gradient(180deg, rgba(28,34,48,0.95), rgba(20,24,33,0.95))",
    border: "1px solid rgba(232,180,0,0.18)",
    borderRadius: 28,
    boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
    ...style,
  }}>{children}</div>
);

export const Chip: React.FC<{ children: React.ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
  <div style={{
    display: "inline-block",
    padding: "10px 22px",
    borderRadius: 999,
    border: `1px solid ${GOLD}`,
    backgroundColor: GOLD_SOFT,
    color: GOLD,
    fontFamily: body, fontWeight: 700, fontSize: 22,
    letterSpacing: 3, textTransform: "uppercase",
    opacity,
  }}>{children}</div>
);
