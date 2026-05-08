import type { Metadata } from "next";
import { FilterableBlog } from "@/components/public/FilterableBlog";
import { fetchApi } from "@/lib/server-data";
import type { BlogPostDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Engineering writing, implementation notes, and product lessons."
};

export default async function BlogPage() {
  const posts = await fetchApi<BlogPostDTO[]>("/blog", []);
  return (
    <div className="relative overflow-hidden">
      {/* Background Visuals */}
      <div className="mesh-gradient absolute inset-0 opacity-10" />
      
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Journal</p>
          <h1 className="mt-6 font-display text-5xl font-black tracking-tight sm:text-7xl">
            Writing from the <span className="text-gradient">Build Floor.</span>
          </h1>
          <p className="mt-8 text-xl leading-relaxed text-muted/90">
            Notes on engineering systems, implementation details, and the lessons learned while building digital products.
          </p>
        </div>

        <div className="mt-20">
          <FilterableBlog posts={posts} />
        </div>
      </section>
    </div>
  );
}
