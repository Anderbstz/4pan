import { sectionLabels } from "@/lib/sections";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart } from "lucide-react";
import { CommentLikeButton } from "@/app/(dashboard)/post/[id]/comment-like-button";
import { timeAgo } from "@/lib/time-ago";

type Post = {
  id: string;
  title: string;
  content: string;
  section: string;
  author: { displayName: string | null };
  createdAt: Date;
  commentCount: number;
  reactionCount: number;
  recentComments: {
    id: string;
    content: string;
    author: { displayName: string | null };
    likeCount: number;
    isLiked: boolean;
  }[];
};

export function FeedContent({
  posts,
  activeSection,
}: {
  posts: Post[];
  activeSection?: string;
}) {
  return (
    <div className="space-y-3">
      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          Todavía no hay publicaciones en esta sección.
          {activeSection && (
            <> También podés{" "}
              <Link href="/" className="underline">
                ver todas
              </Link>.
            </>
          )}
        </p>
      )}

      {posts.map((post) => (
        <div key={post.id}>
          <Link
            href={`/post/${post.id}${post.recentComments.length > 0 ? "#comments" : ""}`}
            className="block transition-colors"
          >
            <Card className="hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-4px_rgba(139,94,60,0.08)] active:scale-[0.99] transition-all duration-200 cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="truncate">{post.title}</CardTitle>
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {post.content}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {sectionLabels[post.section]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.author.displayName ?? "Anónimo"}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(post.createdAt)}
                  </span>
                  <span className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MessageCircle className="size-3.5" /> {post.commentCount}</span>
                    <span className="inline-flex items-center gap-1"><Heart className="size-3.5" /> {post.reactionCount}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Recent comments */}
          {post.recentComments.length > 0 && (
            <div className="ml-4 mt-2 pb-2 space-y-1">
              {post.recentComments.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <svg width="16" height="22" viewBox="0 0 16 22" fill="none" className="text-border shrink-0 mt-1">
                    <path d="M2 2v9a3 3 0 0 0 3 3h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="m11 11 4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="text-xs bg-card border border-border rounded-lg px-3 py-2 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground/80 shrink-0">{c.author.displayName ?? "Anónimo"}:</span>
                      <CommentLikeButton
                        commentId={c.id}
                        initialLiked={c.isLiked}
                        initialCount={c.likeCount}
                      />
                    </div>
                    <span className="text-muted-foreground line-clamp-1">{c.content}</span>
                  </div>
                </div>
              ))}
              {post.commentCount > 3 && (
                <Link
                  href={`/post/${post.id}#comments`}
                  className="text-xs text-primary hover:underline font-medium inline-block mt-1 ml-1"
                >
                  Ver los {post.commentCount} comentarios →
                </Link>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
