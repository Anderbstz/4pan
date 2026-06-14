import { sectionLabels } from "@/lib/sections";
import { CommentForm } from "@/app/(dashboard)/post/[id]/comment-form";
import { CommentLikeButton } from "@/app/(dashboard)/post/[id]/comment-like-button";
import { ReplyForm } from "@/app/(dashboard)/post/[id]/reply-form";
import { ReactionButtons } from "@/app/(dashboard)/post/[id]/reaction-buttons";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/time-ago";

type Post = {
  id: string;
  title: string;
  content: string;
  section: string;
  author: { displayName: string | null };
  createdAt: Date;
  commentCount: number;
};

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  isLiked: boolean;
  author: { displayName: string | null };
  replies: {
    id: string;
    content: string;
    createdAt: Date;
    likeCount: number;
    isLiked: boolean;
    author: { displayName: string | null };
  }[];
};

type Reaction = { emoji: string; count: number }[];

export function PostContent({
  post,
  comments,
  reactions,
  userReactions,
}: {
  post: Post;
  comments: Comment[];
  reactions: Reaction;
  userReactions: string[];
}) {
  return (
    <>
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        ← Volver
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Badge variant="secondary">{sectionLabels[post.section]}</Badge>
            <span>·</span>
            <span>{post.author.displayName ?? "Anónimo"}</span>
            <span>·</span>
            <span>{timeAgo(post.createdAt)}</span>
          </div>
          <h1 className="text-xl font-bold mb-4">{post.title}</h1>
          <div className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </CardContent>
      </Card>

      {/* Reactions */}
      <div className="mt-4">
        <ReactionButtons postId={post.id} initialReactions={reactions} userReactions={userReactions} />
      </div>

      {/* Comments */}
      <section id="comments" className="mt-8">
        <h2 className="font-semibold mb-4">
          Comentarios ({post.commentCount})
        </h2>

        <CommentForm postId={post.id} />

        <div className="space-y-4 mt-6">
          {comments.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">
              Sin comentarios todavía. Sé el primero en responder.
            </p>
          )}

          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="font-medium text-foreground/80">
                    {comment.author.displayName ?? "Anónimo"}
                  </span>
                  <span>·</span>
                  <span>{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm">{comment.content}</p>

                <div className="flex items-center gap-3 mt-2">
                  <CommentLikeButton
                    commentId={comment.id}
                    initialLiked={comment.isLiked}
                    initialCount={comment.likeCount}
                  />
                  <ReplyForm postId={post.id} parentId={comment.id} />
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-2 mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="text-border shrink-0 mt-0">
                          <path d="M2 2v11a3 3 0 0 0 3 3h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="m17 13 4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground/80">
                              {reply.author.displayName ?? "Anónimo"}
                            </span>
                            <span>·</span>
                            <span>{timeAgo(reply.createdAt)}</span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <CommentLikeButton
                              commentId={reply.id}
                              initialLiked={reply.isLiked}
                              initialCount={reply.likeCount}
                            />
                            <ReplyForm postId={post.id} parentId={reply.id} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
