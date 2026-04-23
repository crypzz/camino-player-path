import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, Trophy, AlertTriangle, MailCheck, MailWarning } from 'lucide-react';

type EmailStatus =
  | { kind: 'idle' }
  | { kind: 'checking'; email: string }
  | { kind: 'sent'; email: string }
  | { kind: 'pending'; email: string }
  | { kind: 'failed'; email: string; reason?: string };

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>({ kind: 'idle' });
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Poll email_send_log via SECURITY DEFINER RPC to surface failures to the user.
  const pollEmailStatus = async (recipient: string) => {
    setEmailStatus({ kind: 'checking', email: recipient });
    const FAILED = new Set(['failed', 'dlq', 'bounced', 'complained', 'suppressed']);
    const start = Date.now();
    const TIMEOUT_MS = 25_000;

    while (Date.now() - start < TIMEOUT_MS) {
      const { data, error } = await supabase.rpc('get_signup_email_status', { _email: recipient });
      if (!error && data && data.length > 0) {
        const row = data[0] as { status: string; error_message: string | null };
        if (row.status === 'sent') {
          setEmailStatus({ kind: 'sent', email: recipient });
          return;
        }
        if (FAILED.has(row.status)) {
          setEmailStatus({
            kind: 'failed',
            email: recipient,
            reason: row.error_message || row.status,
          });
          toast.error("We couldn't deliver your confirmation email. See details below.");
          return;
        }
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
    // Timed out waiting for terminal state — treat as pending so user isn't stuck silently.
    setEmailStatus({ kind: 'pending', email: recipient });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const recipient = email.trim().toLowerCase();
      const { error } = await signUp(recipient, password, displayName);
      if (error) {
        toast.error(error.message);
        setEmailStatus({ kind: 'idle' });
      } else {
        toast.success('Account created! Sending confirmation email…');
        // Fire-and-forget polling; UI updates as state transitions.
        pollEmailStatus(recipient);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        navigate('/dashboard');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight font-heading text-foreground">CAMINO</span>
          </div>
          <CardTitle className="text-xl font-heading">{isSignUp ? 'Create Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>{isSignUp ? 'Start tracking player development' : 'Sign in to your dashboard'}</CardDescription>
        </CardHeader>
        <CardContent>
          {isSignUp && emailStatus.kind !== 'idle' && (
            <div className="mb-4">
              {emailStatus.kind === 'checking' && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertTitle>Sending confirmation email…</AlertTitle>
                  <AlertDescription>
                    We're delivering your confirmation link to <strong>{emailStatus.email}</strong>.
                  </AlertDescription>
                </Alert>
              )}
              {emailStatus.kind === 'sent' && (
                <Alert>
                  <MailCheck className="h-4 w-4" />
                  <AlertTitle>Confirmation email sent</AlertTitle>
                  <AlertDescription>
                    Check <strong>{emailStatus.email}</strong> (and your spam folder) for the confirmation link.
                  </AlertDescription>
                </Alert>
              )}
              {emailStatus.kind === 'pending' && (
                <Alert>
                  <MailWarning className="h-4 w-4" />
                  <AlertTitle>Email is taking longer than usual</AlertTitle>
                  <AlertDescription>
                    Your confirmation to <strong>{emailStatus.email}</strong> hasn't arrived yet. Wait a minute, then try resending below if it doesn't show up.
                  </AlertDescription>
                </Alert>
              )}
              {emailStatus.kind === 'failed' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Confirmation email failed</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>
                      We couldn't deliver the confirmation email to <strong>{emailStatus.email}</strong>
                      {emailStatus.reason ? ` — ${emailStatus.reason}` : '.'}
                    </p>
                    <p className="text-xs opacity-90">
                      Double-check the address for typos, or try a different email and sign up again.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Coach Rivera" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="coach@academy.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading || emailStatus.kind === 'checking'}>
              {(loading || emailStatus.kind === 'checking') && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-medium">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
