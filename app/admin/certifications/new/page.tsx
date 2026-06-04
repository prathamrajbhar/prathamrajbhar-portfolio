"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2, Building2, Calendar, Link as LinkIcon, Image as ImageIcon, ShieldCheck, Fingerprint } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn, slugify } from "@/lib/utils";
import { AIAssistant } from "@/components/admin/AIAssistant";
import { AISuggestField } from "@/components/admin/AISuggestField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { normalize } from "@/lib/ai-autofill";
import type { CertificationDTO } from "@/lib/types";


export default function NewCertificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrigin(window.location.origin);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    issuer: "",
    date: "",
    url: "",
    credentialId: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const data = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : undefined,
    };

    try {
      const res = await fetch("/api/admin/certifications", {
        method: "POST",
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
          setErrors({ general: json.error || "Failed to create certification" });
        }
        return;
      }

      router.push("/admin/certifications");
    } catch (error) {
      console.error("Error creating certification:", error);
      setErrors({ general: "Failed to create certification" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-10"
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/admin/certifications" className="group inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Certifications
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">New Certification</h1>
            <p className="text-lg text-muted">Add a new verified credential to your profile.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/certifications">
              <Button variant="outline" size="lg" className="rounded-2xl px-8">Cancel</Button>
            </Link>
            <Button onClick={handleSubmit} disabled={loading} size="lg" className="rounded-2xl px-8 shadow-xl shadow-primary/20 min-w-[160px]">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Add Certification
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

      <form onSubmit={handleSubmit} className="space-y-8">
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
          
          <div className="p-8 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="name">Certification Name *</Label>
                  <AISuggestField label="Certification Name" module="certifications" field="name" context={formData} onApply={(v) => setFormData(prev => ({ ...prev, name: v, slug: slugify(v) }))} />
                </div>
                <Input
                  id="name"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      name, 
                      slug: slugify(name) 
                    }));
                  }}
                  className={cn(errors.name && "border-red-500/50 focus:ring-red-500/10")}
                />
                {errors.name && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug / URL Path *</Label>
                <div className="relative">
                  <Input
                    id="slug"
                    placeholder="e.g. aws-certified-solutions-architect"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }))}
                    className={cn("pl-10", errors.slug && "border-red-500/50 focus:ring-red-500/10")}
                  />
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                </div>
                <p className="text-[10px] text-muted/60 px-1 font-medium truncate">
                  Permalink: {origin}/certifications/{formData.slug || "auto-generated"}
                </p>
                {errors.slug && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.slug}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="issuer">Issuer *</Label>
                  <AISuggestField label="Issuer" module="certifications" field="issuer" context={formData} onApply={(v) => setFormData(prev => ({ ...prev, issuer: v }))} />
                </div>
                <div className="relative">
                  <Input
                    id="issuer"
                    placeholder="e.g. Amazon Web Services"
                    value={formData.issuer}
                    onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className={cn("pl-10", errors.date && "border-red-500/50 focus:ring-red-500/10")}
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                </div>
                {errors.date && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.date}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="credentialId">Credential ID</Label>
                <div className="relative">
                  <Input
                    id="credentialId"
                    placeholder="ABC-123-XYZ"
                    value={formData.credentialId}
                    onChange={(e) => setFormData(prev => ({ ...prev, credentialId: e.target.value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className={cn("pl-10", errors.url && "border-red-500/50 focus:ring-red-500/10")}
                  />
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                </div>
                {errors.url && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.url}</p>}
              </div>
            </div>

            <div className="border-t border-border/50 pt-8 space-y-4">
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                label="Certificate File / Image"
                aspect="aspect-video"
                folder="certifications"
              />
              {errors.image && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.image}</p>}
            </div>
          </div>
        </Card>
      </form>
    </motion.div>
  );
}
