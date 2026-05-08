import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, normalizeTags, requireAdmin, validationErrorResponse } from "@/lib/api";
import { blogPostSchema } from "@/lib/validations";
import { readingTimeFromContent, slugify } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    const posts = await prisma.blogPost.findMany({
      where: session?.user ? {} : { published: true },
      include: { tags: true },
      orderBy: { createdAt: "desc" }
    });
    return dataResponse(posts);
  } catch {
    return errorResponse("Unable to fetch blog posts");
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);

    const body = await request.json();
    const parsed = blogPostSchema.safeParse({
      ...body,
      slug: body.slug || slugify(String(body.title ?? "")),
      readingTime: body.readingTime || readingTimeFromContent(String(body.content ?? ""))
    });
    if (!parsed.success) return validationErrorResponse(parsed.error);

    const tags = normalizeTags(parsed.data.tags);
    const post = await prisma.blogPost.create({
      data: {
        ...parsed.data,
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name }
          }))
        }
      },
      include: { tags: true }
    });
    return dataResponse(post, 201);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return errorResponse("A post with this slug already exists.", 400);
    }
    return errorResponse("Unable to create blog post");
  }
}
