"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2, FileText, Layout, Image as ImageIcon, Tags, Link as LinkIcon, Search } from "lucide-react";
import Link from "next/link";
import { FileUpload } from "@/components/ui/FileUpload";
import { motion } from "framer-motion";
import { cn, slugify } from "@/lib/utils";
import { AIAssistant } from "@/components/admin/AIAssistant";
import { normalize } from "@/lib/ai-autofill";
import type { BlogPostDTO } from "@/lib/types";


export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams<{ adminId: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [post, setPost] = useState<BlogPostDTO | null>(null);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

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

  useEffect(() => {
    if (params.adminId) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/admin/blog/${params.adminId}`);
          const json = await res.json() as { data?: BlogPostDTO };
          const data = json.data;

          if (data) {
            setPost(data);
            setFormData({
              title: data.title,
              slug: data.slug,
              excerpt: data.excerpt,
              content: data.content,
              coverImage: data.coverImage || "",
              published: data.published,
              tags: data.tags.join("\n"),
              seoTitle: data.seoTitle || "",
              seoDescription: data.seoDescription || "",
              seoKeywords: data.seoKeywords || "",
            });
          }
        } catch (error) {
          console.error("Error fetching blog post:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [params.adminId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const data = {
      ...formData,
      tags: formData.tags.split("\n").filter(Boolean),
    };

    try {
      const res = await fetch(`/api/admin/blog/${params.adminId}`, {
        method: "PUT",
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
          setErrors({ general: json.error || "Failed to update blog post" });
        }
        return;
      }

      router.push("/admin/blog");
    } catch (error) {
      console.error("Error updating blog post:", error);
      setErrors({ general: "Failed to update blog post" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-sm font-medium text-muted">Loading article details...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 mb-6">
          <FileText size={32} />
        </div>
        <h3 className="text-xl font-bold text-text">Article not found</h3>
        <Link href="/admin/blog" className="mt-8">
          <Button variant="outline" className="rounded-xl">Go Back</Button>
        </Link>
      </div>
    );
  }

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
            <h1 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">Edit Blog Post</h1>
            <p className="text-lg text-muted">Updating <span className="text-primary font-bold">{formData.title}</span>.</p>
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
                      <Label htmlFor="title">Post Title *</Label>
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
                              {formData.slug}
                            </span>
                          )}
                        </div>
                        {errors.slug && <span className="text-[10px] font-bold uppercase text-red-500">— {errors.slug}</span>}
                      </div>
                      {errors.title && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.title}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt / Summary *</Label>
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
                <div className="p-8">
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
                    <span className="text-xs font-bold uppercase tracking-widest text-muted group-hover:text-text transition-colors">Published</span>
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
                    <Label htmlFor="seoTitle">Meta Title</Label>
                    <Input
                      id="seoTitle"
                      placeholder="e.g. My Post Title | Blog"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted/60">Overrides default title.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seoDescription">Meta Description</Label>
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
                <Button type="submit" disabled={saving} size="lg" className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
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
