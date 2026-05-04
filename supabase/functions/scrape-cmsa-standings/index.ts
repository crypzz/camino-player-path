// Scrapes CMSA / Demosphere standings tables and upserts into our DB.
// Public endpoint — anyone can trigger a refresh; data is already public.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

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
  if (!v) return 0;
  const n = parseInt(v.replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function parseStandings(html: string): ParsedRow[] {
  const dom = new DOMParser().parseFromString(html, "text/html");
  const rows: ParsedRow[] = [];
  let currentTier = "Unknown";

  // Walk every <tr> in document order so we can track tier headers
  const trs = dom.querySelectorAll("tr");
  for (const tr of trs as unknown as Element[]) {
    const cells = tr.querySelectorAll("td, th");
    const texts = Array.from(cells as unknown as Element[]).map((c) =>
      (c.textContent || "").replace(/\s+/g, " ").trim()
    );

    // Tier header row pattern: ["Boys U13 Tier 1","GP","W","T","L","Pts","GF","GA","GD"]
    if (texts.length >= 9 && texts[1] === "GP" && texts[2] === "W") {
      currentTier = texts[0] || currentTier;
      continue;
    }

    // Data row pattern: ["1.","TeamName",GP,W,T,L,Pts,GF,GA,GD]
    if (texts.length >= 10 && /^\d+\.?$/.test(texts[0])) {
      const link = (cells[1] as Element)?.querySelector?.("a");
      const href = link?.getAttribute("href") || "";
      const external_id = href.split("/").filter(Boolean).pop() || `${currentTier}::${texts[1]}`;

      // Skip rows with no games played ("-" in stats)
      if (texts[2] === "-") {
        rows.push({
          external_id,
          team_name: texts[1],
          tier: currentTier,
          rank: parseInt(texts[0], 10) || null,
          gp: 0, w: 0, t: 0, l: 0, pts: 0, gf: 0, ga: 0, gd: 0,
        });
        continue;
      }

      rows.push({
        external_id,
        team_name: texts[1],
        tier: currentTier,
        rank: parseInt(texts[0], 10) || null,
        gp: num(texts[2]),
        w: num(texts[3]),
        t: num(texts[4]),
        l: num(texts[5]),
        pts: num(texts[6]),
        gf: num(texts[7]),
        ga: num(texts[8]),
        gd: num(texts[9]),
      });
    }
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
          headers: { "User-Agent": "Mozilla/5.0 (compatible; CaminoBot/1.0)" },
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
