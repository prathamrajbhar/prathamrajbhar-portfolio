import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const projectLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().url("Invalid URL"),
});

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().default(""),
  subtitle: z.string().optional(),
  role: z.string().optional(),
  client: z.string().optional(),
  category: z.string().optional(),
  timeline: z.string().optional(),
  year: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  impact: z.string().optional(),
  features: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  liveUrl: z.string().url().optional().or(z.literal("")).or(z.null()),
  githubUrl: z.string().url().optional().or(z.literal("")).or(z.null()),
  imageUrl: z.string().url().optional().or(z.literal("")).or(z.null()),
  galleryImages: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.coerce.boolean().default(false),
  status: z.string().default("completed"),
  seoTitle: z.string().optional().or(z.literal("")).or(z.null()),
  seoDescription: z.string().optional().or(z.literal("")).or(z.null()),
  seoKeywords: z.string().optional().or(z.literal("")).or(z.null()),
  projectLinks: z.array(projectLinkSchema).default([]),
});

const draftProjectSchema = z.object({
  title: z.string().default("Untitled Project"),
  slug: z.string().default(""),
  description: z.string().default(""),
  content: z.string().default(""),
  subtitle: z.string().optional().default(""),
  role: z.string().optional().default(""),
  client: z.string().optional().default(""),
  category: z.string().optional().default(""),
  timeline: z.string().optional().default(""),
  year: z.string().optional().default(""),
  problem: z.string().optional().default(""),
  solution: z.string().optional().default(""),
  impact: z.string().optional().default(""),
  features: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  liveUrl: z.string().url().optional().or(z.literal("")).or(z.null()).default(""),
  githubUrl: z.string().url().optional().or(z.literal("")).or(z.null()).default(""),
  imageUrl: z.string().url().optional().or(z.literal("")).or(z.null()).default(""),
  galleryImages: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.coerce.boolean().default(false),
  status: z.string().default("draft"),
  seoTitle: z.string().optional().or(z.literal("")).or(z.null()).default(""),
  seoDescription: z.string().optional().or(z.literal("")).or(z.null()).default(""),
  seoKeywords: z.string().optional().or(z.literal("")).or(z.null()).default(""),
  projectLinks: z.array(projectLinkSchema).default([]),
});

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { projectLinks: true },
    });
    return NextResponse.json({ data: projects }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

async function getUniqueProjectSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.project.findFirst({
      where: { slug },
      select: { id: true },
    });
    if (!existing) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const isDraft = body.status === "draft";
    const titleVal = body.title?.trim() || (isDraft ? "Untitled Project" : "");
    let slugVal = body.slug?.trim() || slugify(titleVal);

    if (isDraft && (!slugVal || slugVal === "untitled-project")) {
      slugVal = `untitled-project-${Date.now()}`;
    }

    slugVal = await getUniqueProjectSlug(slugVal);

    const dataToValidate = {
      ...body,
      title: titleVal,
      slug: slugVal,
    };

    const schemaToUse = isDraft ? draftProjectSchema : projectSchema;
    const result = schemaToUse.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      return NextResponse.json(
        { error: "Validation failed", fields: fieldErrors },
        { status: 400 }
      );
    }

    const { projectLinks, ...projectData } = result.data;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        projectLinks: {
          create: projectLinks,
        },
      },
      include: { projectLinks: true },
    });

    if (project.status !== "draft") {
      revalidatePath("/");
      revalidatePath("/projects");
      revalidatePath(`/projects/${project.slug}`);
    }

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
