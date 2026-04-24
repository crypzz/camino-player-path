import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, Loader2 } from 'lucide-react';

const schema = z.object({
  full_name: z.string().trim().min(2, 'Enter your full name').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(255),
  role: z.enum(['player', 'coach', 'parent', 'director'], {
    required_error: 'Pick the role that fits you best',
  }),
  club_name: z.string().trim().max(120).optional().or(z.literal('')),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

interface Props {
  variant?: 'hero' | 'block';
}

export function WaitlistForm({ variant = 'hero' }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('');
  const [clubName, setClubName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [weeklyCount, setWeeklyCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.rpc('count_waitlist_this_week').then(({ data, error }) => {
      if (!cancelled && !error && typeof data === 'number') setWeeklyCount(data);
    });
    return () => { cancelled = true; };
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = schema.safeParse({
      full_name: fullName,
      email,
      role,
      club_name: clubName,
    });

    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const payload = {
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      role: parsed.data.role,
      club_name: parsed.data.club_name?.trim() ? parsed.data.club_name.trim() : null,
    };

    const { error } = await supabase.from('waitlist').insert(payload);
    setLoading(false);

    if (error) {
      if (error.code === '23505') {
        toast({ title: "You're already on the list", description: "We'll be in touch when it's your turn." });
        setSubmitted(true);
        return;
      }
      toast({ title: 'Something went wrong', description: 'Please try again in a moment.', variant: 'destructive' });
      return;
    }

    setSubmitted(true);
    toast({ title: "You're in", description: "We're onboarding select clubs in Calgary first." });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="mt-6 mx-auto max-w-md rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center backdrop-blur-sm"
      >
        <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-lg font-heading font-semibold text-foreground">You're on the list.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We're onboarding select clubs in Calgary first. We'll reach out when it's your turn.
        </p>
      </motion.div>
    );
  }

  const isHero = variant === 'hero';

  return (
    <form
      onSubmit={handleSubmit}
      className={isHero
        ? 'mt-6 mx-auto max-w-lg space-y-3 rounded-2xl border border-border/40 bg-background/40 p-5 backdrop-blur-md shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.25)]'
        : 'mx-auto max-w-xl space-y-3'}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="wl-name" className="text-xs uppercase tracking-wider text-muted-foreground">Full name</Label>
          <Input
            id="wl-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Alex Rivera"
            className="h-11 bg-secondary/40 border-border/60"
            aria-invalid={!!errors.full_name}
          />
          {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="wl-email" className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
          <Input
            id="wl-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="h-11 bg-secondary/40 border-border/60"
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="wl-role" className="text-xs uppercase tracking-wider text-muted-foreground">I'm a…</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="wl-role" className="h-11 bg-secondary/40 border-border/60" aria-invalid={!!errors.role}>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="player">Player</SelectItem>
              <SelectItem value="coach">Coach</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="director">Club Director</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="wl-club" className="text-xs uppercase tracking-wider text-muted-foreground">
            Club <span className="text-muted-foreground/60 normal-case">(optional)</span>
          </Label>
          <Input
            id="wl-club"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            placeholder="Camino FC"
            className="h-11 bg-secondary/40 border-border/60"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 text-sm font-semibold tracking-wide rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_-8px_hsl(var(--primary)/0.6)]"
      >
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Joining…</> : 'Join the Waitlist'}
      </Button>

      <AnimatePresence>
        {weeklyCount !== null && weeklyCount > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-muted-foreground pt-1"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
            {weeklyCount} {weeklyCount === 1 ? 'person' : 'people'} joined this week
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
