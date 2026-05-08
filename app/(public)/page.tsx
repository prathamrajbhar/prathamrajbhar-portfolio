import type { Metadata } from "next";
import { ArrowRight, Code2, Globe, Sparkles, Zap } from "lucide-react";
import { BlogCard } from "@/components/public/BlogCard";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { HeroSection } from "@/components/public/HeroSection";
import { ProjectCard } from "@/components/public/ProjectCard";
import { TechMarquee } from "@/components/public/TechMarquee";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { defaultSettings } from "@/lib/defaults";
import { fetchApi } from "@/lib/server-data";
import type { BlogPostDTO, ExperienceDTO, ProjectDTO, SiteSettingsDTO, SkillDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
  description: "Portfolio homepage for a computer engineer."
};

export default async function HomePage() {
  const [settings, projects, posts, experiences, skills] = await Promise.all([
    fetchApi<SiteSettingsDTO>("/settings", defaultSettings),
    fetchApi<ProjectDTO[]>("/projects", []),
    fetchApi<BlogPostDTO[]>("/blog", []),
    fetchApi<ExperienceDTO[]>("/experience", []),
    fetchApi<SkillDTO[]>("/skills", [])
  ]);
  const featured = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <>
      <HeroSection settings={settings} />
      
      <TechMarquee skills={skills} />

      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">About Snapshot</p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
            Engineering with product sense.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-6 md:grid-rows-2">
          {/* Main Bio Card */}
          <Card className="glass group col-span-full flex flex-col justify-center p-8 md:col-span-4 md:row-span-2">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:rotate-12">
              <Code2 size={24} />
            </div>
            <p className="text-xl leading-relaxed text-muted/90 sm:text-2xl">
              {settings.bio}
            </p>
            <div className="mt-8 flex gap-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">2+</span>
                <span className="text-xs font-medium uppercase tracking-wider text-muted">Years Exp.</span>
              </div>
              <div className="h-10 w-px bg-border/50" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">{projects.length}+</span>
                <span className="text-xs font-medium uppercase tracking-wider text-muted">Projects</span>
              </div>
            </div>
          </Card>

          {/* Highlight Card 1 */}
          <Card className="glass group col-span-full flex flex-col items-start p-6 md:col-span-2">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-transform group-hover:scale-110">
              <Sparkles size={20} />
            </div>
            <h3 className="font-display text-lg font-bold">Product Focused</h3>
            <p className="mt-2 text-sm text-muted">I don&apos;t just write code; I build solutions that solve real-world problems.</p>
          </Card>

          {/* Highlight Card 2 */}
          <Card className="glass group col-span-full flex flex-col items-start p-6 md:col-span-2">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-110">
              <Globe size={20} />
            </div>
            <h3 className="font-display text-lg font-bold">Global Standards</h3>
            <p className="mt-2 text-sm text-muted">Clean code, high performance, and accessible designs are my top priorities.</p>
          </Card>
        </div>
      </section>

      <section id="featured-projects" className="relative overflow-hidden bg-surface/30 py-24 dark:bg-surface/5">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Portfolio</p>
              <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">Selected Builds</h2>
            </div>
            <Button href="/projects" variant="ghost" className="group" icon={<ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}>
              View All Projects
            </Button>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Trajectory</p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">Work Journey</h2>
            <p className="mt-6 text-lg text-muted/90">
              A timeline of my professional growth, key roles, and the impact I&apos;ve made at various organizations.
            </p>
            <div className="mt-10">
              <Button href="/experience" size="lg" variant="secondary" icon={<Zap size={18} />}>Full Resume</Button>
            </div>
          </div>
          <div className="rounded-3xl border border-border/50 bg-surface/50 p-8 shadow-sm dark:bg-surface/10">
            <ExperienceTimeline experiences={experiences.slice(0, 3)} />
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-24 dark:bg-primary/10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Blog</p>
              <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">Latest Writing</h2>
            </div>
            <Button href="/blog" variant="ghost" className="group" icon={<ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}>
              Read All Posts
            </Button>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => <BlogCard key={post.id} post={post} />)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border py-24">
        <div className="mesh-gradient absolute inset-0 opacity-10" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 text-center">
          <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl">
            Have a project in mind?
          </h2>
          <p className="max-w-2xl text-xl text-muted/90">
            I&apos;m currently available for freelance work and new opportunities. Let&apos;s build something amazing together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/contact" size="xl" className="px-10 py-8 text-lg">Get In Touch</Button>
            <Button href="mailto:hello@example.com" size="xl" variant="secondary" className="px-10 py-8 text-lg">Send Email</Button>
          </div>
        </div>
      </section>
    </>
  );
}
