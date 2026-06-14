import { Navbar } from "@/components/navbar";
import { getPostsBySection } from "@/actions/posts";
import { Section } from "@/generated/prisma/client";
import { Sidebar } from "./sidebar";
import { MobileSectionBar } from "./mobile-sections";
import { FeedContent } from "@/components/feed-content";

const sections = Object.values(Section) as Section[];

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
      <div className="flex-1 flex gap-0 md:gap-6 max-w-5xl mx-auto w-full px-4 py-4 md:py-6">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <MobileSectionBar />
          <FeedContent posts={posts} activeSection={activeSection} />
        </div>
      </div>
    </>
  );
}
