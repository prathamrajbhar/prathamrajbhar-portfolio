import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" || value === null ? undefined : value);
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalText = z.preprocess(emptyToUndefined, z.string().optional());
const dateValue = z.preprocess((value) => {
  if (value instanceof Date) return value;
  if (typeof value === "string" && value.length > 0) return new Date(value);
  return undefined;
}, z.date());
const linkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url()
});

export const projectSchema = z.object({
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(10),
  content: z.string().min(1),
  subtitle: optionalText,
  role: optionalText,
  client: optionalText,
  category: optionalText,
  timeline: optionalText,
  year: optionalText,
  problem: optionalText,
  solution: optionalText,
  impact: optionalText,
  features: z.array(z.string().min(1)).default([]),
  outcomes: z.array(z.string().min(1)).default([]),
  techStack: z.array(z.string().min(1)).min(1),
  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  imageUrl: optionalUrl,
  galleryImages: z.array(z.string().url()).default([]),
  projectLinks: z.array(linkSchema).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["completed", "in-progress", "archived"]).default("completed"),
  tags: z.array(z.string().min(1)).default([])
});

export const blogPostSchema = z.object({
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(10).max(200),
  content: z.string().min(1),
  contentFormat: z.enum(["mdx", "html"]).default("mdx"),
  coverImage: optionalUrl,
  published: z.boolean().default(false),
  readingTime: z.coerce.number().int().min(1).default(5),
  tags: z.array(z.string().min(1)).default([])
});

export const experienceSchema = z
  .object({
    company: z.string().min(2),
    role: z.string().min(2),
    location: z.string().optional().nullable(),
    type: z.string().min(2).default("full-time"),
    startDate: dateValue,
    endDate: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
    current: z.boolean().default(false),
    description: z.string().min(10),
    skills: z.array(z.string().min(1)).default([]),
    logoUrl: optionalUrl,
    order: z.coerce.number().int().default(0)
  })
  .refine((value) => value.current || value.endDate, {
    message: "End date is required unless this is current.",
    path: ["endDate"]
  });

export const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  iconUrl: optionalUrl,
  order: z.coerce.number().int().default(0)
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10)
});

export const settingsSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  bio: z.string().min(10),
  email: z.string().email(),
  github: optionalUrl,
  linkedin: optionalUrl,
  twitter: optionalUrl,
  resumeUrl: optionalUrl,
  avatarUrl: optionalUrl,
  heroTagline: z.string().optional().nullable(),
  openToWork: z.boolean().default(true)
});

export const hackathonSchema = z.object({
  title: z.string().min(2),
  project: z.string().min(2),
  role: optionalText,
  date: dateValue,
  location: optionalText,
  result: optionalText,
  link: optionalUrl,
  description: z.string().min(5),
  image: optionalUrl
});

export const certificationSchema = z.object({
  name: z.string().min(2),
  issuer: z.string().min(2),
  date: dateValue,
  url: optionalUrl,
  credentialId: optionalText,
  image: optionalUrl
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type HackathonInput = z.infer<typeof hackathonSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
