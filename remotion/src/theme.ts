import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const inter = loadInter("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

export const FONT = inter.fontFamily;

export const COLORS = {
  bg: "#0a0a0a",
  bgSoft: "#111111",
  yellow: "#FCD34D",
  yellowDeep: "#F59E0B",
  white: "#FFFFFF",
  muted: "#8a8a8a",
  line: "rgba(255,255,255,0.08)",
};

export const glow = (color: string, strength = 40) =>
  `0 0 ${strength}px ${color}, 0 0 ${strength * 2}px ${color}`;
