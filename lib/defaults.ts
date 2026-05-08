import type { SiteSettingsDTO } from "@/lib/types";

export const defaultSettings: SiteSettingsDTO = {
  id: "singleton",
  name: "Pratham Rajbhar",
  title: "Computer Engineering Student",
  bio: "Motivated Computer Engineering undergraduate (B.Tech, 6th Semester, Ganpat University) with a 9.4 CGPA in Diploma and real-world experience across 6 hackathons where I built and shipped working products under tight deadlines. I am comfortable across the full stack, from building interfaces to designing backend systems and integrating AI features.",
  email: "pratham.rajbhar@gmail.com",
  github: "https://github.com/prathamrajbhar",
  linkedin: "https://linkedin.com/in/prathamrajbhar",
  twitter: null,
  resumeUrl: "/resume.pdf",
  avatarUrl: null,
  heroTagline: "Computer Engineering student building full-stack AI applications and real-time systems.",
  openToWork: true,
  location: "Ahmedabad, Gujarat",
  resumeDownloads: 0,
  updatedAt: new Date().toISOString()
};
