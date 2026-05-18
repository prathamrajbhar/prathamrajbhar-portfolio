"use client";

import { motion } from "framer-motion";
import { Sparkles, GraduationCap, Award, Trophy, Download, MapPin, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { SkillsCloud } from "@/components/public/SkillsCloud";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ExperienceDTO, SkillDTO, HackathonDTO, CertificationDTO, SiteSettingsDTO, EducationDTO } from "@/lib/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

interface ExperienceClientProps {
  experiences: ExperienceDTO[];
  skills: SkillDTO[];
  hackathons: HackathonDTO[];
  certifications: CertificationDTO[];
  settings: SiteSettingsDTO;
  education: EducationDTO[];
}

export function ExperienceClient({ experiences, skills, hackathons, certifications, settings, education }: ExperienceClientProps) {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="relative min-h-screen bg-bg/50"
    >
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>
      
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-20">
        {/* Optimized Hero */}
        <motion.div variants={item} className="mb-12 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge variant="default" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Skills
            </Badge>
            <h1 className="font-display text-4xl tracking-tight sm:text-6xl lg:text-8xl">
              {settings.experienceHeroTitle?.split(" ").slice(0, -1).join(" ")} <br /><span className="text-gradient">{settings.experienceHeroTitle?.split(" ").slice(-1).join(" ")}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted lg:text-xl">
              {settings.experienceHeroDesc || ""}
            </p>
          </div>
          <div className="flex gap-4 lg:flex-col lg:items-end">
             {settings.resumeUrl && (
               <Button href={settings.resumeUrl} target="_blank" size="lg" className="group h-14 px-8 rounded-2xl text-lg shadow-xl shadow-primary/10 transition-all hover:shadow-primary/20">
                 <Download className="mr-2 group-hover:translate-y-0.5 transition-transform" size={20} />
                 Resume
               </Button>
             )}
          </div>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Work Experience Section */}
            <motion.section variants={item}>
              <div className="mb-8 flex items-center justify-between px-2">
                <h2 className="flex items-center gap-3 font-display text-3xl tracking-tight">
                  <Sparkles className="text-primary" size={24} />
                  Jobs
                </h2>
              </div>
              <Card className="overflow-hidden border-border/50 bg-surface/50 backdrop-blur-sm transition-all hover:border-primary/20">
                 <div className="p-6 md:p-10">
                   <ExperienceTimeline experiences={experiences} />
                 </div>
              </Card>
            </motion.section>

            {/* Skills Mosaic */}
            <motion.section variants={item} className="pt-12">
              <div className="mb-8 px-2">
                <h2 className="font-display text-3xl tracking-tight">Tools <span className="text-gradient">I Use</span></h2>
                <p className="mt-2 text-sm text-muted">A look at the tools used to build projects.</p>
              </div>
              <SkillsCloud skills={skills} />
            </motion.section>
          </div>

          {/* Optimized Sidebar */}
          <motion.aside variants={item} className="lg:col-span-4 space-y-8">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Education - Glassmorphism Card */}
              {education.length > 0 && (
                <Card className="relative overflow-hidden border-primary/10 bg-surface/40 p-8 backdrop-blur-xl transition-all hover:border-primary/30 group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <GraduationCap size={80} />
                  </div>
                  <h2 className="flex items-center gap-3 font-display text-xl tracking-tight mb-8">
                    <GraduationCap className="text-primary" size={22} />
                    Education
                  </h2>
                  <div className="space-y-8">
                    {education.map((edu) => (
                      <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-primary before:to-transparent">
                        <div className="absolute left-[-4px] top-1 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />
                        <h3 className="font-bold text-lg leading-tight">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                        <p className="mt-1 text-sm text-primary font-bold">{edu.institution}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {edu.startYear} — {edu.current ? "Present" : edu.endYear}</span>
                          {edu.location && <span className="flex items-center gap-1"><MapPin size={12} /> {edu.location}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Core Arsenal - Compact Detail */}
              <Card className="border-border/50 bg-surface/30 p-8 backdrop-blur-md">
                <h2 className="flex items-center gap-3 font-display text-xl tracking-tight mb-6">
                  <Trophy className="text-primary" size={22} />
                  Main Skills
                </h2>
                <div className="grid gap-5">
                  {skills.slice(0, 5).map((skill) => (
                    <div key={skill.id} className="flex items-center gap-4 group">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg/50 border border-border/50 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all p-2.5">
                         {skill.iconUrl ? (
                           <Image src={skill.iconUrl} alt={skill.name} width={28} height={28} className="object-contain transition-all duration-300 group-hover:scale-110" />
                         ) : (
                           <span className="text-[10px] font-black text-muted/50 uppercase">{skill.name.slice(0, 2)}</span>
                         )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{skill.name}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-primary/40" />
                          <p className="text-[9px] text-muted uppercase font-bold tracking-tighter">{skill.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.aside>
        </div>

        {/* Credentials Showcase */}
        <motion.div variants={item} className="mt-20 pt-20 border-t border-border/50">
          <div className="grid gap-24">
            {/* Hackathons - Immersive Grid */}
            {hackathons.length > 0 && (
              <section>
                <div className="mb-12 flex items-end justify-between px-2">
                  <div className="max-w-xl">
                    <h2 className="font-display text-3xl tracking-tight lg:text-5xl">Building <span className="text-gradient">Projects.</span></h2>
                    <p className="mt-4 text-muted lg:text-lg">Projects I built during hackathons and coding competitions.</p>
                  </div>
                  <div className="hidden lg:block h-px flex-1 mx-12 bg-gradient-to-r from-border to-transparent" />
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {hackathons.map((hackathon) => (
                    <Card key={hackathon.id} className="group overflow-hidden border-border/40 bg-surface/20 transition-all duration-500 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
                      {hackathon.image && (
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image
                            src={hackathon.image}
                            alt={hackathon.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />
                          {hackathon.result && (
                            <div className="absolute top-5 right-5">
                              <Badge className="bg-primary px-3 py-1 font-bold text-white shadow-lg shadow-primary/20">{hackathon.result}</Badge>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-8">
                        <div className="flex items-center gap-2 mb-3">
                          <Trophy size={14} className="text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{hackathon.project}</span>
                        </div>
                        <h3 className="font-display text-2xl leading-tight group-hover:text-primary transition-colors">{hackathon.title}</h3>
                        <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-3">{hackathon.description}</p>
                        <div className="mt-8 flex items-center justify-between pt-6 border-t border-border/50">
                          <span className="flex items-center gap-2 text-xs font-medium text-muted">
                            <Calendar size={12} />
                            {new Date(hackathon.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </span>
                          <Link href={`/hackathons/${hackathon.slug}`} className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter text-primary/0 group-hover:text-primary transition-all group-hover:gap-3">
                            View Case <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications - Professional List */}
            {certifications.length > 0 && (
              <section>
                <div className="mb-12 px-2 text-center lg:text-left">
                  <h2 className="font-display text-3xl tracking-tight lg:text-5xl">Certificates.</h2>
                  <p className="mt-2 text-muted lg:text-lg">Certificates I&apos;ve earned from different courses and exams.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {certifications.map((cert) => (
                    <Card key={cert.id} className="group relative overflow-hidden border-border/50 bg-surface/30 p-0 transition-all duration-500 hover:border-primary/40 hover:bg-surface/50">
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                         <Award size={100} />
                      </div>
                      <div className="p-8">
                        <div className="flex items-start gap-6">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-bg border border-border/50 group-hover:border-primary/20 transition-all p-3 shadow-sm group-hover:shadow-primary/5">
                             {cert.image ? (
                               <Image src={cert.image} alt={cert.issuer} width={40} height={40} className="object-contain transition-all duration-500 group-hover:scale-110" />
                             ) : (
                               <Award size={28} className="text-primary/40 group-hover:text-primary transition-colors" />
                             )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="default" className="bg-primary/5 border-primary/10 text-[9px] font-bold uppercase py-0 px-2">{cert.issuer}</Badge>
                            </div>
                            <h3 className="font-display text-xl leading-snug group-hover:text-primary transition-colors">{cert.name}</h3>
                            <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                               <span className="text-xs font-medium text-muted">{new Date(cert.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</span>
                               <Link href={`/certifications/${cert.slug}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:gap-3 transition-all">
                                 Verify <ArrowRight size={12} />
                               </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

              </section>
            )}
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}


