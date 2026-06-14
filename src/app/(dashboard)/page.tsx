import { Navbar } from "@/components/navbar";
import { sectionLabels } from "@/lib/sections";
import { getPostsBySection } from "@/actions/posts";
import Link from "next/link";
import { Section } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart } from "lucide-react";
import { Sidebar } from "./sidebar";

const sections = Object.values(Section) as Section[];

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days} d`;
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ seccion?: string }>;
}) {
  const { seccion } = await searchParams;
  const activeSection = seccion && sections.includes(seccion as Section)
    ? (seccion as Section)
    : undefined;

  const { posts } = await getPostsBySection(activeSection);

  return (
    <>
      <Navbar />
      <div className="flex-1 flex gap-6 max-w-5xl mx-auto w-full px-4 py-6">
        <Sidebar />
        <div className="flex-1 min-w-0">
          {/* Post list */}
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
                  href={`/post/${post.id}`}
                  className="block transition-colors"
                >
                  <Card className="hover:border-foreground/30 transition-colors cursor-pointer">
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
                          {post.author.displayName}
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
                  <>
                    <div className="flex items-center gap-2 ml-8 mt-1 mb-1">
                      <svg width="20" height="28" viewBox="0 0 20 28" fill="none" className="text-border">
                        <line x1="10" y1="0" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <polyline points="4,12 10,18 16,12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs text-muted-foreground">Comentarios</span>
                    </div>
                    <div className="ml-11 pb-2 space-y-1">
                    {post.recentComments.map((c) => (
                      <div
                        key={c.id}
                        className="text-xs bg-card border border-border rounded-lg px-3 py-2 flex items-start gap-2"
                      >
                        <span className="font-medium text-foreground/80 shrink-0">{c.author.displayName}:</span>
                        <span className="text-muted-foreground line-clamp-1 min-w-0">{c.content}</span>
                        {c.likeCount > 0 && (
                          <span className="text-muted-foreground shrink-0 ml-auto">♥ {c.likeCount}</span>
                        )}
                      </div>
                    ))}
                    {post.commentCount > 3 && (
                      <Link
                        href={`/post/${post.id}`}
                        className="text-xs text-primary hover:underline font-medium inline-block mt-1 ml-1"
                      >
                        Ver los {post.commentCount} comentarios →
                      </Link>
                    )}
                  </div>
                  </>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
