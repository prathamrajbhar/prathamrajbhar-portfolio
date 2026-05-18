"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2, Award, Building2, Calendar, Link as LinkIcon, Image as ImageIcon, ShieldCheck, Fingerprint } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn, slugify } from "@/lib/utils";
import { AIAssistant } from "@/components/admin/AIAssistant";
import { IconSelector } from "@/components/admin/IconSelector";
import { normalize } from "@/lib/ai-autofill";
import type { CertificationDTO } from "@/lib/types";


export default function EditCertificationPage() {
  const router = useRouter();
  const params = useParams<{ adminId: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [certification, setCertification] = useState<CertificationDTO | null>(null);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    issuer: "",
    date: "",
    url: "",
    credentialId: "",
    image: "",
  });

  useEffect(() => {
    if (params.adminId) {
      const fetchCertification = async () => {
        try {
          const res = await fetch(`/api/admin/certifications/${params.adminId}`);
          const json = await res.json() as { data?: CertificationDTO };
          const data = json.data;

          if (data) {
            setCertification(data);
            setFormData({
              slug: data.slug || "",
              name: data.name,
              issuer: data.issuer,
              date: data.date.split("T")[0],
              url: data.url || "",
              credentialId: data.credentialId || "",
              image: data.image || "",
            });
          }
        } catch (error) {
          console.error("Error fetching certification:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCertification();
    }
  }, [params.adminId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const data = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : undefined,
    };

    try {
      const res = await fetch(`/api/admin/certifications/${params.adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json() as { data?: CertificationDTO; error?: string; fields?: Record<string, string[]> };

      if (!res.ok) {
        if (json.fields) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.fields).forEach(([field, messages]) => {
            fieldErrors[field] = messages[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: json.error || "Failed to update certification" });
        }
        return;
      }

      router.push("/admin/certifications");
    } catch (error) {
      console.error("Error updating certification:", error);
      setErrors({ general: "Failed to update certification" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-sm font-medium text-muted">Loading certification details...</p>
      </div>
    );
  }

  if (!certification) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 mb-6">
          <Award size={32} className="opacity-50" />
        </div>
        <h2 className="text-2xl font-bold">Certification not found</h2>
        <p className="mt-2 text-muted">The certification you are trying to edit does not exist.</p>
        <Link href="/admin/certifications" className="mt-8">
          <Button variant="outline" className="rounded-2xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Certifications
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
        <Link href="/admin/certifications" className="group inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Certifications
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">Edit Certification</h1>
            <p className="text-lg text-muted">Update your verified credential details.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/certifications">
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

      <AIAssistant<CertificationDTO>
        module="certifications"
        onFill={(data) => setFormData(prev => ({ ...prev, ...normalize("certifications", data) }))}
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
                <ShieldCheck size={18} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Certification Details</h2>
            </div>
            
            <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Certification Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. AWS Certified Solutions Architect"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData({ 
                          ...formData, 
                          name, 
                          slug: isEditingSlug ? formData.slug : slugify(name) 
                        });
                      }}
                      className={cn(errors.name && "border-red-500/50 focus:ring-red-500/10")}
                    />
                    <div className="flex items-center gap-2 px-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted/60">
                        <LinkIcon size={10} className="text-primary/50" />
                        <span>Permalink:</span>
                        <span className="text-text/40">{origin}/certifications/</span>
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
                    {errors.name && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.name}</p>}
                  </div>
                </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuer *</Label>
                  <div className="relative">
                    <Input
                      id="issuer"
                      placeholder="e.g. Amazon Web Services"
                      value={formData.issuer}
                      onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                      className={cn("pl-10", errors.issuer && "border-red-500/50 focus:ring-red-500/10")}
                    />
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                  </div>
                  {errors.issuer && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.issuer}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date Issued *</Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={cn("pl-10", errors.date && "border-red-500/50 focus:ring-red-500/10")}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                  </div>
                  {errors.date && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.date}</p>}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="credentialId">Credential ID</Label>
                  <div className="relative">
                    <Input
                      id="credentialId"
                      placeholder="ABC-123-XYZ"
                      value={formData.credentialId}
                      onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                      className="pl-10"
                    />
                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Verification URL</Label>
                  <div className="relative">
                    <Input
                      id="url"
                      placeholder="https://..."
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className={cn("pl-10", errors.url && "border-red-500/50 focus:ring-red-500/10")}
                    />
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                  </div>
                  {errors.url && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.url}</p>}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Media */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
            <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ImageIcon size={18} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Media</h2>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <IconSelector
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Certificate Icon"
                />
                {errors.image && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.image}</p>}
              </div>
            </div>
          </Card>
        </div>
      </form>
    </motion.div>
  );
}
