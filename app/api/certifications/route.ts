import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { certificationSchema } from "@/lib/validations";

export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: { date: "desc" }
    });
    return dataResponse(certifications);
  } catch {
    return errorResponse("Unable to fetch certifications");
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    const parsed = certificationSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const certification = await prisma.certification.create({ data: parsed.data });
    return dataResponse(certification, 201);
  } catch {
    return errorResponse("Unable to create certification");
  }
}
