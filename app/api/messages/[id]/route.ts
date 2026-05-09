import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, requireAdmin } from "@/lib/api";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    const message = await prisma.contactMessage.update({
      where: { id: id },
      data: { read: true }
    });
    return dataResponse(message);
  } catch {
    return errorResponse("Unable to mark message as read");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    await prisma.contactMessage.delete({ where: { id: id } });
    return dataResponse({ deleted: true });
  } catch {
    return errorResponse("Unable to delete message");
  }
}
