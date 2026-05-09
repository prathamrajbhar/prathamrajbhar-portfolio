import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, normalizeTags, requireAdmin, validationErrorResponse } from "@/lib/api";
import { projectSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

async function findProject(id: string) {
  return prisma.project.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { tags: true }
  });
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const project = await findProject(id);
    if (!project) return errorResponse("Project not found", 404);
    return dataResponse(project);
  } catch {
    return errorResponse("Unable to fetch project");
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);

    const existing = await findProject(id);
    if (!existing) return errorResponse("Project not found", 404);

    const body = await request.json();
    const parsed = projectSchema.safeParse({ ...body, slug: body.slug || slugify(String(body.title ?? "")) });
    if (!parsed.success) return validationErrorResponse(parsed.error);

    const tags = normalizeTags(parsed.data.tags);
    const project = await prisma.project.update({
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
    return dataResponse(project);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return errorResponse("A project with this slug already exists.", 400);
    }
    return errorResponse("Unable to update project");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);

    const existing = await findProject(id);
    if (!existing) return errorResponse("Project not found", 404);
    await prisma.project.delete({ where: { id: existing.id } });
    return dataResponse({ deleted: true });
  } catch {
    return errorResponse("Unable to delete project");
  }
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const existing = await findProject(id);
    if (!existing) return errorResponse("Project not found", 404);
    const project = await prisma.project.update({
      where: { id: existing.id },
      data: { views: { increment: 1 } },
      include: { tags: true }
    });
    return dataResponse(project);
  } catch {
    return errorResponse("Unable to update project views");
  }
}
