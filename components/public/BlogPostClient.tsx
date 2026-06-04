"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Clock, Share2, Check } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useState } from "react";
import { ReadingProgress } from "@/components/public/ReadingProgress";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { BlogPostDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BlogPostClient({ post, children }: { post: BlogPostDTO; children: ReactNode }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
      } catch {
        // User dismissed or error — do nothing
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <article className="relative min-h-screen pb-24">
      <ReadingProgress />

      <div className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={post.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop"}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

        <div className="absolute inset-0 flex items-end pb-16">
          <div className="mx-auto w-full max-w-4xl px-6">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-5">
                {post.tags.map((tag, index) => (
                  <Badge key={`${tag}-${index}`} variant="muted" className="bg-white/10 text-white border-white/20">
                    {tag}
                  </Badge>
                ))}
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-display text-3xl tracking-tight text-white sm:text-5xl">
                {post.title}
              </motion.h1>

              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap items-center gap-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <CalendarDays size={15} />
                  {formatDate(post.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} />
                  {post.readingTime} min read
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-10 flex items-center justify-between border-b border-border pb-6">
            <Button href="/blog" variant="ghost" className="group -ml-3" icon={<ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />}>
              Back to journal
            </Button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
              aria-label="Share this post"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
              {copied ? "Copied!" : "Share"}
            </button>
          </div>

          <div className="prose-content">{children}</div>

          <div className="mt-20 rounded-2xl border border-border bg-surface p-10 text-center">
            <h3 className="font-display text-xl tracking-tight">Thanks for reading!</h3>
            <p className="mt-3 text-sm text-muted">If you have any questions or feedback, feel free to reach out.</p>
            <div className="mt-6 flex justify-center gap-4">
              <Button href="/contact" size="lg">Get In Touch</Button>
              <Button href="/blog" variant="secondary" size="lg">More Posts</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
