import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { hackathonSchema } from "@/lib/validations";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    const parsed = hackathonSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const hackathon = await prisma.hackathon.update({ where: { id: id }, data: parsed.data });
    return dataResponse(hackathon);
  } catch {
    return errorResponse("Unable to update hackathon");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    await prisma.hackathon.delete({ where: { id: id } });
    return dataResponse({ deleted: true });
  } catch {
    return errorResponse("Unable to delete hackathon");
  }
}
