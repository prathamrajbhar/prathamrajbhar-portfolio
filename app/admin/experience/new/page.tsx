"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2, MapPin, Calendar, Building2, AlignLeft, Sparkles, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AIAssistant } from "@/components/admin/AIAssistant";
import { AISuggestField } from "@/components/admin/AISuggestField";
import { IconSelector } from "@/components/admin/IconSelector";
import { normalize } from "@/lib/ai-autofill";
import type { ExperienceDTO } from "@/lib/types";


export default function NewExperiencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    type: "Full-time",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    skills: "",
    logoUrl: "",
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const data = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      skills: formData.skills.split("\n").filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json() as { data?: ExperienceDTO; error?: string; fields?: Record<string, string[]> };

      if (!res.ok) {
        if (json.fields) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.fields).forEach(([field, messages]) => {
            fieldErrors[field] = messages[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: json.error || "Failed to create experience" });
        }
        return;
      }

      router.push("/admin/experience");
    } catch (error) {
      console.error("Error creating experience:", error);
      setErrors({ general: "Failed to create experience" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto pb-20"
    >
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/admin/experience" className="group inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Experience
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">New Experience</h1>
            <p className="text-lg text-muted">Add a new milestone to your professional journey.</p>
          </div>
        </div>

        <AIAssistant<ExperienceDTO>
          module="experience"
          onFill={(data) => setFormData(prev => ({ ...prev, ...normalize("experience", data) }))}
        />

        <form onSubmit={handleSubmit} className="grid gap-10">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 size={18} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Organization Details</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="company">Company Name *</Label>
                        <AISuggestField label="Company Name" module="experience" field="company" context={formData} onApply={(v) => setFormData({ ...formData, company: v })} />
                      </div>
                      <Input
                        id="company"
                        placeholder="e.g. Google"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={cn(errors.company && "border-red-500/50 focus:ring-red-500/10")}
                      />
                      {errors.company && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.company}</p>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="role">Role / Position *</Label>
                        <AISuggestField label="Role" module="experience" field="role" context={formData} onApply={(v) => setFormData({ ...formData, role: v })} />
                      </div>
                      <Input
                        id="role"
                        placeholder="e.g. Senior Frontend Developer"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className={cn(errors.role && "border-red-500/50 focus:ring-red-500/10")}
                      />
                      {errors.role && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.role}</p>}
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-primary transition-colors" />
                        <Input
                          id="location"
                          placeholder="e.g. San Francisco, CA (Remote)"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="pl-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Employment Type</Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="h-12 w-full rounded-2xl border border-border/50 bg-bg/50 px-5 text-sm text-text outline-none backdrop-blur-sm transition-all focus:border-primary/50 focus:bg-bg focus:ring-4 focus:ring-primary/10"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar size={18} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Timeline</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className={cn(errors.startDate && "border-red-500/50 focus:ring-red-500/10")}
                      />
                      {errors.startDate && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.startDate}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className={cn(formData.current && "opacity-50")}>End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        disabled={formData.current}
                      />
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-center gap-3 group">
                    <div className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md border transition-all group-hover:border-primary/50",
                      formData.current ? "bg-primary border-primary" : "bg-bg border-border"
                    )}>
                      {formData.current && <div className="h-2 w-2 rounded-full bg-bg" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.current}
                      onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: e.target.checked ? "" : formData.endDate })}
                    />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted group-hover:text-text transition-colors">I currently work here</span>
                  </label>
                </div>
              </Card>

              <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <AlignLeft size={18} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Description</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description">What did you do? *</Label>
                      <AISuggestField label="Description" module="experience" field="description" context={formData} onApply={(v) => setFormData({ ...formData, description: v })} />
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Describe your responsibilities, achievements, and impact..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={8}
                      className={cn(errors.description && "border-red-500/50 focus:ring-red-500/10")}
                    />
                    {errors.description && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.description}</p>}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Meta & Skills */}
            <div className="space-y-8">
              <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles size={18} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Skills</h2>
                </div>
                <div className="p-8">
                  <Label htmlFor="skills">Technologies Used</Label>
                  <Textarea
                    id="skills"
                    placeholder="React\nNext.js\nTypeScript..."
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    rows={6}
                    className="mt-2"
                  />
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-muted/60">Enter one skill per line.</p>
                </div>
              </Card>

              <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ImageIcon size={18} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Company Logo</h2>
                </div>
                <div className="p-8">
                  <IconSelector
                    value={formData.logoUrl}
                    onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                    label="Company Logo"
                  />
                  {errors.logoUrl && <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.logoUrl}</p>}
                </div>
              </Card>

              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={loading} size="lg" className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Milestone...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Experience
                    </>
                  )}
                </Button>
                <Link href="/admin/experience">
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
