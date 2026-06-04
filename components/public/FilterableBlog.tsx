"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogCard } from "@/components/public/BlogCard";
import { Button } from "@/components/ui/Button";
import type { BlogPostDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function FilterableBlog({ posts }: { posts: BlogPostDTO[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");

  // Compute unique tags with counts sorted by frequency
  const tagsWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return [
      { name: "All", count: posts.length },
      ...Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    ];
  }, [posts]);

  // Filter posts based on active tag and search query
  const visible = useMemo(() => posts.filter((post) => {
    const matchesTag = active === "All" || post.tags.some((tag) => tag === active);
    const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
    return matchesTag && haystack.includes(query.toLowerCase());
  }), [posts, active, query]);

  const handleClearFilters = useCallback(() => {
    setQuery("");
    setActive("All");
  }, []);

  return (
    <div className="space-y-12">
      {/* Search & Filtering Controls */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Tags */}
        <div className="scrollbar-hide flex flex-wrap items-center gap-3">
          {tagsWithCounts.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => setActive(name)}
              className={cn(
                "flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                active === name
                  ? "bg-text text-bg shadow-lg shadow-text/10"
                  : "bg-surface/50 text-muted border border-border/50 hover:border-primary/30 hover:bg-surface hover:text-text"
              )}
            >
              <span>{name}</span>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-black",
                active === name
                  ? "bg-bg/25 text-bg"
                  : "bg-muted/10 text-muted"
              )}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Premium Search Box */}
        <div className="relative w-full max-w-sm">
          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface/50 px-5 py-3.5 backdrop-blur-md focus-within:border-primary/50 focus-within:bg-surface transition-all duration-300">
            <Search size={18} className="text-muted/40" />
            <input
              type="text"
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted/30 focus:ring-0 focus:outline-none"
              placeholder="Search technical articles..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button 
                onClick={() => setQuery("")} 
                className="text-muted/40 hover:text-primary transition-colors"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Query Status / Found Header */}
      {(query || active !== "All") && (
        <div className="flex items-center justify-between border-b border-border/30 pb-4 text-xs font-bold uppercase tracking-[0.15em] text-muted/60">
          <span>
            Found {visible.length} {visible.length === 1 ? "article" : "articles"} matching your criteria
          </span>
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 text-primary hover:text-primary-hover transition-colors font-black uppercase tracking-widest text-[10px]"
          >
            Clear Filters <X size={12} />
          </button>
        </div>
      )}

      {/* Blog Cards Grid */}
      <AnimatePresence mode="popLayout">
        {visible.length > 0 ? (
          <motion.div 
            key={active + query}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((post) => (
              <motion.div key={post.id} variants={item}>
                <BlogCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-surface/30 p-12 text-center backdrop-blur-sm"
          >
            <div className="mb-6 rounded-full bg-primary/5 p-6 text-primary/30">
              <Search size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight">No articles found</h3>
            <p className="mt-3 text-muted max-w-xs mx-auto leading-relaxed">We couldn&apos;t find any articles matching your current search or filters.</p>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="mt-8 rounded-xl px-8"
            >
              Clear all filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
