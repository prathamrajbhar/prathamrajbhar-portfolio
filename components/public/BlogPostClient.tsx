"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Clock, Share2 } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { CopyCodeButtons } from "@/components/public/CopyCodeButtons";
import { ReadingProgress } from "@/components/public/ReadingProgress";
import { ViewTracker } from "@/components/public/ViewTracker";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { BlogPostDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BlogPostClient({ post, children }: { post: BlogPostDTO; children: ReactNode }) {
  return (
    <article className="relative min-h-screen pb-24">
      <ReadingProgress />
      <CopyCodeButtons />
      <ViewTracker path={`/api/blog/${post.id}`} />
      
      {/* Immersive Header */}
      <div className="relative h-[65vh] min-h-[500px] w-full overflow-hidden">
        <Image
          src={post.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop"}
          alt={post.title}
          fill
          priority
          className="object-cover transition-transform duration-700"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-bg)_100%)] opacity-40" />

        <div className="absolute inset-0 flex items-end pb-24">
          <div className="mx-auto w-full max-w-7xl px-6">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="muted" className="glass border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                    {tag.name}
                  </Badge>
                ))}
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="font-display text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                {post.title}
              </motion.h1>

              <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap items-center gap-8 text-sm font-bold uppercase tracking-widest text-white/70">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-white/90" />
                  {formatDate(post.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-white/90" />
                  {post.readingTime} min read
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-12 flex items-center justify-between border-b border-border pb-8">
            <Button href="/blog" variant="ghost" className="group -ml-4" icon={<ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />}>
              Back to journal
            </Button>
            <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors">
              <Share2 size={18} />
              Share
            </button>
          </div>
          
          <div className="prose-content text-lg leading-relaxed md:text-xl">{children}</div>
          
          <div className="mt-24 rounded-[8px] border border-border bg-surface/30 p-12 text-center dark:bg-surface/5">
            <h3 className="font-display text-2xl font-bold">Thanks for reading!</h3>
            <p className="mt-4 text-muted">I hope you found this implementation note useful. If you have any questions or feedback, feel free to reach out.</p>
            <div className="mt-8 flex justify-center gap-4">
              <Button href="/contact" size="lg">Get In Touch</Button>
              <Button href="/blog" variant="secondary" size="lg">Read More Posts</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
