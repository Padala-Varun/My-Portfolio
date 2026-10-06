"use client";

import { ArrowDown, Download } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { RoleScramble } from "@/components/motion/RoleScramble";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { HeroVisual } from "@/components/three/HeroVisual";
import { socialIcons } from "@/components/ui/SocialIcon";
import { profile, socials } from "@/data/profile";
import { useIntroDone } from "@/lib/intro";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ publicRepos, articles }: { publicRepos: number; articles: number }) {
  const introDone = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: introDone ? { opacity: 1, y: 0 } : undefined,
    transition: { delay, duration: 1, ease: EASE },
  });

  return (
    <section id="top" ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
      <HeroVisual />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />

      <motion.div style={{ y, opacity, scale }} className="container-x relative z-10 flex flex-1 flex-col justify-center pt-32 pb-16">
        <motion.p {...enter(0.05)} className="eyebrow mb-8 flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {profile.availability}
        </motion.p>

        <h1 className="font-display text-[clamp(2.75rem,15.5vw,13.5rem)] leading-[0.82] font-extrabold tracking-[-0.045em] whitespace-nowrap">
          <span className="sr-only">
            {profile.name} — {profile.role}
          </span>
          <span aria-hidden="true">
            <SplitReveal text={profile.firstName} trigger="intro" by="chars" className="block" />
            <SplitReveal text={profile.lastName} trigger="intro" by="chars" delay={0.12} gradient className="block" />
          </span>
        </h1>

        <motion.div {...enter(0.55)} className="mt-10 max-w-xl">
          <p className="font-mono text-sm text-cyan md:text-base">
            <span className="text-dim">~/</span> <RoleScramble roles={profile.roles} start={introDone} />
          </p>
          <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl">
            {profile.tagline} Currently building AI-native agents at <span className="text-fg">Utrecht IT Consulting</span>.
          </p>
        </motion.div>

        <motion.div {...enter(0.75)} className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic>
            <a href="#projects" data-cursor="Explore" className="group inline-flex items-center gap-2 rounded-full bg-fg px-7 py-4 font-medium text-ink">
              View my work
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={profile.resume}
              download="Varun-Padala-Resume.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink/40 px-7 py-4 font-medium backdrop-blur-md transition-colors hover:border-fg"
            >
              Download résumé
              <Download className="h-4 w-4" />
            </a>
          </Magnetic>
          <div className="flex items-center gap-1 sm:ml-2">
            {(["github", "linkedin", "medium"] as const).map((key) => {
              const Icon = socialIcons[key];
              return (
                <Magnetic key={key} strength={0.5}>
                  <a
                    href={socials[key].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socials[key].label}
                    className="grid h-12 w-12 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-fg"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </Magnetic>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      <motion.div {...enter(1)} className="container-x relative z-10 flex items-end justify-between pb-8">
        <span className="eyebrow hidden sm:block">Based in {profile.location}</span>
        <a href="#about" className="eyebrow flex items-center gap-3 transition-colors hover:text-fg">
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-line-strong">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-fg" />
          </span>
        </a>
        <span className="eyebrow hidden sm:block">
          {publicRepos}+ repos · {articles} articles
        </span>
      </motion.div>
    </section>
  );
}
