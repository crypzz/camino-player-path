import { Users, TrendingUp, AlertTriangle, Download, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRankings } from '@/hooks/useRankings';
import { useDirectorStats } from '@/hooks/useDirectorData';
import { exportToCSV, exportPlayerReportPDF } from '@/lib/exportUtils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

export default function DirectorPlayersPage() {
  const { data: players = [] } = useRankings();
  const { data: stats } = useDirectorStats();

  // Top 10 most improved
  const mostImproved = [...players].sort((a, b) => b.improvementScore - a.improvementScore).slice(0, 10);

  // Inactive players (not in active set — low consistency)
  const inactive = [...players].sort((a, b) => a.consistencyScore - b.consistencyScore).slice(0, 5);

  // Mock CPI trend data
  const trendData = [
    { month: 'Jan', cpi: (stats?.avgCPI || 50) - 8 },
    { month: 'Feb', cpi: (stats?.avgCPI || 50) - 5 },
    { month: 'Mar', cpi: (stats?.avgCPI || 50) - 3 },
    { month: 'Apr', cpi: (stats?.avgCPI || 50) - 1 },
    { month: 'May', cpi: stats?.avgCPI || 50 },
    { month: 'Jun', cpi: (stats?.avgCPI || 50) + 1 },
  ];

  const chartConfig = { cpi: { label: 'CPI', color: 'hsl(var(--primary))' } };

  const handleExportAll = () => {
    exportToCSV(players.map(p => ({
      name: p.name, position: p.position, team: p.team,
      age_group: p.age_group, ranking_score: p.rankingScore.toFixed(1),
      cpi: p.overall_rating,
    })), 'camino-all-players.csv');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" /> Player Development Insights
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track growth, flag inactivity, export reports</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportAll}>
          <Download className="h-4 w-4 mr-1" /> Export All Players
        </Button>
      </div>

      {/* CPI Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Club Average CPI Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <LineChart data={trendData}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} domain={['dataMin - 5', 'dataMax + 5']} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="cpi" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Most Improved */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Top 10 Most Improved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {mostImproved.map((p, i) => {
                const initials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <div key={p.id} className="flex items-center gap-3 py-2">
                    <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                    <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] bg-emerald-500/10 text-emerald-600">{initials}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.team}</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">+{(p.improvementScore * 100).toFixed(0)}%</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => exportPlayerReportPDF({ name: p.name, position: p.position, team: p.team, overall_rating: p.overall_rating })}>
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
              {mostImproved.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No data yet</p>}
            </div>
          </CardContent>
        </Card>

        {/* Inactive / Flagged */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Least Active Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {inactive.map((p) => {
                const initials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <div key={p.id} className="flex items-center gap-3 py-2">
                    <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] bg-amber-500/10 text-amber-600">{initials}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.team} · {p.age_group}</p>
                    </div>
                    <span className="text-xs text-amber-600 font-medium">Low activity</span>
                  </div>
                );
              })}
              {inactive.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No data yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
