"use client";

import { Card } from "@/components/ui/Card";
import {
  FolderOpen,
  FileText,
  Briefcase,
  Zap,
  Trophy,
  MessageSquare,
  TrendingUp,
  Eye,
  Plus,
  Clock,
  Sparkles,
  ArrowUpRight,
  GraduationCap,
  Loader2,
  Database,
  Trash2,
  RefreshCw
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { SiteSettingsDTO } from "@/lib/types";

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
  show: { opacity: 1, y: 0 }
};

export default function AdminDashboard() {
  const [stats, setStats] = React.useState({
    projects: 0,
    skills: 0,
    messages: 0,
    experience: 0,
    hackathons: 0,
    education: 0,
    views: 0
  });
  const [settings, setSettings] = React.useState<SiteSettingsDTO | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [seeding, setSeeding] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, settingsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/settings")
        ]);
        const statsJson = await statsRes.json();
        const settingsJson = await settingsRes.json();
        if (statsJson.success) setStats(statsJson.data);
        if (settingsJson.success) setSettings(settingsJson.data);
      } catch (_err) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const adminName = settings?.name || "Admin";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-8 text-xs font-black uppercase tracking-[0.4em] text-muted">Calculating Dashboard Analytics...</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20"
    >
      {/* Welcome Hero Section */}
      <motion.div variants={item} className="relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-surface/30 p-10 backdrop-blur-md">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />
        
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <Sparkles size={12} />
              Platform Overview
            </div>
            <h1 className="font-display text-5xl font-bold tracking-tight text-text lg:text-6xl">
              Welcome back, <span className="text-gradient">{adminName}.</span>
            </h1>
            <p className="text-lg text-muted max-w-xl">
              Your portfolio is performing exceptionally. You have <span className="font-bold text-text">{stats.messages} new messages</span> and <span className="font-bold text-text">{stats.views} total views</span> across all pages.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/projects/new">
              <button className="group flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-bg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                <Plus size={20} className="transition-transform group-hover:rotate-90" />
                New Project
              </button>
            </Link>
            <Link href="/admin/blog/new">
              <button className="group flex items-center gap-3 rounded-2xl border border-border/50 bg-surface/50 px-6 py-4 text-sm font-bold text-text backdrop-blur-md transition-all hover:bg-surface active:scale-95">
                <FileText size={20} />
                Write Post
              </button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Primary Stats Grid */}
      <motion.div variants={item} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Projects" value={stats.projects.toString()} icon={FolderOpen} trend="Live Count" color="primary" />
        <StatCard title="Portfolio Views" value={stats.views.toLocaleString()} icon={Eye} trend="Aggregated" color="blue" />
        <StatCard title="Unread Leads" value={stats.messages.toString()} icon={MessageSquare} trend="Inbound" color="emerald" />
        <StatCard title="Technical Skills" value={stats.skills.toString()} icon={Zap} trend="Verified" color="amber" />
      </motion.div>

      {/* Main Content Sections */}
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left Column: Management */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div variants={item} className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="font-display text-3xl font-bold tracking-tight text-text">Content Ecosystem</h2>
              <p className="text-sm text-muted">Core modules to manage your digital presence.</p>
            </div>
            <Link href="/admin/settings" className="text-xs font-black uppercase tracking-widest text-primary hover:underline">
              Global Settings
            </Link>
          </motion.div>
          
          <motion.div variants={item} className="grid gap-6 sm:grid-cols-2">
            <DashboardCard
              title="Experience"
              description="Keep your professional journey and career milestones updated."
              icon={Briefcase}
              href="/admin/experience"
              badge={`${stats.experience} Positions`}
            />
            <DashboardCard
              title="Skills"
              description="Manage the technical arsenal and tools you excel at."
              icon={Zap}
              href="/admin/skills"
              badge={`${stats.skills} Skills`}
            />
            <DashboardCard
              title="Hackathons"
              description="Showcase your competitive spirit and award-winning projects."
              icon={Trophy}
              href="/admin/hackathons"
              badge={`${stats.hackathons} Entries`}
            />
            <DashboardCard
              title="Education"
              description="Your academic foundation and certifications gallery."
              icon={GraduationCap}
              href="/admin/education"
              badge={`${stats.education} Degrees`}
            />
          </motion.div>
        </div>

        {/* Right Column: Quick Insights */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div variants={item} className="space-y-1">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text">Recent Syncs</h2>
            <p className="text-sm text-muted">Latest updates across the platform.</p>
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <ActivityItem 
              title="Database Live" 
              time="Just now" 
              subtitle="System connected to Prisma"
              icon={Zap}
              highlight
            />
            <Link href="/admin/blog" className="block text-center rounded-2xl border border-dashed border-border/50 py-4 text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:bg-surface/30">
              View All Activity
            </Link>
          </motion.div>
        </div>
      </div>

      {/* System Tools */}
      <motion.div variants={item} className="mt-12 rounded-[2.5rem] border border-border/50 bg-surface/30 p-10 backdrop-blur-md">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <Database size={12} />
              System Tools
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-text">Database Management</h2>
            <p className="text-lg text-muted max-w-xl">
              Seed your portfolio with realistic mock data for testing, or reset the database to a clean state.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              disabled={seeding || resetting}
              onClick={async () => {
                if (!confirm("This will populate your portfolio with sample projects, blog posts, skills, experience, and more. Continue?")) return;
                setSeeding(true);
                try {
                  const res = await fetch("/api/admin/system/seed", { method: "POST" });
                  const json = await res.json();
                  if (res.ok) {
                    alert("Mock data seeded successfully! Refreshing...");
                    window.location.reload();
                  } else {
                    alert(json.error || "Failed to seed data.");
                  }
                } catch (_err) {
                  alert("Failed to seed data.");
                } finally {
                  setSeeding(false);
                }
              }}
              className="group flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-bg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {seeding ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} className="transition-transform group-hover:rotate-180" />}
              Seed Mock Data
            </button>
            <button
              disabled={seeding || resetting}
              onClick={async () => {
                if (!confirm("🚨 WARNING: This will PERMANENTLY DELETE all your data including projects, experience, skills, and messages. Are you absolutely sure?")) return;
                if (!confirm("Final confirmation: This action cannot be undone. Click OK to wipe everything.")) return;
                setResetting(true);
                try {
                  const res = await fetch("/api/admin/system/clear-mock", { method: "POST" });
                  if (res.ok) {
                    alert("Database reset successfully. All data cleared.");
                    window.location.reload();
                  } else {
                    alert("Failed to reset database.");
                  }
                } catch (_err) {
                  alert("Failed to reset database.");
                } finally {
                  setResetting(false);
                }
              }}
              className="group flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm font-bold text-red-500 backdrop-blur-md transition-all hover:scale-105 active:scale-95 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
              Reset Database
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }: { title: string; value: string; icon: React.ElementType, trend?: string, color: string }) {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-surface/30 p-8 backdrop-blur-md transition-all hover:border-primary/30">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
      
      <div className="flex items-center justify-between">
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110",
          color === "primary" ? "bg-primary/10 text-primary" :
          color === "blue" ? "bg-blue-500/10 text-blue-500" :
          color === "emerald" ? "bg-emerald-500/10 text-emerald-500" :
          "bg-amber-500/10 text-amber-500"
        )}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className="flex flex-col items-end">
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
              <TrendingUp size={12} />
              {trend}
            </span>
            <p className="text-[8px] font-bold text-muted uppercase tracking-tighter">This month</p>
          </div>
        )}
      </div>
      <div className="mt-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted">{title}</p>
        <p className="mt-2 font-display text-4xl font-black text-text tracking-tight">{value}</p>
      </div>
    </Card>
  );
}

function DashboardCard({
  title,
  description,
  icon: Icon,
  href,
  badge
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="relative h-full overflow-hidden border-border/50 bg-surface/30 p-8 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-bg border border-border/50 text-primary shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Icon size={28} />
          </div>
          {badge && (
            <span className="rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
              {badge}
            </span>
          )}
        </div>
        <div className="mt-8">
          <h3 className="font-display text-2xl font-bold tracking-tight text-text group-hover:text-primary transition-colors">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-2">{description}</p>
        </div>
        <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary transition-all duration-300 group-hover:translate-x-2">
          Manage Module <ArrowUpRight size={14} />
        </div>
      </Card>
    </Link>
  );
}

function ActivityItem({ title, time, subtitle, icon: Icon, highlight }: { title: string, time: string, subtitle: string, icon: React.ElementType, highlight?: boolean }) {
  return (
    <div className={cn(
      "group flex items-center gap-4 rounded-[1.5rem] border border-border/30 p-5 transition-all hover:bg-surface/50",
      highlight && "border-primary/20 bg-primary/5"
    )}>
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
        highlight ? "bg-primary text-bg" : "bg-bg text-muted group-hover:text-primary"
      )}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-black uppercase tracking-widest text-text truncate">{title}</h4>
          <span className="flex items-center gap-1 text-[10px] font-medium text-muted shrink-0">
            <Clock size={10} />
            {time}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted truncate">{subtitle}</p>
      </div>
    </div>
  );
}
