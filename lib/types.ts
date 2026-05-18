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
  createdAt: string;
  updatedAt: string;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
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
  createdAt: string;
  updatedAt: string;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
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
  title: string | null;
  email: string;
  location: string | null;
  
  // Hero Section
  heroTitle: string | null;
  heroTagline: string | null;
  heroBio: string | null;
  avatarUrl: string | null;
  resumeUrl: string | null;
  
  // About Section
  aboutTitle: string | null;
  aboutGoalTitle: string | null;
  aboutGoalDesc: string | null;
  yearsOfExperience: string | null;
  aboutStatsWork: string | null;
  aboutStatsProjects: string | null;
  aboutStatsCommitment: string | null;
  
  // Projects Section
  projectsTitle: string | null;
  projectsSubtitle: string | null;
  projectsDesc: string | null;

  // Home Page Additional Sections
  homeWorkTitle: string | null;
  homeWorkSubtitle: string | null;
  homeWorkDesc: string | null;
  homeBlogTitle: string | null;
  homeBlogSubtitle: string | null;

  // Hero Typing Roles
  heroRoles: string | null;

  // Blog Page
  blogTitle: string | null;
  blogSubtitle: string | null;
  blogIntro: string | null;

  // Experience Page
  experienceHeroTitle: string | null;
  experienceHeroDesc: string | null;

  // Education Page
  educationHeroDesc: string | null;

  // About Extra Bio
  aboutExtraBio: string | null;

  // Contact CTA
  contactCtaTitle: string | null;
  contactCtaDesc: string | null;
  
  // Links
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  
  // Footer
  footerTitle: string | null;
  footerBio: string | null;
  
  openToWork: boolean;
  updatedAt: string;

  // SEO
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogImage: string | null;
};

export type ServiceDTO = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  order: number;
  createdAt: string;
};

export type HackathonDTO = {
  id: string;
  slug: string;
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
  slug: string;
  name: string;
  issuer: string;
  date: string;
  url: string | null;
  credentialId: string | null;
  image: string | null;
  createdAt: string;
};

export type EducationDTO = {
  id: string;
  slug: string;
  institution: string;
  degree: string;
  field: string | null;
  startYear: string;
  endYear: string | null;
  current: boolean;
  description: string | null;
  gpa: string | null;
  location: string | null;
  order: number;
  createdAt: string;
};

export type ApiResponse<T> = { data: T } | { error: string; fields?: Record<string, string[]> };
