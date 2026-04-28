## Send Real Confirmation Emails on Waitlist Signup

### Problem
Joining the waitlist currently only inserts a row into the `waitlist` table. No email is ever sent. The project has Lovable Emails configured (auth-email-hook deployed for sign-in flows), but the **transactional email system** — required for non-auth emails like waitlist confirmations — has never been scaffolded. The verified sender domain `notify.caminodevelopment.com` is ready to use.

### Solution
Set up the transactional email pipeline and trigger a "Welcome to the waitlist" email immediately after each successful signup. Also send an internal notification to `hello@caminodevelopment.com` so the team is alerted to every new signup.

---

### Steps

**1. Provision transactional email infrastructure**
- Run `setup_email_infra` (idempotent — safe even though auth infra already exists) to ensure all queues, RPCs, and the `process-email-queue` cron job are in place.
- Run `scaffold_transactional_email` to generate:
  - `supabase/functions/send-transactional-email/`
  - `supabase/functions/handle-email-unsubscribe/`
  - `supabase/functions/handle-email-suppression/`
  - `supabase/functions/_shared/transactional-email-templates/registry.ts`

**2. Create two branded templates** in `_shared/transactional-email-templates/`:
- `waitlist-confirmation.tsx` — sent to the user. Matches Camino brand (navy `#0a0e1a` + gold `#c89b2b`, Plus Jakarta Sans headings, Instrument Serif italic accents — same look as the existing `signup.tsx` template). Personalized greeting, role-aware copy ("As a player/coach/parent/director, here's what to expect…"), white body background per spec.
- `waitlist-internal-notification.tsx` — minimal plaintext-style email to the team showing name, email, role, club.

Register both in `registry.ts`.

**3. Wire the trigger in `src/components/WaitlistForm.tsx`**
After a successful `supabase.from('waitlist').insert(...)`:
```ts
const idempotencyKey = `waitlist-${payload.email}`;
// User confirmation
supabase.functions.invoke('send-transactional-email', {
  body: {
    templateName: 'waitlist-confirmation',
    recipientEmail: payload.email,
    idempotencyKey,
    templateData: { name: payload.full_name, role: payload.role, clubName: payload.club_name },
  },
});
// Internal notification (fire-and-forget)
supabase.functions.invoke('send-transactional-email', {
  body: {
    templateName: 'waitlist-internal-notification',
    recipientEmail: 'hello@caminodevelopment.com',
    idempotencyKey: `waitlist-internal-${payload.email}`,
    templateData: { name: payload.full_name, email: payload.email, role: payload.role, clubName: payload.club_name },
  },
});
```
Both calls are fire-and-forget — UI still flips to "You're in" instantly. Errors are logged to console but don't block the success state. Idempotency key prevents duplicate sends if the user double-submits.

**4. Create the unsubscribe page**
The scaffold tool will pick a path (likely `/unsubscribe`). Create `src/pages/UnsubscribePage.tsx` matching Camino's dark theme — token validation on mount, branded "Confirm unsubscribe" button, success/error states. Register the route in `src/App.tsx`.

**5. Deploy**
Deploy `send-transactional-email`, `handle-email-unsubscribe`, `handle-email-suppression`. Auto-deploy handles the rest.

---

### Files Changed

**Created:**
- `supabase/functions/send-transactional-email/index.ts` (+ deno.json)
- `supabase/functions/handle-email-unsubscribe/index.ts` (+ deno.json)
- `supabase/functions/handle-email-suppression/index.ts` (+ deno.json)
- `supabase/functions/_shared/transactional-email-templates/registry.ts`
- `supabase/functions/_shared/transactional-email-templates/waitlist-confirmation.tsx`
- `supabase/functions/_shared/transactional-email-templates/waitlist-internal-notification.tsx`
- `src/pages/UnsubscribePage.tsx`

**Edited:**
- `src/components/WaitlistForm.tsx` — invoke send-transactional-email after insert
- `src/App.tsx` — register `/unsubscribe` route

**Untouched:** all auth email templates, `auth-email-hook`, every dashboard page.

### Result
Within seconds of joining the waitlist, the user receives a branded Camino confirmation email from `notify.caminodevelopment.com`, and the team gets an internal heads-up at `hello@caminodevelopment.com`. Retry-safe via the queue, suppression-safe via the built-in unsubscribe system.
