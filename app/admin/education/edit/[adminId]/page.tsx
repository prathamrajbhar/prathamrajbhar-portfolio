"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2, GraduationCap, Building2, BookOpen, Calendar, MapPin, Hash, Star, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn, slugify } from "@/lib/utils";
import { AIAssistant } from "@/components/admin/AIAssistant";
import { normalize } from "@/lib/ai-autofill";
import type { EducationDTO } from "@/lib/types";


export default function EditEducationPage() {
  const router = useRouter();
  const params = useParams<{ adminId: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [education, setEducation] = useState<EducationDTO | null>(null);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const [formData, setFormData] = useState({
    slug: "",
    institution: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
    current: false,
    description: "",
    gpa: "",
    location: "",
    order: 0,
  });

  useEffect(() => {
    if (params.adminId) {
      const fetchEducation = async () => {
        try {
          const res = await fetch(`/api/admin/education/${params.adminId}`);
          const json = await res.json() as { data?: EducationDTO };
          const data = json.data;
          if (data) {
            setEducation(data);
            setFormData({
              slug: data.slug || "",
              institution: data.institution,
              degree: data.degree,
              field: data.field || "",
              startYear: data.startYear,
              endYear: data.endYear || "",
              current: data.current,
              description: data.description || "",
              gpa: data.gpa || "",
              location: data.location || "",
              order: 0,
            });
          }
        } catch (error) {
          console.error("Error fetching education:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEducation();
    }
  }, [params.adminId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const res = await fetch(`/api/admin/education/${params.adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json() as { data?: EducationDTO; error?: string; fields?: Record<string, string[]> };

      if (!res.ok) {
        if (json.fields) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.fields).forEach(([field, messages]) => {
            fieldErrors[field] = messages[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: json.error || "Failed to update education" });
        }
        return;
      }

      router.push("/admin/education");
    } catch (error) {
      console.error("Error updating education:", error);
      setErrors({ general: "Failed to update education" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-sm font-medium text-muted">Loading education details...</p>
      </div>
    );
  }

  if (!education) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 mb-6">
          <GraduationCap size={32} className="opacity-50" />
        </div>
        <h2 className="text-2xl font-bold">Education entry not found</h2>
        <p className="mt-2 text-muted">The education entry you are trying to edit does not exist.</p>
        <Link href="/admin/education" className="mt-8">
          <Button variant="outline" className="rounded-2xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Education
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/admin/education" className="group inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Education
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">Edit Education</h1>
            <p className="text-lg text-muted">Refine your academic background details.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/education">
              <Button variant="outline" size="lg" className="rounded-2xl px-8">Cancel</Button>
            </Link>
            <Button onClick={handleSubmit} disabled={saving} size="lg" className="rounded-2xl px-8 shadow-xl shadow-primary/20 min-w-[160px]">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <AIAssistant<EducationDTO>
        module="education"
        onFill={(data) => setFormData(prev => ({ ...prev, ...normalize("education", data) }))}
      />

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Core Details */}
        <div className="lg:col-span-8 space-y-8">
          {errors.general && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm font-bold text-red-500">
              {errors.general}
            </motion.div>
          )}

          <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
            <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap size={18} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Academic Details</h2>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <div className="relative">
                    <Input
                      id="institution"
                      placeholder="e.g. Stanford University"
                      value={formData.institution}
                      onChange={(e) => {
                        const institution = e.target.value;
                        setFormData({ 
                          ...formData, 
                          institution, 
                          slug: slugify(`${institution} ${formData.degree}`) 
                        });
                      }}
                      className={cn("pl-10", errors.institution && "border-red-500/50 focus:ring-red-500/10")}
                    />
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                  </div>
                  {errors.institution && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.institution}</p>}
                </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree *</Label>
                      <div className="relative">
                        <Input
                          id="degree"
                          placeholder="e.g. Bachelor of Science"
                          value={formData.degree}
                          onChange={(e) => {
                            const degree = e.target.value;
                            setFormData({ 
                              ...formData, 
                              degree, 
                              slug: isEditingSlug ? formData.slug : slugify(`${formData.institution} ${degree}`) 
                            });
                          }}
                          className={cn("pl-10", errors.degree && "border-red-500/50 focus:ring-red-500/10")}
                        />
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-2 px-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted/60">
                          <LinkIcon size={10} className="text-primary/50" />
                          <span>Permalink:</span>
                          <span className="text-text/40">{origin}/education/</span>
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
                      {errors.degree && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.degree}</p>}
                    </div>
                  </div>
              </div>

                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study</Label>
                  <Input
                    id="field"
                    placeholder="e.g. Computer Science"
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                <Label htmlFor="description">Academic Description</Label>
                <Textarea
                  id="description"
                  placeholder="Key courses, extracurricular activities, honors..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Logistics */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
            <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar size={18} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Logistics</h2>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startYear">Start Year *</Label>
                  <Input
                    id="startYear"
                    placeholder="2018"
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                    className={cn(errors.startYear && "border-red-500/50 focus:ring-red-500/10")}
                  />
                  {errors.startYear && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.startYear}</p>}
                </div>
                {!formData.current && (
                  <div className="space-y-2">
                    <Label htmlFor="endYear">End Year</Label>
                    <Input
                      id="endYear"
                      placeholder="2022"
                      value={formData.endYear}
                      onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <label className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-border/50 bg-bg/50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5">
                <div className="relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-muted/30 transition-colors group-hover:bg-muted/40 has-[:checked]:bg-primary">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                  />
                  <div className="absolute left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all peer-checked:left-6" />
                </div>
                <span className="text-sm font-semibold text-text">Currently Studying</span>
              </label>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <Input
                    id="location"
                    placeholder="e.g. Palo Alto, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <div className="relative">
                    <Input
                      id="gpa"
                      placeholder="3.9"
                      value={formData.gpa}
                      onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                      className="pl-10"
                    />
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <div className="relative">
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="pl-10"
                    />
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </motion.div>
  );
}
