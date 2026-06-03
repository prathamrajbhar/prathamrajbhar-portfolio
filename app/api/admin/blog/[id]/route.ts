import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { readingTimeFromContent } from "@/lib/utils";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  contentFormat: z.string().default("mdx"),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
  readingTime: z.number().optional(),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().optional().or(z.literal("")).or(z.null()),
  seoDescription: z.string().optional().or(z.literal("")).or(z.null()),
  seoKeywords: z.string().optional().or(z.literal("")).or(z.null()),
});

const draftBlogSchema = z.object({
  title: z.string().default("Untitled Post"),
  slug: z.string().default(""),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  contentFormat: z.string().default("mdx"),
  coverImage: z.string().url().optional().or(z.literal("")).or(z.null()).default(""),
  published: z.boolean().default(false),
  readingTime: z.number().optional().default(1),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().optional().or(z.literal("")).or(z.null()).default(""),
  seoDescription: z.string().optional().or(z.literal("")).or(z.null()).default(""),
  seoKeywords: z.string().optional().or(z.literal("")).or(z.null()).default(""),
});

function coerceBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "y", "on"].includes(normalized);
  }
  return false;
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function deriveExcerpt(content: string): string {
  const text = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+]\([^)]+\)/g, " ")
    .replace(/[#>*_`|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.slice(0, 180) || content.slice(0, 180).trim();
}

function buildBlogPayload(body: Record<string, unknown>) {
  const published = coerceBoolean(body.published);
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";

  let finalTitle = title;
  if (!finalTitle && !published) {
    finalTitle = "Untitled Post";
  }

  let finalSlug = typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : slugify(finalTitle);
  if (!published && (!finalSlug || finalSlug === "untitled-post")) {
    finalSlug = `untitled-post-${Date.now()}`;
  }

  return {
    ...body,
    title: finalTitle,
    slug: finalSlug,
    excerpt: excerpt || (published ? deriveExcerpt(content) : ""),
    content,
    contentFormat: typeof body.contentFormat === "string" && body.contentFormat.trim() ? body.contentFormat.trim() : "mdx",
    coverImage: typeof body.coverImage === "string" ? body.coverImage.trim() : body.coverImage,
    published,
    readingTime: readingTimeFromContent(content) || 1,
    tags: normalizeTags(body.tags),
    seoTitle: typeof body.seoTitle === "string" ? body.seoTitle.trim() : body.seoTitle,
    seoDescription: typeof body.seoDescription === "string" ? body.seoDescription.trim() : body.seoDescription,
    seoKeywords: typeof body.seoKeywords === "string" ? body.seoKeywords.trim() : body.seoKeywords,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

async function getUniqueBlogSlug(baseSlug: string, currentPostId: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.blogPost.findFirst({
      where: {
        slug,
        id: { not: currentPostId },
      },
      select: { id: true },
    });
    if (!existing) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    
    const dataToValidate = buildBlogPayload(body);
    dataToValidate.slug = await getUniqueBlogSlug(dataToValidate.slug, id);
    
    const schemaToUse = dataToValidate.published ? blogSchema : draftBlogSchema;
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

    const post = await prisma.blogPost.update({
      where: { id },
      data: result.data,
    });

    if (post.published) {
      revalidatePath("/");
      revalidatePath("/blog");
      revalidatePath(`/blog/${post.slug}`);
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } });
    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/blog");
    if (post) revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
