import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import type { 
  ExperienceDTO, 
  SkillDTO, 
  ProjectDTO, 
  BlogPostDTO, 
  SiteSettingsDTO, 
  CertificationDTO, 
  HackathonDTO, 
  ContactMessageDTO 
} from "@/lib/types";

// Helper to convert Prisma types to DTOs and handle date serialization
function toDTO<T>(data: NonNullable<unknown>): T {
  if (!data) return data as T;
  return JSON.parse(JSON.stringify(data, (_key, value: unknown) => {
    if (value instanceof Date) return value.toISOString();
    return value;
  })) as T;
}

// Experiences
export const getExperiences = cache(async (): Promise<ExperienceDTO[]> => {
  return unstable_cache(
    async () => {
      try {
        const experiences = await prisma.experience.findMany({
          orderBy: { order: "asc" }
        });
        return toDTO<ExperienceDTO[]>(experiences);
      } catch (error) {
        console.error("Prisma error in getExperiences:", error);
        return [];
      }
    },
    ["experiences"],
    { revalidate: 3600, tags: ["experiences"] }
  )();
});

// Skills
export const getSkills = cache(async (): Promise<SkillDTO[]> => {
  return unstable_cache(
    async () => {
      try {
        const skills = await prisma.skill.findMany({
          orderBy: { order: "asc" }
        });
        return toDTO<SkillDTO[]>(skills);
      } catch (error) {
        console.error("Prisma error in getSkills:", error);
        return [];
      }
    },
    ["skills"],
    { revalidate: 3600, tags: ["skills"] }
  )();
});

// Projects
export const getProjects = cache(async (): Promise<ProjectDTO[]> => {
  return unstable_cache(
    async () => {
      try {
        const projects = await prisma.project.findMany({
          include: { tags: true },
          orderBy: { createdAt: "desc" }
        });
        return toDTO<ProjectDTO[]>(projects);
      } catch (error) {
        console.error("Prisma error in getProjects:", error);
        return [];
      }
    },
    ["projects"],
    { revalidate: 3600, tags: ["projects"] }
  )();
});

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectDTO | null> => {
  return unstable_cache(
    async () => {
      try {
        const project = await prisma.project.findFirst({
          where: { slug },
          include: { tags: true }
        });
        return project ? toDTO<ProjectDTO>(project) : null;
      } catch (error) {
        console.error(`Prisma error in getProjectBySlug(${slug}):`, error);
        return null;
      }
    },
    [`project-${slug}`],
    { revalidate: 3600, tags: ["projects", `project-${slug}`] }
  )();
});

export const getAllProjectSlugs = cache(async (): Promise<string[]> => {
  return unstable_cache(
    async () => {
      try {
        const projects = await prisma.project.findMany({
          select: { slug: true }
        });
        return projects.map(p => p.slug);
      } catch {
        return [];
      }
    },
    ["project-slugs"],
    { revalidate: 3600, tags: ["projects"] }
  )();
});

// Blog Posts
export const getBlogPosts = cache(async (): Promise<BlogPostDTO[]> => {
  return unstable_cache(
    async () => {
      try {
        const posts = await prisma.blogPost.findMany({
          include: { tags: true },
          where: { published: true },
          orderBy: { createdAt: "desc" }
        });
        return toDTO<BlogPostDTO[]>(posts);
      } catch (error) {
        console.error("Prisma error in getBlogPosts:", error);
        return [];
      }
    },
    ["blog-posts"],
    { revalidate: 3600, tags: ["blog"] }
  )();
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPostDTO | null> => {
  return unstable_cache(
    async () => {
      try {
        const post = await prisma.blogPost.findFirst({
          where: { slug, published: true },
          include: { tags: true }
        });
        return post ? toDTO<BlogPostDTO>(post) : null;
      } catch (error) {
        console.error(`Prisma error in getBlogPostBySlug(${slug}):`, error);
        return null;
      }
    },
    [`blog-post-${slug}`],
    { revalidate: 3600, tags: ["blog", `blog-post-${slug}`] }
  )();
});

export const getAllBlogPostSlugs = cache(async (): Promise<string[]> => {
  return unstable_cache(
    async () => {
      try {
        const posts = await prisma.blogPost.findMany({
          where: { published: true },
          select: { slug: true }
        });
        return posts.map(p => p.slug);
      } catch {
        return [];
      }
    },
    ["blog-slugs"],
    { revalidate: 3600, tags: ["blog"] }
  )();
});

// Site Settings
export const getSiteSettings = cache(async (): Promise<SiteSettingsDTO | null> => {
  return unstable_cache(
    async () => {
      try {
        const settings = await prisma.siteSettings.findFirst();
        return settings ? toDTO<SiteSettingsDTO>(settings) : null;
      } catch (error) {
        console.error("Prisma error in getSiteSettings:", error);
        return null;
      }
    },
    ["site-settings"],
    { revalidate: 3600, tags: ["settings"] }
  )();
});

// Certifications
export const getCertifications = cache(async (): Promise<CertificationDTO[]> => {
  return unstable_cache(
    async () => {
      try {
        const items = await prisma.certification.findMany({
          orderBy: { date: "desc" }
        });
        return toDTO<CertificationDTO[]>(items);
      } catch {
        return [];
      }
    },
    ["certifications"],
    { revalidate: 3600, tags: ["certifications"] }
  )();
});

// Hackathons
export const getHackathons = cache(async (): Promise<HackathonDTO[]> => {
  return unstable_cache(
    async () => {
      try {
        const items = await prisma.hackathon.findMany({
          orderBy: { date: "desc" }
        });
        return toDTO<HackathonDTO[]>(items);
      } catch {
        return [];
      }
    },
    ["hackathons"],
    { revalidate: 3600, tags: ["hackathons"] }
  )();
});

// Admin/Direct Access (Uncached)
export async function getContactMessages(): Promise<ContactMessageDTO[]> {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }
    });
    return toDTO<ContactMessageDTO[]>(messages);
  } catch {
    return [];
  }
}

export async function getProjectById(id: string): Promise<ProjectDTO | null> {
  try {
    const item = await prisma.project.findUnique({ where: { id }, include: { tags: true } });
    return item ? toDTO<ProjectDTO>(item) : null;
  } catch {
    return null;
  }
}

export async function getBlogPostById(id: string): Promise<BlogPostDTO | null> {
  try {
    const item = await prisma.blogPost.findUnique({ where: { id }, include: { tags: true } });
    return item ? toDTO<BlogPostDTO>(item) : null;
  } catch {
    return null;
  }
}

export async function getExperienceById(id: string): Promise<ExperienceDTO | null> {
  try {
    const item = await prisma.experience.findUnique({ where: { id } });
    return item ? toDTO<ExperienceDTO>(item) : null;
  } catch {
    return null;
  }
}

export async function getCertificationById(id: string): Promise<CertificationDTO | null> {
  try {
    const item = await prisma.certification.findUnique({ where: { id } });
    return item ? toDTO<CertificationDTO>(item) : null;
  } catch {
    return null;
  }
}

export async function getHackathonById(id: string): Promise<HackathonDTO | null> {
  try {
    const item = await prisma.hackathon.findUnique({ where: { id } });
    return item ? toDTO<HackathonDTO>(item) : null;
  } catch {
    return null;
  }
}
