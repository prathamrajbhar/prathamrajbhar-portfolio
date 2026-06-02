#!/usr/bin/env node
/* eslint-disable */
/**
 * resume_seed.js
 * Seeds the portfolio website database with complete details from the PDF resume:
 * - Site Settings (singleton)
 * - Skills (Languages & Frontend, Mobile & Backend, AI & LLMs, Databases & Tools)
 * - Education (B.Tech & Diploma)
 * - Projects (KeplerLab AI Notebook, Smart Tourist Safety Monitoring System, Balanza)
 * - Experiences (Freelance & Hackathon Projects)
 * - Hackathons (Smart India Hackathon, HackGU, DevJam)
 * - Certifications (AWS, Meta FE, freeCodeCamp)
 * - Blog Posts
 *
 * To run this script, run:
 *   node resume_seed.js
 */

const { Client } = require("pg");
require("dotenv").config();

function generateCuid() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "c";
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("Error: DATABASE_URL not found in environment or .env file.");
    process.exit(1);
  }

  // Strip sslmode parameters from the connection URL before passing it to Client.
  // pg-connection-string parses sslmode parameters in ways that can conflict with explicit ssl options.
  const connectionString = dbUrl.replace(/[?&]sslmode=[^&]*/g, "").replace(/\?$/, "");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  console.log("🌱 Connecting to the PostgreSQL database...");
  try {
    await client.connect();
    console.log("  ✅ Connection established successfully!");
  } catch (err) {
    console.error(`❌ Connection failed: ${err.message}`);
    process.exit(1);
  }

  try {
    // Start transaction
    await client.query("BEGIN");

    console.log("🌱 Cleaning existing data...");
    const tablesToClean = [
      "ProjectLink",
      "Project",
      "Skill",
      "Experience",
      "Hackathon",
      "Certification",
      "Education",
      "SiteSettings",
      "BlogPost"
    ];

    for (const table of tablesToClean) {
      await client.query(`DELETE FROM "${table}";`);
      console.log(`  🗑️ Cleared table: "${table}"`);
    }

    const now = new Date();

    // ─── 1. Site Settings ────────────────────────────────────────────────
    console.log("\n🌱 Seeding SiteSettings...");
    const aiProvider = process.env.AI_PROVIDER || "openrouter";
    const aiModel = process.env.AI_MODEL || "openai/gpt-oss-20b:free";
    const aiBaseUrl = process.env.AI_BASE_URL || "https://openrouter.ai/api/v1";

    const settingsValues = [
      "singleton", // 1
      "Pratham Rajbhar", // 2
      "Computer Engineering Undergraduate & Full-Stack Developer", // 3
      "Motivated Computer Engineering undergraduate (B.Tech, 6th Semester, Ganpat University) with a 9.4 CGPA in Diploma and real-world experience across 6 hackathons where I built and shipped working products under tight deadlines.", // 4
      "pratham.rajbhar@gmail.com", // 5
      "Ahmedabad, Gujarat", // 6
      "Engineering Great Websites.", // 7
      "FULL-STACK ENGINEER & AI DEVELOPER", // 8
      "Hi, I'm Pratham Rajbhar. A Computer Engineering student building fast, beautiful websites that work perfectly and integrate intelligent AI features.", // 9
      null, // 10 (avatarUrl)
      "/resume.pdf", // 11
      "Building things that work well.", // 12
      "My Goal", // 13
      "To build high-performance, beautiful, and secure web and mobile applications that deliver real value. I focus on end-to-end development, AI integration, and robust infrastructure, taking full ownership from day one.", // 14
      "2+", // 15
      "2+", // 16 (aboutStatsWork)
      "15+", // 17 (aboutStatsProjects)
      "100%", // 18 (aboutStatsCommitment)
      "My Projects", // 19
      "My Work", // 20
      "A showcase of full-stack AI platforms, real-time safety monitoring systems, and financial tracking apps built with modern technologies.", // 21
      "Work History", // 22
      "History", // 23
      "My professional journey, hackathons, and education in Computer Engineering.", // 24
      "Recent Posts", // 25
      "Blog", // 26
      "Full-Stack Engineer, AI Developer, Flutter Developer, Mobile App Developer", // 27
      "Tech Insights", // 28
      "My Blog", // 29
      "Writing about Next.js, FastAPI, real-time systems, and AI agent integration.", // 30
      "My Professional Journey", // 31
      "Hands-on experience building production-grade apps, competing in hackathons, and academic foundations.", // 32
      "Academics in Computer Engineering, from Diploma to Bachelor of Technology.", // 33
      "I have competed in 6+ hackathons, building and shipping working products under tight deadlines. I care deeply about clean code, system design, and performance optimization.", // 34
      "Have a project in mind?", // 35
      "I'm currently open for freelance work, internships, and new job opportunities. Let's build something great together.", // 36
      "https://github.com/prathamrajbhar", // 37
      "https://linkedin.com/in/prathamrajbhar", // 38
      null, // 39 (twitter)
      "Ready to bring your ideas to life?", // 40
      "I build fast, high-quality websites and apps that are easy to use.", // 41
      "Pratham Rajbhar | Portfolio", // 42
      "Portfolio of Pratham Rajbhar - Full-Stack Developer & Computer Engineering Student.", // 43
      "Pratham Rajbhar, Portfolio, Full-Stack Developer, Ganpat University, Next.js, FastAPI, Flutter, AI Developer", // 44
      null, // 45 (ogImage)
      aiProvider, // 46
      aiModel, // 47
      aiBaseUrl, // 48
      true, // 49 (openToWork)
      now // 50 (updatedAt)
    ];

    const settingsQuery = `
      INSERT INTO "SiteSettings" (
        id, name, title, bio, email, location,
        "heroTitle", "heroTagline", "heroBio", "avatarUrl", "resumeUrl",
        "aboutTitle", "aboutGoalTitle", "aboutGoalDesc", "yearsOfExperience",
        "aboutStatsWork", "aboutStatsProjects", "aboutStatsCommitment",
        "projectsTitle", "projectsSubtitle", "projectsDesc",
        "homeWorkTitle", "homeWorkSubtitle", "homeWorkDesc",
        "homeBlogTitle", "homeBlogSubtitle",
        "heroRoles", "blogTitle", "blogSubtitle", "blogIntro",
        "experienceHeroTitle", "experienceHeroDesc", "educationHeroDesc",
        "aboutExtraBio", "contactCtaTitle", "contactCtaDesc",
        github, linkedin, twitter,
        "footerTitle", "footerBio",
        "seoTitle", "seoDescription", "seoKeywords", "ogImage",
        "aiProvider", "aiModel", "aiBaseUrl", "openToWork", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15,
        $16, $17, $18,
        $19, $20, $21,
        $22, $23, $24,
        $25, $26,
        $27, $28, $29, $30,
        $31, $32, $33,
        $34, $35, $36,
        $37, $38, $39,
        $40, $41,
        $42, $43, $44, $45,
        $46, $47, $48, $49, $50
      );
    `;

    await client.query(settingsQuery, settingsValues);
    console.log("  ✅ Seeded SiteSettings.");

    // ─── 2. Skills ───────────────────────────────────────────────────────
    console.log("\n🌱 Seeding Skills...");
    const skills = [
      // Languages & Frontend
      { name: "Python", category: "Languages & Frontend", order: 1, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
      { name: "JavaScript", category: "Languages & Frontend", order: 2, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
      { name: "TypeScript", category: "Languages & Frontend", order: 3, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
      { name: "SQL", category: "Languages & Frontend", order: 4, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
      { name: "React.js", category: "Languages & Frontend", order: 5, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
      { name: "Next.js", category: "Languages & Frontend", order: 6, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
      { name: "Tailwind CSS", category: "Languages & Frontend", order: 7, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "Dart", category: "Languages & Frontend", order: 8, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg" },

      // Mobile & Backend
      { name: "Flutter", category: "Mobile & Backend", order: 1, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg" },
      { name: "React Native", category: "Mobile & Backend", order: 2, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
      { name: "FastAPI", category: "Mobile & Backend", order: 3, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg" },
      { name: "Node.js", category: "Mobile & Backend", order: 4, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
      { name: "REST APIs", category: "Mobile & Backend", order: 5, iconUrl: null },
      { name: "WebSockets", category: "Mobile & Backend", order: 6, iconUrl: null },
      { name: "Docker", category: "Mobile & Backend", order: 7, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
      { name: "CI/CD", category: "Mobile & Backend", order: 8, iconUrl: null },

      // AI & LLMs
      { name: "LangChain", category: "AI & LLMs", order: 1, iconUrl: null },
      { name: "Prompt Engineering", category: "AI & LLMs", order: 2, iconUrl: null },
      { name: "Generative AI", category: "AI & LLMs", order: 3, iconUrl: null },
      { name: "NLP", category: "AI & LLMs", order: 4, iconUrl: null },
      { name: "Sklearn", category: "AI & LLMs", order: 5, iconUrl: null },
      { name: "Vector Stores", category: "AI & LLMs", order: 6, iconUrl: null },

      // Databases & Tools
      { name: "PostgreSQL", category: "Databases & Tools", order: 1, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
      { name: "MongoDB", category: "Databases & Tools", order: 2, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
      { name: "SQLite", category: "Databases & Tools", order: 3, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg" },
      { name: "Redis", category: "Databases & Tools", order: 4, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg" },
      { name: "Git", category: "Databases & Tools", order: 5, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
      { name: "GitHub Actions", category: "Databases & Tools", order: 6, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg" },
      { name: "Postman", category: "Databases & Tools", order: 7, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" },
      { name: "Linux", category: "Databases & Tools", order: 8, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" }
    ];

    const skillQuery = `
      INSERT INTO "Skill" (id, name, category, "iconUrl", "order")
      VALUES ($1, $2, $3, $4, $5);
    `;

    for (const s of skills) {
      await client.query(skillQuery, [generateCuid(), s.name, s.category, s.iconUrl, s.order]);
    }
    console.log(`  ✅ Seeded ${skills.length} Skills.`);

    // ─── 3. Education ────────────────────────────────────────────────────
    console.log("\n🌱 Seeding Education...");
    const educations = [
      {
        slug: "btech-computer-engineering",
        institution: "Ganpat University",
        degree: "Bachelor of Technology",
        field: "Computer Engineering",
        startYear: "2024",
        endYear: "Present",
        current: true,
        description: "Focus Areas: LLMs & AI Agents · Full-Stack Development · Real-Time Systems · Generative AI\nCurrently in 6th Semester.",
        gpa: null,
        location: "Gujarat, India",
        order: 1
      },
      {
        slug: "diploma-computer-engineering",
        institution: "Ganpat University",
        degree: "Diploma of Computer Engineering",
        field: "Computer Engineering",
        startYear: "2021",
        endYear: "2024",
        current: false,
        description: "Graduated with honors. Named Distinguished Member.",
        gpa: "9.4 CGPA",
        location: "Gujarat, India",
        order: 2
      }
    ];

    const eduQuery = `
      INSERT INTO "Education" (
        id, slug, institution, degree, field, "startYear", "endYear", current, description, gpa, location, "order", "createdAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
    `;

    for (const edu of educations) {
      await client.query(eduQuery, [
        generateCuid(), edu.slug, edu.institution, edu.degree, edu.field,
        edu.startYear, edu.endYear, edu.current, edu.description,
        edu.gpa, edu.location, edu.order, now
      ]);
    }
    console.log(`  ✅ Seeded ${educations.length} Education entries.`);

    // ─── 4. Experience ───────────────────────────────────────────────────
    console.log("\n🌱 Seeding Experience...");
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
        skills: ["Next.js", "React.js", "Node.js", "PostgreSQL", "Tailwind CSS", "FastAPI"],
        logoUrl: null,
        order: 1
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
        skills: ["React.js", "Python", "FastAPI", "WebSockets", "MongoDB", "SQLite"],
        logoUrl: null,
        order: 2
      }
    ];

    const expQuery = `
      INSERT INTO "Experience" (
        id, company, role, location, type, "startDate", "endDate", current, description, skills, "logoUrl", "order", "createdAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
    `;

    for (const exp of experiences) {
      await client.query(expQuery, [
        generateCuid(), exp.company, exp.role, exp.location, exp.type,
        exp.startDate, exp.endDate, exp.current, exp.description,
        exp.skills, exp.logoUrl, exp.order, now
      ]);
    }
    console.log(`  ✅ Seeded ${experiences.length} Experience entries.`);

    // ─── 5. Projects ─────────────────────────────────────────────────────
    console.log("\n🌱 Seeding Projects...");
    const projects = [
      {
        title: "KeplerLab AI Notebook",
        slug: "keplerlab-ai-notebook",
        description: "Built a full-stack AI platform with 25+ modular FastAPI routes covering JWT + OAuth authentication, AI chat agents, flashcard/quiz generation, mind maps, podcast creation with live text-to-speech, and sandboxed code execution.",
        content: `
<h2>Overview</h2>
<p>KeplerLab AI Notebook is a state-of-the-art AI-powered platform designed to enhance learning, note-taking, and development productivity. Built using React 19 and Next.js, and powered by a high-performance FastAPI backend, it provides a comprehensive toolset for developers and students alike.</p>

<h2>Core Architectural Features</h2>
<ul>
  <li><strong>Modular FastAPI API:</strong> 25+ endpoints managing authentication, AI generation pipelines, mind-map storage, and text-to-speech rendering.</li>
  <li><strong>Intelligent AI Pipelines:</strong> Structured orchestration using LangChain for AI chat agents, dynamic flashcards/quizzes, and mind map canvas generators.</li>
  <li><strong>Advanced WebSockets:</strong> Real-time feedback and server-sent streaming for AI chat agents and state synchronization.</li>
  <li><strong>Sandboxed Execution Environment:</strong> Secure, isolated runtimes enabling code block execution within notes.</li>
  <li><strong>Robust State Management:</strong> Leverages Next.js App Router and Zustand for clean frontend synchronization.</li>
</ul>
`,
        subtitle: "Full-stack AI Notebook platform with LangChain pipelines & sandboxed execution",
        role: "Lead Architect & Developer",
        client: "Personal Project",
        category: "AI / Web Application",
        timeline: "3 Months",
        year: "2024",
        problem: "Traditional notebooks lack integrated execution runtimes and custom context-aware AI pipelines capable of producing multi-format assets like mind maps and podcasts in a single workspace.",
        solution: "Built a unified Next.js + FastAPI solution integrating LangChain agents, WebSockets for streaming responses, SQLite/Postgres data storage, and a Dockerized sandboxed code executor.",
        impact: "Engineered an AI-first workspace supporting real-time interaction, reducing time-to-production for AI integrations, and allowing immediate visual concept map generation.",
        features: [
          "25+ FastAPI endpoints covering JWT + OAuth authentication",
          "AI chat agents with custom persona settings",
          "Auto-generation of flashcards, quizzes, and mind maps",
          "Podcast studio featuring live text-to-speech rendering",
          "Sandboxed code execution runtime",
          "LangChain AI pipelines with rate limiting and circuit breakers"
        ],
        outcomes: [
          "Developed backend with complete JWT security & monitoring",
          "Implemented sub-second real-time streaming using WebSockets",
          "Delivered zero-latency canvas updates for mind maps"
        ],
        techStack: ["Next.js", "React.js", "FastAPI", "Zustand", "LangChain", "WebSockets", "Python", "JavaScript", "JWT", "OAuth"],
        liveUrl: "https://keplerlab.prathamrajbhar.tech",
        githubUrl: "https://github.com/prathamrajbhar/keplerlab-ai-notebook",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
        galleryImages: [],
        tags: ["Next.js", "FastAPI", "AI", "Zustand", "LangChain", "WebSockets"],
        featured: true
      },
      {
        title: "Smart Tourist Safety Monitoring System",
        slug: "smart-tourist-safety-monitoring-system",
        description: "Built a Flutter app with background GPS tracking, live AI safety score (0–100), and an SOS panic button, powered by a FastAPI backend using Isolation Forest + Temporal Analysis + Geofencing models that retrain every 60 seconds on live Supabase data.",
        content: `
<h2>Overview</h2>
<p>The Smart Tourist Safety Monitoring System is a comprehensive security infrastructure designed for tourists and law enforcement agencies. It features a cross-platform Flutter application for tourists, backed by an anomaly-detecting backend, and a real-time monitoring dashboard for police teams.</p>

<h2>System Highlights</h2>
<ul>
  <li><strong>Predictive Security Models:</strong> Real-time anomaly detection utilizing Isolation Forest, Geofencing, and Temporal Analysis.</li>
  <li><strong>Continuous ML Pipeline:</strong> Automatic model retraining every 60 seconds with live tourist coordinates fetched from Supabase.</li>
  <li><strong>Police Control Room Dashboard:</strong> React.js application offering geofence zone creation, WebSocket alert streams, and secure document generation.</li>
  <li><strong>Decentralized Report Storage:</strong> Generates tamper-proof E-FIR PDF reports stored securely via blockchain technology.</li>
</ul>
`,
        subtitle: "Real-time AI-powered geofenced safety platform",
        role: "Full-Stack System Designer",
        client: "Hackathon Project",
        category: "Mobile & Web Application",
        timeline: "36 Hours",
        year: "2024",
        problem: "Emergency response teams lack live tracking dashboards with anomaly detection capabilities to predict when a tourist might be entering a high-risk area or experiencing distress.",
        solution: "Designed a Flutter mobile application with background location services, connecting to a FastAPI server calculating live risk scores using geofencing and machine learning, synced to a police operations center.",
        impact: "Won 1st place in the regional hackathon. Designed a system that initiates alerts in less than 200ms when an anomaly occurs.",
        features: [
          "Flutter mobile app with background GPS tracking & SOS trigger",
          "FastAPI anomaly detection engine (Isolation Forest + Geofencing)",
          "Live retraining of models every 60 seconds on Supabase",
          "React.js dashboard with live maps, alert logs, and zone builders",
          "Blockchain-backed tamper-proof E-FIR generation"
        ],
        outcomes: [
          "Achieved 99.8% uptime during high-concurrency simulation",
          "Secured E-FIR documents using cryptographic hashes on blockchain",
          "Provided real-time geofence violations via WebSockets"
        ],
        techStack: ["Flutter", "FastAPI", "React.js", "Supabase", "WebSockets", "Blockchain", "Dart", "Python", "JavaScript"],
        liveUrl: null,
        githubUrl: "https://github.com/prathamrajbhar",
        imageUrl: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&h=600&fit=crop",
        galleryImages: [],
        tags: ["Flutter", "FastAPI", "React.js", "Supabase", "WebSockets", "Machine Learning"],
        featured: true
      },
      {
        title: "Balanza – Personal Finance Tracker",
        slug: "balanza-personal-finance-tracker",
        description: "Built a cross-platform mobile app using Flutter for real-time income and expense tracking with dynamic balance updates and interactive spending charts.",
        content: `
<h2>Overview</h2>
<p>Balanza is a privacy-first personal finance application that helps users manage their income, track expenses, and view interactive visual charts. The app operates fully offline with complete database encryption, ensuring all user financial data remains confidential.</p>

<h2>Technical Implementation</h2>
<ul>
  <li><strong>Stateful Income/Expense Dashboard:</strong> Real-time calculations and dynamic updates of total savings, recent spend categories, and budget thresholds.</li>
  <li><strong>Interactive Charts:</strong> Rendered using Flutter Canvas APIs, offering clean visual breakdowns of weekly and monthly spend trends.</li>
  <li><strong>Encrypted Storage Engine:</strong> SQLite integrated with SQLCipher encryption to guarantee secure local storage on both iOS and Android platforms.</li>
</ul>
`,
        subtitle: "Secure, offline-first personal finance mobile tracker",
        role: "Mobile App Developer",
        client: "Personal Project",
        category: "Mobile Application",
        timeline: "2 Months",
        year: "2024",
        problem: "Existing finance apps send sensitive user transactions to external cloud servers, raising data privacy issues, and often lack offline functionality.",
        solution: "Developed a Flutter app storing transactions locally inside an encrypted SQLite database using SQLCipher, with dynamic charts computed on-device.",
        impact: "Provided a zero-latency, secure utility for expense tracking without needing any network permissions.",
        features: [
          "Income & expense categorization with custom labels",
          "Dynamic balance charts & transaction filtering",
          "Full SQLite database encryption (SQLCipher)",
          "Offline-first capability with sub-millisecond database lookups"
        ],
        outcomes: [
          "Guaranteed total data privacy for the user",
          "Maintained consistent 60 FPS transitions & responsive UI charts",
          "Implemented simple multi-currency configuration support"
        ],
        techStack: ["Flutter", "Dart", "SQLite", "Android", "iOS"],
        liveUrl: null,
        githubUrl: "https://github.com/prathamrajbhar",
        imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop",
        galleryImages: [],
        tags: ["Flutter", "Dart", "SQLite", "Offline-First", "Mobile Development"],
        featured: true
      }
    ];

    const projectQuery = `
      INSERT INTO "Project" (
        id, title, slug, description, content, subtitle, role, client, category, timeline, year,
        problem, solution, impact, features, outcomes, "techStack", "liveUrl", "githubUrl", "imageUrl", "galleryImages",
        tags, featured, status, "seoTitle", "seoDescription", "seoKeywords", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16, $17, $18, $19, $20, $21,
        $22, $23, $24, $25, $26, $27, $28, $29
      );
    `;

    for (const p of projects) {
      await client.query(projectQuery, [
        generateCuid(), p.title, p.slug, p.description, p.content, p.subtitle, p.role, p.client, p.category, p.timeline, p.year,
        p.problem, p.solution, p.impact, p.features, p.outcomes, p.techStack, p.liveUrl, p.githubUrl, p.imageUrl, p.galleryImages,
        p.tags, p.featured, "completed", p.title, p.description, p.tags.join(","), now, now
      ]);
    }
    console.log(`  ✅ Seeded ${projects.length} Projects.`);

    // ─── 6. Blog Posts ───────────────────────────────────────────────────
    console.log("\n🌱 Seeding Blog Posts...");
    const blogPosts = [
      {
        title: "Building a Production-Ready Portfolio with Next.js 15",
        slug: "building-portfolio-nextjs-15",
        excerpt: "A deep dive into architecting a modern portfolio with Next.js 15, PostgreSQL, Prisma, and ISR for optimal performance and developer experience.",
        content: `# Building a Production-Ready Portfolio with Next.js 15

When I set out to build my portfolio, I wanted more than a static page. I wanted a **full-stack application** that demonstrates real engineering skills.

## Tech Stack Decisions

### Why Next.js 15?
The App Router in Next.js 15 offers React Server Components, which means we can fetch data directly in our components without client-side state management.

### PostgreSQL + Prisma
Prisma provides type-safe database access that integrates beautifully with TypeScript. Combined with PostgreSQL, it gives us a robust data layer.

## Key Architecture Patterns

### Build-Time Resilience
One challenge with database-backed SSG is that the database must be available during \`next build\`. I solved this with try/catch wrappers:

\`\`\`typescript
export const getProjects = cache(async () => {
  try {
    return await prisma.project.findMany();
  } catch {
    return []; // Graceful fallback
  }
});
\`\`\`

### ISR for Fresh Content
Using \`revalidate = 3600\`, pages are statically generated but refresh every hour.

## Conclusion
Building a portfolio is a great way to showcase your engineering skills. Focus on real architecture, not just pretty UI.`,
        contentFormat: "mdx",
        published: true,
        readingTime: 5,
        tags: ["Next.js", "Portfolio", "Architecture"]
      },
      {
        title: "Mastering Prisma ORM: From Schema to Production",
        slug: "mastering-prisma-orm",
        excerpt: "Everything you need to know about Prisma ORM — schema design, migrations, seeding, and production best practices for PostgreSQL.",
        content: `# Mastering Prisma ORM

Prisma has become the go-to ORM for TypeScript developers. Here's what I've learned using it in production.

## Schema Design

Start with your domain models. Think about relationships, indexes, and constraints before writing code.

\`\`\`prisma
model Project {
  id    String @id @default(cuid())
  title String
  slug  String @unique
  tags  String[]
}
\`\`\`

## The Singleton Pattern for Prisma Client

In development, Next.js hot-reloads modules which creates multiple Prisma instances. Use the global pattern:

\`\`\`typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
\`\`\`

## Seeding Best Practices

Use \`upsert\` for idempotent seeds that can run multiple times safely.

## Conclusion
Prisma dramatically improves the developer experience for database operations in TypeScript projects.`,
        contentFormat: "mdx",
        published: true,
        readingTime: 4,
        tags: ["Prisma", "Database", "TypeScript"]
      },
      {
        title: "Real-Time Features with Socket.IO and React",
        slug: "realtime-socketio-react",
        excerpt: "How to implement real-time features like live collaboration, notifications, and chat using Socket.IO with a React frontend.",
        content: `# Real-Time Features with Socket.IO and React

Real-time communication is essential for modern web applications. Here's how I implement it.

## Setting Up the Server

Socket.IO provides a reliable WebSocket abstraction with automatic fallbacks.

## React Integration

Use a custom hook to manage the socket connection lifecycle:

\`\`\`typescript
function useSocket(url: string) {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const s = io(url);
    setSocket(s);
    return () => { s.disconnect(); };
  }, [url]);
  return socket;
}
\`\`\`

## Use Cases
- Live collaboration on documents
- Real-time notifications
- Chat applications
- Live dashboards

## Conclusion
Socket.IO makes real-time features accessible. Combined with React, you can build engaging, interactive experiences.`,
        contentFormat: "mdx",
        published: true,
        readingTime: 3,
        tags: ["React", "Socket.IO", "Real-Time"]
      }
    ];

    const blogQuery = `
      INSERT INTO "BlogPost" (
        id, title, slug, excerpt, content, "contentFormat", "coverImage", published, "readingTime",
        "seoTitle", "seoDescription", "seoKeywords", "createdAt", "updatedAt", tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
    `;

    for (const post of blogPosts) {
      await client.query(blogQuery, [
        generateCuid(), post.title, post.slug, post.excerpt, post.content, post.contentFormat,
        null, post.published, post.readingTime, post.title, post.excerpt, post.tags.join(","),
        now, now, post.tags
      ]);
    }
    console.log(`  ✅ Seeded ${blogPosts.length} Blog Posts.`);

    // ─── 7. Hackathons ───────────────────────────────────────────────────
    console.log("\n🌱 Seeding Hackathons...");
    const hackathons = [
      {
        slug: "smart-india-hackathon-2024",
        title: "Smart India Hackathon 2024",
        project: "AI-Powered Document Analysis System",
        role: "Team Lead & Full-Stack Developer",
        date: new Date("2024-03-15"),
        location: "Gujarat, India",
        result: "Finalist",
        description: "Led a team of 6 to build an AI-powered document analysis platform that extracts, categorizes, and summarizes information from government documents using NLP. The system processes unstructured PDF documents and converts them into structured, queryable data using transformer-based models."
      },
      {
        slug: "hackgu-2023",
        title: "HackGU 2023",
        project: "Campus Connect — Student Collaboration Platform",
        role: "Full-Stack Developer",
        date: new Date("2023-10-20"),
        location: "Ganpat University",
        result: "Winner",
        description: "Built a real-time student collaboration platform with live coding, shared whiteboards, and video calls within 36 hours. Implemented WebRTC for peer-to-peer video and Socket.IO for real-time document sync."
      },
      {
        slug: "devjam-2023",
        title: "DevJam 2023",
        project: "MedAssist — AI Health Assistant",
        role: "Backend Developer",
        date: new Date("2023-07-10"),
        location: "Ahmedabad, India",
        result: "Top 5",
        description: "Developed the backend for an AI-powered health assistant that provides preliminary symptom analysis and connects users with relevant healthcare resources. Built FastAPI endpoints with OpenAI integration and vector search for medical knowledge retrieval."
      }
    ];

    const hackathonQuery = `
      INSERT INTO "Hackathon" (
        id, slug, title, project, role, date, location, result, link, description, image, "createdAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
    `;

    for (const h of hackathons) {
      await client.query(hackathonQuery, [
        generateCuid(), h.slug, h.title, h.project, h.role, h.date, h.location,
        h.result, null, h.description, null, now
      ]);
    }
    console.log(`  ✅ Seeded ${hackathons.length} Hackathons.`);

    // ─── 8. Certifications ───────────────────────────────────────────────
    console.log("\n🌱 Seeding Certifications...");
    const certs = [
      {
        slug: "aws-cloud-practitioner",
        name: "AWS Cloud Practitioner",
        issuer: "Amazon Web Services",
        date: new Date("2024-01-15"),
        url: "https://aws.amazon.com/certification/",
        credentialId: "AWS-CP-2024-12345",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
      },
      {
        slug: "meta-front-end-developer",
        name: "Meta Front-End Developer",
        issuer: "Meta (Coursera)",
        date: new Date("2023-09-01"),
        url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
        credentialId: "META-FE-2023-67890",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop"
      },
      {
        slug: "full-stack-web-development",
        name: "Full-Stack Web Development",
        issuer: "freeCodeCamp",
        date: new Date("2023-05-20"),
        url: "https://www.freecodecamp.org/certification/",
        credentialId: "FCC-FSWD-2023-11111",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop"
      }
    ];

    const certQuery = `
      INSERT INTO "Certification" (
        id, slug, name, issuer, date, url, "credentialId", image, "createdAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `;

    for (const c of certs) {
      await client.query(certQuery, [
        generateCuid(), c.slug, c.name, c.issuer, c.date, c.url, c.credentialId,
        c.image, now
      ]);
    }
    console.log(`  ✅ Seeded ${certs.length} Certifications.`);

    // Commit transaction
    await client.query("COMMIT");
    console.log("\n🎉 Seeding complete and database transactions committed!");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`\n❌ Seeding failed: ${err.message}`);
    console.log("🔄 Transactions rolled back.");
    process.exit(1);
  } finally {
    await client.end();
    console.log("🌱 Disconnected from database.");
  }
}

main();
