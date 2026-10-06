// Pure mappers for GitHub API and Medium RSS responses.
// Shared by the live fetchers (src/lib/github.ts, src/lib/medium.ts) and by
// scripts/update-fallbacks.mts, so keep runtime imports to npm packages only.
import { XMLParser } from "fast-xml-parser";

export type RepoStats = {
  name: string;
  url: string;
  description: string | null;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  pushedAt: string;
};

export type GithubSnapshot = {
  fetchedAt: string;
  user: {
    login: string;
    url: string;
    followers: number;
    publicRepos: number;
  };
  totalStars: number;
  repos: RepoStats[];
};

export type MediumPost = {
  id: string;
  title: string;
  link: string;
  publishedAt: string;
  categories: string[];
  thumbnail: string | null;
  excerpt: string;
  readingMinutes: number;
};

type RawUser = {
  login: string;
  html_url: string;
  followers: number;
  public_repos: number;
};

type RawRepo = {
  name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
};

export function mapGithub(user: RawUser, repos: RawRepo[], featured: string[]): GithubSnapshot {
  const wanted = new Set(featured.map((name) => name.toLowerCase()));
  const own = repos.filter((repo) => !repo.fork);

  return {
    fetchedAt: new Date().toISOString(),
    user: {
      login: user.login,
      url: user.html_url,
      followers: user.followers,
      publicRepos: user.public_repos,
    },
    totalStars: own.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    repos: repos
      .filter((repo) => wanted.has(repo.name.toLowerCase()))
      .map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        homepage: repo.homepage || null,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics ?? [],
        pushedAt: repo.pushed_at,
      })),
  };
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const value = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(value) ? String.fromCodePoint(value) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<figure[\s\S]*?<\/figure>/gi, " ")
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<\/?(p|h\d|li|ul|ol|blockquote|pre|br|div)\b[^>]*>/gi, " ")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.—-]+$/, "")}…`;
}

const asArray = <T>(value: T | T[] | undefined): T[] => (value === undefined ? [] : Array.isArray(value) ? value : [value]);

type RawItem = {
  title?: string;
  link?: string;
  guid?: string | { "#text": string };
  pubDate?: string;
  category?: string | string[];
  "content:encoded"?: string;
};

export function parseMediumFeed(xml: string, limit = 6): MediumPost[] {
  const parser = new XMLParser({
    ignoreAttributes: true,
    processEntities: false,
    htmlEntities: false,
    parseTagValue: false,
    isArray: (name) => name === "item" || name === "category",
  });
  const doc = parser.parse(xml);
  const items: RawItem[] = asArray(doc?.rss?.channel?.item);

  return items.slice(0, limit).flatMap((item) => {
    const link = String(item.link ?? "").split("?")[0];
    const title = decodeEntities(String(item.title ?? "")).trim();
    if (!link || !title) return [];

    const html = String(item["content:encoded"] ?? "");
    const text = htmlToText(html);
    const guid = typeof item.guid === "object" ? item.guid["#text"] : item.guid;
    const thumbnail = html.match(/<img[^>]+src="(https:\/\/(?:cdn-images-\d+|miro)\.medium\.com\/[^"]+)"/i)?.[1] ?? null;
    // Medium repeats the title as the first heading; drop it from the excerpt.
    const body = text.startsWith(title) ? text.slice(title.length).trim() : text;

    return [
      {
        id: String(guid ?? link).split("/").pop() ?? link,
        title,
        link,
        publishedAt: new Date(String(item.pubDate)).toISOString(),
        categories: asArray(item.category).map((c) => String(c).replace(/-/g, " ")),
        thumbnail,
        excerpt: truncate(body, 190),
        readingMinutes: Math.max(1, Math.round(text.split(" ").length / 230)),
      },
    ];
  });
}
