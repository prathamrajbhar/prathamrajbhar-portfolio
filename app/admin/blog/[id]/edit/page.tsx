import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/BlogForm";
import { getBlogPostById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();
  return <BlogForm post={post} />;
}
