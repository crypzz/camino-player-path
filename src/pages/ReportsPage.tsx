import { mockPlayers } from '@/data/mockPlayers';
import { motion } from 'framer-motion';
import { FileText, Download, ChevronRight, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CPIScoreDisplay } from '@/components/CPIScoreDisplay';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const allReports = mockPlayers.flatMap(p => p.reports.map(r => ({ ...r, player: p })));
  const selectedReport = allReports.find(r => r.id === selectedReportId);

  const handleExportPDF = () => {
    toast.success('PDF report exported (demo)');
  };

  if (selectedReport) {
    const { player } = selectedReport;
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <button onClick={() => setSelectedReportId(null)} className="text-xs text-muted-foreground hover:text-primary mb-2 flex items-center gap-1">
              ← Back to Reports
            </button>
            <h1 className="text-2xl font-display font-bold text-foreground">{player.name} – {selectedReport.quarter}</h1>
            <p className="text-muted-foreground text-sm mt-1">Generated on {new Date(selectedReport.date).toLocaleDateString()}</p>
          </div>
          <Button onClick={handleExportPDF} variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-3">Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{selectedReport.summary}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Skill Ratings</h3>
              <div className="grid grid-cols-2 gap-4">
                {(['technical', 'tactical', 'physical', 'mental'] as const).map((cat) => (
                  <div key={cat} className="stat-gradient rounded-lg p-3">
                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1 text-center capitalize">{cat}</h4>
                    <PlayerRadarChart player={player} category={cat} />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" /> Improvement Areas
              </h3>
              <ul className="space-y-2">
                {selectedReport.improvementAreas.map((area, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground p-2 rounded-lg bg-accent/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                    {area}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-3">Coach Feedback</h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic">"{selectedReport.coachFeedback}"</p>
              <p className="text-xs text-muted-foreground/60 mt-3">— {selectedReport.coach}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" /> Recommendations
              </h3>
              <ul className="space-y-2">
                {selectedReport.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground p-2 rounded-lg bg-accent/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5 flex justify-center">
              <CPIScoreDisplay player={player} size="md" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-5">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Player Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Position</span><span className="text-foreground">{player.position}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Team</span><span className="text-foreground">{player.team}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Age</span><span className="text-foreground">{player.age}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Nationality</span><span className="text-foreground">{player.nationality}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Attendance</span><span className="text-foreground">{player.attendance}%</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Development Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Quarterly player development reports</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allReports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedReportId(report.id)}
            className="glass-card rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center font-display font-bold text-primary text-sm">
                  {report.player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{report.player.name}</h3>
                  <p className="text-xs text-muted-foreground">{report.quarter} · {report.coach}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-display font-bold">
                  CPI {report.cpiScore}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{report.summary}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
