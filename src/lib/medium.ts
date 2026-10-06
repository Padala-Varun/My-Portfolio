import fallback from "@/data/medium.json";
import { profile } from "@/data/profile";
import { parseMediumFeed, type MediumPost } from "./parsers";

/** Latest Medium articles via RSS (cached for an hour), or the bundled snapshot. */
export async function getMediumPosts(limit = 6): Promise<MediumPost[]> {
  try {
    const res = await fetch(`https://medium.com/feed/@${profile.mediumUser}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; portfolio-site)" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Medium ${res.status}`);
    const posts = parseMediumFeed(await res.text(), limit);
    if (posts.length === 0) throw new Error("Medium feed was empty");
    return posts;
  } catch (error) {
    console.warn("[medium] using fallback snapshot:", (error as Error).message);
    return (fallback as MediumPost[]).slice(0, limit);
  }
}
