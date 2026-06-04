"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Trophy, Award, Calendar, MapPin, Pencil, Trash2, Loader2, Sparkles, ChevronDown, ChevronUp, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { HackathonDTO } from "@/lib/types";

interface HackathonCardProps {
  hackathon: HackathonDTO;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function HackathonCard({ hackathon, onDelete, isDeleting }: HackathonCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-surface/30 p-6 sm:p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Trophy / Icon Container */}
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-bg border border-border/50 text-primary shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
          <Trophy size={30} />
          {hackathon.result && (
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 shadow-lg border-2 border-surface flex items-center justify-center">
              <Award size={10} className="text-white" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-xl font-bold tracking-tight text-text group-hover:text-primary transition-colors leading-tight">
              {hackathon.title}
            </h3>
            {hackathon.result && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-emerald-500 shadow-sm">
                <Sparkles size={10} />
                {hackathon.result}
              </span>
            )}
          </div>
          <p className="text-base font-bold text-muted/80 tracking-tight mt-1">
            {hackathon.project}
          </p>

          {/* Inline Metadata */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-muted/60">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary/60" />
              {new Date(hackathon.date).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </span>
            {hackathon.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-primary/60" />
                {hackathon.location}
              </span>
            )}
            {hackathon.role && (
              <span className="flex items-center gap-1.5">
                <Briefcase size={14} className="text-primary/60" />
                {hackathon.role}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 lg:shrink-0 lg:border-l lg:border-border/50 lg:pl-6 lg:ml-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg border border-border/50 text-muted transition-all hover:bg-surface hover:text-text active:scale-95 shadow-md cursor-pointer"
            title={isExpanded ? "Collapse Description" : "Expand Description"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          <Link href={`/admin/hackathons/edit/${hackathon.id}`}>
            <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg border border-border/50 text-muted transition-all hover:bg-primary hover:text-bg hover:border-primary active:scale-95 shadow-md cursor-pointer">
              <Pencil size={18} />
            </button>
          </Link>

          <button
            onClick={() => onDelete(hackathon.id)}
            disabled={isDeleting}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg border border-border/50 text-muted transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95 shadow-md disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isDeleting ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Description Container */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-6 pt-6 border-t border-border/50">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted/50 mb-2">Description</h4>
              <p className="text-sm leading-relaxed text-muted whitespace-pre-line bg-bg/20 p-4 rounded-xl border border-border/10">
                {hackathon.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
