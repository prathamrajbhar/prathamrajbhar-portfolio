import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  type: z.string().default("Full-time"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).nullable(),
  current: z.coerce.boolean().default(false),
  description: z.string().min(1, "Description is required"),
  skills: z.array(z.string()).default([]),
  logoUrl: z.string().url().optional().or(z.literal("")).or(z.null()),
  order: z.coerce.number().default(0),
});

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
    return NextResponse.json({ data: experiences });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
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
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : null,
    };
    
    const result = experienceSchema.safeParse(dataToValidate);

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

    const experience = await prisma.experience.create({
      data: result.data,
    });

    revalidatePath("/");
    revalidatePath("/experience");

    return NextResponse.json({ data: experience }, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
