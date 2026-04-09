import { useState, useEffect, useRef } from 'react';
import { useConversations, useMessages, useSendMessage, useCreateConversation, useAllProfiles } from '@/hooks/useCommunications';
import { useTeams } from '@/hooks/useDirectorData';
import { useAuth } from '@/hooks/useAuth';
import { useAppContext } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Send, Plus, Hash } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

function DateSeparator({ date }: { date: string }) {
  const d = new Date(date);
  const label = isToday(d) ? 'Today' : isYesterday(d) ? 'Yesterday' : format(d, 'EEEE, MMM d');
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[11px] text-muted-foreground/50 font-medium">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export function TeamChatTab() {
  const { user } = useAuth();
  const { role } = useAppContext();
  const { data: conversations = [] } = useConversations();
  const { data: teams = [] } = useTeams();
  const { data: profiles = [] } = useAllProfiles();
  const createConvo = useCreateConversation();
  const sendMutation = useSendMessage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: messages = [] } = useMessages(selectedId);
  const [msgInput, setMsgInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();

  const teamChats = conversations.filter((c: any) => c.type === 'team_chat');

  useEffect(() => {
    if (!selectedId) return;
    const channel = supabase
      .channel(`team-chat-${selectedId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedId}` },
        () => { qc.invalidateQueries({ queryKey: ['messages', selectedId] }); }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedId, qc]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleCreateTeamChat = async (teamId: string, teamName: string) => {
    try {
      const data = await createConvo.mutateAsync({
        type: 'team_chat',
        team_id: teamId,
        title: teamName,
        participant_ids: [],
      });
      setSelectedId(data.id);
    } catch { }
  };

  const handleSend = async () => {
    if (!msgInput.trim() || !selectedId) return;
    await sendMutation.mutateAsync({ conversation_id: selectedId, content: msgInput.trim() });
    setMsgInput('');
  };

  const getSenderName = (senderId: string) => {
    if (senderId === user?.id) return 'You';
    return profiles.find((p: any) => p.user_id === senderId)?.display_name || 'Unknown';
  };

  // Group messages by date
  let lastDate = '';

  return (
    <div className="flex gap-4 h-[calc(100vh-16rem)] min-h-[400px]">
      <div className="w-72 shrink-0 flex flex-col space-y-1">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground/50 font-medium px-2 mb-2">Team Channels</p>
        {teamChats.map((c: any) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm flex items-center gap-2.5 ${selectedId === c.id ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
          >
            <Hash className="h-4 w-4 text-primary/60" />
            <span className="truncate font-medium text-[13px]">{c.title || 'Team Chat'}</span>
          </button>
        ))}
        {(role === 'coach' || role === 'director') && teams.length > 0 && (
          <>
            <div className="h-px bg-border my-2" />
            <p className="text-[11px] text-muted-foreground/40 px-2">Create channel for:</p>
            {teams.filter((t: any) => !teamChats.some((c: any) => c.team_id === t.id)).map((t: any) => (
              <button key={t.id} onClick={() => handleCreateTeamChat(t.id, t.name)} className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 text-muted-foreground/60 hover:bg-accent/30 transition-colors">
                <Plus className="h-3.5 w-3.5" /><span className="text-[13px]">{t.name}</span>
              </button>
            ))}
          </>
        )}
        {teamChats.length === 0 && teams.length === 0 && (
          <div className="text-center py-8 text-muted-foreground/50 text-sm">No team channels</div>
        )}
      </div>

      <Card className="flex-1 flex flex-col">
        {!selectedId ? (
          <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center"><Users className="h-10 w-10 mx-auto mb-3 opacity-30" /><p className="text-sm">Select a team channel</p></div>
          </CardContent>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary/60" />
              <span className="font-medium text-sm">{teamChats.find((c: any) => c.id === selectedId)?.title || 'Team Chat'}</span>
              <Badge variant="outline" className="text-[10px] ml-auto">Team</Badge>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-1">
              {messages.map((m: any) => {
                const isMe = m.sender_id === user?.id;
                const dateKey = format(new Date(m.created_at), 'yyyy-MM-dd');
                const showDate = dateKey !== lastDate;
                lastDate = dateKey;
                return (
                  <div key={m.id}>
                    {showDate && <DateSeparator date={m.created_at} />}
                    <div className={`flex gap-2.5 py-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-[11px] font-bold text-primary">
                        {getSenderName(m.sender_id).charAt(0)}
                      </div>
                      <div className={`max-w-[70%]`}>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[12px] font-medium text-foreground">{getSenderName(m.sender_id)}</span>
                          <span className="text-[10px] text-muted-foreground/40">{format(new Date(m.created_at), 'h:mm a')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{m.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <Input value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder="Message the team..." onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()} className="flex-1" />
              <Button size="icon" onClick={handleSend} disabled={!msgInput.trim()}><Send className="h-4 w-4" /></Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
