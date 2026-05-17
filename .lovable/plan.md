# Evaluations & Fitness Revamp Plan

## Goals
- Make rating players **fast and tactile** for coaches (no more clunky sliders)
- Show all four categories at once so coaches don't have to switch dropdowns
- Auto-save changes so coaches never lose work
- Make fitness test entry smoother with quick presets, inline editing, and clearer feedback

---

## 1. Evaluations Page revamp (`src/pages/EvaluationsPage.tsx`)

### New interaction model: 1–10 segmented rating buttons
Replace `<Slider>` with a row of 10 small clickable pills per attribute. Tap = instant rating. No drag, no fiddling on mobile.

- Each pill colored by score band: 1–3 red, 4–6 amber, 7–8 emerald, 9–10 primary gold
- Current value highlighted with filled background + scale animation (framer-motion)
- Keyboard support: arrow keys to nudge focused row
- "Quick set" buttons above each category: **Reset to current**, **Set all to 5**, **+1 all**, **−1 all**

### Layout
- **Left:** Player picker (searchable combobox instead of plain Select — uses `Command` from shadcn), with avatar + position chip
- **Center:** Tabbed grid showing all 4 categories at once (Technical / Tactical / Physical / Mental) as tabs, not nested dropdowns. Each tab shows the attribute rows with pill ratings.
- **Right (sticky on desktop, collapsible on mobile):** Live radar + CPI dial + dirty-state indicator
- **Bottom bar (sticky):** "Unsaved changes for {name}" + Save / Discard buttons. Saves all 4 categories in one mutation instead of one at a time.

### Auto-save behavior
- Debounced auto-save 1.2s after last change (toast: "Saved")
- Manual Save button still available
- Switching player while dirty → confirm dialog

### Quick rate from history
- Show last evaluation date + "Copy from last session" button to prefill

### Visual polish
- Glass cards with subtle gradient borders matching design system
- Category icons (Target / Brain / Zap / Heart)
- Progress bar showing % of attributes rated above 6

---

## 2. Fitness Test page improvements (`src/pages/FitnessTestPage.tsx`)

### Inline form (no toggle)
- Always-visible compact entry strip at top once a player is selected — coaches can log tests without clicking "New Test" first
- Number inputs with **stepper buttons** (+/-) and proper `inputMode="decimal"` for mobile keyboards
- Each field shows its **last recorded value** as ghost placeholder so coaches see progress context

### Test type chips
- Replace 7 inputs always shown with **chip selector** — coach picks which tests they ran today, only those inputs render
- Presets: "Speed Day" (10m + 30m + agility), "Endurance Day" (beep + cooper), "Power Day" (vertical jump), "Full Combine" (all)

### Benchmark scoring preview
- As coach types raw value, show derived 1–10 score live next to the input (uses existing youth-athlete benchmarks from `lib/playerLevel.ts` / fitness mapping). Gives instant feedback that the test "counted."

### Edit & delete past tests
- Each history card gets a pencil + trash icon (coach who recorded it can edit/delete via existing RLS)
- Edit opens inline, not a separate page

### History improvements
- Group by month
- Show delta arrows vs previous test for each metric (▲ 0.2s faster)
- Sparkline mini-chart per metric across all tests at top of history

---

## 3. Shared additions

### New hook: `useUpdateFitnessTest` and `useDeleteFitnessTest` in `src/hooks/useFitnessTests.ts`
- Mirrors existing create hook
- Invalidates `['fitness-tests', playerId]` and `['players']`

### Rating pill component: `src/components/evaluations/RatingPills.tsx`
- Reusable 1–10 segmented control
- Props: `value`, `onChange`, `label`, `compact?`

### Category averages helper unchanged — reuse `getCategoryAverage`

---

## Technical notes
- No DB schema changes needed — existing `players` JSONB columns and `fitness_tests` table cover everything
- Auto-save uses existing `useUpdatePlayer` mutation, just batched (send technical + tactical + physical + mental in one call)
- Benchmark → score mapping: extract small util `src/lib/fitnessBenchmarks.ts` with age-band lookup tables (sprints, agility, jump, cooper, beep)
- Searchable player picker: shadcn `Command` + `Popover` (both already in repo via shadcn defaults)

## Out of scope
- No changes to CPI formula, RLS, or `evaluations` history table writes (those continue exactly as today)
- No changes to Director/Parent views
