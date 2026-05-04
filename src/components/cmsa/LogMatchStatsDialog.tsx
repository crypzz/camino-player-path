import { useState, useMemo } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCMSAStandings } from "@/hooks/useCMSAStandings";
import { useLogMatchStats, LogMatchEntry } from "@/hooks/useCMSAPlayerStats";

export function LogMatchStatsDialog({ ageGroupId }: { ageGroupId: string }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { data: standings = [] } = useCMSAStandings(ageGroupId);
  const log = useLogMatchStats();

  const [teamId, setTeamId] = useState("");
  const [matchDate, setMatchDate] = useState(new Date().toISOString().slice(0, 10));
  const [opponent, setOpponent] = useState("");
  const [entries, setEntries] = useState<LogMatchEntry[]>([
    { player_name: "", goals: 0, assists: 0, played: true },
  ]);

  const teamOptions = useMemo(
    () => standings.map(s => ({ id: s.team_id, name: s.cmsa_teams?.name || "—", tier: s.tier, age: s.age_group_id })),
    [standings]
  );
  const selectedTeam = teamOptions.find(t => t.id === teamId);

  function updateEntry(i: number, patch: Partial<LogMatchEntry>) {
    setEntries(prev => prev.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  }

  async function submit() {
    if (!selectedTeam) {
      toast({ title: "Pick a team", variant: "destructive" });
      return;
    }
    try {
      await log.mutateAsync({
        team_id: selectedTeam.id,
        age_group_id: selectedTeam.age,
        tier: selectedTeam.tier,
        match_date: matchDate,
        opponent: opponent.trim() || null,
        entries,
      });
      toast({ title: "Match stats logged", description: "Top Scorers leaderboard updated." });
      setOpen(false);
      setEntries([{ player_name: "", goals: 0, assists: 0, played: true }]);
      setOpponent("");
    } catch (e) {
      toast({
        title: "Failed to log stats",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Log Match Stats
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Match Stats</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Team</Label>
            <Select value={teamId} onValueChange={setTeamId}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select your team" /></SelectTrigger>
              <SelectContent>
                {teamOptions.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} <span className="text-muted-foreground ml-1">· {t.tier}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Match date</Label>
              <Input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} className="h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Opponent (optional)</Label>
              <Input value={opponent} onChange={e => setOpponent(e.target.value)} className="h-9 text-sm" />
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs">Players</Label>
              <Button
                variant="ghost" size="sm"
                onClick={() => setEntries(p => [...p, { player_name: "", goals: 0, assists: 0, played: true }])}
                className="h-7 text-xs gap-1"
              >
                <Plus className="h-3 w-3" /> Add player
              </Button>
            </div>
            <div className="grid grid-cols-[1fr_60px_60px_24px] gap-2 px-1 pb-1 text-[10px] uppercase text-muted-foreground tracking-wider">
              <span>Name</span>
              <span className="text-center">Goals</span>
              <span className="text-center">Assists</span>
              <span></span>
            </div>
            <div className="space-y-2">
              {entries.map((e, i) => (
                <div key={i} className="grid grid-cols-[1fr_60px_60px_24px] gap-2 items-center">
                  <Input
                    placeholder="Player name"
                    value={e.player_name}
                    maxLength={80}
                    onChange={ev => updateEntry(i, { player_name: ev.target.value })}
                    className="h-8 text-sm"
                  />
                  <Input
                    type="number" min={0} max={20}
                    value={e.goals}
                    onChange={ev => updateEntry(i, { goals: Math.max(0, parseInt(ev.target.value) || 0) })}
                    className="h-8 text-sm text-center"
                  />
                  <Input
                    type="number" min={0} max={20}
                    value={e.assists}
                    onChange={ev => updateEntry(i, { assists: Math.max(0, parseInt(ev.target.value) || 0) })}
                    className="h-8 text-sm text-center"
                  />
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => setEntries(p => p.filter((_, idx) => idx !== i))}
                    disabled={entries.length === 1}
                    className="h-7 w-7"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={submit} disabled={log.isPending}>
              {log.isPending && <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />}
              Log stats
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Names are public but shown abbreviated (first name + last initial). Full name visible only to you.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
