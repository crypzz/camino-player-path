import { useState, useEffect, useRef } from 'react';
import { useConversations, useMessages, useSendMessage, useCreateConversation, useAllProfiles } from '@/hooks/useCommunications';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Plus, User } from 'lucide-react';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

export function MessagesTab() {
  const { user } = useAuth();
  const { data: conversations = [], isLoading } = useConversations();
  const { data: profiles = [] } = useAllProfiles();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: messages = [] } = useMessages(selectedId);
  const sendMutation = useSendMessage();
  const createConvo = useCreateConversation();
  const [msgInput, setMsgInput] = useState('');
  const [newConvoOpen, setNewConvoOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();

  // Realtime subscription for messages
  useEffect(() => {
    if (!selectedId) return;
    const channel = supabase
      .channel(`messages-${selectedId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedId}` },
        () => { qc.invalidateQueries({ queryKey: ['messages', selectedId] }); }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedId, qc]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const directConvos = conversations.filter((c: any) => c.type === 'direct');

  const getOtherName = (convo: any) => {
    const otherId = convo.conversation_participants?.find((p: any) => p.user_id !== user?.id)?.user_id;
    const profile = profiles.find((p: any) => p.user_id === otherId);
    return profile?.display_name || 'Unknown';
  };

  const handleSend = async () => {
    if (!msgInput.trim() || !selectedId) return;
    await sendMutation.mutateAsync({ conversation_id: selectedId, content: msgInput.trim() });
    setMsgInput('');
  };

  const handleNewConvo = async () => {
    if (!selectedUser) return;
    try {
      const data = await createConvo.mutateAsync({ type: 'direct', participant_ids: [selectedUser], title: null as any });
      setSelectedId(data.id);
      setNewConvoOpen(false);
      setSelectedUser('');
    } catch { }
  };

  const getSenderName = (senderId: string) => {
    if (senderId === user?.id) return 'You';
    const p = profiles.find((p: any) => p.user_id === senderId);
    return p?.display_name || 'Unknown';
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="flex gap-4 h-[calc(100vh-16rem)] min-h-[400px]">
      {/* Sidebar */}
      <div className="w-72 shrink-0 flex flex-col">
        <Dialog open={newConvoOpen} onOpenChange={setNewConvoOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="mb-3 gap-2 w-full"><Plus className="h-3.5 w-3.5" /> New Message</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Conversation</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger><SelectValue placeholder="Select a user" /></SelectTrigger>
                <SelectContent>
                  {profiles.filter((p: any) => p.user_id !== user?.id).map((p: any) => (
                    <SelectItem key={p.user_id} value={p.user_id}>{p.display_name || 'Unnamed'} ({p.role})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleNewConvo} disabled={!selectedUser} className="w-full">Start Conversation</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex-1 overflow-auto space-y-1">
          {directConvos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No conversations yet</p>
          ) : directConvos.map((c: any) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm flex items-center gap-2.5 ${selectedId === c.id ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-[13px]">{getOtherName(c)}</p>
                <p className="text-[11px] text-muted-foreground/60">{format(new Date(c.updated_at), 'MMM d')}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <Card className="flex-1 flex flex-col">
        {!selectedId ? (
          <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center"><MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" /><p className="text-sm">Select a conversation</p></div>
          </CardContent>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {messages.map((m: any) => {
                const isMe = m.sender_id === user?.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-3.5 py-2 rounded-2xl text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-accent text-foreground rounded-bl-md'}`}>
                      {!isMe && <p className="text-[11px] font-medium mb-0.5 opacity-70">{getSenderName(m.sender_id)}</p>}
                      <p className="whitespace-pre-wrap">{m.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/60' : 'text-muted-foreground/50'}`}>{format(new Date(m.created_at), 'h:mm a')}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <Input
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSend} disabled={!msgInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
