import { BackToTop } from "@/components/BackToTop";
import { profile } from "@/data/profile";
import { navLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-16 pb-8">
      <div className="container-x">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-2xl font-bold tracking-tight">{profile.shortName}</p>
            <p className="mt-1 text-muted">
              {profile.role} · {profile.location}
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-muted">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="transition-colors hover:text-fg">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={profile.resume} target="_blank" rel="noopener" className="transition-colors hover:text-fg">
                  Résumé
                </a>
              </li>
            </ul>
          </nav>
          <BackToTop />
        </div>

        <p aria-hidden="true" className="text-outline mt-16 text-center font-display text-[15vw] leading-[0.8] font-extrabold tracking-[-0.05em] whitespace-nowrap select-none">
          {profile.firstName.toUpperCase()}
        </p>

        <div className="mt-10 flex flex-col gap-2 font-mono text-xs text-dim sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>Built with Next.js · Three.js · GSAP · Motion</span>
        </div>
      </div>
    </footer>
  );
}
