import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('waitlist').insert({ email: email.trim().toLowerCase() });
    setLoading(false);
    if (error) {
      if (error.code === '23505') {
        toast({ title: "You're already on the list", description: 'We'll be in touch soon.' });
        setSubmitted(true);
      } else {
        toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'destructive' });
      }
      return;
    }
    setSubmitted(true);
    toast({ title: "You're in", description: 'We'll reach out when it's your turn.' });
  };

  if (submitted) {
    return (
      <p className="mt-4 text-sm text-primary font-medium">
        ✓ You're on the list. We'll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row items-center gap-2.5 max-w-sm mx-auto">
      <Input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-10 text-sm bg-secondary/60 border-border/60 placeholder:text-muted-foreground/60 focus-visible:ring-primary/40"
      />
      <Button type="submit" disabled={loading} className="shrink-0 h-10 px-5 text-sm font-semibold">
        {loading ? 'Sending…' : 'Request Access'}
      </Button>
    </form>
  );
}
