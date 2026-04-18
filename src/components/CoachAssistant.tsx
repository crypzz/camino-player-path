import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, X, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { WeeklyReportDialog } from '@/components/WeeklyReportDialog';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTED = [
  'Which players regressed this month?',
  'Top 3 players by CPI right now',
  'Who needs a fitness focus?',
  'Draft a training plan for my weakest defender',
];

export function CoachAssistant() {
  const [open, setOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Msg = { role: 'user', content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    let assistantSoFar = '';
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error('Not signed in');

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coach-assistant`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error('Rate limit hit — wait a moment.');
        else if (resp.status === 402) toast.error('AI credits exhausted.');
        else toast.error('Assistant unavailable.');
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buf.indexOf('\n')) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) upsert(delta);
          } catch {
            buf = line + '\n' + buf;
            break;
          }
        }
      }
    } catch (e: any) {
      toast.error(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn(
          'fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full',
          'bg-gradient-to-br from-primary to-primary/70',
          'shadow-[0_8px_24px_-4px_hsl(var(--primary)/0.5)]',
          'flex items-center justify-center text-primary-foreground',
          'hover:scale-105 transition-transform',
          open && 'opacity-0 pointer-events-none'
        )}
        aria-label="Open AI Coach Assistant"
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[420px] h-[600px] max-h-[calc(100vh-3rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-foreground">AI Coach Assistant</h3>
                  <p className="text-[10px] text-muted-foreground">Knows your roster</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs px-2"
                  onClick={() => setReportOpen(true)}
                  title="Generate weekly report"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Weekly Report</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-3">
              {messages.length === 0 ? (
                <div className="space-y-4 py-4">
                  <div className="text-center space-y-1">
                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/50" />
                    <p className="text-sm text-foreground font-medium">Ask anything about your players</p>
                    <p className="text-xs text-muted-foreground">I can read CPI, evaluations, fitness & attendance.</p>
                  </div>
                  <div className="space-y-2">
                    {SUGGESTED.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="w-full text-left text-xs px-3 py-2 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        'rounded-xl px-3 py-2 text-sm max-w-[90%]',
                        m.role === 'user'
                          ? 'ml-auto bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-foreground'
                      )}
                    >
                      {m.role === 'assistant' ? (
                        <div className="prose prose-sm prose-invert max-w-none [&>*]:my-1 [&_strong]:text-primary [&_ul]:pl-4 [&_li]:my-0.5">
                          <ReactMarkdown>{m.content || '...'}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      )}
                    </div>
                  ))}
                  {loading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="bg-muted/50 rounded-xl px-3 py-2 max-w-[90%]">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  <div ref={endRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-border p-3 bg-card">
              <div className="flex gap-2 items-end">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ask about a player, plan, or trend..."
                  className="min-h-[44px] max-h-[120px] resize-none text-sm"
                  rows={1}
                  disabled={loading}
                />
                <Button
                  size="icon"
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="h-11 w-11 shrink-0"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
