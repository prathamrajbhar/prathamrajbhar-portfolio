import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover border-transparent",
  secondary: "bg-surface text-text border-border hover:border-primary/50",
  ghost: "bg-transparent text-text border-transparent hover:bg-surface",
  danger: "bg-red-600 text-white border-transparent hover:bg-red-700",
  outline: "bg-transparent text-text border-border hover:border-primary/50"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  xl: "h-14 px-8 text-lg font-bold",
  icon: "h-10 w-10 p-0"
};

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
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
  const { variant = "primary", size = "md", icon, className, children } = props;
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-[6px] border font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className
  );

  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, icon: _i, className: _c, children: _ch, ...anchorProps } = props;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {icon}
        {children}
      </Link>
    );
  }

  const {
    type = "button",
    variant: _v2,
    size: _s2,
    icon: _i2,
    className: _c2,
    children: _ch2,
    ...buttonProps
  } = props as ButtonProps;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {icon}
      {children}
    </button>
  );
}
