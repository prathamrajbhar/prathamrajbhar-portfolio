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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const certification = await prisma.certification.findUnique({
      where: { id },
    });

    if (!certification) {
      return NextResponse.json(
        { error: "Certification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: certification });
  } catch (error) {
    console.error("Error fetching certification:", error);
    return NextResponse.json(
      { error: "Failed to fetch certification" },
      { status: 500 }
    );
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
    const certification = await prisma.certification.update({
      where: { id },
      data,
    });

    revalidatePath("/");
    revalidatePath("/certifications");

    return NextResponse.json({ data: certification });
  } catch (error) {
    console.error("Error updating certification:", error);
    return NextResponse.json(
      { error: "Failed to update certification" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.certification.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/certifications");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting certification:", error);
    return NextResponse.json(
      { error: "Failed to delete certification" },
      { status: 500 }
    );
  }
}
