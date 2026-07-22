export { display, body, NAVY, NAVY_2, GOLD, IVORY, MUTED, GoldChip } from "../allinone/_shared";

export const TEAMS = [
  { rank: 1, name: "Foothills SC U15", gp: 12, w: 10, t: 1, l: 1, pts: 31, gf: 42, ga: 12, gd: 30 },
  { rank: 2, name: "Calgary Villains", gp: 12, w: 9, t: 2, l: 1, pts: 29, gf: 38, ga: 15, gd: 23 },
  { rank: 3, name: "Cavalry FC Academy", gp: 12, w: 8, t: 2, l: 2, pts: 26, gf: 34, ga: 18, gd: 16 },
  { rank: 4, name: "Chinook FC", gp: 12, w: 6, t: 3, l: 3, pts: 21, gf: 26, ga: 22, gd: 4 },
  { rank: 5, name: "Bow Valley United", gp: 12, w: 5, t: 2, l: 5, pts: 17, gf: 22, ga: 24, gd: -2 },
  { rank: 6, name: "West Island FC", gp: 12, w: 4, t: 2, l: 6, pts: 14, gf: 18, ga: 28, gd: -10 },
];

export const SCORERS = [
  { rank: 1, name: "L. Martinez", team: "Foothills SC", goals: 18, assists: 7 },
  { rank: 2, name: "J. Okonkwo", team: "Villains", goals: 15, assists: 4 },
  { rank: 3, name: "A. Singh", team: "Cavalry FC", goals: 13, assists: 9 },
  { rank: 4, name: "M. Dubois", team: "Chinook FC", goals: 11, assists: 3 },
  { rank: 5, name: "R. Thompson", team: "Bow Valley", goals: 9, assists: 6 },
];

export const FORM: { team: string; results: ("W" | "L" | "T")[] }[] = [
  { team: "Foothills SC", results: ["W", "W", "W", "W", "T"] },
  { team: "Villains", results: ["W", "W", "T", "W", "L"] },
  { team: "Cavalry FC", results: ["W", "L", "W", "T", "W"] },
  { team: "Chinook FC", results: ["L", "W", "T", "L", "W"] },
];
