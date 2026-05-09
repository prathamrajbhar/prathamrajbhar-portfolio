import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, normalizeTags, requireAdmin, validationErrorResponse } from "@/lib/api";
import { blogPostSchema } from "@/lib/validations";
import { readingTimeFromContent, slugify } from "@/lib/utils";

async function findPost(id: string) {
  return prisma.blogPost.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { tags: true }
  });
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await auth();
    const post = await findPost(id);
    if (!post || (!post.published && !session?.user)) return errorResponse("Blog post not found", 404);
    return dataResponse(post);
  } catch {
    return errorResponse("Unable to fetch blog post");
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);

    const existing = await findPost(id);
    if (!existing) return errorResponse("Blog post not found", 404);

    const body = await request.json();
    const parsed = blogPostSchema.safeParse({
      ...body,
      slug: body.slug || slugify(String(body.title ?? "")),
      readingTime: body.readingTime || readingTimeFromContent(String(body.content ?? ""))
    });
    if (!parsed.success) return validationErrorResponse(parsed.error);

    const tags = normalizeTags(parsed.data.tags);
    const post = await prisma.blogPost.update({
      where: { id: existing.id },
      data: {
        ...parsed.data,
        tags: {
          set: [],
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name }
          }))
        }
      },
      include: { tags: true }
    });
    return dataResponse(post);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return errorResponse("A post with this slug already exists.", 400);
    }
    return errorResponse("Unable to update blog post");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);

    const existing = await findPost(id);
    if (!existing) return errorResponse("Blog post not found", 404);
    await prisma.blogPost.delete({ where: { id: existing.id } });
    return dataResponse({ deleted: true });
  } catch {
    return errorResponse("Unable to delete blog post");
  }
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const post = await findPost(id);
    if (!post) return errorResponse("Blog post not found", 404);
    const updated = await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
      include: { tags: true }
    });
    return dataResponse(updated);
  } catch {
    return errorResponse("Unable to update post views");
  }
}
