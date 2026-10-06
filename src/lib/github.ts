import fallback from "@/data/github.json";
import { featuredProjects, profile, type FeaturedProject } from "@/data/profile";
import { mapGithub, type GithubSnapshot, type RepoStats } from "./parsers";

const REVALIDATE_SECONDS = 3600;

export type Project = Omit<FeaturedProject, "demo"> & {
  url: string;
  demo: string | null;
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string | null;
};

async function fetchJson<T>(url: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(url, {
    headers,
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

/** Live GitHub data (cached for an hour), or the bundled snapshot if GitHub is unreachable. */
export async function getGithub(): Promise<GithubSnapshot> {
  const base = `https://api.github.com/users/${profile.githubUser}`;
  try {
    const [user, repos] = await Promise.all([
      fetchJson<Parameters<typeof mapGithub>[0]>(base),
      fetchJson<Parameters<typeof mapGithub>[1]>(`${base}/repos?per_page=100&sort=updated`),
    ]);
    return mapGithub(user, repos, featuredProjects.map((p) => p.repo));
  } catch (error) {
    console.warn("[github] using fallback snapshot:", (error as Error).message);
    return fallback as GithubSnapshot;
  }
}

/** Curated projects from profile.ts, enriched with live repo stats. */
export function mergeProjects(github: GithubSnapshot): Project[] {
  const byName = new Map<string, RepoStats>(github.repos.map((r) => [r.name.toLowerCase(), r]));
  const snapshot = new Map<string, RepoStats>((fallback as GithubSnapshot).repos.map((r) => [r.name.toLowerCase(), r]));

  return featuredProjects.map((project) => {
    const repo = byName.get(project.repo.toLowerCase()) ?? snapshot.get(project.repo.toLowerCase());
    return {
      ...project,
      url: repo?.url ?? `https://github.com/${profile.githubUser}/${project.repo}`,
      demo: project.demo ?? repo?.homepage ?? null,
      stars: repo?.stars ?? 0,
      forks: repo?.forks ?? 0,
      language: repo?.language ?? null,
      pushedAt: repo?.pushedAt ?? null,
    };
  });
}
