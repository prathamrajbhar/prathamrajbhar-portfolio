import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type {
  BlogPostDTO,
  CertificationDTO,
  ContactMessageDTO,
  EducationDTO,
  ExperienceDTO,
  HackathonDTO,
  ProjectDTO,
  SiteSettingsDTO,
  SkillDTO,
  ServiceDTO
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
    seoTitle: p.seoTitle ?? null,
    seoDescription: p.seoDescription ?? null,
    seoKeywords: p.seoKeywords ?? null,
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
    seoTitle: p.seoTitle ?? null,
    seoDescription: p.seoDescription ?? null,
    seoKeywords: p.seoKeywords ?? null,
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

function toServiceDTO(s: NonNullable<Awaited<ReturnType<typeof prisma.service.findFirst>>>): ServiceDTO {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    icon: s.icon,
    order: s.order,
    createdAt: s.createdAt.toISOString(),
  };
}

function toSiteSettingsDTO(s: NonNullable<Awaited<ReturnType<typeof prisma.siteSettings.findFirst>>>): SiteSettingsDTO {
  return {
    id: s.id,
    name: s.name,
    title: s.title ?? null,
    email: s.email,
    location: s.location,
    heroTitle: s.heroTitle,
    heroTagline: s.heroTagline,
    heroBio: s.heroBio,
    avatarUrl: s.avatarUrl,
    resumeUrl: s.resumeUrl,
    aboutTitle: s.aboutTitle,
    aboutGoalTitle: s.aboutGoalTitle,
    aboutGoalDesc: s.aboutGoalDesc,
    yearsOfExperience: s.yearsOfExperience,
    aboutStatsWork: s.aboutStatsWork,
    aboutStatsProjects: s.aboutStatsProjects,
    aboutStatsCommitment: s.aboutStatsCommitment,
    projectsTitle: s.projectsTitle,
    projectsSubtitle: s.projectsSubtitle,
    projectsDesc: s.projectsDesc,
    homeWorkTitle: s.homeWorkTitle,
    homeWorkSubtitle: s.homeWorkSubtitle,
    homeWorkDesc: s.homeWorkDesc ?? null,
    homeBlogTitle: s.homeBlogTitle,
    homeBlogSubtitle: s.homeBlogSubtitle,
    heroRoles: s.heroRoles ?? null,
    blogTitle: s.blogTitle ?? null,
    blogSubtitle: s.blogSubtitle ?? null,
    blogIntro: s.blogIntro ?? null,
    experienceHeroTitle: s.experienceHeroTitle ?? null,
    experienceHeroDesc: s.experienceHeroDesc ?? null,
    educationHeroDesc: s.educationHeroDesc ?? null,
    aboutExtraBio: s.aboutExtraBio ?? null,
    contactCtaTitle: s.contactCtaTitle,
    contactCtaDesc: s.contactCtaDesc,
    github: s.github,
    linkedin: s.linkedin,
    twitter: s.twitter,
    footerTitle: s.footerTitle,
    footerBio: s.footerBio,
    openToWork: s.openToWork,
    updatedAt: s.updatedAt.toISOString(),
    seoTitle: s.seoTitle ?? null,
    seoDescription: s.seoDescription ?? null,
    seoKeywords: s.seoKeywords ?? null,
    ogImage: s.ogImage ?? null,
  };
}

function toCertificationDTO(c: NonNullable<Awaited<ReturnType<typeof prisma.certification.findFirst>>>): CertificationDTO {
  return {
    id: c.id,
    slug: c.slug,
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
    slug: h.slug,
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

function toEducationDTO(e: NonNullable<Awaited<ReturnType<typeof prisma.education.findFirst>>>): EducationDTO {
  return {
    id: e.id,
    institution: e.institution,
    degree: e.degree,
    field: e.field,
    startYear: e.startYear,
    endYear: e.endYear,
    current: e.current,
    description: e.description,
    gpa: e.gpa,
    location: e.location,
    slug: e.slug,
    order: e.order,
    createdAt: e.createdAt.toISOString(),
  };
}

// ─── Fetchers (Strict - No fallbacks, let errors throw for safety) ─────────────

export const getExperiences = cache(async (): Promise<ExperienceDTO[]> => {
  try {
    const rows = await prisma.experience.findMany({ orderBy: { startDate: "desc" } });
    return rows.map(toExperienceDTO);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
});

export const getSkills = cache(async (): Promise<SkillDTO[]> => {
  try {
    const rows = await prisma.skill.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        iconUrl: true,
        order: true,
      },
      orderBy: { order: "asc" },
    });
    return rows.map(toSkillDTO);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
});

export const getServices = cache(async (): Promise<ServiceDTO[]> => {
  try {
    const rows = await prisma.service.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
        order: true,
        createdAt: true,
      },
      orderBy: { order: "asc" },
    });
    return rows.map(toServiceDTO);
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
});

export const getProjects = cache(async (): Promise<ProjectDTO[]> => {
  try {
    const rows = await prisma.project.findMany({
      where: { status: "completed" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        content: true,
        subtitle: true,
        role: true,
        client: true,
        category: true,
        timeline: true,
        year: true,
        problem: true,
        solution: true,
        impact: true,
        features: true,
        outcomes: true,
        techStack: true,
        liveUrl: true,
        githubUrl: true,
        imageUrl: true,
        galleryImages: true,
        projectLinks: { select: { label: true, url: true } },
        featured: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => toProjectDTO(row as PrismaProject));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
});

export const getAllProjectSlugs = cache(async (): Promise<string[]> => {
  try {
    const rows = await prisma.project.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch (error) {
    console.error("Error fetching project slugs:", error);
    return [];
  }
});

export const getBlogPosts = cache(async (): Promise<BlogPostDTO[]> => {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        contentFormat: true,
        coverImage: true,
        published: true,
        readingTime: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toBlogPostDTO);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
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
    console.error("Error fetching blog post slugs:", error);
    return [];
  }
});

export const getSiteSettings = cache(async (): Promise<SiteSettingsDTO | null> => {
  try {
    const row = await prisma.siteSettings.findFirst();
    return row ? toSiteSettingsDTO(row) : null;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
});

export const getCertifications = cache(async (): Promise<CertificationDTO[]> => {
  try {
    const rows = await prisma.certification.findMany({ orderBy: { date: "desc" } });
    return rows.map(toCertificationDTO);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }
});

export const getHackathons = cache(async (): Promise<HackathonDTO[]> => {
  try {
    const rows = await prisma.hackathon.findMany({ orderBy: { date: "desc" } });
    return rows.map(toHackathonDTO);
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    return [];
  }
});

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectDTO | null> => {
  try {
    const row = await prisma.project.findUnique({
      where: { slug },
      include: { projectLinks: true },
    });
    return row ? toProjectDTO(row as PrismaProject) : null;
  } catch (error) {
    console.error("Error fetching project by slug:", error);
    return null;
  }
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPostDTO | null> => {
  try {
    const row = await prisma.blogPost.findUnique({ where: { slug } });
    return row ? toBlogPostDTO(row) : null;
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return null;
  }
});

export const getContactMessages = cache(async (): Promise<ContactMessageDTO[]> => {
  try {
    const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(toContactMessageDTO);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }
});

export const getProjectById = cache(async (id: string): Promise<ProjectDTO | null> => {
  try {
    const row = await prisma.project.findUnique({
      where: { id },
      include: { projectLinks: true },
    });
    return row ? toProjectDTO(row as PrismaProject) : null;
  } catch (error) {
    console.error("Error fetching project by id:", error);
    return null;
  }
});

export const getBlogPostById = cache(async (id: string): Promise<BlogPostDTO | null> => {
  try {
    const row = await prisma.blogPost.findUnique({ where: { id } });
    return row ? toBlogPostDTO(row) : null;
  } catch (error) {
    console.error("Error fetching blog post by id:", error);
    return null;
  }
});

export const getExperienceById = cache(async (id: string): Promise<ExperienceDTO | null> => {
  try {
    const row = await prisma.experience.findUnique({ where: { id } });
    return row ? toExperienceDTO(row) : null;
  } catch (error) {
    console.error("Error fetching experience by id:", error);
    return null;
  }
});

export const getSkillById = cache(async (id: string): Promise<SkillDTO | null> => {
  try {
    const row = await prisma.skill.findUnique({ where: { id } });
    return row ? toSkillDTO(row) : null;
  } catch (error) {
    console.error("Error fetching skill by id:", error);
    return null;
  }
});

export const getCertificationById = cache(async (id: string): Promise<CertificationDTO | null> => {
  try {
    const row = await prisma.certification.findUnique({ where: { id } });
    return row ? toCertificationDTO(row) : null;
  } catch (error) {
    console.error("Error fetching certification by id:", error);
    return null;
  }
});

export const getHackathonById = cache(async (id: string): Promise<HackathonDTO | null> => {
  try {
    const row = await prisma.hackathon.findUnique({ where: { id } });
    return row ? toHackathonDTO(row) : null;
  } catch (error) {
    console.error("Error fetching hackathon by id:", error);
    return null;
  }
});

export const getHackathonBySlug = cache(async (slug: string): Promise<HackathonDTO | null> => {
  try {
    const row = await prisma.hackathon.findUnique({ where: { slug } });
    return row ? toHackathonDTO(row) : null;
  } catch (error) {
    console.error("Error fetching hackathon by slug:", error);
    return null;
  }
});

export const getAllHackathonSlugs = cache(async (): Promise<string[]> => {
  try {
    const rows = await prisma.hackathon.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch (error) {
    console.error("Error fetching hackathon slugs:", error);
    return [];
  }
});

export const getCertificationBySlug = cache(async (slug: string): Promise<CertificationDTO | null> => {
  try {
    const row = await prisma.certification.findUnique({ where: { slug } });
    return row ? toCertificationDTO(row) : null;
  } catch (error) {
    console.error("Error fetching certification by slug:", error);
    return null;
  }
});

export const getAllCertificationSlugs = cache(async (): Promise<string[]> => {
  try {
    const rows = await prisma.certification.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch (error) {
    console.error("Error fetching certification slugs:", error);
    return [];
  }
});

export const getEducation = cache(async (): Promise<EducationDTO[]> => {
  try {
    const rows = await prisma.education.findMany({ orderBy: { order: "asc" } });
    return rows.map(toEducationDTO);
  } catch (error) {
    console.error("Error fetching education:", error);
    return [];
  }
});

export const getEducationBySlug = cache(async (slug: string): Promise<EducationDTO | null> => {
  try {
    const row = await prisma.education.findUnique({ where: { slug } });
    return row ? toEducationDTO(row) : null;
  } catch (error) {
    console.error("Error fetching education by slug:", error);
    return null;
  }
});

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