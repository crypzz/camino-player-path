import { motion } from 'framer-motion';
import { Star, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCoachAssignments, useUpdateCoachStatus, useProfiles } from '@/hooks/useDirectorData';
import { useTeams } from '@/hooks/useDirectorData';
import { toast } from '@/hooks/use-toast';

export default function DirectorCoachesPage() {
  const { data: assignments = [], isLoading } = useCoachAssignments();
  const { data: profiles = [] } = useProfiles();
  const { data: teams = [] } = useTeams();
  const updateStatus = useUpdateCoachStatus();

  // Get coach profiles (role = 'coach')
  const coachProfiles = profiles.filter(p => p.role === 'coach');

  const handleApprove = (id: string) => {
    updateStatus.mutate({ id, status: 'approved' }, {
      onSuccess: () => toast({ title: 'Coach approved' }),
    });
  };

  const handleRemove = (id: string) => {
    updateStatus.mutate({ id, status: 'removed' }, {
      onSuccess: () => toast({ title: 'Coach removed' }),
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'removed': return <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="h-3 w-3 mr-1" />Removed</Badge>;
      default: return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  // Enrich assignments with names
  const enriched = assignments.map(a => {
    const profile = profiles.find(p => p.user_id === a.coach_user_id);
    const team = teams.find(t => t.id === a.team_id);
    return { ...a, coach_name: profile?.display_name || 'Unknown', team_name: team?.name || 'Unassigned' };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Star className="h-6 w-6 text-yellow-500" /> Coach Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">View, approve, and manage coaching staff</p>
      </div>

      {/* All coaches from profiles */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">All Registered Coaches ({coachProfiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {coachProfiles.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No coaches registered yet</p>
          ) : (
            <div className="divide-y divide-border">
              {coachProfiles.map((coach, i) => {
                const initials = (coach.display_name || 'C').split(' ').map(n => n[0]).join('').slice(0, 2);
                const assignment = enriched.find(a => a.coach_user_id === coach.user_id);
                return (
                  <motion.div key={coach.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-3 py-3">
                    <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{coach.display_name || 'Coach'}</p>
                      <p className="text-[11px] text-muted-foreground">{assignment?.team_name || 'No team assigned'}</p>
                    </div>
                    {assignment ? getStatusBadge(assignment.status) : <Badge variant="outline" className="text-muted-foreground">Unassigned</Badge>}
                    {assignment && assignment.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600" onClick={() => handleApprove(assignment.id)}>Approve</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-red-600" onClick={() => handleRemove(assignment.id)}>Remove</Button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending assignments */}
      {enriched.filter(a => a.status === 'pending').length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-amber-600">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {enriched.filter(a => a.status === 'pending').map(a => (
                <div key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{a.coach_name}</p>
                    <p className="text-xs text-muted-foreground">Requesting to join: {a.team_name}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" className="h-7 text-xs" onClick={() => handleApprove(a.id)}>Approve</Button>
                    <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleRemove(a.id)}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
