import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2, AlertTriangle, MailX } from 'lucide-react';

type State =
  | { kind: 'validating' }
  | { kind: 'valid' }
  | { kind: 'already' }
  | { kind: 'invalid' }
  | { kind: 'submitting' }
  | { kind: 'done' }
  | { kind: 'error'; message: string };

export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState<State>({ kind: 'validating' });

  useEffect(() => {
    if (!token) {
      setState({ kind: 'invalid' });
      return;
    }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
      headers: { apikey: supabaseAnonKey },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.valid) setState({ kind: 'valid' });
        else if (data?.reason === 'already_unsubscribed') setState({ kind: 'already' });
        else setState({ kind: 'invalid' });
      })
      .catch(() => setState({ kind: 'invalid' }));
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState({ kind: 'submitting' });
    const { data, error } = await supabase.functions.invoke('handle-email-unsubscribe', {
      body: { token },
    });
    if (error) {
      setState({ kind: 'error', message: error.message || 'Something went wrong.' });
      return;
    }
    if (data?.success) setState({ kind: 'done' });
    else if (data?.reason === 'already_unsubscribed') setState({ kind: 'already' });
    else setState({ kind: 'error', message: 'Unable to process unsubscribe.' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 text-center">
        <div className="mx-auto mb-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
          <MailX className="h-6 w-6 text-primary" strokeWidth={1.5} />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
          Email preferences
        </h1>

        {state.kind === 'validating' && (
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Checking your link…
          </p>
        )}

        {state.kind === 'valid' && (
          <>
            <p className="text-muted-foreground mb-6">
              Confirm to unsubscribe from Camino emails. You can rejoin anytime from our site.
            </p>
            <Button onClick={confirm} className="w-full h-11">Confirm unsubscribe</Button>
          </>
        )}

        {state.kind === 'submitting' && (
          <Button disabled className="w-full h-11">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…
          </Button>
        )}

        {state.kind === 'done' && (
          <div className="text-foreground">
            <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-medium mb-1">You've been unsubscribed.</p>
            <p className="text-sm text-muted-foreground">We won't email you again.</p>
          </div>
        )}

        {state.kind === 'already' && (
          <div className="text-foreground">
            <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-medium">You're already unsubscribed.</p>
          </div>
        )}

        {state.kind === 'invalid' && (
          <div className="text-foreground">
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-medium mb-1">This link isn't valid.</p>
            <p className="text-sm text-muted-foreground">It may have expired or already been used.</p>
          </div>
        )}

        {state.kind === 'error' && (
          <div className="text-foreground">
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-medium mb-1">Something went wrong.</p>
            <p className="text-sm text-muted-foreground">{state.message}</p>
          </div>
        )}

        <Link to="/" className="block mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Back to caminodevelopment.com
        </Link>
      </div>
    </div>
  );
}
