// Refreshes the offline snapshots the site falls back to when GitHub or Medium
// can't be reached. Run with: npm run update-fallbacks
import { writeFile } from "node:fs/promises";
import { featuredProjects, profile } from "../src/data/profile.ts";
import { mapGithub, parseMediumFeed } from "../src/lib/parsers.ts";

const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function get(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res;
}

const [user, repos, feed] = await Promise.all([
  get(`https://api.github.com/users/${profile.githubUser}`, { headers }).then((r) => r.json()),
  get(`https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=updated`, { headers }).then((r) => r.json()),
  get(`https://medium.com/feed/@${profile.mediumUser}`, { headers: { "User-Agent": "Mozilla/5.0 portfolio-snapshot" } }).then((r) => r.text()),
]);

const github = mapGithub(user, repos, featuredProjects.map((p) => p.repo));
const medium = parseMediumFeed(feed);

const missing = featuredProjects.filter((p) => !github.repos.some((r) => r.name.toLowerCase() === p.repo.toLowerCase()));
if (missing.length) console.warn(`⚠ Featured repos not found on GitHub: ${missing.map((p) => p.repo).join(", ")}`);

await writeFile(new URL("../src/data/github.json", import.meta.url), JSON.stringify(github, null, 2) + "\n");
await writeFile(new URL("../src/data/medium.json", import.meta.url), JSON.stringify(medium, null, 2) + "\n");

console.log(`✓ github.json — ${github.repos.length} featured repos, ${github.user.publicRepos} public repos`);
console.log(`✓ medium.json — ${medium.length} articles`);
