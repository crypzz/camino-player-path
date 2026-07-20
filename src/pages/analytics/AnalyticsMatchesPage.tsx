import { Link } from "react-router-dom";
import { useAnalyticsMatches } from "@/hooks/useAnalytics";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

const statusIcon = {
  queued: <Clock className="h-3 w-3" />,
  processing: <Loader2 className="h-3 w-3 animate-spin" />,
  done: <CheckCircle2 className="h-3 w-3" />,
  error: <AlertTriangle className="h-3 w-3" />,
};

export default function AnalyticsMatchesPage() {
  const { data, isLoading } = useAnalyticsMatches();
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Match Analytics</h1>
          <p className="text-muted-foreground">Automated player performance from match footage</p>
        </div>
        <Link to="/dashboard/analytics/new">
          <Button><Plus className="mr-2 h-4 w-4" />New Match</Button>
        </Link>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      <div className="grid gap-3">
        {data?.map((m) => (
          <Link key={m.id} to={`/dashboard/analytics/${m.id}`}>
            <Card className="p-4 hover:border-primary transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{m.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {m.home_team || "Home"} vs {m.away_team || "Away"} · {m.match_date || m.created_at.slice(0, 10)}
                  </div>
                </div>
                <Badge variant="outline" className="gap-1">
                  {statusIcon[m.status]}{m.status}
                </Badge>
              </div>
              {m.error_message && <div className="mt-2 text-xs text-destructive">{m.error_message}</div>}
            </Card>
          </Link>
        ))}
        {!isLoading && !data?.length && (
          <Card className="p-8 text-center text-muted-foreground">
            No matches yet. Upload your first game to start.
          </Card>
        )}
      </div>
    </div>
  );
}
