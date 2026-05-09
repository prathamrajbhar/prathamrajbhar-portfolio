import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { experienceSchema } from "@/lib/validations";

const reorderSchema = z.object({ order: z.coerce.number().int() });

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);

    const parsed = experienceSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const experience = await prisma.experience.update({
      where: { id: id },
      data: parsed.data
    });
    return dataResponse(experience);
  } catch {
    return errorResponse("Unable to update experience");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    const parsed = reorderSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const experience = await prisma.experience.update({
      where: { id: id },
      data: { order: parsed.data.order }
    });
    return dataResponse(experience);
  } catch {
    return errorResponse("Unable to reorder experience");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    await prisma.experience.delete({ where: { id: id } });
    return dataResponse({ deleted: true });
  } catch {
    return errorResponse("Unable to delete experience");
  }
}
