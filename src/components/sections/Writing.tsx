import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { socials } from "@/data/profile";
import type { MediumPost } from "@/lib/parsers";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function Writing({ posts }: { posts: MediumPost[] }) {
  return (
    <section id="writing" className="section">
      <div className="container-x">
        <SectionHeading index="05" label="Writing" title="Notes from the build log.">
          I write about agent memory, event-driven systems, and what I learn shipping them.{" "}
          <a href={socials.medium.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-fg underline decoration-line-strong underline-offset-4 hover:decoration-cyan">
            Follow on Medium <ArrowUpRight className="h-4 w-4" />
          </a>
        </SectionHeading>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) * 0.08} className="h-full">
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Read"
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-ink-2 transition-all duration-500 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-[0_30px_80px_-30px_rgba(139,92,246,0.35)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-ink-3">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-violet/30 to-cyan/20" />
                  )}
                  {i === 0 && <span className="absolute top-4 left-4 rounded-full bg-fg px-2.5 py-1 font-mono text-[10px] tracking-wider text-ink uppercase">Latest</span>}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-mono text-xs text-muted">
                    {dateFormat.format(new Date(post.publishedAt))} · {post.readingMinutes} min read
                  </p>
                  <h3 className="mt-3 font-display text-xl leading-snug font-semibold tracking-tight transition-colors group-hover:text-cyan">{post.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <ul className="flex flex-wrap gap-1.5">
                      {post.categories.slice(0, 2).map((c) => (
                        <li key={c} className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted capitalize">
                          {c}
                        </li>
                      ))}
                    </ul>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
