import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { getDefaultAIBaseUrl, getDefaultAIModel, normalizeAIProvider } from "../lib/ai-config";

// Strip sslmode from URL — we configure SSL via Pool options to avoid TLS cert errors with AWS RDS
const rawUrl = process.env.DATABASE_URL!;
const parsedUrl = new URL(rawUrl);
parsedUrl.searchParams.delete("sslmode");
const connectionString = parsedUrl.toString();

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const aiProvider = normalizeAIProvider(process.env.AI_PROVIDER ?? null);
  const aiModel = process.env.AI_MODEL?.trim() || getDefaultAIModel(aiProvider);
  const aiBaseUrl = process.env.AI_BASE_URL?.trim() || getDefaultAIBaseUrl(aiProvider);

  // ─── Site Settings ─────────────────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Pratham Rajbhar",
      email: "pratham.rajbhar@gmail.com",
      location: "Surat, India",
      heroTitle: "Engineering Great Websites.",
      heroTagline: "FULL-STACK ENGINEER",
      heroBio: "Hi, I'm Pratham Rajbhar. A Computer Engineering student building fast, beautiful websites that work perfectly.",
      avatarUrl: null,
      resumeUrl: "/resume.pdf",
      aboutTitle: "Building things that work well.",
      aboutGoalTitle: "My Goal",
      aboutGoalDesc: "I make websites that look great and work perfectly. I focus on building fast, easy-to-use apps that can grow with your needs.",
      yearsOfExperience: "2+",
      github: "https://github.com/prathamrajbhar",
      linkedin: "https://linkedin.com/in/prathamrajbhar",
      twitter: null,
      aiProvider,
      aiModel,
      aiBaseUrl,
      openToWork: true,
    },
  });
  console.log("  ✅ Site settings");

  // ─── Skills ────────────────────────────────────────────────────────────────
  const skills = [
    { name: "React", category: "Frontend", order: 1, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
    { name: "Next.js", category: "Frontend", order: 2, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
    { name: "TypeScript", category: "Frontend", order: 3, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
    { name: "Tailwind CSS", category: "Frontend", order: 4, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "HTML/CSS", category: "Frontend", order: 5, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
    { name: "Framer Motion", category: "Frontend", order: 6, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg" },
    { name: "Node.js", category: "Backend", order: 7, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
    { name: "Express.js", category: "Backend", order: 8, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" },
    { name: "Python", category: "Backend", order: 9, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "FastAPI", category: "Backend", order: 10, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg" },
    { name: "REST APIs", category: "Backend", order: 11 },
    { name: "PostgreSQL", category: "Database", order: 12, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
    { name: "MongoDB", category: "Database", order: 13, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
    { name: "Prisma", category: "Database", order: 14, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" },
    { name: "Redis", category: "Database", order: 15, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg" },
    { name: "Docker", category: "DevOps", order: 16, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
    { name: "Git", category: "DevOps", order: 17, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    { name: "GitHub Actions", category: "DevOps", order: 18, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg" },
    { name: "AWS", category: "DevOps", order: 19, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
    { name: "OpenAI API", category: "AI/ML", order: 20, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openai/openai-original.svg" },
    { name: "LangChain", category: "AI/ML", order: 21 },
    { name: "Socket.IO", category: "Tools", order: 22, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg" },
    { name: "Figma", category: "Tools", order: 23, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { category: skill.category, order: skill.order, iconUrl: skill.iconUrl ?? null },
      create: skill,
    });
  }
  console.log("  ✅ Skills");

  // ─── Experiences ───────────────────────────────────────────────────────────
  const experiences = [
    {
      company: "Freelance",
      role: "Full-Stack Developer",
      location: "Remote",
      type: "Freelance",
      startDate: new Date("2024-06-01"),
      endDate: null,
      current: true,
      description: "Building production-grade web applications for clients using Next.js, React, and Node.js. Delivering end-to-end solutions including database design, API development, and responsive UI implementation.",
      skills: ["Next.js", "React", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
      order: 1,
    },
    {
      company: "Hackathon Projects",
      role: "Full-Stack Engineer",
      location: "Gujarat, India",
      type: "Project-based",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2024-12-31"),
      current: false,
      description: "Participated in 6+ hackathons, building and shipping working products under tight deadlines. Developed AI-powered applications, real-time collaboration tools, and data visualization dashboards.",
      skills: ["React", "Python", "FastAPI", "OpenAI API", "Socket.IO", "MongoDB"],
      order: 2,
    },
    {
      company: "Ganpat University",
      role: "B.Tech Computer Engineering",
      location: "Gujarat, India",
      type: "Education",
      startDate: new Date("2022-08-01"),
      endDate: null,
      current: true,
      description: "Pursuing B.Tech in Computer Engineering with focus on software development, data structures, algorithms, and system design. Active participant in coding competitions and technical events.",
      skills: ["Data Structures", "Algorithms", "System Design", "C++", "Java"],
      order: 3,
    },
  ];

  // Clear and re-insert experiences for idempotency
  await prisma.experience.deleteMany();
  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log("  ✅ Experiences");

  // ─── Projects ──────────────────────────────────────────────────────────────
  await prisma.project.deleteMany();
  const projects = [
    {
      title: "Portfolio Website",
      slug: "portfolio-website",
      description: "A high-performance, SEO-optimized personal portfolio built with Next.js 15, featuring a PostgreSQL backend, dynamic content management, and stunning UI animations.",
      content: "<h2>Overview</h2><p>This portfolio showcases my work and skills with a modern, performant web application. Built with Next.js 15 App Router, it features server-side rendering, incremental static regeneration, and a full PostgreSQL backend via Prisma ORM.</p><h2>Technical Highlights</h2><ul><li>Next.js 15 App Router with React Server Components</li><li>PostgreSQL database with Prisma ORM</li><li>Tailwind CSS with custom design system</li><li>Framer Motion animations throughout</li><li>Full SEO optimization with dynamic sitemap</li><li>Contact form with Zod validation</li></ul>",
      subtitle: "Modern, performant portfolio with full-stack architecture",
      category: "Web Application",
      year: "2024",
      techStack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Framer Motion"],
      tags: ["Next.js", "Full-Stack", "Portfolio"],
      features: ["Server-side rendering with ISR", "PostgreSQL backend with Prisma", "Responsive design with dark mode", "Contact form with validation", "SEO optimized with dynamic sitemap", "Animated UI with Framer Motion"],
      outcomes: ["Lightning-fast page loads", "100% Lighthouse SEO score", "Fully accessible design"],
      featured: true,
      status: "completed",
      githubUrl: "https://github.com/prathamrajbhar/prathamrajbhar-portfolio",
    },
    {
      title: "AI Chat Application",
      slug: "ai-chat-application",
      description: "A real-time AI-powered chat application with context-aware responses, built using React, Node.js, and the OpenAI API with streaming support.",
      content: "<h2>Overview</h2><p>An intelligent chat application that leverages OpenAI's GPT models to provide context-aware conversations. Features real-time streaming responses, conversation history, and a polished user interface.</p><h2>Key Features</h2><ul><li>Real-time streaming responses from GPT-4</li><li>Conversation history and context management</li><li>Markdown rendering in chat messages</li><li>Dark/light theme support</li></ul>",
      subtitle: "Real-time AI conversations with streaming responses",
      category: "AI Application",
      year: "2024",
      techStack: ["React", "Node.js", "OpenAI API", "Socket.IO", "Express.js", "MongoDB"],
      tags: ["AI/ML", "Full-Stack", "Real-Time"],
      features: ["Streaming GPT-4 responses", "Conversation context management", "Markdown rendering", "Real-time WebSocket communication"],
      outcomes: ["Sub-second response initiation", "Seamless conversation flow", "Production-ready architecture"],
      featured: true,
      status: "completed",
      githubUrl: "https://github.com/prathamrajbhar",
    },
    {
      title: "Task Management System",
      slug: "task-management-system",
      description: "A collaborative project management tool with real-time updates, Kanban boards, and team collaboration features built with Next.js and PostgreSQL.",
      content: "<h2>Overview</h2><p>A full-featured task management system designed for team collaboration. Features Kanban boards, real-time updates, and comprehensive project tracking capabilities.</p>",
      subtitle: "Collaborative project tracking with real-time sync",
      category: "Productivity",
      year: "2024",
      techStack: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Socket.IO"],
      tags: ["Next.js", "Full-Stack", "Real-Time"],
      features: ["Drag-and-drop Kanban boards", "Real-time collaboration", "Project analytics dashboard", "Role-based access control"],
      outcomes: ["Improved team productivity", "Real-time sync across devices"],
      featured: true,
      status: "completed",
      githubUrl: "https://github.com/prathamrajbhar",
    },
    {
      title: "E-Commerce API",
      slug: "e-commerce-api",
      description: "A scalable RESTful API for e-commerce platforms with authentication, payment processing, inventory management, and order tracking.",
      content: "<h2>Overview</h2><p>A robust backend API designed to power e-commerce platforms. Built with Express.js and PostgreSQL, featuring JWT authentication, Stripe payment integration, and comprehensive inventory management.</p>",
      subtitle: "Scalable backend for modern e-commerce",
      category: "Backend",
      year: "2023",
      techStack: ["Node.js", "Express.js", "PostgreSQL", "Redis", "Docker"],
      tags: ["Backend", "API"],
      features: ["JWT authentication", "Stripe payment integration", "Inventory management", "Order tracking system", "Rate limiting and caching"],
      outcomes: ["Handles 1000+ concurrent requests", "99.9% uptime", "Sub-100ms response times"],
      featured: false,
      status: "completed",
      githubUrl: "https://github.com/prathamrajbhar",
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log("  ✅ Projects");

  // ─── Blog Posts ────────────────────────────────────────────────────────────
  await prisma.blogPost.deleteMany();
  const blogPosts = [
    {
      title: "Building a Production-Ready Portfolio with Next.js 15",
      slug: "building-portfolio-nextjs-15",
      excerpt: "A deep dive into architecting a modern portfolio with Next.js 15, PostgreSQL, Prisma, and ISR for optimal performance and developer experience.",
      content: "# Building a Production-Ready Portfolio with Next.js 15\n\nWhen I set out to build my portfolio, I wanted more than a static page. I wanted a **full-stack application** that demonstrates real engineering skills.\n\n## Tech Stack Decisions\n\n### Why Next.js 15?\nThe App Router in Next.js 15 offers React Server Components, which means we can fetch data directly in our components without client-side state management.\n\n### PostgreSQL + Prisma\nPrisma provides type-safe database access that integrates beautifully with TypeScript. Combined with PostgreSQL, it gives us a robust data layer.\n\n## Key Architecture Patterns\n\n### Build-Time Resilience\nOne challenge with database-backed SSG is that the database must be available during `next build`. I solved this with try/catch wrappers:\n\n```typescript\nexport const getProjects = cache(async () => {\n  try {\n    return await prisma.project.findMany();\n  } catch {\n    return []; // Graceful fallback\n  }\n});\n```\n\n### ISR for Fresh Content\nUsing `revalidate = 3600`, pages are statically generated but refresh every hour.\n\n## Conclusion\nBuilding a portfolio is a great way to showcase your engineering skills. Focus on real architecture, not just pretty UI.",
      contentFormat: "mdx",
      published: true,
      readingTime: 5,
      tags: ["Next.js", "Portfolio", "Architecture"],
    },
    {
      title: "Mastering Prisma ORM: From Schema to Production",
      slug: "mastering-prisma-orm",
      excerpt: "Everything you need to know about Prisma ORM — schema design, migrations, seeding, and production best practices for PostgreSQL.",
      content: "# Mastering Prisma ORM\n\nPrisma has become the go-to ORM for TypeScript developers. Here's what I've learned using it in production.\n\n## Schema Design\n\nStart with your domain models. Think about relationships, indexes, and constraints before writing code.\n\n```prisma\nmodel Project {\n  id    String @id @default(cuid())\n  title String\n  slug  String @unique\n  tags  String[]\n}\n```\n\n## The Singleton Pattern for Prisma Client\n\nIn development, Next.js hot-reloads modules which creates multiple Prisma instances. Use the global pattern:\n\n```typescript\nconst globalForPrisma = globalThis as unknown as { prisma: PrismaClient };\nexport const prisma = globalForPrisma.prisma ?? new PrismaClient();\nif (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;\n```\n\n## Seeding Best Practices\n\nUse `upsert` for idempotent seeds that can run multiple times safely.\n\n## Conclusion\nPrisma dramatically improves the developer experience for database operations in TypeScript projects.",
      contentFormat: "mdx",
      published: true,
      readingTime: 4,
      tags: ["Prisma", "Database", "TypeScript"],
    },
    {
      title: "Real-Time Features with Socket.IO and React",
      slug: "realtime-socketio-react",
      excerpt: "How to implement real-time features like live collaboration, notifications, and chat using Socket.IO with a React frontend.",
      content: "# Real-Time Features with Socket.IO and React\n\nReal-time communication is essential for modern web applications. Here's how I implement it.\n\n## Setting Up the Server\n\nSocket.IO provides a reliable WebSocket abstraction with automatic fallbacks.\n\n## React Integration\n\nUse a custom hook to manage the socket connection lifecycle:\n\n```typescript\nfunction useSocket(url: string) {\n  const [socket, setSocket] = useState(null);\n  useEffect(() => {\n    const s = io(url);\n    setSocket(s);\n    return () => { s.disconnect(); };\n  }, [url]);\n  return socket;\n}\n```\n\n## Use Cases\n- Live collaboration on documents\n- Real-time notifications\n- Chat applications\n- Live dashboards\n\n## Conclusion\nSocket.IO makes real-time features accessible. Combined with React, you can build engaging, interactive experiences.",
      contentFormat: "mdx",
      published: true,
      readingTime: 3,
      tags: ["React", "Socket.IO", "Real-Time"],
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }
  console.log("  ✅ Blog posts");

  // ─── Hackathons ────────────────────────────────────────────────────────────
  await prisma.hackathon.deleteMany();
  const hackathons = [
    {
      slug: "smart-india-hackathon-2024",
      title: "Smart India Hackathon 2024",
      project: "AI-Powered Document Analysis System",
      role: "Team Lead & Full-Stack Developer",
      date: new Date("2024-03-15"),
      location: "Gujarat, India",
      result: "Finalist",
      description: "Led a team of 6 to build an AI-powered document analysis platform that extracts, categorizes, and summarizes information from government documents using NLP. The system processes unstructured PDF documents and converts them into structured, queryable data using transformer-based models.",
    },
    {
      slug: "hackgu-2023",
      title: "HackGU 2023",
      project: "Campus Connect — Student Collaboration Platform",
      role: "Full-Stack Developer",
      date: new Date("2023-10-20"),
      location: "Ganpat University",
      result: "Winner",
      description: "Built a real-time student collaboration platform with live coding, shared whiteboards, and video calls within 36 hours. Implemented WebRTC for peer-to-peer video and Socket.IO for real-time document sync.",
    },
    {
      slug: "devjam-2023",
      title: "DevJam 2023",
      project: "MedAssist — AI Health Assistant",
      role: "Backend Developer",
      date: new Date("2023-07-10"),
      location: "Ahmedabad, India",
      result: "Top 5",
      description: "Developed the backend for an AI-powered health assistant that provides preliminary symptom analysis and connects users with relevant healthcare resources. Built FastAPI endpoints with OpenAI integration and vector search for medical knowledge retrieval.",
    },
  ];

  for (const h of hackathons) {
    await prisma.hackathon.create({ data: h });
  }
  console.log("  ✅ Hackathons");

  // ─── Certifications ────────────────────────────────────────────────────────
  await prisma.certification.deleteMany();
  const certs = [
    {
      slug: "aws-cloud-practitioner",
      name: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: new Date("2024-01-15"),
      url: "https://aws.amazon.com/certification/",
      credentialId: "AWS-CP-2024-12345",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    },
    {
      slug: "meta-front-end-developer",
      name: "Meta Front-End Developer",
      issuer: "Meta (Coursera)",
      date: new Date("2023-09-01"),
      url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
      credentialId: "META-FE-2023-67890",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
    },
    {
      slug: "full-stack-web-development",
      name: "Full-Stack Web Development",
      issuer: "freeCodeCamp",
      date: new Date("2023-05-20"),
      url: "https://www.freecodecamp.org/certification/",
      credentialId: "FCC-FSWD-2023-11111",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    },
  ];

  for (const c of certs) {
    await prisma.certification.create({ data: c });
  }
  console.log("  ✅ Certifications");

  // ─── Education ─────────────────────────────────────────────────────────────
  await prisma.education.deleteMany();
  const educations = [
    {
      slug: "btech-computer-engineering",
      institution: "Ganpat University",
      degree: "B.Tech in Computer Engineering",
      field: "Computer Engineering",
      startYear: "2022",
      endYear: "2026",
      current: true,
      description: "Pursuing Bachelor of Technology in Computer Engineering with a focus on software development, distributed systems, and AI/ML. Active participant in coding competitions, hackathons, and technical workshops. Maintained a strong academic record with consistent performance in core computer science subjects.",
      gpa: "8.5/10",
      location: "Gujarat, India",
      order: 1,
    },
    {
      slug: "diploma-computer-engineering",
      institution: "Government Polytechnic",
      degree: "Diploma in Computer Engineering",
      field: "Computer Engineering",
      startYear: "2019",
      endYear: "2022",
      current: false,
      description: "Completed a 3-year diploma program with a 9.4 CGPA. Built a strong foundation in programming, data structures, computer networks, and database management. Won the Best Project Award for the final year project on Smart Traffic Management System.",
      gpa: "9.4/10",
      location: "Gujarat, India",
      order: 2,
    },
  ];

  for (const edu of educations) {
    await prisma.education.create({ data: edu });
  }
  console.log("  ✅ Education");

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
