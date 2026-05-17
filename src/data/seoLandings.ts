// SEO landing page content. Each entry powers a /solutions/[slug] page
// and, when region is set, a /[region]/[city]/[slug] variant.

export interface SeoFeature {
  title: string;
  body: string;
}

export interface SeoFAQ {
  q: string;
  a: string;
}

export interface SeoLandingContent {
  slug: string;
  keyword: string;            // canonical keyword phrase
  // Meta
  title: string;              // <60 chars incl. brand
  description: string;        // <160 chars
  h1: string;
  kicker: string;             // small label above H1
  subhead: string;            // 1–2 sentences under H1
  // Body
  intro: string;
  features: SeoFeature[];
  faqs: SeoFAQ[];
  ctaHeadline: string;
  ctaSub: string;
}

const BRAND = 'Camino';

export const SEO_LANDINGS: Record<string, SeoLandingContent> = {
  'soccer-club-management-software': {
    slug: 'soccer-club-management-software',
    keyword: 'soccer club management software',
    title: `Soccer Club Management Software | ${BRAND}`,
    description:
      'Camino is soccer club management software for academies, coaches, and directors. Track player development, evaluate performance, and manage your roster in one place.',
    h1: 'Soccer club management software, built for the modern academy.',
    kicker: 'For clubs & academies',
    subhead:
      'Roster, evaluations, fitness testing, and a verified player passport — in one platform your coaches will actually use.',
    intro:
      'Most club software was built to collect fees, not develop players. Camino is the opposite: a soccer club management platform built around the player development pathway, with the admin layer your directors need on top.',
    features: [
      {
        title: 'A single roster across every team',
        body:
          'Manage every age group, coach, and player from one director view. Move players between teams, track attendance, and see how each squad is trending — without juggling spreadsheets.',
      },
      {
        title: 'Standardized evaluations across coaches',
        body:
          'Every coach evaluates against the same 23-attribute framework. The result: one composite player index (CPI) that means the same thing across U-10 and U-18, across coaches, across seasons.',
      },
      {
        title: 'Fitness testing that actually informs decisions',
        body:
          'Log sprint, agility, and endurance results once. Camino maps raw numbers to age-banded benchmarks and feeds them into the player passport automatically.',
      },
      {
        title: 'A player passport directors can share',
        body:
          'Every player gets a verified profile that follows them through your academy — and that you can share externally when the time comes. Built for serious clubs, not pay-to-play.',
      },
    ],
    faqs: [
      {
        q: 'How is this different from team management software?',
        a: 'Team management apps handle scheduling and payments. Camino does player development — evaluations, fitness data, video, and a composite player index across your whole club.',
      },
      {
        q: 'Do coaches need to learn a new system?',
        a: 'Coaches use a single mobile-first dashboard. Evaluations take under 90 seconds per player and feed the rest of the platform automatically.',
      },
      {
        q: 'Can directors see across all teams?',
        a: 'Yes. The director view consolidates every team, coach, and player into one leaderboard so you can spot rising talent and underperforming squads at a glance.',
      },
      {
        q: 'Is Camino available outside Calgary?',
        a: 'We are onboarding Calgary clubs first. Clubs elsewhere can join the waitlist — we add new regions monthly.',
      },
    ],
    ctaHeadline: 'See Camino in your club.',
    ctaSub: 'Join the waitlist. Calgary clubs onboarded first; new regions added monthly.',
  },

  'football-academy-software': {
    slug: 'football-academy-software',
    keyword: 'football academy software',
    title: `Football Academy Software | ${BRAND}`,
    description:
      'Camino is football academy software for player development. Evaluations, fitness testing, video analysis, and a verified player passport — one platform, every team.',
    h1: 'Football academy software, designed around player development.',
    kicker: 'For football academies',
    subhead:
      'Standardize evaluations, track fitness, analyze match film, and give every player a verified passport — across every age group in your academy.',
    intro:
      'Camino is a football academy platform built for serious development environments. It replaces the patchwork of spreadsheets, group chats, and standalone tools with one system that follows a player from U-10 to the senior squad.',
    features: [
      {
        title: 'One framework across every age group',
        body:
          'Camino uses a single 23-attribute evaluation framework so U-12 scores are comparable to U-18 scores — and so coaches across your academy speak the same language.',
      },
      {
        title: 'AI-assisted video analysis',
        body:
          'Upload match film, tag events, and let Camino surface key moments. Evidence-backed feedback replaces "you played well today."',
      },
      {
        title: 'Verified player profiles',
        body:
          'Every player carries a passport verified by their coaches — touches, evaluations, fitness, video clips. The kind of profile scouts actually trust.',
      },
      {
        title: 'Built for directors of football',
        body:
          'See your full academy in one leaderboard. Filter by age group, position, or attribute. Identify the next first-team callup with data, not vibes.',
      },
    ],
    faqs: [
      {
        q: 'Is Camino designed for academies or recreational clubs?',
        a: 'Academies and competitive clubs. The depth of the evaluation framework and fitness tracking is overkill for purely recreational programs.',
      },
      {
        q: 'What does the player passport include?',
        a: 'CPI score, attribute breakdown, fitness benchmarks, evaluation history, video clips, and match stats — all verified by the coaches who entered them.',
      },
      {
        q: 'Do I need expensive hardware to do video analysis?',
        a: 'No. Upload phone footage of a match. Camino handles the AI tagging server-side.',
      },
    ],
    ctaHeadline: 'Bring Camino into your academy.',
    ctaSub: 'Join the waitlist for early access. We onboard new academies on a rolling basis.',
  },

  'youth-soccer-app': {
    slug: 'youth-soccer-app',
    keyword: 'youth soccer app',
    title: `Youth Soccer App for Players & Parents | ${BRAND}`,
    description:
      'Camino is a youth soccer app that gives every player a verified profile, real rankings, and a path to the next level. Trusted by serious clubs.',
    h1: 'The youth soccer app that takes your kid seriously.',
    kicker: 'For players & parents',
    subhead:
      'Real rankings. A verified profile coaches sign off on. The kind of player passport that follows your kid all the way up.',
    intro:
      'Most youth soccer apps stop at the schedule. Camino is built for the player who wants to know — with data — where they actually stand, and the parent who wants to see real progress instead of participation trophies.',
    features: [
      {
        title: 'A real, verified leaderboard',
        body:
          'Players climb a single ranking based on coach evaluations, fitness, and match performance. No pay-to-win, no inflated scores.',
      },
      {
        title: 'A player passport coaches verify',
        body:
          'Every stat, evaluation, and clip is signed off by the coach who entered it. The profile your kid shares with the next club actually holds up.',
      },
      {
        title: 'Progress you can see, not guess',
        body:
          'Weekly progress reports. Attribute-by-attribute trend lines. A composite player index (CPI) updated as your kid improves.',
      },
      {
        title: 'Designed for serious players',
        body:
          'Camino is for the kid who treats this like the path to a future, and the family supporting that path.',
      },
    ],
    faqs: [
      {
        q: 'Is the app free for players?',
        a: 'Yes — during early access, players and parents in onboarded clubs get full access at no cost.',
      },
      {
        q: 'Does my club need to use Camino for it to work for me?',
        a: 'The verified passport works best when your club is on Camino. Join the waitlist and we will reach out to your club too.',
      },
      {
        q: 'Is my child\'s data private?',
        a: 'Yes. Profiles are private by default. Parents and players control what is visible externally.',
      },
    ],
    ctaHeadline: 'Give your player a real profile.',
    ctaSub: 'Join the waitlist. We are onboarding Calgary families and clubs first.',
  },

  'player-development-platform': {
    slug: 'player-development-platform',
    keyword: 'player development platform',
    title: `Player Development Platform for Soccer | ${BRAND}`,
    description:
      'Camino is the player development platform for soccer academies. One framework, one score, every player tracked from U-10 to first team.',
    h1: 'The player development platform serious clubs run on.',
    kicker: 'The Camino platform',
    subhead:
      'One framework. One composite index. Every evaluation, fitness test, and clip rolling up into a single player passport.',
    intro:
      'A real player development platform connects evaluations, fitness data, video, and a verified player profile into one pathway — and gives directors a way to see across the whole academy. That is what Camino does.',
    features: [
      {
        title: 'The Composite Player Index (CPI)',
        body:
          'A 0–100 score across 23 technical, tactical, physical, and mental attributes. One number that means the same thing across every age group, coach, and season.',
      },
      {
        title: 'Closed-loop development cycle',
        body:
          'Evaluate → benchmark → coach → re-evaluate. Camino tracks every loop so improvement is measured, not assumed.',
      },
      {
        title: 'A passport that travels with the player',
        body:
          'When a player moves up to your senior squad — or out to a new club — their full Camino profile travels with them. Verified, complete, theirs.',
      },
      {
        title: 'Built for the long game',
        body:
          'Camino is not a one-season tool. It compounds value as your academy builds years of standardized data.',
      },
    ],
    faqs: [
      {
        q: 'How is the CPI calculated?',
        a: 'A weighted composite across 23 attributes grouped into technical, tactical, physical, and mental. Coaches evaluate against the framework; Camino calculates the score.',
      },
      {
        q: 'How long until the data is useful?',
        a: 'You get useful insights after the first round of evaluations and one fitness test. Trend value compounds over months and seasons.',
      },
      {
        q: 'Do you integrate with existing tools?',
        a: 'Camino replaces most of them. We are open to specific integrations for clubs onboarded during early access — ask us.',
      },
    ],
    ctaHeadline: 'Run your academy on Camino.',
    ctaSub: 'Join the waitlist. Limited onboarding spots — Calgary first.',
  },
};

export interface RegionContent {
  region: string;             // url slug e.g. 'ca'
  city: string;               // url slug e.g. 'calgary'
  cityLabel: string;          // 'Calgary'
  regionLabel: string;        // 'Canada'
  proximityLine: string;      // shown on page
}

export const REGIONS: Record<string, RegionContent> = {
  'ca/calgary': {
    region: 'ca',
    city: 'calgary',
    cityLabel: 'Calgary',
    regionLabel: 'Canada',
    proximityLine:
      'Camino is onboarding Calgary clubs first — including academies across the CMSA pyramid.',
  },
};

/** Build a regionalized variant of a SEO landing content block. */
export function regionalize(
  base: SeoLandingContent,
  region: RegionContent
): SeoLandingContent {
  const cityKeyword = `${base.keyword} in ${region.cityLabel}`;
  return {
    ...base,
    slug: `${region.region}/${region.city}/${base.slug}`,
    keyword: cityKeyword,
    title: `${base.keyword.replace(/\b\w/g, (c) => c.toUpperCase())} in ${region.cityLabel} | ${BRAND}`,
    description: `${base.description.replace(/\.$/, '')} Now onboarding clubs in ${region.cityLabel}, ${region.regionLabel}.`,
    h1: `${base.h1.replace(/\.$/, '')} — built for ${region.cityLabel}.`,
    kicker: `${base.kicker} · ${region.cityLabel}`,
    subhead: `${base.subhead} ${region.proximityLine}`,
    ctaSub: `${base.ctaSub} Reach out and we will prioritize ${region.cityLabel} ${region.regionLabel} clubs.`,
  };
}
