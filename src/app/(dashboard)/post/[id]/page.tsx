import { Navbar, sectionLabels } from "@/components/navbar";
import { getPostById } from "@/actions/posts";
import { getComments } from "@/actions/comments";
import { getReactions } from "@/actions/reactions";
import { CommentForm } from "./comment-form";
import { ReactionButtons } from "./reaction-buttons";
import { notFound } from "next/navigation";
import Link from "next/link";

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days} d`;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, comments, reactions] = await Promise.all([
    getPostById(id),
    getComments(id),
    getReactions(id),
  ]);

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-black mb-4 inline-block"
        >
          ← Volver
        </Link>

        <article className="border rounded-xl p-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
              {sectionLabels[post.section]}
            </span>
            <span>·</span>
            <span>{post.author.displayName}</span>
            <span>·</span>
            <span>{timeAgo(post.createdAt)}</span>
          </div>

          <h1 className="text-xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </article>

        {/* Reactions */}
        <div className="mt-4">
          <ReactionButtons postId={post.id} initialReactions={reactions} />
        </div>

        {/* Comments */}
        <section className="mt-8">
          <h2 className="font-semibold mb-4">
            Comentarios ({post.commentCount})
          </h2>

          <CommentForm postId={post.id} />

          <div className="space-y-4 mt-6">
            {comments.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">
                Sin comentarios todavía. Sé el primero en responder.
              </p>
            )}

            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <span className="font-medium text-gray-600">
                    {comment.author.displayName}
                  </span>
                  <span>·</span>
                  <span>{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm">{comment.content}</p>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-6 mt-3 space-y-3 border-l-2 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                          <span className="font-medium text-gray-600">
                            {reply.author.displayName}
                          </span>
                          <span>·</span>
                          <span>{timeAgo(reply.createdAt)}</span>
                        </div>
                        <p className="text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
