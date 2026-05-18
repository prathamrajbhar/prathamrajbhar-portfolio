import type { SiteSettingsDTO } from "@/lib/types";

export const defaultSettings: SiteSettingsDTO = {
  id: "singleton",
  name: "",
  title: "",
  email: "",
  location: "",

  // Hero Section
  heroTitle: "",
  heroTagline: "",
  heroBio: "",
  avatarUrl: null,
  resumeUrl: null,

  // About Section
  aboutTitle: "",
  aboutGoalTitle: "",
  aboutGoalDesc: "",
  yearsOfExperience: "",
  aboutStatsWork: "",
  aboutStatsProjects: "",
  aboutStatsCommitment: "",

  // Projects Section
  projectsTitle: "",
  projectsSubtitle: "",
  projectsDesc: "",

  // Home Page Additional Sections
  homeWorkTitle: "",
  homeWorkSubtitle: "",
  homeWorkDesc: "",
  homeBlogTitle: "",
  homeBlogSubtitle: "",

  // Hero Typing Roles
  heroRoles: "",

  // Blog Page
  blogTitle: "",
  blogSubtitle: "",
  blogIntro: "",

  // Experience Page
  experienceHeroTitle: "",
  experienceHeroDesc: "",

  // Education Page
  educationHeroDesc: "",

  // About Extra Bio
  aboutExtraBio: "",

  // Contact CTA
  contactCtaTitle: "",
  contactCtaDesc: "",

  // Links
  github: null,
  linkedin: null,
  twitter: null,

  // Footer
  footerTitle: "",
  footerBio: "",

  openToWork: true,
  updatedAt: new Date().toISOString(),

  // SEO (null = use computed defaults)
  seoTitle: null,
  seoDescription: null,
  seoKeywords: null,
  ogImage: null,
};
