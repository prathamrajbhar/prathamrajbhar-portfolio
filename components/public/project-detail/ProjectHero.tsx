"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, Layers } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { ProjectDTO } from "@/lib/types";

interface ProjectHeroProps {
  project: ProjectDTO;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  // Use default fallback banner if project image is null or fails to load
  const defaultBanner = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop";
  const [imgSrc, setImgSrc] = useState(project.imageUrl || defaultBanner);

  return (
    <section className="relative w-full py-8 md:py-16 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 right-0 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />
      
      <div className="mx-auto max-w-6xl px-6">
        {/* Navigation & Breadcrumbs */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
          <Button
            href="/projects"
            variant="ghost"
            className="group -ml-3 text-muted hover:text-text"
            icon={<ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />}
          >
            Back to gallery
          </Button>

          <nav className="flex items-center gap-2 text-xs font-semibold text-muted tracking-widest" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-primary transition-colors">PROJECTS</Link>
            <span>/</span>
            <span className="text-text truncate max-w-[150px] sm:max-w-none uppercase font-black tracking-widest text-primary/95">{project.title}</span>
          </nav>
        </div>

        {/* Hero Main Grid */}
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
          {/* Details Column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-4">
              {project.category && (
                <Badge variant="muted" className="flex items-center gap-1.5 bg-surface/50 border-border/60 px-3 py-1 text-xs text-muted">
                  <Layers size={12} />
                  {project.category}
                </Badge>
              )}
              {project.year && (
                <Badge variant="muted" className="flex items-center gap-1.5 bg-surface/50 border-border/60 px-3 py-1 text-xs text-muted">
                  <Calendar size={12} />
                  {project.year}
                </Badge>
              )}
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-gradient leading-tight"
            >
              {project.title}
            </motion.h1>

            {project.subtitle && (
              <motion.p
                variants={fadeInUp}
                className="mt-4 text-base sm:text-lg text-muted font-normal leading-relaxed max-w-xl"
              >
                {project.subtitle}
              </motion.p>
            )}

            {/* Quick action buttons */}
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3 w-full sm:w-auto">
              {project.liveUrl && (
                <Button
                  href={project.liveUrl}
                  target="_blank"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all"
                  icon={<ExternalLink size={18} />}
                >
                  Live Preview
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  href={project.githubUrl}
                  target="_blank"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto border-border hover:border-text/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all"
                  icon={<Github size={18} />}
                >
                  View Source
                </Button>
              )}
            </motion.div>
          </motion.div>

          {/* Image Card Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative group w-full"
          >
            {/* Soft Ambient Shadow Glow behind image */}
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-600/20 opacity-30 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
            
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface/30 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/20">
              <Image
                src={imgSrc}
                alt={project.title}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                sizes="(min-width: 1024px) 50vw, 100vw"
                onError={() => setImgSrc(defaultBanner)}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
