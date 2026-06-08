import { Navbar, sectionLabels } from "@/components/navbar";
import { getPostsBySection } from "@/actions/posts";
import Link from "next/link";
import { Section } from "@/generated/prisma/client";

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
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {/* Section tabs */}
        <div className="flex gap-1 overflow-x-auto pb-4 mb-2">
          <Link
            href="/"
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !activeSection
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Todas
          </Link>
          {sections.map((s) => (
            <Link
              key={s}
              href={`/?seccion=${s}`}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeSection === s
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {sectionLabels[s]}
            </Link>
          ))}
        </div>

        {/* Post list */}
        <div className="space-y-3">
          {posts.length === 0 && (
            <p className="text-center text-gray-400 py-12">
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
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="block border rounded-xl p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold truncate">{post.title}</h2>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {post.content}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span>{post.author.displayName}</span>
                <span>·</span>
                <span>{timeAgo(post.createdAt)}</span>
                <span className="ml-auto flex items-center gap-3">
                  <span>💬 {post.commentCount}</span>
                  <span>❤️ {post.reactionCount}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
