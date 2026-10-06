"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { profile, socials } from "@/data/profile";
import { navLinks } from "@/lib/site";
import { useIntroDone } from "@/lib/intro";

function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  if (window.__lenis) window.__lenis.scrollTo(target, { offset: 0 });
  else target.scrollIntoView({ behavior: "smooth" });
}

export function Nav() {
  const introDone = useIntroDone();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240 && !open);
    setScrolled(y > 24);
  });

  useEffect(() => {
    const sections = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: introDone && !hidden ? 0 : -100, opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav
          aria-label="Main"
          className={`container-x flex h-[72px] items-center justify-between transition-colors duration-500 ${scrolled ? "bg-ink/70 backdrop-blur-xl" : ""}`}
        >
          <a href="#top" className="group flex items-center gap-3" aria-label={`${profile.shortName} — back to top`}>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-line-strong font-display text-sm font-bold transition-colors group-hover:border-cyan group-hover:text-cyan">
              {profile.initials}
            </span>
            <span className="hidden font-display font-semibold tracking-tight sm:block">{profile.shortName}</span>
          </a>

          <ul className="hidden items-center gap-1 rounded-full border border-line bg-ink-2/60 p-1 backdrop-blur-xl md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`relative block rounded-full px-4 py-2 text-sm transition-colors ${active === link.id ? "text-ink" : "text-muted hover:text-fg"}`}
                >
                  {active === link.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-fg" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener"
              className="hidden items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:border-fg hover:bg-fg hover:text-ink sm:flex"
            >
              Résumé <ArrowUpRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-full border border-line-strong md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-4 pt-28 pb-10 md:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-2">
              {navLinks.map((link, i) => (
                <li key={link.id} className="overflow-hidden">
                  <motion.a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      window.__lenis?.start();
                      requestAnimationFrame(() => scrollToId(link.id));
                    }}
                    className="flex items-baseline gap-4 font-display text-5xl font-bold tracking-tight"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="font-mono text-sm text-cyan">0{i + 1}</span>
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }} exit={{ opacity: 0 }} className="space-y-4">
              <a href={`mailto:${profile.email}`} className="block text-lg text-muted">
                {profile.email}
              </a>
              <div className="flex gap-5 text-sm">
                {(["github", "linkedin", "medium"] as const).map((key) => (
                  <a key={key} href={socials[key].href} target="_blank" rel="noopener noreferrer" className="text-fg underline-offset-4 hover:underline">
                    {socials[key].label}
                  </a>
                ))}
                <a href={profile.resume} target="_blank" rel="noopener" className="text-cyan">
                  Résumé ↗
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
