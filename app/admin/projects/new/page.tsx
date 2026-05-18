"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2, Plus, X, Layout, Info, Code, Link as LinkIcon, Image as ImageIcon, Target } from "lucide-react";
import Link from "next/link";
import { FileUpload } from "@/components/ui/FileUpload";
import { motion } from "framer-motion";
import { cn, slugify } from "@/lib/utils";
import { Search } from "lucide-react";
import { AIAssistant } from "@/components/admin/AIAssistant";
import { AISuggestField } from "@/components/admin/AISuggestField";
import { normalize } from "@/lib/ai-autofill";
import type { ProjectDTO } from "@/lib/types";

interface ProjectLink {
  label: string;
  url: string;
}


export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const [projectLinks, setProjectLinks] = useState<ProjectLink[]>([]);
  const [isEditingSlug, setIsEditingSlug] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    subtitle: "",
    role: "",
    client: "",
    category: "",
    timeline: "",
    year: "",
    problem: "",
    solution: "",
    impact: "",
    features: "",
    outcomes: "",
    techStack: "",
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    galleryImages: "",
    tags: "",
    featured: false,
    status: "completed",
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
      features: formData.features.split("\n").filter(Boolean),
      outcomes: formData.outcomes.split("\n").filter(Boolean),
      techStack: formData.techStack.split("\n").filter(Boolean),
      galleryImages: formData.galleryImages.split("\n").filter(Boolean),
      tags: formData.tags.split("\n").filter(Boolean),
      projectLinks,
    };

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json() as { data?: ProjectDTO; error?: string; fields?: Record<string, string[]> };

      if (!res.ok) {
        if (json.fields) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.fields).forEach(([field, messages]) => {
            fieldErrors[field] = messages[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: json.error || "Failed to create project" });
        }
        return;
      }

      router.push("/admin/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      setErrors({ general: "Failed to create project" });
    } finally {
      setLoading(false);
    }
  };

  const addProjectLink = () => {
    setProjectLinks([...projectLinks, { label: "", url: "" }]);
  };

  const removeProjectLink = (index: number) => {
    setProjectLinks(projectLinks.filter((_, i) => i !== index));
  };

  const updateProjectLink = (index: number, field: keyof ProjectLink, value: string) => {
    setProjectLinks(projectLinks.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto pb-20"
    >
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/admin/projects" className="group inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Projects
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">New Project</h1>
            <p className="text-lg text-muted">Showcase your latest creation to the world.</p>
          </div>
        </div>

        <AIAssistant<ProjectDTO>
          module="projects"
          onFill={(data) => {
            const normalized = normalize("projects", data);
            if (Array.isArray(normalized.projectLinks)) {
              setProjectLinks(normalized.projectLinks as { label: string; url: string }[]);
            }
            setFormData(prev => ({ ...prev, ...normalized }));
          }}
        />

        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Basic Info */}
            <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Layout size={18} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Core Information</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="title">Project Title *</Label>
                      <AISuggestField label="Project Title" module="projects" field="title" context={formData} onApply={(v) => setFormData({ ...formData, title: v, slug: isEditingSlug ? formData.slug : slugify(v) })} />
                    </div>
                    <Input
                      id="title"
                      placeholder="e.g. Acme Dashboard"
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
                        <span className="text-text/40">{origin}/projects/</span>
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
                  <Label htmlFor="subtitle">Subtitle / Tagline</Label>
                  <Input
                    id="subtitle"
                    placeholder="e.g. A high-performance analytics platform"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Short Description *</Label>
                    <AISuggestField label="Short Description" module="projects" field="description" context={formData} onApply={(v) => setFormData({ ...formData, description: v })} />
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Provide a brief overview of the project..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={cn(errors.description && "border-red-500/50 focus:ring-red-500/10")}
                  />
                  {errors.description && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.description}</p>}
                </div>
              </div>
            </Card>

            {/* Case Study Details */}
            <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Target size={18} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Case Study Content</h2>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="problem">The Problem</Label>
                      <AISuggestField label="Problem" module="projects" field="problem" context={formData} onApply={(v) => setFormData({ ...formData, problem: v })} />
                    </div>
                    <Textarea
                      id="problem"
                      placeholder="What challenges did this project address?"
                      value={formData.problem}
                      onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="solution">The Solution</Label>
                      <AISuggestField label="Solution" module="projects" field="solution" context={formData} onApply={(v) => setFormData({ ...formData, solution: v })} />
                    </div>
                    <Textarea
                      id="solution"
                      placeholder="How did you solve these challenges?"
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="impact">The Impact</Label>
                      <AISuggestField label="Impact" module="projects" field="impact" context={formData} onApply={(v) => setFormData({ ...formData, impact: v })} />
                    </div>
                    <Textarea
                      id="impact"
                      placeholder="What was the result of your work?"
                      value={formData.impact}
                      onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content">Full Content (Markdown)</Label>
                    <AISuggestField label="Full Content" module="projects" field="content" context={formData} onApply={(v) => setFormData({ ...formData, content: v })} />
                  </div>
                  <Textarea
                    id="content"
                    placeholder="Write the complete case study or project details..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    className="font-mono text-sm leading-relaxed"
                  />
                </div>
              </div>
            </Card>

            {/* Technical arsenal */}
            <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Code size={18} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Technical Stack & Features</h2>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="techStack">Technologies</Label>
                    <Textarea
                      id="techStack"
                      placeholder="React\nTailwind CSS\nPrisma..."
                      value={formData.techStack}
                      onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                      rows={6}
                    />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted/60">One per line.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="features">Key Features</Label>
                    <Textarea
                      id="features"
                      placeholder="Real-time analytics\nAuthentication\nResponsive design..."
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      rows={6}
                    />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted/60">One per line.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-10">
            {/* Meta Info */}
            <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Info size={18} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Project Meta</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="status">Project Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="h-12 w-full rounded-2xl border border-border/50 bg-bg/50 px-5 text-sm text-text outline-none backdrop-blur-sm transition-all focus:border-primary/50 focus:bg-bg focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" placeholder="2024" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" placeholder="Web App" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Input id="client" placeholder="Personal Project" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} />
                </div>
                <label className="flex cursor-pointer items-center gap-3 group">
                  <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md border transition-all group-hover:border-primary/50",
                    formData.featured ? "bg-primary border-primary" : "bg-bg border-border"
                  )}>
                    {formData.featured && <div className="h-2 w-2 rounded-full bg-bg" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted group-hover:text-text transition-colors">Featured on Homepage</span>
                </label>
              </div>
            </Card>

            {/* SEO Info */}
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
                    <AISuggestField label="Meta Title" module="projects" field="seoTitle" context={formData} onApply={(v) => setFormData({ ...formData, seoTitle: v })} />
                  </div>
                  <Input 
                    id="seoTitle" 
                    placeholder="e.g. Acme Dashboard | My Portfolio" 
                    value={formData.seoTitle} 
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} 
                  />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted/60">Overrides default title.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seoDescription">Meta Description</Label>
                    <AISuggestField label="Meta Description" module="projects" field="seoDescription" context={formData} onApply={(v) => setFormData({ ...formData, seoDescription: v })} />
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
                    placeholder="e.g. React, Dashboard, Analytics" 
                    value={formData.seoKeywords} 
                    onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })} 
                  />
                </div>
              </div>
            </Card>

            {/* Links */}
            <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LinkIcon size={18} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Project Links</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="liveUrl">Live Demo URL</Label>
                  <Input id="liveUrl" placeholder="https://..." value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">Source Code URL</Label>
                  <Input id="githubUrl" placeholder="https://github.com/..." value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} />
                </div>
                <div className="space-y-4">
                  <Label>Additional Links</Label>
                  {projectLinks.map((link, index) => (
                    <div key={index} className="flex flex-col gap-2 p-4 rounded-2xl bg-bg/50 border border-border/50">
                      <Input
                        placeholder="Label (e.g. Documentation)"
                        value={link.label}
                        onChange={(e) => updateProjectLink(index, "label", e.target.value)}
                        className="h-10"
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://..."
                          value={link.url}
                          onChange={(e) => updateProjectLink(index, "url", e.target.value)}
                          className="h-10"
                        />
                        <Button type="button" variant="danger" size="sm" onClick={() => removeProjectLink(index)} className="rounded-xl">
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addProjectLink} className="w-full rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Link
                  </Button>
                </div>
              </div>
            </Card>

            {/* Media */}
            <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ImageIcon size={18} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Project Media</h2>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-2">
                  <Label>Hero Image *</Label>
                  <FileUpload
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    label="Upload project banner"
                  />
                  {errors.imageUrl && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.imageUrl}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="galleryImages">Gallery Image URLs</Label>
                  <Textarea
                    id="galleryImages"
                    placeholder="https://...\nhttps://..."
                    value={formData.galleryImages}
                    onChange={(e) => setFormData({ ...formData, galleryImages: e.target.value })}
                    rows={4}
                  />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted/60">One URL per line.</p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={loading} size="lg" className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Project
                  </>
                )}
              </Button>
              <Link href="/admin/projects" className="w-full">
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
        </form>
      </div>
    </motion.div>
  );
}
