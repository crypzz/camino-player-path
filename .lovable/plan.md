## Goal

The Squad Overview cards currently show too many numbers (CPI badge, four TEC/TAC/PHY/MEN tiles, attendance % with a colored dot, nationality). It looks like a stat-line on a betting site. Clean it up so each card is calm and minimal, and surface the detailed stats only after the user clicks a player.

## Changes

### 1. Redesign `src/components/PlayerCard.tsx`

Strip the card down to identity-only:

- Avatar (initials in a rounded circle, slightly larger)
- Name (primary)
- One subtle meta line: `Position · Team · Age`
- A single small CPI pill on the right (just the number, no big "CPI" label stack, no 4 stat tiles, no attendance bar, no nationality row)
- Subtle attendance shown only as a thin colored left border (success/warning/destructive) — no number — so coaches still get an at-a-glance health cue without a number wall
- Hover: gentle lift + primary border tint (keep existing motion)

Result: one number per card (CPI), not six.

### 2. Add a click-to-open stats dialog

On mobile/tablet today the detail panel only appears on `lg:` breakpoints — clicking a card on smaller screens does nothing visible. Fix this by opening the existing `PlayerDetailPanel` content inside a Dialog when clicked, on all viewports.

- Create `src/components/PlayerDetailDialog.tsx` — a thin wrapper that renders `PlayerDetailPanel` inside `<Dialog>` from `@/components/ui/dialog` (max-w-2xl, scrollable, dark themed to match glass-card).
- On click, the card opens this dialog (works at every breakpoint, including the user's current 679px viewport).
- Keep the existing right-side inline panel behavior on `lg+` as an alternative? No — unify on the dialog so the experience is consistent and the grid stays clean. Remove the `lg:grid-cols-[1fr_380px]` split layout from `CoachDashboard.tsx` and `PlayersPage.tsx`; squad grid becomes full-width `md:grid-cols-2 lg:grid-cols-3`.

### 3. Files touched

- `src/components/PlayerCard.tsx` — simplified markup (remove 4-stat grid, attendance row, nationality)
- `src/components/PlayerDetailDialog.tsx` — new wrapper
- `src/pages/CoachDashboard.tsx` — swap inline panel for dialog, widen grid to 3 cols on lg
- `src/pages/PlayersPage.tsx` — same swap

### 4. Out of scope

- No changes to `PlayerDetailPanel` internals (skills/progress/goals/videos tabs stay as-is — that's where the numbers belong now).
- No CPI / ranking algorithm changes.

## Visual before/after (card)

```text
BEFORE                                AFTER
┌──────────────────────────┐          ┌──────────────────────────┐
│ JD  Jane Doe        87   │          │▌ JD  Jane Doe        87  │
│     ST · U16 · 15y  CPI  │          │▌     ST · U16 · 15y      │
│ ┌──┬──┬──┬──┐            │          └──────────────────────────┘
│ │82│79│88│85│            │           (thin left border = attendance health)
│ │TEC TAC PHY MEN│        │
│ ───────────────          │
│ 🇬🇧 GBR        ● 92%    │
└──────────────────────────┘
```
