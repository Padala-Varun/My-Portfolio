# Varun Padala — Portfolio

A highly animated personal portfolio for **Padala Venkata Sai Varun Kumar** (Agentic AI Engineer).

- **3D hero**: a GPU particle field (Three.js / React Three Fiber) that morphs between a sphere and a torus knot, reacts to the mouse, and scatters on scroll.
- **Motion**: GSAP ScrollTrigger + SplitText reveals, a pinned horizontal project gallery, velocity-reactive marquees, a self-drawing experience timeline, magnetic buttons, a custom cursor, and Lenis smooth scrolling.
- **Live content**: GitHub repo stats and Medium articles are fetched on the server and refreshed hourly. If either service is down, the site falls back to bundled snapshots.
- **Contact form**: messages are emailed to `varunpadala137@gmail.com` via [Resend](https://resend.com). The recruiter's address is set as *reply-to*, so you can answer straight from Gmail.
- **Accessible**: respects `prefers-reduced-motion` (no 3D, no scroll animations), keyboard-friendly, works at phone width.

Built with Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion · GSAP · Lenis · Three.js.

---

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Without a `RESEND_API_KEY`, the contact form works in development but **logs messages to the terminal** instead of emailing them.

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run update-fallbacks` | Re-download GitHub + Medium data into `src/data/*.json` (the offline fallbacks) |

## Editing content

Almost everything lives in **[`src/data/profile.ts`](src/data/profile.ts)**:

- name, roles, tagline, about text, availability line
- social links, stats, experience, education, achievements, skills
- **`featuredProjects`**: which GitHub repos appear in *Selected work*, with their descriptions, tech tags, pipeline stages (drawn as the animated agent graph), demo link, and accent colour. Stars, language, and last-updated date are pulled live from GitHub.

**Add a photo:** put a square-ish image in `public/` (e.g. `public/profile.jpg`) and set `photo: "/profile.jpg"` in `profile.ts`. Until then, an animated monogram is shown.

**Résumé:** replace `public/resume.pdf` (it powers the *Download résumé* buttons).

Medium articles appear automatically. Publish on Medium and the site picks it up within an hour.

## Contact form setup (one time, ~5 minutes)

1. Sign up at **[resend.com](https://resend.com)** using **varunpadala137@gmail.com**.
   Without a custom domain, Resend's test sender (`onboarding@resend.dev`) can only deliver to the account owner's address, so the sign-up email must be the inbox you want messages in.
2. Create an API key: **API Keys → Create API Key** (sending access).
3. Add the environment variables (locally in `.env.local`, and on Vercel, see below):

   ```bash
   RESEND_API_KEY=re_xxxxxxxx
   CONTACT_TO_EMAIL=varunpadala137@gmail.com
   ```

4. Send yourself a test message from the live site.

Optional: verify your own domain in Resend and set `CONTACT_FROM_EMAIL="Portfolio <hello@your-domain.com>"` for a branded sender.

Spam protection: hidden honeypot field, minimum time-on-form check, server-side validation, and a per-IP rate limit (5 messages / 10 minutes).

## Deploy to Vercel (manual)

**Option A: GitHub + Vercel dashboard (recommended)**

1. Create an empty GitHub repo (e.g. `varun-portfolio`; the name `portfolio` is already taken by an older repo on the account) and push this project:

   ```bash
   git remote add origin https://github.com/Padala-Varun/varun-portfolio.git
   git push -u origin main
   ```

2. In [vercel.com/new](https://vercel.com/new), import the repo. The framework is auto-detected as Next.js, so keep the defaults.
3. Under **Settings → Environment Variables**, add `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (and optionally `GITHUB_TOKEN`).
4. Deploy. Every later push redeploys automatically.

**Option B: Vercel CLI**

```bash
npx vercel            # first run links the project
npx vercel env add RESEND_API_KEY
npx vercel env add CONTACT_TO_EMAIL
npx vercel --prod
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | In production | Sends contact-form emails |
| `CONTACT_TO_EMAIL` | Recommended | Inbox for messages (defaults to the email in `profile.ts`) |
| `CONTACT_FROM_EMAIL` | No | Custom sender after verifying a domain in Resend |
| `GITHUB_TOKEN` | No | Higher GitHub API rate limit |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for SEO / OG images (Vercel provides a default) |

## Project structure

```
src/
  app/
    page.tsx               # loads GitHub + Medium data, renders the sections
    layout.tsx             # fonts, metadata, preloader, cursor, smooth scroll, nav
    api/contact/route.ts   # contact form → Resend
    opengraph-image.tsx    # generated social preview image
  components/
    sections/              # Hero, About, Skills, Experience, Projects, Writing, Recognition, Contact, Footer
    motion/                # Preloader, SplitReveal, VelocityMarquee, TiltCard, Magnetic, CustomCursor, …
    three/                 # HeroScene (R3F particle shader) + HeroVisual (lazy loader / fallback)
    ui/                    # AgentGraph, SectionHeading, SocialIcon
  data/
    profile.ts             # ← all editable content
    github.json, medium.json  # offline fallbacks (npm run update-fallbacks)
  lib/                     # GitHub / Medium fetchers, RSS + API parsers, GSAP setup
```
