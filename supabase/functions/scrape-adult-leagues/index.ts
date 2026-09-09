// Imports Calgary adult league standings + match results (CUSA men's, CWSA women's).
// Both leagues run on RAMP InterActive, which exposes JSON endpoints:
//   /api/leaguegame/getstandings3cached/{aid}/{sid}/{gtid}/{catid}/{did}/0/0
//   /api/leaguegame/get/{aid}/{sid}/{catid}/{did}/{gtid}/0/
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Accept": "text/html,application/json,*/*" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

async function fetchJson<T>(url: string): Promise<T> {
  const txt = await fetchText(url);
  try {
    return JSON.parse(txt) as T;
  } catch {
    throw new Error(`Non-JSON response from ${url}`);
  }
}

interface SeedInfo {
  seasonId: string;
  seasonLabel: string;
  gameTypeId: string;
  divisions: Array<{ catid: string; did: string }>;
}

// Parses the seed division page: current season, "Regular Season" game type,
// and every division linked in the league navigation.
function parseSeed(html: string): SeedInfo {
  const seasonSel = /id="ddlSeason"[\s\S]*?<\/select>/.exec(html)?.[0] ?? "";
  const selected = /<option value="(\d+)"\s+selected="selected"\s*>([^<]*)</.exec(seasonSel);
  let seasonId = selected?.[1] ?? "";
  let seasonLabel = (selected?.[2] ?? "").trim();
  if (!seasonId) {
    const opts = [...seasonSel.matchAll(/<option value="(\d+)"[^>]*>([^<]*)</g)];
    const last = opts[opts.length - 1];
    seasonId = last?.[1] ?? "";
    seasonLabel = (last?.[2] ?? "").trim();
  }

  const gtSel = /id="ddlGameType"[\s\S]*?<\/select>/.exec(html)?.[0] ?? "";
  const gtOpts = [...gtSel.matchAll(/<option value="(\d+)"[^>]*>([^<]*)</g)];
  const regular = gtOpts.find((o) => /regular season/i.test(o[2]));
  const gameTypeId = regular?.[1] ?? gtOpts.find((o) => o[1] !== "0")?.[1] ?? "0";

  const seen = new Set<string>();
  const divisions: Array<{ catid: string; did: string }> = [];
  for (const m of html.matchAll(/\/division\/(\d+)\/(\d+)\/standings/g)) {
    const key = `${m[1]}/${m[2]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    divisions.push({ catid: m[1], did: m[2] });
  }

  return { seasonId, seasonLabel, gameTypeId, divisions };
}

interface StandingRow {
  TeamName: string;
  TID: number;
  DivName: string | null;
  GamesPlayed: number;
  Wins: number;
  Losses: number;
  Ties: number;
  Points: number;
  GF: number;
  GA: number;
}

interface GameRow {
  GID: number;
  homeTID: number;
  awayTID: number;
  HomeTeamName: string;
  AwayTeamName: string;
  homeScore: number | null;
  awayScore: number | null;
  completed: boolean;
  eDateString?: string | null;
  ArenaName?: string | null;
  CategoryName?: string | null;
  HomeDivision?: string | null;
  rawDate?: string | null;
  gameDate?: string | null;
}

function cleanTeamName(n: string): string {
  return (n || "").replace(/\s*\(\d+\)\s*$/, "").trim();
}

function toIsoDate(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const d = new Date(v);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  {
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await authClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;
    const { data: isCoach } = await supabase.rpc("has_role", { _user_id: userId, _role: "coach" });
    const { data: isDirector } = await supabase.rpc("has_role", { _user_id: userId, _role: "director" });
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    const profileAllowed = profile?.role === "coach" || profile?.role === "director";
    if (!isCoach && !isDirector && !profileAllowed) {
      return new Response(JSON.stringify({ ok: false, error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  }

  let onlyLeague: string | null = null;
  try {
    const body = await req.json();
    if (body && typeof body.league_id === "string") onlyLeague = body.league_id;
  } catch {
    // no body — refresh everything
  }

  try {
    let q = supabase.from("adult_leagues").select("*").order("display_order");
    if (onlyLeague) q = q.eq("id", onlyLeague);
    const { data: leagues, error: lErr } = await q;
    if (lErr) throw lErr;

    const summary: Array<Record<string, unknown>> = [];

    for (const league of leagues || []) {
      let divisionsScraped = 0;
      let rowsUpserted = 0;
      try {
        const seedHtml = await fetchText(league.seed_url);
        const seed = parseSeed(seedHtml);
        if (!seed.seasonId || seed.divisions.length === 0) {
          throw new Error("Could not read season or divisions from league site");
        }

        await supabase
          .from("adult_leagues")
          .update({
            season_id: seed.seasonId,
            season_label: seed.seasonLabel,
            game_type_id: seed.gameTypeId,
          })
          .eq("id", league.id);

        for (let i = 0; i < seed.divisions.length; i++) {
          const div = seed.divisions[i];
          const standings = await fetchJson<StandingRow[]>(
            `${league.site_url}/api/leaguegame/getstandings3cached/${league.association_id}/${seed.seasonId}/${seed.gameTypeId}/${div.catid}/${div.did}/0/0`,
          );
          if (!Array.isArray(standings) || standings.length === 0) continue;

          const divName = standings.find((s) => s.DivName)?.DivName || `Division ${div.did}`;

          const { data: divRow, error: dErr } = await supabase
            .from("adult_divisions")
            .upsert(
              {
                league_id: league.id,
                external_did: div.did,
                external_catid: div.catid,
                name: divName,
                display_order: i,
              },
              { onConflict: "league_id,external_did" },
            )
            .select("id")
            .single();
          if (dErr) throw dErr;
          const divisionId = divRow.id as string;
          divisionsScraped++;

          // Teams
          const teamPayload = standings.map((s) => ({
            league_id: league.id,
            division_id: divisionId,
            external_tid: String(s.TID),
            name: cleanTeamName(s.TeamName),
          }));
          const { data: teams, error: tErr } = await supabase
            .from("adult_teams")
            .upsert(teamPayload, { onConflict: "league_id,external_tid" })
            .select("id, external_tid");
          if (tErr) throw tErr;
          const teamByExt = new Map((teams || []).map((t) => [t.external_tid, t.id]));

          // Standings, ranked by points then goal difference then goals for
          const sorted = [...standings].sort((a, b) => {
            const pd = (b.Points ?? 0) - (a.Points ?? 0);
            if (pd !== 0) return pd;
            const gdd = ((b.GF ?? 0) - (b.GA ?? 0)) - ((a.GF ?? 0) - (a.GA ?? 0));
            if (gdd !== 0) return gdd;
            return (b.GF ?? 0) - (a.GF ?? 0);
          });
          const standingsPayload = sorted
            .map((s, idx) => ({
              league_id: league.id,
              division_id: divisionId,
              team_id: teamByExt.get(String(s.TID)),
              season_id: seed.seasonId,
              rank: idx + 1,
              gp: s.GamesPlayed ?? 0,
              w: s.Wins ?? 0,
              l: s.Losses ?? 0,
              t: s.Ties ?? 0,
              pts: s.Points ?? 0,
              gf: s.GF ?? 0,
              ga: s.GA ?? 0,
              gd: (s.GF ?? 0) - (s.GA ?? 0),
              scraped_at: new Date().toISOString(),
            }))
            .filter((r) => r.team_id);

          const { error: sErr } = await supabase
            .from("adult_standings")
            .upsert(standingsPayload, { onConflict: "division_id,team_id" });
          if (sErr) throw sErr;
          rowsUpserted += standingsPayload.length;

          // Match results (real goals scored, straight from the league site)
          try {
            const games = await fetchJson<GameRow[]>(
              `${league.site_url}/api/leaguegame/get/${league.association_id}/${seed.seasonId}/${div.catid}/${div.did}/${seed.gameTypeId}/0/`,
            );
            if (Array.isArray(games) && games.length > 0) {
              const gamePayload = games.map((g) => ({
                league_id: league.id,
                division_id: divisionId,
                game_key: `${league.id}-${g.GID}`,
                home_team_id: teamByExt.get(String(g.homeTID)) || null,
                away_team_id: teamByExt.get(String(g.awayTID)) || null,
                home_team_name: cleanTeamName(g.HomeTeamName),
                away_team_name: cleanTeamName(g.AwayTeamName),
                home_score: g.completed ? (g.homeScore ?? 0) : null,
                away_score: g.completed ? (g.awayScore ?? 0) : null,
                match_date:
                  toIsoDate(g.eDateString) ?? toIsoDate(g.gameDate) ?? toIsoDate(g.rawDate),
                venue: g.ArenaName ?? null,
                played: !!g.completed,
                scraped_at: new Date().toISOString(),
              }));
              const { error: gErr } = await supabase
                .from("adult_match_results")
                .upsert(gamePayload, { onConflict: "game_key" });
              if (gErr) throw gErr;
              rowsUpserted += gamePayload.length;
            }
          } catch (gameErr) {
            console.error(`Game import failed for ${league.id}/${div.did}`, gameErr);
          }
        }

        summary.push({
          league: league.id,
          status: "success",
          divisions: divisionsScraped,
          rows: rowsUpserted,
          season: seed.seasonLabel,
        });
        await supabase.from("adult_scrape_runs").insert({
          league_id: league.id,
          status: "success",
          divisions_scraped: divisionsScraped,
          rows_upserted: rowsUpserted,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        summary.push({ league: league.id, status: "error", error: msg });
        await supabase.from("adult_scrape_runs").insert({
          league_id: league.id,
          status: "error",
          divisions_scraped: divisionsScraped,
          rows_upserted: rowsUpserted,
          error_message: msg,
        });
      }
    }

    return new Response(JSON.stringify({ ok: true, summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
