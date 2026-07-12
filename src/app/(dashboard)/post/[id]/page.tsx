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
    <PostContent
      post={post}
      comments={comments}
      reactions={reactions}
      userReactions={userReactions}
    />
  );
}
