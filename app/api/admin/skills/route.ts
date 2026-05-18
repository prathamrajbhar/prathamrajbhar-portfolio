import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  iconUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().default(0),
});

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ data: skills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const result = skillSchema.safeParse(body);

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

    const skill = await prisma.skill.create({
      data: result.data,
    });

    revalidatePath("/");
    revalidatePath("/about");

    return NextResponse.json({ data: skill }, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "A skill with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
