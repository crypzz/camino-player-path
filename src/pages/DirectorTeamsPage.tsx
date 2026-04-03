import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTeams } from '@/hooks/useDirectorData';
import { useRankings } from '@/hooks/useRankings';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { AGE_GROUPS } from '@/lib/constants';

export default function DirectorTeamsPage() {
  const { data: teams = [], isLoading } = useTeams();
  const { data: allPlayers = [] } = useRankings();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamAge, setTeamAge] = useState('');

  const handleCreate = async () => {
    if (!teamName || !user) return;
    const { error } = await supabase.from('teams').insert({ name: teamName, age_group: teamAge || null, created_by: user.id });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Team created' });
    setTeamName('');
    setTeamAge('');
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ['teams'] });
  };

  // Group players by team name for stats
  const teamStats = teams.map(t => {
    const teamPlayers = allPlayers.filter(p => p.team === t.name);
    const avgCPI = teamPlayers.length > 0
      ? teamPlayers.reduce((s, p) => s + p.rankingScore, 0) / teamPlayers.length
      : 0;
    const mostImproved = teamPlayers.sort((a, b) => b.improvementScore - a.improvementScore)[0];
    return { ...t, playerCount: teamPlayers.length, avgCPI: Math.round(avgCPI * 10) / 10, mostImproved: mostImproved?.name || '—' };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-500" /> Team Performance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">All teams across the academy</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Team</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Team</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Input placeholder="Team name" value={teamName} onChange={e => setTeamName(e.target.value)} />
              <Select value={teamAge} onValueChange={setTeamAge}>
                <SelectTrigger><SelectValue placeholder="Age group" /></SelectTrigger>
                <SelectContent>{AGE_GROUPS.map(ag => <SelectItem key={ag} value={ag}>{ag}</SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={handleCreate} className="w-full" disabled={!teamName}>Create Team</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>
      ) : teamStats.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No teams yet. Create your first team above.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamStats.map((team, i) => (
            <motion.div key={team.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center justify-between">
                    {team.name}
                    {team.age_group && <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">{team.age_group}</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Players</span>
                    <span className="font-medium">{team.playerCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> Avg CPI</span>
                    <span className="font-medium">{team.avgCPI}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Most Improved</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400 truncate max-w-[120px]">{team.mostImproved}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
