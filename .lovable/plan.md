

## Waitlist Mode: Lock the Platform Behind a Premium Landing Page

Convert Camino into an exclusive waitlist experience. All app features stay in the codebase — they're just hidden behind a private route. Public visitors see only a redesigned landing page with a single goal: capture qualified waitlist signups.

---

### 1. Lock down the app

- `/auth` (sign in / sign up) → redirect to `/`
- `/dashboard/*` and any protected route → redirect to `/`
- `/cv/:slug` and `/player/:id` (public profile pages) → redirect to `/`
- **Hidden internal access:** keep a single backdoor at `/admin` that renders the existing `AuthPage`. Not linked anywhere in the UI. You sign in there, then get full dashboard access as before.
- Authenticated users with a session continue to access `/dashboard/*` normally (so your existing account keeps working).

### 2. Expand the waitlist

Extend the `waitlist` table with: `full_name`, `role` (player / coach / parent / director), `club_name` (optional). Keep email unique. RLS stays as-is (anon insert, director read).

Rebuild `WaitlistForm.tsx` with all four fields, inline validation (zod), animated success state ("You're on the list. We're onboarding select clubs in Calgary first."), and a subtle counter ("Joined this week: N") pulled live from the table via a new `count_waitlist_this_week` SECURITY DEFINER RPC (returns just an integer — no email exposure).

### 3. Rebuild the landing page (premium, immersive)

Replace the current dense landing page with a focused, scarcity-driven flow. Keep existing landing components we'll reuse (`Hero3DPitch`, `FloatingPlayerCards`, `CPIDial`, `ProductShowcaseReel`, `ParticleBurst`, `CursorFollower`, `MagneticButton`, `TiltCard`, `SiteFooter`). Drop the marketing-heavy sections (testimonials carousel, features grid of 6, 3-step "how it works", role columns, trust badges).

**New section order:**

```text
┌─────────────────────────────────────────────────┐
│  HERO — full viewport                           │
│  • 3D pitch background (Hero3DPitch, lazy)     │
│  • Headline: "The Future of Player Development"│
│  • Sub: "Track performance. Climb rankings.    │
│         Get seen."                              │
│  • Inline waitlist form (name + email + role)  │
│  • Scarcity chip: "Limited onboarding spots"   │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  RANKINGS — animated leaderboard preview        │
│  • Mock rows that shuffle position on scroll    │
│  • Gold glow on #1                              │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  PROFILES — floating player cards (parallax)    │
│  • Reuse FloatingPlayerCards with depth layers  │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  VIDEO + TRACKING — preview placeholder         │
│  • Pitch with moving dots + "Coming soon" badge│
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  SOCIAL PROOF + SCARCITY                        │
│  • "Built for competitive players and clubs"   │
│  • "Early access clubs in Calgary"              │
│  • "Rolling access — N spots remaining"         │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  FINAL CTA — full-bleed waitlist form           │
└─────────────────────────────────────────────────┘
```

**3D / depth treatment:**
- Hero pitch already uses react-three-fiber — keep, lazy-loaded
- Add scroll-driven parallax (`useScroll` + `useTransform`) to floating cards: foreground/midground/background layers move at different speeds
- Gradient lighting: radial gold glow that follows cursor (`CursorFollower`)
- Mobile fallback: disable Canvas, use static gradient + CSS transforms only (already handled by `useIsMobile`)

**Visual language:** dark navy base, gold accents only (existing tokens), Plus Jakarta Sans display, Instrument Serif for one accent word ("seen"), generous whitespace, no illustrations — pure UI mockups as the art.

### 4. Nav + footer

- Top nav: just the Camino logo + a single "Join Waitlist" magnetic button (scrolls to form). No "Sign in" link visible publicly.
- Footer: keep `SiteFooter` but strip any login links.

---

### Technical details

**Routing changes (`src/App.tsx`):**
- `<Route path="/" element={<LandingPage />} />` — unchanged
- `<Route path="/admin" element={<AuthPage />} />` — new hidden entry
- `<Route path="/auth" element={<Navigate to="/" replace />} />`
- `<Route path="/cv/:slug" element={<Navigate to="/" replace />} />`
- `<Route path="/player/:id" element={<Navigate to="/" replace />} />`
- `/dashboard/*` stays gated by `ProtectedRoute` (already redirects unauthenticated users — change target from `/auth` to `/admin`)

**Database migration:**
```sql
alter table public.waitlist
  add column full_name text,
  add column role text check (role in ('player','coach','parent','director')),
  add column club_name text;

create or replace function public.count_waitlist_this_week()
returns integer language sql stable security definer
set search_path = public as $$
  select count(*)::int from public.waitlist
  where created_at > now() - interval '7 days';
$$;
revoke all on function public.count_waitlist_this_week() from public;
grant execute on function public.count_waitlist_this_week() to anon, authenticated;
```

**Files touched:**
- `src/App.tsx` — route changes
- `src/pages/LandingPage.tsx` — full rewrite (slimmer, focused)
- `src/components/WaitlistForm.tsx` — add fields, zod validation, live counter
- `src/integrations/supabase/types.ts` — auto-regenerated after migration

**Files preserved untouched:** all dashboard pages, all hooks, all `landing/*` components we reuse, `AuthPage.tsx` (now reachable only at `/admin`).

**Reversibility:** Flipping back to public mode later = restore the `/auth` route and re-link "Sign in" in the nav. Zero feature loss.

