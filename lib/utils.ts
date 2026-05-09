import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import slugifyLib from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return slugifyLib(value, { lower: true, strict: true, trim: true });
}

export function formatDate(date: string | Date, pattern = "MMM d, yyyy") {
  return format(new Date(date), pattern);
}

export function readingTimeFromHtml(html: string) {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return Math.max(1, Math.ceil(text.split(" ").filter(Boolean).length / 200));
}

export function readingTimeFromContent(content: string) {
  const text = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+]\([^)]+\)/g, " ")
    .replace(/[#>*_`|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return Math.max(1, Math.ceil(text.split(" ").filter(Boolean).length / 200));
}

export function sanitizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function getBaseUrl(headersList?: Headers | null) {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  const host = headersList?.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}


