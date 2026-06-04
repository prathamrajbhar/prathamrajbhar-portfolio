import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-32 w-full rounded-2xl border bg-bg/50 px-5 py-4 text-sm text-text outline-none backdrop-blur-sm transition-all placeholder:text-muted/40 hover:border-border disabled:opacity-60",
        error
          ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
          : "border-border/50 focus:border-primary/50 focus:bg-bg focus:ring-4 focus:ring-primary/10",
        className
      )}
      {...props}
    />
  );
});
