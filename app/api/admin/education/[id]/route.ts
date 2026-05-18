import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const educationSchema = z.object({
  slug: z.string().optional(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  startYear: z.string().min(1, "Start year is required"),
  endYear: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  gpa: z.string().optional(),
  location: z.string().optional(),
  order: z.number().default(0),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const education = await prisma.education.findUnique({ where: { id } });
    if (!education) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 });
    }
    return NextResponse.json({ data: education });
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const result = educationSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      return NextResponse.json({ error: "Validation failed", fields: fieldErrors }, { status: 400 });
    }

    const data = {
      ...result.data,
      slug: result.data.slug || slugify(`${result.data.degree}-${result.data.institution}`),
    };
    const education = await prisma.education.update({ where: { id }, data });

    revalidatePath("/");
    revalidatePath("/education");
    revalidatePath("/about");

    return NextResponse.json({ data: education });
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.education.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/education");
    revalidatePath("/about");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
