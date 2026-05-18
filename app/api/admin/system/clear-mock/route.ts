import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST() {
  try {
    await requireAdmin();

    // Sequential deletion to avoid foreign key issues and ensure clean slate
    await prisma.projectLink.deleteMany();
    await prisma.project.deleteMany();
    await prisma.blogPost.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.hackathon.deleteMany();
    await prisma.certification.deleteMany();
    await prisma.education.deleteMany();
    await prisma.contactMessage.deleteMany();
    await prisma.pageView.deleteMany();

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, message: "Database cleared successfully" });
  } catch (error) {
    console.error("Error clearing database:", error);
    return NextResponse.json({ success: false, error: "Failed to clear database" }, { status: 500 });
  }
}
