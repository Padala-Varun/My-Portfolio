import { StaggerList } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { marqueeRows, skillGroups } from "@/data/profile";

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="mx-6 h-[0.45em] w-[0.45em] shrink-0 text-cyan md:mx-10" aria-hidden="true">
      <path fill="currentColor" d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

export function Skills() {
  return (
    <section id="skills" className="section overflow-hidden">
      <div aria-hidden="true" className="space-y-2 font-display text-[clamp(3rem,9vw,8rem)] leading-none font-bold tracking-tight">
        <VelocityMarquee baseVelocity={-2.2}>
          {marqueeRows[0].map((word) => (
            <span key={word} className="flex items-center">
              {word}
              <Star />
            </span>
          ))}
        </VelocityMarquee>
        <VelocityMarquee baseVelocity={2.2}>
          {marqueeRows[1].map((word) => (
            <span key={word} className="text-outline flex items-center">
              {word}
              <Star />
            </span>
          ))}
        </VelocityMarquee>
      </div>

      <div className="container-x mt-28">
        <SectionHeading index="02" label="Skills" title="The toolkit behind the agents.">
          From LangGraph orchestration and knowledge graphs to event-driven backends — the stack I use to take agents from idea to production.
        </SectionHeading>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Spotlight key={group.title} className="p-7 md:p-8">
              <p className="font-mono text-xs text-dim">0{i + 1}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">{group.title}</h3>
              <StaggerList
                items={group.items}
                className="mt-6 flex flex-wrap gap-2"
                itemClassName="rounded-full border border-line-strong bg-ink px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-cyan hover:text-fg"
              />
            </Spotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
