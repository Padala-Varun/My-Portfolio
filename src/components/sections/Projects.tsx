"use client";

import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { useRef } from "react";
import { SiGithub } from "react-icons/si";
import { TiltCard } from "@/components/motion/TiltCard";
import { AgentGraph } from "@/components/ui/AgentGraph";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/lib/github";
import { gsap, useGSAP } from "@/lib/gsap";

const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

const initials = (title: string) =>
  title
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  return (
    <TiltCard className="flex flex-col overflow-hidden rounded-3xl border border-line bg-ink-2" max={5}>
      <div
        className="relative aspect-[16/10] shrink-0 border-b border-line [.is-horizontal_&]:aspect-auto [.is-horizontal_&]:min-h-[150px] [.is-horizontal_&]:flex-1 [.is-horizontal_&]:shrink"
        style={{ background: `radial-gradient(120% 90% at 50% 0%, ${project.accent}26, transparent 70%)` }}
      >
        <div className="absolute top-5 left-5 font-mono text-xs text-muted">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
        {project.fromResume && (
          <span className="absolute top-4 right-4 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase" style={{ borderColor: `${project.accent}66`, color: project.accent }}>
            Flagship
          </span>
        )}
        <div className="absolute inset-0 px-4 pt-8 pb-2">
          <AgentGraph nodes={project.pipeline} accent={project.accent} core={initials(project.title)} title={project.title} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8 [.is-horizontal_&]:flex-none">
        <h3 className="font-display text-3xl font-bold tracking-tight">{project.title}</h3>
        <p className="mt-1.5 font-medium" style={{ color: project.accent }}>
          {project.tagline}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{project.description}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li key={tech} className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-[11px] text-muted">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-7">
          <div className="flex items-center gap-4 font-mono text-xs text-muted">
            <span className="flex items-center gap-1" title="GitHub stars">
              <Star className="h-3.5 w-3.5" /> {project.stars}
            </span>
            {project.forks > 0 && (
              <span className="flex items-center gap-1" title="Forks">
                <GitFork className="h-3.5 w-3.5" /> {project.forks}
              </span>
            )}
            {project.language && <span>{project.language}</span>}
            {project.pushedAt && <span className="hidden sm:inline">· {monthYear.format(new Date(project.pushedAt))}</span>}
          </div>
          <div className="flex gap-2">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Code"
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:border-fg"
            >
              <SiGithub className="h-4 w-4" /> Code
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Live"
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90"
                style={{ background: project.accent }}
              >
                Live demo <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

export function Projects({ projects, githubUrl, totalRepos }: { projects: Project[]; githubUrl: string; totalRepos: number }) {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Horizontal, scroll-driven gallery on large screens with motion enabled.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const sectionEl = section.current!;
        const trackEl = track.current!;
        sectionEl.classList.add("is-horizontal");
        const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);

        const tween = gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.fromTo("[data-progress]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: pin.current, start: "top top", end: () => `+=${distance()}`, scrub: 0.8, invalidateOnRefresh: true } });

        // Cards drift in from slightly below as they enter from the right.
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
          gsap.from(card, {
            y: 80,
            rotate: 2,
            opacity: 0.3,
            ease: "power2.out",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 55%", scrub: true },
          });
        });

        return () => sectionEl.classList.remove("is-horizontal");
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section id="projects" ref={section} className="group/projects relative">
      <div className="container-x section pb-16 lg:pb-20">
        <SectionHeading index="04" label="Selected work" title="Things I've built.">
          {projects.length} hand-picked builds from {totalRepos}+ public repositories — multi-agent systems, AI memory, RAG, and the products around them.{" "}
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-fg underline decoration-line-strong underline-offset-4 hover:decoration-cyan">
            Browse all repos <ArrowUpRight className="h-4 w-4" />
          </a>
        </SectionHeading>
      </div>

      <div ref={pin} className="relative [.is-horizontal_&]:flex [.is-horizontal_&]:h-screen [.is-horizontal_&]:flex-col [.is-horizontal_&]:justify-center [.is-horizontal_&]:overflow-hidden">
        <div
          ref={track}
          className="container-x grid gap-6 pb-24 md:grid-cols-2 [.is-horizontal_&]:flex [.is-horizontal_&]:w-max [.is-horizontal_&]:max-w-none [.is-horizontal_&]:gap-8 [.is-horizontal_&]:pr-[var(--gutter)] [.is-horizontal_&]:pb-0"
        >
          {projects.map((project, i) => (
            <div key={project.repo} data-card className="[.is-horizontal_&]:h-[min(82vh,700px)] [.is-horizontal_&]:w-[min(560px,42vw)] [.is-horizontal_&]:shrink-0">
              <ProjectCard project={project} index={i} total={projects.length} />
            </div>
          ))}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-card
            data-cursor="GitHub"
            className="group grid min-h-[260px] place-items-center rounded-3xl border border-dashed border-line-strong p-10 text-center transition-colors hover:border-cyan md:col-span-2 [.is-horizontal_&]:h-[min(82vh,700px)] [.is-horizontal_&]:w-[min(420px,32vw)] [.is-horizontal_&]:shrink-0"
          >
            <span>
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-line-strong transition-all duration-500 group-hover:rotate-45 group-hover:border-cyan group-hover:bg-cyan group-hover:text-ink">
                <ArrowUpRight className="h-8 w-8" />
              </span>
              <span className="mt-6 block font-display text-3xl font-bold">{totalRepos - projects.length}+ more on GitHub</span>
              <span className="mt-2 block text-muted">Experiments, hackathon builds, and everything in between.</span>
            </span>
          </a>
        </div>

        <div className="container-x mt-10 hidden [.is-horizontal_&]:block" aria-hidden="true">
          <div className="h-px w-full bg-line">
            <div data-progress className="h-px origin-left bg-gradient-to-r from-violet to-cyan" />
          </div>
        </div>
      </div>
    </section>
  );
}
