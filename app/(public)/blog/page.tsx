import type { Metadata } from "next";
import { FilterableBlog } from "@/components/public/FilterableBlog";
import { getBlogPosts, getSiteSettings } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, guides, and insights.",
  alternates: {
    canonical: "/blog"
  }
};

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([
    getBlogPosts(),
    getSiteSettings().then(s => s || defaultSettings),
  ]);
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg/50">
      {/* Background Decorative Elements */}
      <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{settings.blogSubtitle || "Blog"}</p>
          <h1 className="mt-6 font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">
            {settings.blogTitle?.split(" ").slice(0, -2).join(" ")} <br /><span className="text-gradient">{settings.blogTitle?.split(" ").slice(-2).join(" ")}</span>
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted lg:text-xl">
            {settings.blogIntro || ""}
          </p>
        </div>

        <div className="mt-16">
          <FilterableBlog posts={posts} />
        </div>
      </section>
    </div>
  );
}
