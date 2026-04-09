import { useState } from 'react';
import { useAnnouncements, useCreateAnnouncement, useMarkAnnouncementRead } from '@/hooks/useCommunications';
import { useAppContext } from '@/context/AppContext';
import { useTeams } from '@/hooks/useDirectorData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Megaphone, Pin, Eye, EyeOff, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function AnnouncementsTab() {
  const { role } = useAppContext();
  const { data: announcements = [], isLoading } = useAnnouncements();
  const { data: teams = [] } = useTeams();
  const createMutation = useCreateAnnouncement();
  const markRead = useMarkAnnouncementRead();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetType, setTargetType] = useState('club');
  const [targetTeam, setTargetTeam] = useState('');
  const [pinned, setPinned] = useState(false);

  const canCreate = role === 'coach' || role === 'director';

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      await createMutation.mutateAsync({
        title, content, target_type: targetType,
        target_team_id: targetTeam || undefined,
        pinned,
      });
      toast.success('Announcement published');
      setOpen(false);
      setTitle(''); setContent(''); setTargetType('club'); setTargetTeam(''); setPinned(false);
    } catch { toast.error('Failed to create announcement'); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-4">
      {canCreate && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Announcement</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Create Announcement</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              <Textarea placeholder="Message..." value={content} onChange={e => setContent(e.target.value)} rows={4} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={targetType} onValueChange={setTargetType}>
                  <SelectTrigger><SelectValue placeholder="Target" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="club">Entire Club</SelectItem>
                    <SelectItem value="team">Specific Team</SelectItem>
                    <SelectItem value="players">Players Only</SelectItem>
                    <SelectItem value="parents">Parents Only</SelectItem>
                  </SelectContent>
                </Select>
                {targetType === 'team' && (
                  <Select value={targetTeam} onValueChange={setTargetTeam}>
                    <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                    <SelectContent>
                      {teams.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} className="rounded border-input" />
                <Pin className="h-3.5 w-3.5" /> Pin this announcement
              </label>
              <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? 'Publishing...' : 'Publish Announcement'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {announcements.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground"><Megaphone className="h-8 w-8 mx-auto mb-3 opacity-40" /><p>No announcements yet</p></CardContent></Card>
      ) : (
        announcements.map((a: any) => (
          <Card key={a.id} className={`transition-colors ${a.pinned ? 'border-primary/30 bg-primary/5' : ''} ${!a.isRead ? 'border-l-2 border-l-primary' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {a.pinned && <Pin className="h-3.5 w-3.5 text-primary" />}
                  <CardTitle className="text-base">{a.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{a.target_type}</Badge>
                  {a.isRead ? <Eye className="h-3.5 w-3.5 text-muted-foreground/40" /> : (
                    <button onClick={() => markRead.mutate(a.id)} title="Mark as read">
                      <EyeOff className="h-3.5 w-3.5 text-primary" />
                    </button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.content}</p>
              <p className="text-[11px] text-muted-foreground/50 mt-3">{format(new Date(a.created_at), 'MMM d, yyyy · h:mm a')}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
