import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const certificationSchema = z.object({
  slug: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().or(z.date()),
  url: z.string().url().optional().or(z.literal("")),
  credentialId: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ data: certifications });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    
    const dataToValidate = {
      ...body,
      date: body.date ? new Date(body.date) : undefined,
    };
    
    const result = certificationSchema.safeParse(dataToValidate);

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

    const data = {
      ...result.data,
      slug: result.data.slug || slugify(result.data.name),
    };
    const certification = await prisma.certification.create({ data });

    revalidatePath("/");
    revalidatePath("/certifications");

    return NextResponse.json({ data: certification }, { status: 201 });
  } catch (error) {
    console.error("Error creating certification:", error);
    return NextResponse.json(
      { error: "Failed to create certification" },
      { status: 500 }
    );
  }
}
