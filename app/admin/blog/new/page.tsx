"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Loader2, FileText, Layout, Image as ImageIcon, Tags, Send, Link as LinkIcon, Search } from "lucide-react";
import Link from "next/link";
import { FileUpload } from "@/components/ui/FileUpload";
import { motion } from "framer-motion";
import { cn, slugify } from "@/lib/utils";
import { AIAssistant } from "@/components/admin/AIAssistant";
import { AISuggestField } from "@/components/admin/AISuggestField";
import { normalize } from "@/lib/ai-autofill";
import type { BlogPostDTO } from "@/lib/types";


export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const [isEditingSlug, setIsEditingSlug] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
    tags: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const data = {
      ...formData,
      tags: formData.tags.split("\n").filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json() as { data?: BlogPostDTO; error?: string; fields?: Record<string, string[]> };

      if (!res.ok) {
        if (json.fields) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.fields).forEach(([field, messages]) => {
            fieldErrors[field] = messages[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: json.error || "Failed to create blog post" });
        }
        return;
      }

      router.push("/admin/blog");
    } catch (error) {
      console.error("Error creating blog post:", error);
      setErrors({ general: "Failed to create blog post" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-20"
    >
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/admin/blog" className="group inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">New Blog Post</h1>
            <p className="text-lg text-muted">Share your thoughts and technical insights with the world.</p>
          </div>
        </div>

        <AIAssistant<BlogPostDTO>
          module="blog"
          onFill={(data) => setFormData(prev => ({ ...prev, ...normalize("blog", data) }))}
        />

        <form onSubmit={handleSubmit} className="grid gap-10">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column: Post Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Layout size={18} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Post Details</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="title">Post Title *</Label>
                        <AISuggestField
                          label="Post Title"
                          module="blog"
                          field="title"
                          context={formData}
                          onApply={(v) => setFormData({ ...formData, title: v, slug: isEditingSlug ? formData.slug : slugify(v) })}
                        />
                      </div>
                      <Input
                        id="title"
                        placeholder="e.g. My Journey into Web Development"
                        value={formData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setFormData({ 
                            ...formData, 
                            title, 
                            slug: isEditingSlug ? formData.slug : slugify(title) 
                          });
                        }}
                        className={cn("h-14 text-lg font-bold", errors.title && "border-red-500/50 focus:ring-red-500/10")}
                      />
                      <div className="flex items-center gap-2 px-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted/60">
                          <LinkIcon size={10} className="text-primary/50" />
                          <span>Permalink:</span>
                          <span className="text-text/40">{origin}/blog/</span>
                          {isEditingSlug ? (
                            <input
                              type="text"
                              value={formData.slug}
                              onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                              onBlur={() => setIsEditingSlug(false)}
                              autoFocus
                              className="bg-transparent border-none p-0 focus:ring-0 text-primary font-bold lowercase w-fit min-w-[50px] outline-none"
                            />
                          ) : (
                            <span 
                              className="text-primary font-bold cursor-pointer hover:underline decoration-dotted underline-offset-4"
                              onClick={() => setIsEditingSlug(true)}
                            >
                              {formData.slug || "auto-generated"}
                            </span>
                          )}
                        </div>
                        {errors.slug && <span className="text-[10px] font-bold uppercase text-red-500">— {errors.slug}</span>}
                      </div>
                      {errors.title && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.title}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="excerpt">Excerpt / Summary *</Label>
                      <AISuggestField
                        label="Excerpt"
                        module="blog"
                        field="excerpt"
                        context={formData}
                        onApply={(v) => setFormData({ ...formData, excerpt: v })}
                      />
                    </div>
                    <Textarea
                      id="excerpt"
                      placeholder="A short summary for the blog card..."
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={3}
                      className={cn(errors.excerpt && "border-red-500/50 focus:ring-red-500/10")}
                    />
                    {errors.excerpt && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.excerpt}</p>}
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText size={18} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Content Body</h2>
                </div>
                <div className="p-8 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content">Content Body</Label>
                    <AISuggestField
                      label="Content Body"
                      module="blog"
                      field="content"
                      context={formData}
                      onApply={(v) => setFormData({ ...formData, content: v })}
                    />
                  </div>
                  <Textarea
                    id="content"
                    placeholder="Write your article in Markdown..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={20}
                    className={cn("font-mono text-sm leading-relaxed", errors.content && "border-red-500/50 focus:ring-red-500/10")}
                  />
                  {errors.content && <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.content}</p>}
                </div>
              </Card>
            </div>

            {/* Right Column: Meta & Media */}
            <div className="space-y-8">
              <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ImageIcon size={18} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Cover Image</h2>
                </div>
                <div className="p-8">
                  <FileUpload
                    value={formData.coverImage}
                    onChange={(url) => setFormData({ ...formData, coverImage: url })}
                    label="Upload cover image"
                  />
                  {errors.coverImage && <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.coverImage}</p>}
                </div>
              </Card>

              <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Tags size={18} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Metadata</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Textarea
                      id="tags"
                      placeholder="React\nNext.js\nTutorial..."
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      rows={4}
                    />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted/60">One tag per line.</p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-3 group">
                    <div className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md border transition-all group-hover:border-primary/50",
                      formData.published ? "bg-primary border-primary" : "bg-bg border-border"
                    )}>
                      {formData.published && <div className="h-2 w-2 rounded-full bg-bg" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted group-hover:text-text transition-colors">Publish immediately</span>
                  </label>
                </div>
              </Card>

              {/* SEO Config */}
              <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Search size={18} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-text/80">SEO Configuration</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="seoTitle">Meta Title</Label>
                      <AISuggestField
                        label="Meta Title"
                        module="blog"
                        field="seoTitle"
                        context={formData}
                        onApply={(v) => setFormData({ ...formData, seoTitle: v })}
                      />
                    </div>
                    <Input
                      id="seoTitle"
                      placeholder="e.g. My Post Title | Blog"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted/60">Overrides default title.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="seoDescription">Meta Description</Label>
                      <AISuggestField
                        label="Meta Description"
                        module="blog"
                        field="seoDescription"
                        context={formData}
                        onApply={(v) => setFormData({ ...formData, seoDescription: v })}
                      />
                    </div>
                    <Textarea
                      id="seoDescription"
                      placeholder="Short, keyword-rich description..."
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seoKeywords">Keywords</Label>
                    <Input
                      id="seoKeywords"
                      placeholder="e.g. React, Tutorial, Web Dev"
                      value={formData.seoKeywords}
                      onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                    />
                  </div>
                </div>
              </Card>

              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={loading} size="lg" className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Publishing Article...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      {formData.published ? "Publish Post" : "Save Draft"}
                    </>
                  )}
                </Button>
                <Link href="/admin/blog" className="w-full">
                  <Button variant="outline" size="lg" className="w-full h-14 rounded-2xl">Cancel</Button>
                </Link>
              </div>

              {errors.general && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm font-bold text-red-500"
                >
                  {errors.general}
                </motion.div>
              )}
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
