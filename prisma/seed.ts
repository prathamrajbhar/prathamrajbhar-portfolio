import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { slugify } from "../lib/utils";

const prisma = new PrismaClient();

const longPost = (topic: string) => `
## ${topic}

${topic} is strongest when architecture decisions stay close to real user workflows. In portfolio projects, dashboards, and internal tools, the best systems are rarely the ones with the most ceremony. They are the ones where data models, validation, loading states, and visual hierarchy work together so the next action feels obvious.

![Desk with code and interface notes](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop)

### Practical constraints

- Who maintains the feature after launch?
- What data can be trusted?
- Which failures are likely in production?
- What does the user need to decide next?

| Area | Detail |
| --- | --- |
| Content | Draft states, predictable slugs, image support |
| Projects | Case-study fields, galleries, useful external links |
| Contact | Validation, feedback, and reliable delivery |

<Callout>
Good engineering is a habit of finishing the details: accessible labels, readable empty states, confirmation dialogs, consistent dates, and meaningful admin screens.
</Callout>

The same mindset applies to performance. Server-rendered data, small client components, and focused animations let the page feel polished without hiding slow interactions behind visual noise.
`;

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123456";

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password: await bcrypt.hash(adminPassword, 12) },
    create: {
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12)
    }
  });

  const siteSettings = {
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
    openToWork: true
  };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: siteSettings,
    create: {
      id: "singleton",
      ...siteSettings
    }
  });

  const tagNames = [
    "FastAPI", "React", "Next.js", "Flutter", "AI", "LangChain", "WebSockets", "Blockchain", 
    "Python", "JavaScript", "SQL", "Dart", "Node.js", "Docker", "PostgreSQL", "MongoDB", 
    "SQLite", "Mobile", "LangGraph", "Vector Databases", "RAG", "Education", "Frontend", "Backend"
  ];
  await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  );

  const projects = [
    {
      title: "KeplerLab AI Notebook",
      description: "Full-stack AI platform with modular FastAPI routes, AI chat agents, and sandboxed code execution.",
      subtitle: "Comprehensive AI development and learning platform",
      content: "<p>Built a full-stack AI platform with 25+ modular FastAPI routes covering JWT + OAuth authentication, AI chat agents, flashcard/quiz generation, mind maps, podcast creation with live text-to-speech, and sandboxed code execution.</p><p>Implemented production-ready backend infrastructure including LangChain AI pipelines, realtime WebSocket communication, rate limiting, circuit breakers, and performance monitoring.</p>",
      role: "Lead Developer",
      client: "Personal Project",
      category: "AI / Web",
      timeline: "Ongoing",
      year: "2024",
      problem: "Fragmented tools for AI learning and development.",
      solution: "A unified notebook experience with integrated AI agents and sandboxed execution.",
      impact: "Streamlined AI workflow for developers.",
      features: ["AI chat agents", "Flashcard/quiz generation", "Mind maps", "Podcast creation", "Sandboxed code execution"],
      outcomes: ["Full implementation of LangChain pipelines", "Real-time collaboration features"],
      galleryImages: [],
      projectLinks: [],
      techStack: ["FastAPI", "Next.js", "LangChain", "Zustand", "WebSockets"],
      liveUrl: "https://keplerlab.tech",
      githubUrl: "https://github.com/prathamrajbhar",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=800&fit=crop",
      featured: true,
      status: "completed",
      tags: ["FastAPI", "Next.js", "AI", "LangChain"]
    },
    {
      title: "Smart Tourist Safety Monitoring",
      description: "Flutter app with background GPS tracking and live AI safety scoring.",
      subtitle: "Real-time safety for travelers powered by AI",
      content: "<p>Built a Flutter app with background GPS tracking, live AI safety score (0–100), and an SOS panic button, powered by a FastAPI backend using Isolation Forest + Temporal Analysis + Geofencing models that retrain every 60 seconds on live Supabase data.</p><p>Delivered a React.js police dashboard with real-time WebSocket alerts, polygon zone management, broadcast notifications, and blockchain-backed E-FIR PDF reports.</p>",
      role: "Full-stack Developer",
      client: "Hackathon Project",
      category: "Mobile / AI",
      timeline: "Hackathon",
      year: "2024",
      problem: "Lack of real-time safety monitoring for tourists in unfamiliar areas.",
      solution: "Predictive safety scoring using environmental data and real-time GPS tracking.",
      impact: "Improved emergency response times and proactive threat detection.",
      features: ["Background GPS tracking", "AI safety score", "SOS panic button", "Police dashboard", "Blockchain E-FIR"],
      outcomes: ["Successful deployment during hackathon", "Real-time alert system verified"],
      galleryImages: [],
      projectLinks: [],
      techStack: ["Flutter", "FastAPI", "Supabase", "React.js", "Blockchain"],
      liveUrl: null,
      githubUrl: "https://github.com/prathamrajbhar",
      imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop",
      featured: true,
      status: "completed",
      tags: ["Flutter", "FastAPI", "AI", "Blockchain"]
    },
    {
      title: "Balanza Finance Tracker",
      description: "Cross-platform mobile app for real-time income and expense tracking.",
      subtitle: "Simple and secure personal finance management",
      content: "<p>Built a cross-platform mobile app using Flutter for real-time income and expense tracking with dynamic balance updates and interactive spending charts.</p><p>Secured all financial data locally using SQLite encryption, ensuring user privacy with consistent read/write performance on both Android and iOS.</p>",
      role: "Mobile Developer",
      client: "Personal Project",
      category: "Mobile",
      timeline: "4 weeks",
      year: "2023",
      problem: "Complex finance trackers with poor privacy.",
      solution: "Local-first, encrypted finance tracking with simple visualization.",
      impact: "Users can manage finances securely without cloud dependency.",
      features: ["Income/expense tracking", "Dynamic balance updates", "Spending charts", "SQLite encryption"],
      outcomes: ["Cross-platform performance optimization", "Secure local storage implementation"],
      galleryImages: [],
      projectLinks: [],
      techStack: ["Flutter", "SQLite", "Dart"],
      liveUrl: null,
      githubUrl: "https://github.com/prathamrajbhar",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop",
      featured: true,
      status: "completed",
      tags: ["Flutter", "SQLite", "Dart"]
    }
  ];

  await prisma.project.deleteMany({});
  for (const project of projects) {
    await prisma.project.create({
      data: {
        title: project.title,
        slug: slugify(project.title),
        description: project.description,
        content: project.content,
        subtitle: project.subtitle,
        role: project.role,
        client: project.client,
        category: project.category,
        timeline: project.timeline,
        year: project.year,
        problem: project.problem,
        solution: project.solution,
        impact: project.impact,
        features: project.features,
        outcomes: project.outcomes,
        techStack: project.techStack,
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        imageUrl: project.imageUrl,
        galleryImages: project.galleryImages,
        projectLinks: project.projectLinks,
        featured: project.featured,
        status: project.status,
        tags: {
          connect: project.tags.map((name) => ({ name }))
        }
      }
    });
  }

  await prisma.blogPost.deleteMany({});
  const posts = [
    {
      title: "The Rise of Agentic AI: Why LLMs Need Tools",
      excerpt: "Exploring the shift from simple chatbots to autonomous AI agents that can use tools and perform complex workflows.",
      content: longPost("The Rise of Agentic AI"),
      published: true,
      tags: ["AI", "Next.js", "LangChain"]
    },
    {
      title: "FastAPI vs. Node.js: Choosing the Right Backend for 2024",
      excerpt: "A deep dive into performance, developer experience, and ecosystem for high-concurrency applications.",
      content: longPost("FastAPI vs. Node.js"),
      published: true,
      tags: ["FastAPI", "Node.js", "PostgreSQL"]
    },
    {
      title: "Flutter for AI Applications: A Match Made in Heaven?",
      excerpt: "How to integrate complex AI models into mobile applications with Flutter's reactive architecture.",
      content: longPost("Flutter for AI"),
      published: true,
      tags: ["Flutter", "AI", "Mobile"]
    },
    {
      title: "Mastering React 19: New Hooks and Features",
      excerpt: "What's new in React 19 and how it changes the way we build modern web interfaces.",
      content: longPost("Mastering React 19"),
      published: true,
      tags: ["React", "Next.js", "JavaScript"]
    }
  ];

  for (const post of posts) {
    await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: slugify(post.title),
        excerpt: post.excerpt,
        content: post.content,
        published: post.published,
        tags: {
          connect: post.tags.map(name => ({ name }))
        }
      }
    });
  }

  await prisma.experience.deleteMany({});
  const experiences = [
    {
      company: "AI Research Lab, Ganpat University",
      role: "AI Research Intern",
      location: "Mehsana, Gujarat",
      type: "internship",
      startDate: new Date("2024-06-01"),
      current: true,
      description: "Leading research on autonomous agents using LangChain and LangGraph. Developed a system for automated research paper summarization and knowledge graph extraction.",
      skills: ["LangChain", "Python", "Vector Databases"],
      order: 1
    },
    {
      company: "Tech Solutions Inc.",
      role: "Full-Stack Developer Intern",
      location: "Ahmedabad, Gujarat",
      type: "internship",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-05-31"),
      current: false,
      description: "Developed and maintained several client-facing web applications using Next.js and FastAPI. Optimized database queries resulting in a 40% reduction in API latency.",
      skills: ["Next.js", "FastAPI", "PostgreSQL"],
      order: 2
    },
    {
      company: "Freelance Development",
      role: "Web Developer",
      location: "Remote",
      type: "contract",
      startDate: new Date("2022-08-01"),
      endDate: new Date("2023-12-31"),
      current: false,
      description: "Delivered custom web solutions for 10+ local businesses. Focused on SEO, performance, and responsive design using React and Tailwind CSS.",
      skills: ["React", "Tailwind CSS", "JavaScript"],
      order: 3
    }
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }

  const skills = [
    ["Python", "Languages", 1],
    ["JavaScript", "Languages", 2],
    ["SQL", "Languages", 3],
    ["Dart", "Languages", 4],
    ["TypeScript", "Languages", 5],
    ["React.js", "Frontend", 6],
    ["Next.js", "Frontend", 7],
    ["Tailwind CSS", "Frontend", 8],
    ["Zustand", "Frontend", 9],
    ["Flutter", "Mobile", 10],
    ["React Native", "Mobile", 11],
    ["FastAPI", "Backend", 12],
    ["Node.js", "Backend", 13],
    ["REST APIs", "Backend", 14],
    ["WebSockets", "Backend", 15],
    ["Prisma", "Backend", 16],
    ["LangChain", "AI & LLMs", 17],
    ["LangGraph", "AI & LLMs", 18],
    ["Vector Databases", "AI & LLMs", 19],
    ["Prompt Engineering", "AI & LLMs", 20],
    ["TensorFlow", "AI & LLMs", 21],
    ["PyTorch", "AI & LLMs", 22],
    ["PostgreSQL", "Databases", 23],
    ["MongoDB", "Databases", 24],
    ["Redis", "Databases", 25],
    ["Docker", "Tools", 26],
    ["CI/CD", "Tools", 27],
    ["Git", "Tools", 28],
    ["Linux", "Tools", 29]
  ] as const;

  await prisma.skill.deleteMany({});
  for (const [name, category, order] of skills) {
    await prisma.skill.create({ data: { name, category, order } });
  }

  await prisma.education.deleteMany({});
  await prisma.education.createMany({
    data: [
      {
        institution: "Ganpat University",
        degree: "Bachelor of Technology",
        field: "Computer Engineering",
        startDate: new Date("2024-08-01"),
        current: true,
        description: "Focus Areas: LLMs & AI Agents · Full-Stack Development · Real-Time Systems · Generative AI",
        order: 1
      },
      {
        institution: "Ganpat University",
        degree: "Diploma",
        field: "Computer Engineering",
        startDate: new Date("2021-09-01"),
        endDate: new Date("2024-07-01"),
        current: false,
        description: "CGPA: 9.4 | Distinguished Member",
        gpa: "9.4",
        order: 2
      }
    ]
  });

  await prisma.hackathon.deleteMany({});
  await prisma.hackathon.createMany({
    data: [
      {
        title: "Smart India Hackathon 2024",
        project: "Smart Tourist Safety Monitoring System",
        role: "Lead Developer",
        date: new Date("2024-09-15"),
        location: "Nodal Center, India",
        result: "Winner / Finalist",
        link: "https://github.com/prathamrajbhar",
        description: "Developed an AI-driven safety system for tourists with real-time tracking and emergency response orchestration.",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop"
      },
      {
        title: "HackGujarat 2024",
        project: "AI Health Assistant",
        role: "AI Lead",
        date: new Date("2024-07-20"),
        location: "Virtual",
        result: "Finalist",
        link: "https://github.com/prathamrajbhar",
        description: "Built a diagnostic assistant using RAG (Retrieval Augmented Generation) to provide medical insights based on health records.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop"
      },
      {
        title: "University Innovation Hack",
        project: "Balanza Finance",
        role: "Mobile Lead",
        date: new Date("2023-11-20"),
        location: "Ganpat University",
        result: "Top 3",
        link: "https://github.com/prathamrajbhar",
        description: "Created a privacy-focused finance tracker with local encryption and real-time visualization.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
      },
      {
        title: "Google Cloud Community Day Hack",
        project: "EcoTrack",
        role: "Full-Stack Developer",
        date: new Date("2023-08-10"),
        location: "Ahmedabad",
        result: "Runner Up",
        link: "https://github.com/prathamrajbhar",
        description: "Application to track carbon footprint of individual users based on their daily commute and utility usage.",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop"
      },
      {
        title: "Buildathon 2.0",
        project: "SkillChain",
        role: "Backend Developer",
        date: new Date("2023-05-05"),
        location: "Ganpat University",
        result: "Top 5",
        link: "https://github.com/prathamrajbhar",
        description: "Blockchain-based credential verification system integrated with AI for skill gap analysis.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?w=800&h=600&fit=crop"
      },
      {
        title: "DevFest Ahmedabad Hack",
        project: "Local Connect",
        role: "Participant",
        date: new Date("2022-10-15"),
        location: "Ahmedabad",
        result: "Participated",
        link: "https://github.com/prathamrajbhar",
        description: "A community platform to connect local artisans with urban customers.",
        image: "https://images.unsplash.com/photo-1522071823991-b96c0d3eccc0?w=800&h=600&fit=crop"
      }
    ]
  });

  await prisma.certification.deleteMany({});
  await prisma.certification.createMany({
    data: [
      {
        name: "Deep Learning Specialization",
        issuer: "DeepLearning.AI / Coursera",
        date: new Date("2024-05-01"),
        url: "https://coursera.org",
        credentialId: "DL-123456",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop"
      },
      {
        name: "Google Cloud Certified Associate Cloud Engineer",
        issuer: "Google Cloud",
        date: new Date("2024-03-15"),
        url: "https://cloud.google.com",
        credentialId: "GCP-ACE-789",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop"
      },
      {
        name: "TensorFlow Developer Certificate",
        issuer: "Google",
        date: new Date("2024-01-10"),
        url: "https://www.tensorflow.org/certificate",
        credentialId: "TF-DEV-999",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop"
      },
      {
        name: "Meta Front-End Developer Professional Certificate",
        issuer: "Meta / Coursera",
        date: new Date("2023-11-05"),
        url: "https://coursera.org",
        credentialId: "META-FE-555",
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=600&fit=crop"
      }
    ]
  });

  await prisma.contactMessage.deleteMany({});
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
