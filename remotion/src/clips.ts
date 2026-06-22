// Remote CDN URLs for the AI-generated cinematic soccer footage.
// Stored as big assets (see public/video/*.asset.json) and referenced remotely
// so the binaries don't need to live in the repo.
const BASE = "https://id-preview--1c841d04-207d-448f-9854-ec12a2b4280c.lovable.app";

export const CLIPS = {
  heroPlay: `${BASE}/__l5e/assets-v1/0d083b2a-91c1-4350-bea4-09c9bfdb466b/hero-play.mp4`,
  scoutMissed: `${BASE}/__l5e/assets-v1/3d037705-6b93-45cf-88c3-975eef381bfb/scout-missed.mp4`,
  bench: `${BASE}/__l5e/assets-v1/a83f7b35-4659-408e-a6ff-31f8001ac19f/bench.mp4`,
};
