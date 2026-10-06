import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { CopyEmail } from "@/components/CopyEmail";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { socialIcons } from "@/components/ui/SocialIcon";
import { profile, socials, type SocialKey } from "@/data/profile";

export function Contact() {
  return (
    <section id="contact" className="section relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.22),transparent)] blur-3xl" />

      <div className="container-x relative">
        <p className="eyebrow mb-8 flex items-center gap-3">
          <span className="text-cyan">(07)</span>
          <span className="h-px w-10 bg-line-strong" />
          Contact
        </p>
        <SplitReveal
          as="h2"
          text="Let's build something intelligent."
          by="words"
          className="max-w-6xl font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.9] font-bold tracking-tight"
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="space-y-10 lg:col-span-5">
            <p className="text-lg leading-relaxed text-muted">
              Hiring for an AI or full-stack role, or have an agentic idea you want to bring to life? Send a message — it lands straight in my inbox.
            </p>
            <CopyEmail email={profile.email} />
            <ul className="border-t border-line">
              {(Object.keys(socials) as SocialKey[]).map((key) => {
                const Icon = socialIcons[key];
                const social = socials[key];
                return (
                  <li key={key} className="border-b border-line">
                    <a href={social.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 py-4">
                      <Icon className="h-5 w-5 text-muted transition-colors group-hover:text-fg" />
                      <span className="font-medium">{social.label}</span>
                      <span className="hidden truncate text-sm text-dim sm:block">{social.handle}</span>
                      <ArrowUpRight className="ml-auto h-4 w-4 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <ContactForm fallbackEmail={profile.email} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
