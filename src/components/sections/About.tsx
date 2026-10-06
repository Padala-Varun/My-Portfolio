import Image from "next/image";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollHighlight } from "@/components/motion/ScrollHighlight";
import { profile, skillGroups, stats } from "@/data/profile";
import type { GithubSnapshot } from "@/lib/parsers";

const ORBIT = ["LangGraph", "RAG", "Neo4j", "Qdrant", "FastAPI", "MQTT", "CrewAI", "Next.js"];

function Monogram() {
  return (
    <div className="relative mx-auto aspect-square w-[80%] max-w-[420px] [--orbit-r:40cqw] sm:w-full sm:[--orbit-r:50cqw]" aria-hidden="true">
      <div className="absolute inset-[12%] animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#8b5cf6,#22d3ee,#d4ff4f,#8b5cf6)] opacity-80 blur-2xl" />
      <div className="absolute inset-[14%] grid place-items-center rounded-full border border-line-strong bg-ink">
        <span className="font-display text-[clamp(4rem,10vw,7rem)] font-extrabold tracking-tighter text-gradient">{profile.initials}</span>
      </div>
      <div className="absolute inset-0 animate-orbit rounded-full border border-dashed border-line">
        {ORBIT.map((label, i) => {
          const angle = (i / ORBIT.length) * 360;
          return (
            <div
              key={label}
              className="absolute top-1/2 left-1/2 h-0 w-0"
              style={{ transform: `rotate(${angle}deg) translateX(min(210px, var(--orbit-r))) rotate(${-angle}deg)` }}
            >
              <span className="absolute -translate-x-1/2 -translate-y-1/2 animate-orbit-reverse rounded-full border border-line-strong bg-ink-2 px-3 py-1 font-mono text-[11px] whitespace-nowrap text-muted">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function About({ github }: { github: GithubSnapshot }) {
  const liveStats = [
    { value: github.user.publicRepos, label: "public repos" },
    { value: github.totalStars, label: "stars earned" },
    { value: github.user.followers, label: "followers" },
  ];

  return (
    <section id="about" className="section">
      <div className="container-x">
        <h2 className="sr-only">About</h2>
        <p className="eyebrow mb-10 flex items-center gap-3">
          <span className="text-cyan">(01)</span>
          <span className="h-px w-10 bg-line-strong" />
          About
        </p>
        <ScrollHighlight
          text={profile.intro}
          className="max-w-6xl font-display text-[clamp(1.75rem,4vw,3.6rem)] leading-[1.12] font-semibold tracking-tight"
        />

        <div className="mt-24 grid items-center gap-16 lg:grid-cols-12">
          <Reveal className="@container lg:col-span-5">
            {profile.photo ? (
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-3xl border border-line">
                <Image src={profile.photo} alt={profile.name} fill sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" />
              </div>
            ) : (
              <Monogram />
            )}
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
              {profile.about.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08} y={20} className="bg-ink p-6 md:p-8">
                  <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} className="font-display text-4xl font-bold tracking-tight md:text-5xl" />
                  <p className="mt-2 text-sm text-muted">{stat.label}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> live from GitHub
              </span>
              {liveStats.map((s) => (
                <span key={s.label}>
                  <span className="text-fg">{s.value}</span> {s.label}
                </span>
              ))}
              <span>
                <span className="text-fg">{skillGroups.reduce((n, g) => n + g.items.length, 0)}</span> skills
              </span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
