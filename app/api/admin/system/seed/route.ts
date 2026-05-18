import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST() {
  try {
    await requireAdmin();

    // 1. Seed SiteSettings
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        name: "Alex Morgan",
        title: "Full-Stack Developer",
        email: "alex@example.com",
        location: "San Francisco, CA",
        heroTitle: "Building Digital Experiences.",
        heroTagline: "FULL-STACK DEVELOPER",
        heroBio: "I craft high-performance web applications with modern technologies.",
        aboutTitle: "Passionate about clean code.",
        aboutGoalTitle: "My Mission",
        aboutGoalDesc: "To build software that makes a positive impact on people's lives.",
        yearsOfExperience: "5+",
        aboutStatsWork: "5+",
        aboutStatsProjects: "30+",
        aboutStatsCommitment: "100%",
        projectsTitle: "Featured Projects",
        projectsSubtitle: "My Work",
        projectsDesc: "A curated selection of projects showcasing my expertise.",
        homeWorkTitle: "Work History",
        homeWorkSubtitle: "Experience",
        homeWorkDesc: "My professional journey through various roles and companies.",
        homeBlogTitle: "Latest Articles",
        homeBlogSubtitle: "Blog",
        heroRoles: "Full-Stack Developer, UI Engineer, Open Source Contributor, Tech Writer",
        blogTitle: "Dev Blog",
        blogSubtitle: "Thoughts on Engineering",
        blogIntro: "I write about software architecture, performance optimization, and modern development workflows.",
        experienceHeroTitle: "Career Path",
        experienceHeroDesc: "My professional journey and the skills I've developed along the way.",
        educationHeroDesc: "My academic background and continuous learning journey.",
        aboutExtraBio: "When I'm not coding, I enjoy hiking, photography, and contributing to open-source projects.",
        contactCtaTitle: "Let's work together",
        contactCtaDesc: "I'm available for freelance projects and full-time opportunities.",
        footerTitle: "Ready to build something amazing?",
        footerBio: "Let's collaborate on your next project.",
        github: "https://github.com/alexmorgan",
        linkedin: "https://linkedin.com/in/alexmorgan",
        twitter: "https://twitter.com/alexmorgan",
        openToWork: true,
      },
      create: {
        id: "singleton",
        name: "Alex Morgan",
        title: "Full-Stack Developer",
        email: "alex@example.com",
        location: "San Francisco, CA",
        heroTitle: "Building Digital Experiences.",
        heroTagline: "FULL-STACK DEVELOPER",
        heroBio: "I craft high-performance web applications with modern technologies.",
        aboutTitle: "Passionate about clean code.",
        aboutGoalTitle: "My Mission",
        aboutGoalDesc: "To build software that makes a positive impact on people's lives.",
        yearsOfExperience: "5+",
        aboutStatsWork: "5+",
        aboutStatsProjects: "30+",
        aboutStatsCommitment: "100%",
        projectsTitle: "Featured Projects",
        projectsSubtitle: "My Work",
        projectsDesc: "A curated selection of projects showcasing my expertise.",
        homeWorkTitle: "Work History",
        homeWorkSubtitle: "Experience",
        homeWorkDesc: "My professional journey through various roles and companies.",
        homeBlogTitle: "Latest Articles",
        homeBlogSubtitle: "Blog",
        heroRoles: "Full-Stack Developer, UI Engineer, Open Source Contributor, Tech Writer",
        blogTitle: "Dev Blog",
        blogSubtitle: "Thoughts on Engineering",
        blogIntro: "I write about software architecture, performance optimization, and modern development workflows.",
        experienceHeroTitle: "Career Path",
        experienceHeroDesc: "My professional journey and the skills I've developed along the way.",
        educationHeroDesc: "My academic background and continuous learning journey.",
        aboutExtraBio: "When I'm not coding, I enjoy hiking, photography, and contributing to open-source projects.",
        contactCtaTitle: "Let's work together",
        contactCtaDesc: "I'm available for freelance projects and full-time opportunities.",
        footerTitle: "Ready to build something amazing?",
        footerBio: "Let's collaborate on your next project.",
        github: "https://github.com/alexmorgan",
        linkedin: "https://linkedin.com/in/alexmorgan",
        twitter: "https://twitter.com/alexmorgan",
        openToWork: true,
      },
    });

    // 2. Seed Skills
    const skills = [
      { name: "React", category: "Frontend", iconUrl: null, order: 1 },
      { name: "TypeScript", category: "Frontend", iconUrl: null, order: 2 },
      { name: "Next.js", category: "Frontend", iconUrl: null, order: 3 },
      { name: "Node.js", category: "Backend", iconUrl: null, order: 4 },
      { name: "PostgreSQL", category: "Backend", iconUrl: null, order: 5 },
      { name: "Prisma", category: "Backend", iconUrl: null, order: 6 },
      { name: "Tailwind CSS", category: "Frontend", iconUrl: null, order: 7 },
      { name: "Docker", category: "DevOps", iconUrl: null, order: 8 },
      { name: "AWS", category: "DevOps", iconUrl: null, order: 9 },
      { name: "GraphQL", category: "Backend", iconUrl: null, order: 10 },
    ];
    for (const skill of skills) {
      await prisma.skill.upsert({
        where: { name: skill.name },
        update: skill,
        create: skill,
      });
    }

    // 3. Seed Experience
    await prisma.experience.createMany({
      data: [
        {
          role: "Senior Full-Stack Developer",
          company: "TechCorp Inc.",
          description: "Leading frontend architecture decisions and mentoring junior developers.",
          type: "Full-time",
          startDate: new Date("2022-03-01"),
          endDate: null,
          current: true,
          location: "San Francisco, CA",
          skills: ["React", "TypeScript", "Node.js"],
          logoUrl: null,
          order: 1,
        },
        {
          role: "Full-Stack Developer",
          company: "StartupXYZ",
          description: "Built and scaled the core platform from MVP to 10k+ users.",
          type: "Full-time",
          startDate: new Date("2020-06-01"),
          endDate: new Date("2022-02-28"),
          current: false,
          location: "Remote",
          skills: ["Next.js", "PostgreSQL", "AWS"],
          logoUrl: null,
          order: 2,
        },
        {
          role: "Junior Developer",
          company: "Digital Agency",
          description: "Developed client websites and e-commerce solutions.",
          type: "Full-time",
          startDate: new Date("2019-01-01"),
          endDate: new Date("2020-05-31"),
          current: false,
          location: "New York, NY",
          skills: ["JavaScript", "PHP", "WordPress"],
          logoUrl: null,
          order: 3,
        },
      ],
    });

    // 4. Seed Projects
    const project1 = await prisma.project.create({
      data: {
        title: "E-Commerce Platform",
        slug: "e-commerce-platform",
        subtitle: "Modern Shopping Experience",
        description: "A full-featured e-commerce platform with real-time inventory, Stripe payments, and admin dashboard.",
        content: "## Overview\n\nThis project showcases a complete e-commerce solution built with Next.js 14, featuring server-side rendering for optimal SEO and performance.\n\n## Key Features\n\n- Real-time inventory management\n- Stripe payment integration\n- Admin dashboard with analytics\n- Mobile-first responsive design\n\n## Tech Stack\n\nReact, Next.js, Prisma, PostgreSQL, Stripe, Tailwind CSS",
        role: "Lead Developer",
        client: "RetailBrand Co.",
        category: "Web Application",
        imageUrl: null,
        featured: true,
        techStack: ["Next.js", "Stripe", "Prisma", "Tailwind"],
        tags: ["E-Commerce", "Full-Stack"],
      },
    });

    await prisma.projectLink.createMany({
      data: [
        { projectId: project1.id, label: "Live Demo", url: "https://demo.example.com" },
        { projectId: project1.id, label: "Source Code", url: "https://github.com/example/ecommerce" },
      ],
    });

    const project2 = await prisma.project.create({
      data: {
        title: "AI Dashboard",
        slug: "ai-dashboard",
        subtitle: "Analytics Platform",
        description: "A real-time analytics dashboard powered by machine learning models for predictive insights.",
        content: "## Overview\n\nAn AI-powered dashboard that processes millions of data points to deliver actionable business insights.\n\n## Architecture\n\nThe system uses a microservices architecture with Python ML services and a Next.js frontend.",
        role: "Full-Stack Developer",
        client: "DataFlow Inc.",
        category: "SaaS",
        imageUrl: null,
        featured: true,
        techStack: ["React", "Python", "TensorFlow", "Docker"],
        tags: ["AI", "Machine Learning"],
      },
    });

    await prisma.projectLink.createMany({
      data: [
        { projectId: project2.id, label: "Live Demo", url: "https://ai-demo.example.com" },
      ],
    });

    const project3 = await prisma.project.create({
      data: {
        title: "Social Media App",
        slug: "social-media-app",
        subtitle: "Community Platform",
        description: "A modern social platform with real-time messaging, stories, and content discovery.",
        content: "## Overview\n\nBuilt a social platform from scratch with real-time features using WebSockets.\n\n## Highlights\n\n- Real-time messaging\n- Stories with expiration\n- Content recommendation engine\n- Push notifications",
        role: "Solo Developer",
        client: "SocialStart",
        category: "Mobile & Web",
        imageUrl: null,
        featured: false,
        techStack: ["React Native", "Firebase", "GraphQL"],
        tags: ["Social", "Mobile"],
      },
    });

    await prisma.projectLink.createMany({
      data: [
        { projectId: project3.id, label: "App Store", url: "https://apps.apple.com/example" },
        { projectId: project3.id, label: "Play Store", url: "https://play.google.com/example" },
      ],
    });

    // 5. Seed Blog Posts
    await prisma.blogPost.createMany({
      data: [
        {
          title: "Building Scalable APIs with Next.js",
          slug: "building-scalable-apis-nextjs",
          excerpt: "Learn how to design and implement APIs that can handle millions of requests using Next.js App Router.",
          content: "## Introduction\n\nBuilding APIs that scale is crucial for modern applications. In this post, we'll explore best practices...\n\n## Architecture Decisions\n\nWhen designing APIs, consider caching strategies, database optimization, and edge computing...\n\n## Conclusion\n\nWith the right approach, Next.js can power enterprise-grade APIs.",
          coverImage: null,
          published: true,
          tags: ["Next.js", "API", "Performance"],
          readingTime: 8,
        },
        {
          title: "The Future of React Server Components",
          slug: "future-react-server-components",
          excerpt: "Exploring how RSC changes the way we think about rendering and data fetching in React.",
          content: "## What are Server Components?\n\nReact Server Components allow you to render components on the server...\n\n## Benefits\n\n- Zero client-side JavaScript\n- Direct database access\n- Automatic code splitting\n\n## Practical Examples\n\nLet's build a dashboard using RSC...",
          coverImage: null,
          published: true,
          tags: ["React", "RSC", "Architecture"],
          readingTime: 12,
        },
        {
          title: "TypeScript Tips for Better Code",
          slug: "typescript-tips-better-code",
          excerpt: "Advanced TypeScript patterns that will improve your code quality and developer experience.",
          content: "## Type Guards\n\nLearn to narrow types effectively...\n\n## Generics Mastery\n\nUnderstanding generic constraints...\n\n## Utility Types\n\nBuilt-in types you should know...",
          coverImage: null,
          published: true,
          tags: ["TypeScript", "JavaScript", "Tips"],
          readingTime: 6,
        },
      ],
    });

    // 6. Seed Hackathons
    await prisma.hackathon.createMany({
      data: [
        {
          title: "Global AI Hackathon 2023",
          slug: "global-ai-hackathon-2023",
          project: "MediScan AI",
          role: "Team Lead & Full-Stack Dev",
          date: new Date("2023-10-15"),
          location: "San Francisco, CA",
          result: "1st Place / 200+ Teams",
          link: "https://devpost.com/example",
          description: "Built an AI-powered medical imaging analysis tool that helps detect early-stage diseases with 94% accuracy.",
          image: null,
        },
        {
          title: "ETHGlobal 2023",
          slug: "ethglobal-2023",
          project: "DeFi Dashboard",
          role: "Smart Contract Developer",
          date: new Date("2023-11-20"),
          location: "Online",
          result: "Finalist",
          link: "https://ethglobal.com/example",
          description: "Created a decentralized finance dashboard with real-time yield farming analytics.",
          image: null,
        },
      ],
    });

    // 7. Seed Certifications
    await prisma.certification.createMany({
      data: [
        {
          name: "AWS Certified Solutions Architect",
          slug: "aws-certified-solutions-architect",
          issuer: "Amazon Web Services",
          date: new Date("2023-06-01"),
          url: "https://aws.amazon.com/certification",
          credentialId: "AWS-123456",
          image: null,
        },
        {
          name: "Google Cloud Professional Developer",
          slug: "google-cloud-professional-developer",
          issuer: "Google Cloud",
          date: new Date("2022-09-01"),
          url: "https://cloud.google.com/certification",
          credentialId: "GCP-789012",
          image: null,
        },
      ],
    });

    // 8. Seed Education
    await prisma.education.createMany({
      data: [
        {
          institution: "Stanford University",
          slug: "stanford-university",
          degree: "Master of Science",
          field: "Computer Science",
          startYear: "2018",
          endYear: "2020",
          current: false,
          description: "Specialized in distributed systems and machine learning.",
          location: "Stanford, CA",
          gpa: "3.9",
        },
        {
          institution: "UC Berkeley",
          slug: "uc-berkeley",
          degree: "Bachelor of Science",
          field: "Software Engineering",
          startYear: "2014",
          endYear: "2018",
          current: false,
          description: "Graduated with honors. Active in ACM and open-source clubs.",
          location: "Berkeley, CA",
          gpa: "3.8",
        },
      ],
    });

    // 9. Seed Contact Messages
    await prisma.contactMessage.createMany({
      data: [
        {
          name: "Sarah Johnson",
          email: "sarah@company.com",
          subject: "Project Collaboration",
          message: "Hi! I'm interested in collaborating on a new e-commerce project. Would love to discuss details.",
          read: false,
        },
        {
          name: "Michael Chen",
          email: "michael@startup.io",
          subject: "Full-time Opportunity",
          message: "We're looking for a senior developer to join our team. Your portfolio looks impressive!",
          read: true,
        },
      ],
    });

    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidatePath("/projects");
    revalidatePath("/blog");
    revalidatePath("/experience");
    revalidatePath("/education");
    revalidatePath("/contact");

    return NextResponse.json({ success: true, message: "Mock data seeded successfully" });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 });
  }
}
