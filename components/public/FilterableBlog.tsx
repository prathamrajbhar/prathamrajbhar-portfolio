"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { BlogCard } from "@/components/public/BlogCard";
import { Input } from "@/components/ui/Input";
import type { BlogPostDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FilterableBlog({ posts }: { posts: BlogPostDTO[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");
  
  const tags = useMemo(() => ["All", ...Array.from(new Set(posts.flatMap((post) => post.tags.map((tag) => tag.name))))], [posts]);
  
  const visible = posts.filter((post) => {
    const matchesTag = active === "All" || post.tags.some((tag) => tag.name === active);
    const haystack = `${post.title} ${post.tags.map((tag) => tag.name).join(" ")}`.toLowerCase();
    return matchesTag && haystack.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="mr-2 text-xs font-bold uppercase tracking-widest text-muted/60">Categories</span>
          {tags.map((tag) => (
            <button 
              key={tag} 
              onClick={() => setActive(tag)} 
              className={cn(
                "rounded-full px-5 py-2 text-sm font-bold transition-all duration-300",
                active === tag 
                  ? "bg-primary text-white shadow-lg shadow-primary/30" 
                  : "bg-surface/50 text-muted border border-border/50 hover:bg-surface hover:text-text dark:bg-surface/20"
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-sm">
          <div className="glass flex items-center gap-3 rounded-2xl px-4 py-1.5 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <Search size={18} className="text-muted/60" />
            <Input 
              className="border-0 bg-transparent px-0 py-2 focus:ring-0 placeholder:text-muted/50" 
              placeholder="Search articles..." 
              value={query} 
              onChange={(event) => setQuery(event.target.value)} 
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted/60 hover:text-text">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => <BlogCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[3rem] border border-dashed border-border bg-surface/30 p-12 text-center">
          <div className="mb-4 rounded-full bg-surface p-6 text-muted">
            <Search size={48} />
          </div>
          <h3 className="text-2xl font-bold">No articles found</h3>
          <p className="mt-2 text-muted max-w-sm">We couldn&apos;t find any posts matching your criteria. Try adjusting your search or filters.</p>
          <button 
            onClick={() => { setQuery(""); setActive("All"); }} 
            className="mt-6 font-bold text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
