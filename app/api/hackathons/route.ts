import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { hackathonSchema } from "@/lib/validations";

export async function GET() {
  try {
    const hackathons = await prisma.hackathon.findMany({
      orderBy: { date: "desc" }
    });
    return dataResponse(hackathons);
  } catch {
    return errorResponse("Unable to fetch hackathons");
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    const parsed = hackathonSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const hackathon = await prisma.hackathon.create({ data: parsed.data });
    return dataResponse(hackathon, 201);
  } catch {
    return errorResponse("Unable to create hackathon");
  }
}
