"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ExternalLink, Github, LinkIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ViewTracker } from "@/components/public/ViewTracker";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { ProjectDTO } from "@/lib/types";
import { sanitizeHtml } from "@/lib/utils";

export function ProjectDetailClient({ project, related }: { project: ProjectDTO, related: ProjectDTO[] }) {
  const projectLinks = Array.isArray(project.projectLinks) ? project.projectLinks : [];
  const overviewItems = [
    ["Role", project.role],
    ["Client", project.client],
    ["Category", project.category],
    ["Timeline", project.timeline],
    ["Year", project.year]
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <article className="relative min-h-screen">
      <ViewTracker path={`/api/projects/${project.id}`} />
      
      {/* Immersive Header */}
      <div className="relative h-[65vh] min-h-[500px] w-full overflow-hidden">
        <Image
          src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop"}
          alt={project.title}
          fill
          priority
          className="object-cover transition-transform duration-700"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-bg)_100%)] opacity-40" />
        
        <div className="absolute inset-0 flex items-end pb-24">
          <div className="mx-auto w-full max-w-7xl px-6">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-6">
                <Badge variant={project.status === "completed" ? "success" : "warning"} className="glass px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                  {project.status}
                </Badge>
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="muted" className="glass border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                    {tech}
                  </Badge>
                ))}
              </motion.div>
              <motion.h1 variants={fadeInUp} className="font-display text-6xl font-black tracking-tight text-white sm:text-8xl lg:text-9xl">
                {project.title}
              </motion.h1>
              {project.subtitle ? (
                <motion.p variants={fadeInUp} className="mt-6 max-w-3xl text-xl font-semibold leading-relaxed text-white/85 sm:text-2xl">
                  {project.subtitle}
                </motion.p>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-12 flex items-center justify-between border-b border-border pb-8">
              <Button href="/projects" variant="ghost" className="group -ml-4" icon={<ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />}>
                Back to gallery
              </Button>
              <div className="flex gap-3">
                {project.githubUrl ? (
                  <Button href={project.githubUrl} variant="secondary" size="lg" className="rounded-full px-6" icon={<Github size={20} />}>Source</Button>
                ) : null}
                {project.liveUrl ? (
                  <Button href={project.liveUrl} size="lg" className="rounded-full px-6" icon={<ExternalLink size={20} />}>Live Site</Button>
                ) : null}
              </div>
            </div>

            <p className="text-2xl font-medium leading-relaxed text-muted/90 sm:text-3xl lg:text-4xl">
              {project.description}
            </p>

            {project.problem || project.solution || project.impact ? (
              <div className="mt-16 grid gap-5 md:grid-cols-3">
                {project.problem ? (
                  <section className="rounded-[8px] border border-border bg-surface/60 p-6 dark:bg-surface/20">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Problem</p>
                    <p className="mt-4 text-sm leading-7 text-muted">{project.problem}</p>
                  </section>
                ) : null}
                {project.solution ? (
                  <section className="rounded-[8px] border border-border bg-surface/60 p-6 dark:bg-surface/20">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Solution</p>
                    <p className="mt-4 text-sm leading-7 text-muted">{project.solution}</p>
                  </section>
                ) : null}
                {project.impact ? (
                  <section className="rounded-[8px] border border-border bg-surface/60 p-6 dark:bg-surface/20">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Impact</p>
                    <p className="mt-4 text-sm leading-7 text-muted">{project.impact}</p>
                  </section>
                ) : null}
              </div>
            ) : null}

            {project.features.length > 0 || project.outcomes.length > 0 ? (
              <div className="mt-16 grid gap-10 md:grid-cols-2">
                {project.features.length > 0 ? (
                  <section>
                    <h2 className="font-display text-3xl font-black tracking-tight">Key Features</h2>
                    <div className="mt-6 grid gap-3">
                      {project.features.map((feature) => (
                        <div key={feature} className="flex gap-3 rounded-[8px] border border-border bg-surface/40 p-4 dark:bg-surface/10">
                          <CheckCircle2 size={18} className="mt-1 shrink-0 text-primary" />
                          <span className="text-sm leading-6 text-muted">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
                {project.outcomes.length > 0 ? (
                  <section>
                    <h2 className="font-display text-3xl font-black tracking-tight">Outcomes</h2>
                    <div className="mt-6 grid gap-3">
                      {project.outcomes.map((outcome) => (
                        <div key={outcome} className="flex gap-3 rounded-[8px] border border-border bg-surface/40 p-4 dark:bg-surface/10">
                          <Sparkles size={18} className="mt-1 shrink-0 text-primary" />
                          <span className="text-sm leading-6 text-muted">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : null}

            <div 
              className="prose-content mt-20 max-w-none text-lg leading-loose" 
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.content) }} 
            />

            {project.galleryImages.length > 0 ? (
              <section className="mt-20">
                <h2 className="font-display text-4xl font-black tracking-tight">Project Gallery</h2>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {project.galleryImages.map((imageUrl) => (
                    <div key={imageUrl} className="relative aspect-[16/10] overflow-hidden rounded-[8px] border border-border bg-surface">
                      <Image src={imageUrl} alt={`${project.title} screenshot`} fill className="object-cover" sizes="(min-width: 1024px) 360px, 100vw" />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-12">
            <div className="glass rounded-[8px] p-8">
              <h3 className="mb-6 flex items-center gap-2 font-display text-sm font-black uppercase tracking-[0.2em] text-primary">
                <Sparkles size={16} />
                Overview
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/50">Engagement</span>
                  <span className="text-2xl font-black">{project.views} views</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/50">Phase</span>
                  <span className="text-2xl font-black capitalize">{project.status}</span>
                </div>
                {overviewItems.map(([label, value]) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/50">{label}</span>
                    <span className="text-base font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass rounded-[8px] p-8">
              <h3 className="mb-6 font-display text-sm font-black uppercase tracking-[0.2em] text-primary">Core Tech</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {project.techStack.map((tech) => (
                  <span key={tech} className="text-sm font-bold tracking-tight text-muted transition-colors hover:text-text">{tech}</span>
                ))}
              </div>
            </div>

            {projectLinks.length > 0 ? (
              <div className="glass rounded-[8px] p-8">
                <h3 className="mb-6 flex items-center gap-2 font-display text-sm font-black uppercase tracking-[0.2em] text-primary">
                  <LinkIcon size={16} />
                  Links
                </h3>
                <div className="grid gap-3">
                  {projectLinks.map((link) => (
                    <Button key={`${link.label}-${link.url}`} href={link.url} target="_blank" variant="secondary" className="justify-between" icon={<ExternalLink size={16} />}>
                      {link.label}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="border-t border-border bg-surface/30 py-32 dark:bg-surface/5">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Next Steps</p>
                <h2 className="mt-4 font-display text-5xl font-black tracking-tight">Similar Builds</h2>
              </div>
              <Button href="/projects" variant="ghost" className="group" icon={<ArrowLeft size={18} className="rotate-180 transition-transform group-hover:translate-x-1" />}>
                All projects
              </Button>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              {related.map((item) => <ProjectCard key={item.id} project={item} />)}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
