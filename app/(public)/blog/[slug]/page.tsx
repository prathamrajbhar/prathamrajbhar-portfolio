import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostClient } from "@/components/public/BlogPostClient";
import { MdxContent } from "@/components/public/MdxContent";
import { fetchApi } from "@/lib/server-data";
import type { BlogPostDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchApi<BlogPostDTO | null>(`/blog/${params.slug}`, null);
  return {
    title: post?.title ?? "Blog post",
    description: post?.excerpt ?? "Blog post",
    openGraph: {
      images: [`/api/og?title=${encodeURIComponent(post?.title ?? "Blog post")}&subtitle=Blog`]
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchApi<BlogPostDTO | null>(`/blog/${params.slug}`, null);
  if (!post) notFound();

  return (
    <BlogPostClient post={post}>
      <MdxContent source={post.content} />
    </BlogPostClient>
  );
}
