import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { skillSchema } from "@/lib/validations";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    const parsed = skillSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const skill = await prisma.skill.update({ where: { id: id }, data: parsed.data });
    return dataResponse(skill);
  } catch {
    return errorResponse("Unable to update skill");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    await prisma.skill.delete({ where: { id: id } });
    return dataResponse({ deleted: true });
  } catch {
    return errorResponse("Unable to delete skill");
  }
}
