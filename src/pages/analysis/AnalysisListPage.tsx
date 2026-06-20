import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Video, Eye, Trash2, Loader2 } from "lucide-react";
import { MatchRow, statusStyles } from "@/lib/videoApi";

export default function AnalysisListPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load matches");
    else setMatches((data as MatchRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("matches").delete().eq("id", id);
    if (error) toast.error("Failed to delete match");
    else {
      toast.success("Match deleted");
      setMatches((m) => m.filter((x) => x.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Video Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload match footage and review AI-tracked player stats.
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard/analysis/upload")}>
          <Plus className="h-4 w-4" /> Upload Match
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Video className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground">No matches yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Upload your first match video to start analyzing player performance.
            </p>
            <Button className="mt-5" onClick={() => navigate("/dashboard/analysis/upload")}>
              <Plus className="h-4 w-4" /> Upload Match
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium text-foreground">{m.name}</TableCell>
                  <TableCell className="text-muted-foreground">{m.date}</TableCell>
                  <TableCell className="text-muted-foreground">{m.team || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${statusStyles[m.status]}`}>
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => navigate(`/dashboard/analysis/${m.id}`)}
                      >
                        <Eye className="h-4 w-4" /> View
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this match?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This permanently removes "{m.name}" along with its tracks and stats.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(m.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
