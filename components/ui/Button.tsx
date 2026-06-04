import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-bg hover:bg-primary-hover border-transparent shadow-sm shadow-primary/20",
  secondary: "bg-surface text-text border-border hover:border-primary/30 hover:bg-surface/80",
  ghost: "bg-transparent text-text border-transparent hover:bg-border/30",
  danger: "bg-red-700 text-white border-transparent hover:bg-red-800",
  outline: "bg-transparent text-primary border-primary/30 hover:border-primary hover:bg-primary/5"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
  xl: "h-14 px-8 text-base",
  icon: "h-10 w-10 p-0"
};

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  isLoading?: boolean;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  SharedProps & {
    href?: undefined;
  };

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  SharedProps & {
    href: string;
  };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", icon, isLoading, className, children } = props;
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-60 transition-all active:scale-[0.98] active:opacity-90",
    variants[variant],
    sizes[size],
    className
  );

  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, icon: _i, isLoading: _il, className: _c, children: _ch, ...anchorProps } = props;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : icon}
        {children}
      </Link>
    );
  }

  const {
    type = "button",
    variant: _v2,
    size: _s2,
    icon: _i2,
    isLoading: _il2,
    className: _c2,
    children: _ch2,
    disabled,
    ...buttonProps
  } = props as ButtonProps;
  return (
    <button type={type} className={classes} disabled={disabled || isLoading} {...buttonProps}>
      {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : icon}
      {children}
    </button>
  );
}
