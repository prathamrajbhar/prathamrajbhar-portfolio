"use client";

import { BarChart3, BriefcaseBusiness, FolderKanban, LogOut, Mail, NotebookText, Settings, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: NotebookText },
  { href: "/admin/experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "/admin/hackathons", label: "Hackathons", icon: Sparkles },
  { href: "/admin/certifications", label: "Certifications", icon: NotebookText },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Site Settings", icon: Settings }
];

export function AdminSidebar({ open, onClose, unread }: { open: boolean; onClose: () => void; unread: number }) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-surface p-4 transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-12 items-center justify-between">
          <Link href="/admin" className="font-display text-lg font-bold">Admin</Link>
          <Button className="md:hidden" size="icon" variant="ghost" onClick={onClose} aria-label="Close sidebar">
            <X size={18} />
          </Button>
        </div>
        <nav className="mt-6 grid gap-1">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between rounded-[6px] px-3 py-2 text-sm text-muted hover:bg-bg hover:text-text",
                pathname === href && "bg-bg text-text"
              )}
            >
              <span className="flex items-center gap-3"><Icon size={18} /> {label}</span>
              {label === "Messages" && unread > 0 ? <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">{unread}</span> : null}
            </Link>
          ))}
        </nav>
        <Button className="mt-auto justify-start" variant="ghost" icon={<LogOut size={18} />} onClick={() => void signOut({ callbackUrl: "/admin/login" })}>
          Logout
        </Button>
      </aside>
      {open ? <button className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} aria-label="Close sidebar overlay" /> : null}
    </>
  );
}
