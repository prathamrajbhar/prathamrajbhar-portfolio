import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink, ShieldCheck, Award, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getCertificationBySlug } from "@/lib/data";

export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cert = await getCertificationBySlug(slug);
  if (!cert) return { title: "Not Found" };
  return {
    title: `${cert.name} | Certification`,
    description: `${cert.name} certified by ${cert.issuer}`,
  };
}

export default async function CertificationDetailPage({ params }: Props) {
  const { slug } = await params;
  const cert = await getCertificationBySlug(slug);
  if (!cert) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      {/* Back Button */}
      <div className="mb-10">
        <Link href="/experience" className="group inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Experience
        </Link>
      </div>

      <div className="space-y-12">
        {/* Certification Title & Meta */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="default" className="bg-primary/10 border-primary/20 text-primary py-0.5 px-3 uppercase text-[10px] font-black tracking-wider">
              {cert.issuer}
            </Badge>
            <span className="flex items-center gap-1.5 text-xs text-muted/80 font-medium">
              <Calendar size={14} className="text-primary/60" />
              {new Date(cert.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-text leading-tight">
              {cert.name}
            </h1>
            <p className="text-lg text-muted/80 font-medium">
              Verified credential issued by <span className="text-text font-bold">{cert.issuer}</span>
            </p>
          </div>
        </div>

        {/* Certificate Display Frame */}
        {cert.image ? (
          <div className="relative group rounded-[2rem] border border-border/50 bg-surface/10 p-4 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-primary/20">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-fuchsia-500/5 to-primary/10 rounded-[2.2rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-bg/50">
              <Image
                src={cert.image}
                alt={cert.name}
                fill
                className="object-contain p-2 transition-transform duration-700 group-hover:scale-[1.01]"
                sizes="(min-width: 1024px) 800px, 100vw"
                priority
              />
            </div>
          </div>
        ) : (
          <div className="relative rounded-[2rem] border border-border/50 bg-surface/10 p-12 backdrop-blur-md flex flex-col items-center justify-center text-center min-h-[320px]">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-[2.2rem] blur-2xl opacity-40 pointer-events-none" />
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-xl shadow-primary/5">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">No Document Uploaded</h3>
            <p className="text-sm text-muted/60 max-w-sm">This certification is verified, but no physical certificate file was uploaded to display.</p>
          </div>
        )}

        {/* Verification and Credential Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-8 rounded-3xl border border-border/50 bg-surface/10 backdrop-blur-md">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text/80">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Verified Credential</span>
            </div>
            {cert.credentialId ? (
              <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
                <Fingerprint size={12} className="text-muted/60" />
                <span>Credential ID:</span>
                <span className="font-mono text-text font-bold bg-surface/30 px-2 py-0.5 rounded-lg border border-border/40">{cert.credentialId}</span>
              </div>
            ) : (
              <p className="text-xs text-muted/60 font-medium">This credential has been verified and registered on this profile.</p>
            )}
          </div>

          {cert.url && (
            <Button 
              href={cert.url} 
              target="_blank" 
              className="rounded-2xl px-6 py-3 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all font-bold text-sm shrink-0"
              icon={<ExternalLink size={14} className="ml-1" />}
            >
              Verify Credential
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
