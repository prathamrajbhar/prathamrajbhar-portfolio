"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Settings,
  FolderOpen,
  FileText,
  Briefcase,
  Zap,
  Trophy,
  Award,
  MessageSquare,
  GraduationCap,
  Settings2,
  ArrowLeft,
  ChevronRight,
  LogOut,
  User,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { SiteSettingsDTO } from "@/lib/types";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Zap },
  { href: "/admin/services", label: "Services", icon: Settings2 },
  { href: "/admin/hackathons", label: "Hackathons", icon: Trophy },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

type SidebarProps = {
  adminName: string;
  adminEmail: string;
  initial: string;
  pathname: string;
  onNavClick?: () => void;
};

function Sidebar({ adminName, adminEmail, initial, pathname, onNavClick }: SidebarProps) {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="p-8">
        <Link href="/admin" className="group flex items-center gap-4">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20 transition-all group-hover:scale-110 group-hover:rotate-3">
              <span className="font-display text-xl font-black text-bg">{initial}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-surface bg-green-500" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-text">{adminName}</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Admin Console</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavClick}
                className={cn(
                  "group relative flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-[13px] font-bold transition-all duration-300",
                  isActive
                    ? "bg-primary text-bg shadow-xl shadow-primary/25"
                    : "text-muted hover:bg-surface/50 hover:text-text"
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "transition-colors duration-300",
                    isActive
                      ? "text-bg"
                      : "text-primary group-hover:scale-110"
                  )}
                />
                <span className="flex-1 tracking-tight">{item.label}</span>
                {isActive ? (
                  <motion.div
                    layoutId="active-indicator"
                    className="h-1.5 w-1.5 rounded-full bg-bg"
                  />
                ) : (
                  <ChevronRight
                    size={14}
                    className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-40"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile / Logout */}
      <div className="p-6 mt-auto">
        <div className="rounded-3xl border border-border/50 bg-surface/50 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-text truncate">
                Admin User
              </p>
              <p className="text-[10px] font-bold text-muted truncate">{adminEmail}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-border/50 bg-bg py-2.5 text-[10px] font-black uppercase tracking-widest text-text transition-all hover:bg-surface active:scale-95"
            >
              <ArrowLeft size={12} />
              Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95"
            >
              <LogOut size={12} />
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettingsDTO | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setSettings(json.data);
      })
      .catch(() => {});
  }, []);


  const adminName = settings?.name || "Admin";
  const adminEmail = settings?.email || "admin@site.com";
  const initial = adminName.charAt(0).toUpperCase() || "A";

  return (
    <div className="relative min-h-screen bg-bg overflow-hidden selection:bg-primary/20">
      {/* Decorative Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Desktop Sidebar — always visible at lg+ */}
        <aside className="hidden lg:flex fixed left-0 top-0 z-50 h-screen w-72 flex-col border-r border-border/50 bg-surface/30 backdrop-blur-3xl">
          <Sidebar
            adminName={adminName}
            adminEmail={adminEmail}
            initial={initial}
            pathname={pathname}
          />
        </aside>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-border/50 bg-surface/95 backdrop-blur-3xl lg:hidden"
                initial={{ x: -288 }}
                animate={{ x: 0 }}
                exit={{ x: -288 }}
                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              >
                <Sidebar
                  adminName={adminName}
                  adminEmail={adminEmail}
                  initial={initial}
                  pathname={pathname}
                  onNavClick={() => setSidebarOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="min-h-screen flex-1 lg:ml-72">
          {/* Mobile top header */}
          <div className="sticky top-0 z-30 flex items-center gap-4 border-b border-border/50 bg-bg/80 px-6 py-4 backdrop-blur-md lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-surface/50 text-muted transition-all hover:bg-surface hover:text-text"
              aria-label="Open navigation sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <span className="font-display text-sm font-black text-bg">{initial}</span>
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-text">
                {adminName}
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-6 py-8 lg:px-12 lg:py-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
