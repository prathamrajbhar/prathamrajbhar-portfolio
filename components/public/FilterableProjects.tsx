"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderOpen, 
  Star, 
  Cpu, 
  CheckCircle2, 
  Search, 
  X, 
  LayoutGrid, 
  List, 
  ArrowRight, 
  ExternalLink 
} from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import type { ProjectDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.98, y: 15 },
  show: { opacity: 1, scale: 1, y: 0 }
};

export function FilterableProjects({ projects }: { projects: ProjectDTO[] }) {
  const [activeTag, setActiveTag] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alpha">("newest");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  // ─── Stats Dashboard Calculations ──────────────────────────────────────────
  const totalProjects = projects.length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const uniqueTech = useMemo(() => {
    const techs = projects.flatMap((p) => 
      p.techStack.flatMap((tech) => tech.split(",").map((t) => t.trim().toLowerCase()))
    );
    return new Set(techs.filter(Boolean)).size;
  }, [projects]);
  const completedCount = projects.filter((p) => p.status === "completed").length;

  // ─── Compute Unique Tags with Project Counts ───────────────────────────────
  const tagsWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((project) => {
      project.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return [
      { name: "All", count: projects.length },
      ...Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    ];
  }, [projects]);

  // ─── Filter and Sort Visible Projects ──────────────────────────────────────
  const visible = useMemo(() => {
    let itemsFiltered = projects.filter((project) => {
      const matchesTag = activeTag === "All" || project.tags.includes(activeTag);
      const searchHaystack = `${project.title} ${project.description} ${project.techStack.join(" ")} ${project.tags.join(" ")}`.toLowerCase();
      const matchesSearch = searchHaystack.includes(query.toLowerCase());
      return matchesTag && matchesSearch;
    });

    if (sortBy === "newest") {
      itemsFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      itemsFiltered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "alpha") {
      itemsFiltered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return itemsFiltered;
  }, [projects, activeTag, query, sortBy]);

  const handleClearFilters = () => {
    setQuery("");
    setActiveTag("All");
    setSortBy("newest");
  };

  return (
    <div className="space-y-12">
      {/* ─── Stats Dashboard Row ─── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Projects", value: totalProjects, icon: FolderOpen, color: "text-primary bg-primary/5 border-primary/20" },
          { label: "Featured Work", value: featuredCount, icon: Star, color: "text-amber-500 bg-amber-500/5 border-amber-500/20" },
          { label: "Technologies Used", value: uniqueTech, icon: Cpu, color: "text-blue-500 bg-blue-500/5 border-blue-500/20" },
          { label: "Completed Projects", value: completedCount, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/20" }
        ].map((stat, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-2xl border border-border/50 bg-surface/30 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted/60">{stat.label}</span>
              <stat.icon size={20} className={cn("rounded-lg p-1.5", stat.color.split(" ").slice(0, 2).join(" "))} />
            </div>
            <div className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ─── Filtering Controls Bar ─── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-t border-border/30 pt-8">
        {/* Category Tags */}
        <div className="scrollbar-hide flex w-full flex-wrap gap-2.5">
          {tagsWithCounts.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => setActiveTag(name)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-xs",
                activeTag === name
                  ? "bg-text text-bg shadow-lg shadow-text/10"
                  : "bg-surface/50 text-muted border border-border/50 hover:border-primary/30 hover:bg-surface hover:text-text"
              )}
            >
              <span>{name}</span>
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[9px] font-black",
                activeTag === name ? "bg-bg/25 text-bg" : "bg-muted/10 text-muted"
              )}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Search & Sort Bar ─── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Live Search */}
        <div className="relative w-full max-w-md">
          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface/50 px-5 py-3.5 backdrop-blur-md focus-within:border-primary/50 focus-within:bg-surface transition-all duration-300">
            <Search size={18} className="text-muted/40" />
            <input
              type="text"
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted/30 focus:ring-0 focus:outline-none"
              placeholder="Search by project name, tech, or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted/40 hover:text-primary transition-colors">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Sort & Layout controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Sorting */}
          <div className="flex items-center gap-2 rounded-2xl border border-border/50 bg-surface/50 px-4 py-3.5 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted/50">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-text outline-none focus:outline-none cursor-pointer border-0 p-0 focus:ring-0"
            >
              <option value="newest" className="bg-bg text-text">Newest First</option>
              <option value="oldest" className="bg-bg text-text">Oldest First</option>
              <option value="alpha" className="bg-bg text-text">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center rounded-2xl border border-border/50 bg-surface/50 p-1.5 backdrop-blur-md">
            <button
              onClick={() => setLayout("grid")}
              className={cn(
                "rounded-xl p-2.5 transition-all duration-200",
                layout === "grid" ? "bg-text text-bg shadow-sm" : "text-muted hover:text-text"
              )}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setLayout("list")}
              className={cn(
                "rounded-xl p-2.5 transition-all duration-200",
                layout === "list" ? "bg-text text-bg shadow-sm" : "text-muted hover:text-text"
              )}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Query Status / Found Header */}
      {(query || activeTag !== "All") && (
        <div className="flex items-center justify-between border-b border-border/30 pb-4 text-xs font-bold uppercase tracking-[0.15em] text-muted/60">
          <span>
            Found {visible.length} {visible.length === 1 ? "project" : "projects"} matching your criteria
          </span>
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 text-primary hover:text-primary-hover transition-colors font-black uppercase tracking-widest text-[10px]"
          >
            Clear Filters <X size={12} />
          </button>
        </div>
      )}

      {/* ─── Projects Display ─── */}
      <AnimatePresence mode="wait">
        {visible.length > 0 ? (
          <motion.div
            key={layout + activeTag + sortBy + query}
            variants={container}
            initial="hidden"
            animate="show"
            className={cn(
              layout === "grid" 
                ? "grid gap-10 sm:grid-cols-2 lg:grid-cols-3" 
                : "flex flex-col gap-4"
            )}
          >
            {visible.map((project) => (
              <motion.div key={project.id} variants={item}>
                {layout === "grid" ? (
                  <ProjectCard project={project} />
                ) : (
                  <ProjectListItem project={project} />
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-surface/30 p-12 text-center backdrop-blur-sm"
          >
            <div className="mb-6 rounded-full bg-primary/5 p-6 text-primary/30">
              <Search size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight">No projects found</h3>
            <p className="mt-3 text-muted max-w-xs mx-auto leading-relaxed">We couldn&apos;t find any projects matching your current filters or search terms.</p>
            <button 
              onClick={handleClearFilters} 
              className="mt-8 rounded-xl bg-primary px-8 py-4 text-xs font-black uppercase tracking-widest text-bg shadow-xl shadow-primary/10 transition-all hover:scale-105 active:scale-95"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Compact List Item Component for Bulk Navigation ────────────────────────
function ProjectListItem({ project }: { project: ProjectDTO }) {
  const techItems = project.techStack
    .flatMap((tech) => tech.split(",").map((t) => t.trim()))
    .filter(Boolean);

  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-border/50 bg-surface/20 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-surface/30 md:flex-row md:items-center md:justify-between">
      <div className="flex-1 min-w-0 space-y-2.5">
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/projects/${project.slug}`}>
            <h3 className="font-display text-lg font-bold tracking-tight text-text group-hover:text-primary transition-colors">
              {project.title}
            </h3>
          </Link>
          {project.featured && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-500 border border-amber-500/20">
              <Star size={8} fill="currentColor" />
              Featured
            </span>
          )}
          {project.year && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted/40 md:ml-auto">
              {project.year}
            </span>
          )}
        </div>
        <p className="text-sm text-muted line-clamp-1 max-w-4xl">
          {project.description}
        </p>
        
        {/* Tech Stack */}
        {techItems.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {techItems.map((tech, idx) => (
              <span key={`${tech}-${idx}`} className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-semibold text-muted/80 border border-border/30">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0 border-t border-border/20 pt-4 md:border-t-0 md:pt-0 md:pl-6 md:border-l md:border-border/30">
        <div className="flex items-center gap-3.5 text-muted/65">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-primary transition-colors"
              aria-label="View Source Code"
            >
              <Github size={16} />
            </a>
          )}
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-primary transition-colors"
              aria-label="View Live Site"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
        
        <Link 
          href={`/projects/${project.slug}`} 
          className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary hover:text-primary-hover transition-colors"
        >
          View Case Study
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
