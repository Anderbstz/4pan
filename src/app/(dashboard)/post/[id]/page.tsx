import { Navbar } from "@/components/navbar";
import { getPostById } from "@/actions/posts";
import { getComments } from "@/actions/comments";
import { getReactions } from "@/actions/reactions";
import { notFound } from "next/navigation";
import { PostContent } from "@/components/post-content";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, comments, { counts: reactions, userReactions }] = await Promise.all([
    getPostById(id),
    getComments(id),
    getReactions(id),
  ]);

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <PostContent
          post={post}
          comments={comments}
          reactions={reactions}
          userReactions={userReactions}
        />
      </main>
    </>
  );
}
