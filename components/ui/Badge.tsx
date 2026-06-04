import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "muted" | "warning" | "error";

const variants: Record<BadgeVariant, string> = {
  default: "border-primary/20 bg-primary/10 text-primary",
  success: "border-emerald-600/20 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  muted: "border-border bg-bg text-muted",
  warning: "border-amber-600/20 bg-amber-600/10 text-amber-700 dark:text-amber-400",
  error: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
};

export function Badge({ className, variant = "default", ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}
      {...props}
    />
  );
}
