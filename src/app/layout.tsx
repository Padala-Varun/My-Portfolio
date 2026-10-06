import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Providers } from "@/components/Providers";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { Preloader } from "@/components/motion/Preloader";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { profile, socials } from "@/data/profile";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"], weight: ["600", "700", "800"] });

const title = `${profile.shortName} — ${profile.role}`;
const description = `${profile.tagline} Portfolio of ${profile.name}: multi-agent systems with LangGraph, RAG, knowledge graphs, and full-stack AI products.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${profile.shortName}` },
  description,
  applicationName: `${profile.shortName} Portfolio`,
  authors: [{ name: profile.name, url: socials.linkedin.href }],
  creator: profile.name,
  keywords: ["Varun Padala", profile.name, "Agentic AI Engineer", "LangGraph", "Multi-Agent Systems", "RAG", "Knowledge Graphs", "Neo4j", "FastAPI", "Next.js", "Portfolio"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${profile.shortName} — Portfolio`,
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
};

// Runs before paint: skip the preloader on repeat visits within a session.
const introScript = `try{if(sessionStorage.getItem("intro-seen")==="1")document.documentElement.dataset.introSeen="1"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${syne.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[110] -translate-y-20 rounded-full bg-fg px-4 py-2 text-sm text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Providers>
          <Preloader />
          <ScrollProgress />
          <CustomCursor />
          <Nav />
          {children}
        </Providers>
        <div className="noise" aria-hidden="true" />
      </body>
    </html>
  );
}
