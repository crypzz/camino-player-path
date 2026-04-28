## Fix all dead links across the site

Right now almost every link in the footer points to `/` (it's a placeholder). Privacy, Terms, Cookies, About, "Coaches/Players/Parents/Directors", "How CPI Works", etc. are all dead. The contact email also uses the wrong domain (`hello@camino.app` instead of the brand domain).

### What I'll do

**1. Create four new public pages** (waitlist mode keeps the rest of the app hidden, but legal + about pages must be reachable):

- `/privacy` — Privacy Policy
- `/terms` — Terms of Service
- `/cookies` — Cookie Policy
- `/about` — About Camino Development

Each page gets its own slim layout: top nav (logo + Join Waitlist button, same as landing), readable long-form content using existing typography tokens, and the `SiteFooter` at the bottom. Last-updated date shown. Content will be real and specific to Camino (waitlist data collection, the four user roles, Calgary-first rollout, contact email) — not lorem-ipsum filler.

**2. Register the new routes in `src/App.tsx`** (kept public alongside `/` and `/admin`):

```text
/privacy   → PrivacyPage
/terms     → TermsPage
/cookies   → CookiesPage
/about     → AboutPage
```

**3. Rewire `SiteFooter.tsx`** so every link actually goes somewhere:

| Column | Link | New target |
|---|---|---|
| Platform | Camino Player Index | `/#rankings` |
| Platform | Video Analysis | `/#video` (new id on existing section) |
| Platform | Evaluations | `/#cpi` (new id on CPI section) |
| Platform | Fitness Testing | `/#cpi` |
| Platform | Communication Hub | `/#profiles` (new id) |
| Built for | Coaches / Players / Parents / Directors | all → `/#waitlist` |
| Resources | How CPI Works | `/#cpi` |
| Resources | Methodology | `/about` |
| Resources | Privacy | `/privacy` |
| Resources | Terms | `/terms` |
| Company | About | `/about` |
| Company | Contact | `mailto:hello@caminodevelopment.com` |
| Company | Press | `mailto:hello@caminodevelopment.com?subject=Press%20inquiry` |
| Company | Join Waitlist | `/#waitlist` |
| Bottom bar | Privacy / Terms / Cookies | `/privacy` `/terms` `/cookies` |

The footer currently uses `<Link to=…>` from react-router. I'll switch link items that point to in-page anchors to `<a href>` (so hash navigation actually scrolls) and keep `<Link>` only for true routes. I'll also add a small handler so that clicking a `/#section` link from another page navigates to `/` and then scrolls.

**4. Add anchor ids to the matching landing-page sections** (`#video`, `#cpi`, `#profiles`) so the new footer links scroll to the right places.

**5. Fix the contact email everywhere** from `hello@camino.app` → `hello@caminodevelopment.com` (the brand's real domain).

### Files touched

- `src/App.tsx` — add 4 new public routes
- `src/components/landing/SiteFooter.tsx` — real hrefs + correct email
- `src/pages/LandingPage.tsx` — add `id` attributes to existing CPI / Profiles / Video sections
- `src/pages/PrivacyPage.tsx` — new
- `src/pages/TermsPage.tsx` — new
- `src/pages/CookiesPage.tsx` — new
- `src/pages/AboutPage.tsx` — new
- `src/components/landing/LegalLayout.tsx` — new shared shell (top nav + footer + prose container) used by all 4 new pages

### Visual treatment for the new pages

Same dark-theme aesthetic as the landing page. Centered max-width prose column (`max-w-3xl`), `font-display` headings, gold accent rule under the H1, `text-muted-foreground` body. No new design tokens — just reuses existing ones.

### Out of scope

- I'm not adding cookie-consent banner logic. The Cookie Policy page documents what is used (Supabase auth session storage, no third-party tracking) which is honest given the current code.
- No CMS — content lives in the page components so you can edit it in code.
