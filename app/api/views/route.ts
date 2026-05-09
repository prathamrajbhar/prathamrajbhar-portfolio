import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const viewSchema = z.object({
  path: z.string().min(1, "Path is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = viewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const view = await prisma.pageView.upsert({
      where: { path: result.data.path },
      update: { count: { increment: 1 } },
      create: { path: result.data.path, count: 1 },
    });

    return NextResponse.json({ data: { count: view.count } });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}
