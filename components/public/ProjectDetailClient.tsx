"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, ExternalLink, LinkIcon, Sparkles, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import Image from "next/image";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { ProjectDTO } from "@/lib/types";
import { sanitizeHtml } from "@/lib/utils";

export function ProjectDetailClient({ project, related }: { project: ProjectDTO; related: ProjectDTO[] }) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const projectLinks = Array.isArray(project.projectLinks) ? project.projectLinks : [];

  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImageIndex(null);
      } else if (e.key === "ArrowLeft" && project.galleryImages.length > 1) {
        setActiveImageIndex((prev) => (prev === null || prev === 0 ? project.galleryImages.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight" && project.galleryImages.length > 1) {
        setActiveImageIndex((prev) => (prev === null || prev === project.galleryImages.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, project.galleryImages]);
  const overviewItems = [
    ["Role", project.role],
    ["Client", project.client],
    ["Category", project.category],
    ["Timeline", project.timeline],
    ["Year", project.year]
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <article className="relative min-h-screen">
      <div className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop"}
          alt={project.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

        <div className="absolute inset-0 flex items-end pb-16">
          <div className="mx-auto w-full max-w-5xl px-6">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-5">
                <Badge variant={project.status === "completed" ? "success" : "warning"} className="bg-white/10 text-white border-white/20">
                  {project.status}
                </Badge>
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="muted" className="bg-white/10 text-white border-white/20">
                    {tech}
                  </Badge>
                ))}
              </motion.div>
              <motion.h1 variants={fadeInUp} className="font-display text-4xl tracking-tight text-white sm:text-5xl lg:text-6xl">
                {project.title}
              </motion.h1>
              {project.subtitle ? (
                <motion.p variants={fadeInUp} className="mt-4 max-w-2xl text-lg text-white/80 sm:text-xl">
                  {project.subtitle}
                </motion.p>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-16 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-10 flex items-center justify-between border-b border-border pb-6">
              <Button href="/projects" variant="ghost" className="group -ml-3" icon={<ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />}>
                Back to gallery
              </Button>
              <div className="flex gap-3">
                {project.githubUrl ? (
                  <Button href={project.githubUrl} variant="secondary" size="md" icon={<Github size={16} />}>Source</Button>
                ) : null}
                {project.liveUrl ? (
                  <Button href={project.liveUrl} size="md" icon={<ExternalLink size={16} />}>Live</Button>
                ) : null}
              </div>
            </div>

            <p className="text-xl leading-relaxed text-muted sm:text-2xl">
              {project.description}
            </p>

            {project.problem || project.solution || project.impact ? (
              <div className="mt-14 grid gap-4 md:grid-cols-3">
                {project.problem ? (
                  <section className="rounded-xl border border-border bg-surface p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">Problem</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{project.problem}</p>
                  </section>
                ) : null}
                {project.solution ? (
                  <section className="rounded-xl border border-border bg-surface p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">Solution</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{project.solution}</p>
                  </section>
                ) : null}
                {project.impact ? (
                  <section className="rounded-xl border border-border bg-surface p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">Impact</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{project.impact}</p>
                  </section>
                ) : null}
              </div>
            ) : null}

            {project.features.length > 0 || project.outcomes.length > 0 ? (
              <div className="mt-14 grid gap-8 md:grid-cols-2">
                {project.features.length > 0 ? (
                  <section>
                    <h2 className="font-display text-xl tracking-tight">Key Features</h2>
                    <div className="mt-5 grid gap-2">
                      {project.features.map((feature) => (
                        <div key={feature} className="flex gap-3 rounded-xl border border-border bg-surface p-4">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                          <span className="text-sm text-muted">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
                {project.outcomes.length > 0 ? (
                  <section>
                    <h2 className="font-display text-xl tracking-tight">Outcomes</h2>
                    <div className="mt-5 grid gap-2">
                      {project.outcomes.map((outcome) => (
                        <div key={outcome} className="flex gap-3 rounded-xl border border-border bg-surface p-4">
                          <Sparkles size={16} className="mt-0.5 shrink-0 text-primary" />
                          <span className="text-sm text-muted">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : null}

            <div
              className="prose-content mt-16 max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.content) }}
            />

            {project.galleryImages.length > 0 ? (
              <section className="mt-16">
                <h2 className="font-display text-2xl tracking-tight">Project Gallery</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.galleryImages.map((imageUrl, index) => (
                    <div
                      key={imageUrl}
                      onClick={() => setActiveImageIndex(index)}
                      className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-surface cursor-pointer group hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                    >
                      <Image
                        src={imageUrl}
                        alt={`${project.title} screenshot`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 320px, 100vw"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-8">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
                <Sparkles size={14} />
                Overview
              </h3>
              <div className="space-y-5">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted">Phase</span>
                  <span className="mt-1 text-lg font-medium capitalize">{project.status}</span>
                </div>
                {overviewItems.map(([label, value]) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted">{label}</span>
                    <span className="mt-1 text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-5 text-xs font-medium uppercase tracking-widest text-primary">Core Tech</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="text-sm text-muted">{tech}</span>
                ))}
              </div>
            </div>

            {projectLinks.length > 0 ? (
              <div className="rounded-xl border border-border bg-surface p-6">
                <h3 className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
                  <LinkIcon size={14} />
                  Links
                </h3>
                <div className="grid gap-2">
                  {projectLinks.map((link) => (
                    <Button key={`${link.label}-${link.url}`} href={link.url} target="_blank" variant="secondary" className="justify-between text-sm" icon={<ExternalLink size={14} />}>
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
        <section className="border-t border-border bg-surface/50 py-20 dark:bg-surface/20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-primary">More</p>
                <h2 className="mt-3 font-display text-2xl tracking-tight sm:text-3xl">Similar Builds</h2>
              </div>
              <Button href="/projects" variant="ghost" icon={<ArrowLeft size={16} className="rotate-180" />}>
                All projects
              </Button>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((item) => <ProjectCard key={item.id} project={item} />)}
            </div>
          </div>
        </section>
      ) : null}

      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md"
            onClick={() => setActiveImageIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full transition-all duration-300 z-50 cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            {/* Next / Prev buttons */}
            {project.galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === null || prev === 0 ? project.galleryImages.length - 1 : prev - 1));
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/15 hover:scale-105 active:scale-95 text-white rounded-full transition-all duration-300 z-50 cursor-pointer"
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === null || prev === project.galleryImages.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/15 hover:scale-105 active:scale-95 text-white rounded-full transition-all duration-300 z-50 cursor-pointer"
                  aria-label="Next Image"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Main image container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-5xl max-h-[80vh] w-full aspect-[16/10] md:aspect-auto md:h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={project.galleryImages[activeImageIndex]}
                alt="Enlarged screenshot"
                fill
                priority
                className="object-contain max-h-[80vh] select-none pointer-events-none"
                sizes="100vw"
              />
            </motion.div>

            {/* Indicator / caption */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs font-black uppercase tracking-[0.2em] bg-white/5 px-6 py-3 border border-white/10 rounded-full backdrop-blur-md z-50 select-none">
              {activeImageIndex + 1} / {project.galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
