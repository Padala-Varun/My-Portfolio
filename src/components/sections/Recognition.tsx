import { ArrowUpRight, GraduationCap, Trophy } from "lucide-react";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { socialIcons } from "@/components/ui/SocialIcon";
import { achievements, education, socials } from "@/data/profile";

export function Recognition() {
  const school = education[0];

  return (
    <section id="recognition" className="section">
      <div className="container-x">
        <SectionHeading index="06" label="Recognition" title="Wins, leadership & learning." />

        <div className="grid gap-12 lg:grid-cols-12">
          <ol className="border-t border-line lg:col-span-8">
            {achievements.map((item, i) => (
              <li key={item.title} className="border-b border-line">
                <Reveal y={24} delay={i * 0.04}>
                  <div className="group relative flex items-center gap-5 overflow-hidden px-2 py-6 md:gap-8 md:py-7">
                    <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-violet/15 via-cyan/5 to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />
                    <span className="relative font-mono text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
                    <div className="relative flex-1">
                      <p className="font-display text-xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:text-2xl">{item.title}</p>
                      <p className="mt-1 text-sm text-muted transition-transform delay-75 duration-500 group-hover:translate-x-2">{item.detail}</p>
                    </div>
                    <Trophy className="relative h-5 w-5 -translate-x-3 text-cyan opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <aside className="lg:col-span-4">
            <Reveal className="glass sticky top-28 rounded-3xl p-8">
              <GraduationCap className="h-8 w-8 text-cyan" aria-hidden="true" />
              <p className="eyebrow mt-6">Education</p>
              <h3 className="mt-3 font-display text-2xl leading-tight font-bold tracking-tight">{school.school}</h3>
              <p className="mt-2 text-muted">{school.degree}</p>
              <p className="mt-1 font-mono text-sm text-muted">{school.period}</p>
              <div className="mt-8 flex items-baseline gap-2 border-t border-line pt-6">
                <Counter value={school.cgpa} decimals={2} className="font-display text-6xl font-bold tracking-tight text-gradient" />
                <span className="text-muted">/ 10 CGPA</span>
              </div>

              <p className="eyebrow mt-10">Competitive programming</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {(["leetcode", "codechef"] as const).map((key) => {
                  const Icon = socialIcons[key];
                  return (
                    <a
                      key={key}
                      href={socials[key].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-line bg-ink/50 px-4 py-3 transition-colors hover:border-line-strong"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <Icon className="h-4 w-4" /> {socials[key].label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  );
}
