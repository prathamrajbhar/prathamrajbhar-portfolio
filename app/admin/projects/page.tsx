"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2, Globe, Star, FolderOpen, Calendar, ArrowUpRight, Search, LayoutGrid, List } from "lucide-react";
import { Github as GithubIcon } from "@/components/ui/BrandIcons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProjectDTO } from "@/lib/types";


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/admin/projects");
        const json = await res.json() as { data?: ProjectDTO[] };
        setProjects(json.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(filter.toLowerCase()) || 
    p.description.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-sm font-black uppercase tracking-widest text-muted">Compiling projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <FolderOpen size={12} />
            Showcase Manager
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-6xl">Projects</h1>
          <p className="text-lg text-muted max-w-2xl">Curate your best engineering work, open-source contributions, and side projects for the world to see.</p>
        </div>
        <Link href="/admin/projects/new">
          <button className="group flex items-center gap-3 rounded-2xl bg-primary px-8 py-5 text-sm font-black uppercase tracking-widest text-bg shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Plus size={20} className="transition-transform group-hover:rotate-90" />
            Create Project
          </button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search across project titles or descriptions..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border/50 bg-surface/30 pl-12 pr-4 text-sm font-medium text-text outline-none backdrop-blur-md transition-all focus:border-primary/50 focus:bg-surface/50 focus:ring-4 focus:ring-primary/5"
          />
        </div>
        <div className="flex h-14 items-center gap-4 rounded-2xl border border-border/50 bg-surface/30 px-6 backdrop-blur-md">
          <div className="flex items-center gap-2 border-r border-border/50 pr-4">
            <button className="p-2 rounded-lg bg-primary text-bg transition-all active:scale-90">
              <List size={16} />
            </button>
            <button className="p-2 rounded-lg text-muted transition-all hover:bg-surface active:scale-90">
              <LayoutGrid size={16} />
            </button>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">{filteredProjects.length} Projects</span>
        </div>
      </div>

      {/* Projects List */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="flex flex-col items-center justify-center border-dashed border-border/50 bg-surface/10 p-24 text-center backdrop-blur-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-primary/5 text-primary mb-6 animate-pulse">
                  <FolderOpen size={40} />
                </div>
                <h3 className="font-display text-2xl font-bold">No projects found</h3>
                <p className="mt-2 text-muted max-w-sm mx-auto">It seems you haven&apos;t added any projects matching your search. Start by creating your first showcase item.</p>
                <Link href="/admin/projects/new" className="mt-8">
                  <Button className="rounded-xl px-8">Add First Project</Button>
                </Link>
              </Card>
            </motion.div>
          ) : (
            filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={item}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="group relative overflow-hidden border-border/50 bg-surface/30 p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                    {/* Icon/Preview Placeholder */}
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-bg border border-border/50 text-primary shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <FolderOpen size={36} />
                      <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface border border-border/50 shadow-lg group-hover:scale-110">
                        <Plus size={14} className="text-primary" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <h3 className="font-display text-2xl font-bold tracking-tight text-text group-hover:text-primary transition-colors truncate">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {project.featured && (
                            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-amber-500 border border-amber-500/20">
                              <Star size={10} fill="currentColor" />
                              Featured
                            </span>
                          )}
                          <span className={cn(
                            "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border",
                            project.status === "draft"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : project.status === "completed" 
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          )}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-base text-muted line-clamp-2 max-w-3xl leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="mt-6 flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted/60">
                          <Calendar size={14} />
                          Added {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-3">
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">
                              <Globe size={14} />
                              Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">
                              <GithubIcon size={14} />
                              Repository
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 lg:shrink-0 lg:border-l lg:border-border/50 lg:pl-8">
                      <Link href={`/admin/projects/edit/${project.id}`}>
                        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-primary hover:text-bg hover:border-primary active:scale-95">
                          <Pencil size={18} />
                        </button>
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deleting === project.id}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95"
                      >
                        {deleting === project.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>

                      <div className="hidden lg:block ml-2 text-muted/20">
                        <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform group-hover:text-primary group-hover:opacity-100" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
