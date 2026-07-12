import { getPostsBySection } from "@/actions/posts";
import { Section } from "@/generated/prisma/client";
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

  return <FeedContent posts={posts} activeSection={activeSection} />;
}
