export type TagDTO = {
  id: string;
  name: string;
};

export type ProjectLinkDTO = {
  label: string;
  url: string;
};

export type ProjectDTO = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  subtitle: string | null;
  role: string | null;
  client: string | null;
  category: string | null;
  timeline: string | null;
  year: string | null;
  problem: string | null;
  solution: string | null;
  impact: string | null;
  features: string[];
  outcomes: string[];
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  galleryImages: string[];
  projectLinks: ProjectLinkDTO[];
  featured: boolean;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  tags: TagDTO[];
};

export type BlogPostDTO = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentFormat: "mdx" | "html";
  coverImage: string | null;
  published: boolean;
  readingTime: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  tags: TagDTO[];
};

export type ExperienceDTO = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  type: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  skills: string[];
  logoUrl: string | null;
  order: number;
  createdAt: string;
};

export type SkillDTO = {
  id: string;
  name: string;
  category: string;
  iconUrl: string | null;
  order: number;
};

export type ContactMessageDTO = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type SiteSettingsDTO = {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  resumeUrl: string | null;
  avatarUrl: string | null;
  heroTagline: string | null;
  openToWork: boolean;
  location: string | null;
  resumeDownloads: number;
  updatedAt: string;
};

export type HackathonDTO = {
  id: string;
  title: string;
  project: string;
  role: string | null;
  date: string;
  location: string | null;
  result: string | null;
  link: string | null;
  description: string;
  image: string | null;
  createdAt: string;
};

export type CertificationDTO = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string | null;
  credentialId: string | null;
  image: string | null;
  createdAt: string;
};

export type ApiResponse<T> = { data: T } | { error: string; fields?: Record<string, string[]> };
