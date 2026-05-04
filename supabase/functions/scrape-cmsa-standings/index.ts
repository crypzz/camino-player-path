// Scrapes CMSA / Demosphere standings tables and upserts into our DB.
// Public endpoint — anyone can trigger a refresh; data is already public.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

interface ParsedRow {
  external_id: string;
  team_name: string;
  tier: string;
  rank: number | null;
  gp: number; w: number; t: number; l: number;
  pts: number; gf: number; ga: number; gd: number;
}

function num(v: string | null | undefined): number {
  if (v == null || v === "" || v === "-") return 0;
  const n = parseInt(String(v).replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

// Demosphere embeds team data inline as JSON-like objects:
// "116593237":{"tm":"116593234","tmnm":"...","tgnm":"Boys U13 Tier 1","rank":"10","TOT_GP":"2",...}
function parseStandings(html: string): ParsedRow[] {
  const rows: ParsedRow[] = [];
  // Match { ... } objects that have tmnm and TOT_PTS
  const re = /"(\d+)"\s*:\s*\{([^{}]*?"tmnm"[^{}]*?"TOT_GD"[^{}]*?)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const external_id = m[1];
    const body = m[2];
    const get = (k: string) => {
      const r = new RegExp(`"${k}"\\s*:\\s*"([^"]*)"`).exec(body);
      return r ? r[1] : "";
    };
    const tmnm = get("tmnm");
    const tgnm = get("tgnm");
    if (!tmnm || !tgnm) continue;
    rows.push({
      external_id,
      team_name: tmnm,
      tier: tgnm,
      rank: num(get("rank")) || null,
      gp: num(get("TOT_GP")),
      w: num(get("TOT_W")),
      t: num(get("TOT_T")),
      l: num(get("TOT_L")),
      pts: num(get("TOT_PTS")),
      gf: num(get("TOT_GF")),
      ga: num(get("TOT_GA")),
      gd: num(get("TOT_GD")),
    });
  }
  return rows;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { data: ageGroups, error: agErr } = await supabase
      .from("cmsa_age_groups")
      .select("id, label, source_url")
      .order("display_order");
    if (agErr) throw agErr;

    const summary: Array<{ age_group: string; rows: number; status: string; error?: string }> = [];
    const seenUrls = new Set<string>();

    for (const ag of ageGroups || []) {
      // Same source URL across multiple age groups → only fetch once, but record one log per ag
      const cacheKey = ag.source_url;
      let rows: ParsedRow[] = [];

      try {
        if (!seenUrls.has(cacheKey)) {
          seenUrls.add(cacheKey);
        }
        const res = await fetch(ag.source_url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://calgaryminorsoccer.com/",
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        rows = parseStandings(html);

        // Filter to rows whose tier label likely matches this age group
        // (e.g. ag "u13_u19" matches all U13-U19; ag "u10" matches "U10")
        const want = ag.id.toUpperCase().replace("_", " - ");
        const filtered = ag.id === "u13_u19"
          ? rows.filter((r) => /U1[3-9]/i.test(r.tier))
          : rows.filter((r) => r.tier.toUpperCase().includes(ag.label.toUpperCase()));

        if (filtered.length === 0) {
          summary.push({ age_group: ag.id, rows: 0, status: "success" });
          await supabase.from("cmsa_scrape_runs").insert({
            age_group_id: ag.id, status: "success", rows_upserted: 0,
          });
          continue;
        }

        // Upsert teams
        const teamPayload = filtered.map((r) => ({
          external_id: r.external_id,
          name: r.team_name,
          age_group_id: ag.id,
          tier: r.tier,
        }));
        const { data: teams, error: tErr } = await supabase
          .from("cmsa_teams")
          .upsert(teamPayload, { onConflict: "external_id" })
          .select("id, external_id");
        if (tErr) throw tErr;

        const idMap = new Map(teams!.map((t) => [t.external_id, t.id]));

        // Upsert standings
        const standingsPayload = filtered.map((r) => ({
          team_id: idMap.get(r.external_id),
          age_group_id: ag.id,
          tier: r.tier,
          rank: r.rank,
          gp: r.gp, w: r.w, t: r.t, l: r.l,
          pts: r.pts, gf: r.gf, ga: r.ga, gd: r.gd,
          scraped_at: new Date().toISOString(),
        })).filter((r) => r.team_id);

        const { error: sErr } = await supabase
          .from("cmsa_standings")
          .upsert(standingsPayload, { onConflict: "team_id,tier" });
        if (sErr) throw sErr;

        summary.push({ age_group: ag.id, rows: standingsPayload.length, status: "success" });
        await supabase.from("cmsa_scrape_runs").insert({
          age_group_id: ag.id, status: "success", rows_upserted: standingsPayload.length,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        summary.push({ age_group: ag.id, rows: 0, status: "error", error: msg });
        await supabase.from("cmsa_scrape_runs").insert({
          age_group_id: ag.id, status: "error", error_message: msg,
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
