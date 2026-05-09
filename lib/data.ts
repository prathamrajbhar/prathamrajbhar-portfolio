import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { defaultSettings } from "@/lib/defaults";
import type {
  BlogPostDTO,
  CertificationDTO,
  ContactMessageDTO,
  ExperienceDTO,
  HackathonDTO,
  ProjectDTO,
  SiteSettingsDTO,
  SkillDTO
} from "@/lib/types";

// ─── Transform Helpers ───────────────────────────────────────────────────────
// Prisma returns Date objects; DTOs use ISO strings for serialization safety.

type PrismaProject = Awaited<ReturnType<typeof prisma.project.findFirst>> & {
  projectLinks: { label: string; url: string }[];
};

function toProjectDTO(p: NonNullable<PrismaProject>): ProjectDTO {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    content: p.content,
    subtitle: p.subtitle,
    role: p.role,
    client: p.client,
    category: p.category,
    timeline: p.timeline,
    year: p.year,
    problem: p.problem,
    solution: p.solution,
    impact: p.impact,
    features: p.features,
    outcomes: p.outcomes,
    techStack: p.techStack,
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl,
    imageUrl: p.imageUrl,
    galleryImages: p.galleryImages,
    projectLinks: p.projectLinks.map((l) => ({ label: l.label, url: l.url })),
    featured: p.featured,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    tags: p.tags,
  };
}

function toBlogPostDTO(p: NonNullable<Awaited<ReturnType<typeof prisma.blogPost.findFirst>>>): BlogPostDTO {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    contentFormat: p.contentFormat as "mdx" | "html",
    coverImage: p.coverImage,
    published: p.published,
    readingTime: p.readingTime,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    tags: p.tags,
  };
}

function toExperienceDTO(e: NonNullable<Awaited<ReturnType<typeof prisma.experience.findFirst>>>): ExperienceDTO {
  return {
    id: e.id,
    company: e.company,
    role: e.role,
    location: e.location,
    type: e.type,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate?.toISOString() ?? null,
    current: e.current,
    description: e.description,
    skills: e.skills,
    logoUrl: e.logoUrl,
    order: e.order,
    createdAt: e.createdAt.toISOString(),
  };
}

function toSkillDTO(s: NonNullable<Awaited<ReturnType<typeof prisma.skill.findFirst>>>): SkillDTO {
  return {
    id: s.id,
    name: s.name,
    category: s.category,
    iconUrl: s.iconUrl,
    order: s.order,
  };
}

function toSiteSettingsDTO(s: NonNullable<Awaited<ReturnType<typeof prisma.siteSettings.findFirst>>>): SiteSettingsDTO {
  return {
    id: s.id,
    name: s.name,
    title: s.title,
    bio: s.bio,
    email: s.email,
    github: s.github,
    linkedin: s.linkedin,
    twitter: s.twitter,
    resumeUrl: s.resumeUrl,
    avatarUrl: s.avatarUrl,
    heroTagline: s.heroTagline,
    openToWork: s.openToWork,
    updatedAt: s.updatedAt.toISOString(),
  };
}

function toCertificationDTO(c: NonNullable<Awaited<ReturnType<typeof prisma.certification.findFirst>>>): CertificationDTO {
  return {
    id: c.id,
    name: c.name,
    issuer: c.issuer,
    date: c.date.toISOString(),
    url: c.url,
    credentialId: c.credentialId,
    image: c.image,
    createdAt: c.createdAt.toISOString(),
  };
}

function toHackathonDTO(h: NonNullable<Awaited<ReturnType<typeof prisma.hackathon.findFirst>>>): HackathonDTO {
  return {
    id: h.id,
    title: h.title,
    project: h.project,
    role: h.role,
    date: h.date.toISOString(),
    location: h.location,
    result: h.result,
    link: h.link,
    description: h.description,
    image: h.image,
    createdAt: h.createdAt.toISOString(),
  };
}

function toContactMessageDTO(m: NonNullable<Awaited<ReturnType<typeof prisma.contactMessage.findFirst>>>): ContactMessageDTO {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    read: m.read,
    createdAt: m.createdAt.toISOString(),
  };
}

// ─── Data Fetching ───────────────────────────────────────────────────────────
// Every function wraps Prisma calls in try/catch for build-time resilience.
// If the database is unreachable (e.g. during CI/CD), pages render with fallback data.

export const getExperiences = cache(async (): Promise<ExperienceDTO[]> => {
  try {
    const rows = await prisma.experience.findMany({ orderBy: { order: "asc" } });
    return rows.map(toExperienceDTO);
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return [];
  }
});

export const getSkills = cache(async (): Promise<SkillDTO[]> => {
  try {
    const rows = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    return rows.map(toSkillDTO);
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return [];
  }
});

export const getProjects = cache(async (): Promise<ProjectDTO[]> => {
  try {
    const rows = await prisma.project.findMany({
      include: { projectLinks: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toProjectDTO);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
});

export const getAllProjectSlugs = cache(async (): Promise<string[]> => {
  try {
    const rows = await prisma.project.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch (error) {
    console.error("Failed to fetch project slugs:", error);
    return [];
  }
});

export const getBlogPosts = cache(async (): Promise<BlogPostDTO[]> => {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toBlogPostDTO);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
});

export const getAllBlogPostSlugs = cache(async (): Promise<string[]> => {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  } catch (error) {
    console.error("Failed to fetch blog slugs:", error);
    return [];
  }
});

export const getSiteSettings = cache(async (): Promise<SiteSettingsDTO | null> => {
  try {
    const row = await prisma.siteSettings.findFirst();
    return row ? toSiteSettingsDTO(row) : defaultSettings;
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return defaultSettings;
  }
});

export const getCertifications = cache(async (): Promise<CertificationDTO[]> => {
  try {
    const rows = await prisma.certification.findMany({ orderBy: { date: "desc" } });
    return rows.map(toCertificationDTO);
  } catch (error) {
    console.error("Failed to fetch certifications:", error);
    return [];
  }
});

export const getHackathons = cache(async (): Promise<HackathonDTO[]> => {
  try {
    const rows = await prisma.hackathon.findMany({ orderBy: { date: "desc" } });
    return rows.map(toHackathonDTO);
  } catch (error) {
    console.error("Failed to fetch hackathons:", error);
    return [];
  }
});

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectDTO | null> => {
  try {
    const row = await prisma.project.findUnique({
      where: { slug },
      include: { projectLinks: true },
    });
    return row ? toProjectDTO(row) : null;
  } catch (error) {
    console.error("Failed to fetch project by slug:", error);
    return null;
  }
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPostDTO | null> => {
  try {
    const row = await prisma.blogPost.findUnique({ where: { slug } });
    return row ? toBlogPostDTO(row) : null;
  } catch (error) {
    console.error("Failed to fetch blog post by slug:", error);
    return null;
  }
});

export async function getContactMessages(): Promise<ContactMessageDTO[]> {
  try {
    const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(toContactMessageDTO);
  } catch (error) {
    console.error("Failed to fetch contact messages:", error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<ProjectDTO | null> {
  try {
    const row = await prisma.project.findUnique({
      where: { id },
      include: { projectLinks: true },
    });
    return row ? toProjectDTO(row) : null;
  } catch (error) {
    console.error("Failed to fetch project by id:", error);
    return null;
  }
}

export async function getBlogPostById(id: string): Promise<BlogPostDTO | null> {
  try {
    const row = await prisma.blogPost.findUnique({ where: { id } });
    return row ? toBlogPostDTO(row) : null;
  } catch (error) {
    console.error("Failed to fetch blog post by id:", error);
    return null;
  }
}

export async function getExperienceById(id: string): Promise<ExperienceDTO | null> {
  try {
    const row = await prisma.experience.findUnique({ where: { id } });
    return row ? toExperienceDTO(row) : null;
  } catch (error) {
    console.error("Failed to fetch experience by id:", error);
    return null;
  }
}

export async function getCertificationById(id: string): Promise<CertificationDTO | null> {
  try {
    const row = await prisma.certification.findUnique({ where: { id } });
    return row ? toCertificationDTO(row) : null;
  } catch (error) {
    console.error("Failed to fetch certification by id:", error);
    return null;
  }
}

export async function getHackathonById(id: string): Promise<HackathonDTO | null> {
  try {
    const row = await prisma.hackathon.findUnique({ where: { id } });
    return row ? toHackathonDTO(row) : null;
  } catch (error) {
    console.error("Failed to fetch hackathon by id:", error);
    return null;
  }
}