"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2, Zap, Code, Search, LayoutGrid, Terminal, Globe, Database, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SkillDTO } from "@/lib/types";

const CATEGORY_STYLES: Record<string, { color: string; icon: typeof Globe; bg: string; border: string }> = {
  frontend: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Globe },
  backend: { color: "text-emerald-500", bg: "bg-emerald-400/10", border: "border-emerald-500/20", icon: Terminal },
  database: { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Database },
  mobile: { color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: Cpu },
  devops: { color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20", icon: Zap },
  default: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", icon: Code },
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/admin/skills");
        const json = await res.json() as { data?: SkillDTO[] };
        setSkills(json.data || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredSkills = skills.filter(s => 
    s.name.toLowerCase().includes(filter.toLowerCase()) || 
    s.category.toLowerCase().includes(filter.toLowerCase())
  );

  const getCategoryStyle = (category: string) => {
    const key = Object.keys(CATEGORY_STYLES).find(k => category.toLowerCase().includes(k)) || "default";
    return CATEGORY_STYLES[key];
  };

  // Group by category
  const groupedSkills = filteredSkills.reduce<Record<string, SkillDTO[]>>((acc, skill) => {
    const category = skill.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-muted">Indexing skills...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary w-fit">
            <Zap size={12} />
            Skill Matrix
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-text sm:text-5xl">Technical Arsenal</h1>
          <p className="text-muted max-w-2xl text-base">Manage and categorize the technologies, frameworks, and tools that define your professional expertise.</p>
        </div>

        <Link href="/admin/skills/new" className="shrink-0">
          <button className="group flex items-center gap-2.5 rounded-2xl bg-primary px-6 py-4 text-xs font-black uppercase tracking-widest text-bg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus size={16} className="transition-transform group-hover:rotate-90" />
            Inject New Skill
          </button>
        </Link>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search across name or category..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-12 w-full rounded-2xl border border-border/50 bg-surface/30 pl-12 pr-4 text-sm font-medium text-text outline-none backdrop-blur-md transition-all focus:border-primary/50 focus:bg-surface/50"
          />
        </div>
        
        <div className="flex h-12 items-center gap-2.5 rounded-2xl border border-border/50 bg-surface/30 px-5 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-muted shrink-0">
          <LayoutGrid size={14} className="text-primary/50" />
          <span>{filteredSkills.length} Total Units</span>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="space-y-12">
        {filteredSkills.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="flex flex-col items-center justify-center border-dashed border-border/50 bg-surface/10 p-16 text-center backdrop-blur-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-primary/5 text-primary mb-4 animate-pulse">
                <Zap size={32} />
              </div>
              <h3 className="font-display text-xl font-bold">No results found</h3>
              <p className="mt-1 text-sm text-muted max-w-sm mx-auto">Try refining your search or add a fresh skill to your professional toolkit.</p>
              <Button variant="outline" className="mt-6 rounded-xl" onClick={() => setFilter("")}>
                Clear Filters
              </Button>
            </Card>
          </motion.div>
        ) : (
          Object.entries(groupedSkills).map(([category, categorySkills]) => {
            const style = getCategoryStyle(category);
            const Icon = style.icon;
            
            return (
              <div key={category} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-center gap-3 border-b border-border/30 pb-3">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", style.bg, style.color)}>
                    <Icon size={16} />
                  </div>
                  <h2 className="text-base font-black uppercase tracking-widest text-text/90">{category}</h2>
                  <span className="rounded-full bg-surface/50 border border-border/50 px-2.5 py-0.5 text-[9px] font-black text-muted">
                    {categorySkills.length} Units
                  </span>
                </div>
                
                {/* Compact Skills Grid */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {categorySkills.map((skill) => (
                    <div 
                      key={skill.id} 
                      className="group relative flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-surface/20 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-surface/30"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Icon */}
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-bg border border-border/50 flex items-center justify-center p-2 shadow-inner">
                          {skill.iconUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={skill.iconUrl}
                              alt={skill.name}
                              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement?.querySelector('.icon-fallback')?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={cn(
                            "icon-fallback flex items-center justify-center text-primary/40",
                            skill.iconUrl ? "hidden" : ""
                          )}>
                            <Code size={18} />
                          </div>
                        </div>
                        
                        {/* Name & Order */}
                        <div className="min-w-0">
                          <h4 className="font-bold text-text truncate group-hover:text-primary transition-colors text-sm" title={skill.name}>{skill.name}</h4>
                          <span className="text-[10px] font-medium text-muted/50">Position #{skill.order}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Link href={`/admin/skills/edit/${skill.id}`}>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg border border-border/50 text-muted transition-all hover:bg-primary hover:text-bg hover:border-primary active:scale-90">
                            <Pencil size={14} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          disabled={deleting === skill.id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg border border-border/50 text-muted transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-90"
                        >
                          {deleting === skill.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
