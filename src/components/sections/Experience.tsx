"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/profile";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-line]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-timeline]", start: "top 65%", end: "bottom 65%", scrub: 0.5 } },
        );

        gsap.utils.toArray<HTMLElement>("[data-item]").forEach((item) => {
          gsap.from(item.querySelectorAll("[data-fade]"), {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: item, start: "top 80%", once: true },
          });
        });
      });

      // Dots light up as the line reaches them (also without motion).
      gsap.utils.toArray<HTMLElement>("[data-item]").forEach((item) => {
        ScrollTrigger.create({ trigger: item, start: "top 65%", toggleClass: { targets: item, className: "is-active" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="experience" ref={root} className="section">
      <div className="container-x">
        <SectionHeading index="03" label="Experience" title="Where I've shipped.">
          Three internships across agentic AI, generative AI, and full-stack engineering — building systems people actually use.
        </SectionHeading>

        <div data-timeline className="relative">
          <div aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-line md:left-[calc(33.333%+5px)]" />
          <div
            data-line
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-gradient-to-b from-violet via-cyan to-violet md:left-[calc(33.333%+5px)]"
          />
          <ol>

          {experience.map((job) => (
            <li key={job.company} data-item className="group relative grid gap-6 pb-20 pl-10 last:pb-0 md:grid-cols-3 md:gap-0 md:pl-0">
              <span
                aria-hidden="true"
                className="absolute top-2 left-0 h-[11px] w-[11px] rounded-full border border-line-strong bg-ink transition-all duration-500 group-[.is-active]:border-cyan group-[.is-active]:bg-cyan group-[.is-active]:shadow-[0_0_18px_4px_rgba(34,211,238,0.45)] md:left-[33.333%]"
              />

              <div className="md:pr-12" data-fade>
                <p className="font-mono text-sm text-muted">{job.period}</p>
                <p className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">{job.company}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-line-strong px-2.5 py-1 text-muted">{job.mode}</span>
                  {job.current && (
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-emerald-300">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      Current
                    </span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 md:pl-14">
                <h3 data-fade className="text-xl font-semibold md:text-2xl">
                  {job.role}
                  {job.focus && <span className="mt-1 block text-base font-normal text-cyan">{job.focus}</span>}
                </h3>
                <ul className="mt-6 space-y-4">
                  {job.points.map((point) => (
                    <li key={point.slice(0, 30)} data-fade className="relative pl-6 leading-relaxed text-muted">
                      <span aria-hidden="true" className="absolute top-[0.7em] left-0 h-px w-3 bg-cyan" />
                      {point}
                    </li>
                  ))}
                </ul>
                <ul data-fade className="mt-6 flex flex-wrap gap-2">
                  {job.stack.map((tech) => (
                    <li key={tech} className="rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-muted">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
