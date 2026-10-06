import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Recognition } from "@/components/sections/Recognition";
import { Skills } from "@/components/sections/Skills";
import { Writing } from "@/components/sections/Writing";
import { socials } from "@/data/profile";
import { getGithub, mergeProjects } from "@/lib/github";
import { getMediumPosts } from "@/lib/medium";

// Re-fetch GitHub stats and Medium articles at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const [github, posts] = await Promise.all([getGithub(), getMediumPosts()]);
  const projects = mergeProjects(github);

  return (
    <>
      <main id="main">
        <Hero publicRepos={github.user.publicRepos} articles={posts.length} />
        <About github={github} />
        <Skills />
        <Experience />
        <Projects projects={projects} githubUrl={socials.github.href} totalRepos={github.user.publicRepos} />
        <Writing posts={posts} />
        <Recognition />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
