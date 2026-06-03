"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { ProjectDTO } from "@/lib/types";
import { sanitizeHtml } from "@/lib/utils";

// Import modular subcomponents
import { ProjectHero } from "./project-detail/ProjectHero";
import { ProjectOverview } from "./project-detail/ProjectOverview";
import { ProjectCaseStudy } from "./project-detail/ProjectCaseStudy";
import { ProjectGallery } from "./project-detail/ProjectGallery";

interface ProjectDetailClientProps {
  project: ProjectDTO;
  related: ProjectDTO[];
}

export function ProjectDetailClient({ project, related }: ProjectDetailClientProps) {
  return (
    <article className="relative min-h-screen w-full pb-20 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[400px] -left-[200px] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[600px] -right-[200px] w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero Header Section */}
      <ProjectHero project={project} />

      {/* Main Grid Layout */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px] items-start">
          {/* Main Case Study Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {/* Context Narrative */}
            <motion.div variants={fadeInUp}>
              <p className="text-lg leading-relaxed text-muted sm:text-xl font-normal">
                {project.description}
              </p>
            </motion.div>

            {/* Case Study Cards (Problem, Solution, Impact, Features, Outcomes) */}
            <motion.div variants={fadeInUp}>
              <ProjectCaseStudy project={project} />
            </motion.div>

            {/* Structured HTML/Markdown Body Content */}
            {project.content && (
              <motion.div
                variants={fadeInUp}
                className="prose-content border-t border-border/40 pt-12"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.content) }}
              />
            )}

            {/* Project Screenshot Gallery */}
            <motion.div variants={fadeInUp}>
              <ProjectGallery project={project} />
            </motion.div>
          </motion.div>

          {/* Sticky Sidebar Meta Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProjectOverview project={project} />
          </motion.div>
        </div>
      </div>

      {/* Related Projects Section */}
      {related.length > 0 && (
        <section className="mt-12 border-t border-border/40 bg-surface/[0.01] py-20 dark:bg-surface/[0.02]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Discover More</p>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-gradient">
                  Similar Builds
                </h2>
              </div>
              <Button
                href="/projects"
                variant="ghost"
                className="group text-muted hover:text-text"
                icon={<ArrowLeft size={16} className="rotate-180 transition-transform group-hover:translate-x-1" />}
              >
                All projects
              </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
