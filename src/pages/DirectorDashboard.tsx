import { motion } from 'framer-motion';
import { Users, Shield, TrendingUp, Trophy, Activity, Star, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDirectorStats } from '@/hooks/useDirectorData';
import { useNavigate } from 'react-router-dom';
import { exportToCSV } from '@/lib/exportUtils';

export default function DirectorDashboard() {
  const { data: stats, isLoading } = useDirectorStats();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  const metrics = [
    { label: 'Total Players', value: stats?.totalPlayers || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Total Teams', value: stats?.totalTeams || 0, icon: Shield, color: 'text-emerald-500' },
    { label: 'Active (30d)', value: stats?.activePlayers || 0, icon: Activity, color: 'text-amber-500' },
    { label: 'Avg CPI', value: stats?.avgCPI || 0, icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Top Ranked', value: stats?.topRanked?.name || '—', icon: Trophy, color: 'text-yellow-500', sub: stats?.topRanked ? `CPI: ${stats.topRanked.rating}` : '' },
    { label: 'Most Improved', value: stats?.mostImproved?.name || '—', icon: Star, color: 'text-rose-500' },
  ];

  const handleExport = () => {
    if (!stats?.players) return;
    exportToCSV(stats.players.map(p => ({
      name: p.name,
      position: p.position,
      team: p.team,
      age_group: p.age_group,
      overall_rating: p.overall_rating,
    })), 'camino-club-players.csv');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Club Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">High-level performance analytics for your academy</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <m.icon className={`h-4 w-4 ${m.color}`} />
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{m.label}</span>
                </div>
                <p className="text-lg font-bold text-foreground truncate">{m.value}</p>
                {m.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{m.sub}</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(stats?.activePlayers || 0) < (stats?.totalPlayers || 0) && (
              <div className="flex items-center gap-2 text-sm p-2 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <Activity className="h-4 w-4" />
                {(stats?.totalPlayers || 0) - (stats?.activePlayers || 0)} players have been inactive for 30+ days
              </div>
            )}
            {stats?.totalTeams === 0 && (
              <div className="flex items-center gap-2 text-sm p-2 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-400">
                <Shield className="h-4 w-4" />
                No teams registered yet. Head to Teams to create your first team.
              </div>
            )}
            {(stats?.totalPlayers || 0) > 0 && (
              <div className="flex items-center gap-2 text-sm p-2 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                Club average CPI is {stats?.avgCPI}. {stats?.topRanked?.name} leads the rankings.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { title: 'Teams', desc: 'Manage teams & performance', path: '/dashboard/director/teams', icon: Shield },
          { title: 'Players', desc: 'Development insights & exports', path: '/dashboard/director/players', icon: Users },
          { title: 'Coaches', desc: 'Manage & verify coaches', path: '/dashboard/director/coaches', icon: Star },
        ].map(item => (
          <Card key={item.title} className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30" onClick={() => navigate(item.path)}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
