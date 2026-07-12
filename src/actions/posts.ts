"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { Section } from "@/generated/prisma/client";
import { createPostSchema } from "@/lib/schemas";

export type CreatePostState = {
  error?: string;
  success?: boolean;
} | undefined;

async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  // Fallback for direct connections (dev)
  return h.get("x-real-ip") ?? null;
}

export async function createPost(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const session = await auth();
  const ip = await getClientIp();

  const parsed = createPostSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { error: firstError };
  }
  const { title, content, section, isAnonymous: isAnon } = parsed.data;
  const isAnonymous = isAnon === "true";

  // Límite de 5 posts por día
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  if (!isAnonymous && !session?.user?.id) {
    return { error: "Tenés que iniciar sesión para publicar con tu nombre" };
  }

  if (isAnonymous) {
    // Anonymous: limit by IP
    if (ip) {
      const todayCount = await prisma.post.count({
        where: {
          ipAddress: ip,
          createdAt: { gte: todayStart },
        },
      });
      if (todayCount >= 5) {
        return {
          error: "Alcanzaste el límite de 5 publicaciones anónimas por día desde esta IP.",
        };
      }
    }
  } else if (session?.user?.id) {
    // Named: limit by user
    const todayCount = await prisma.post.count({
      where: {
        authorId: session.user.id,
        createdAt: { gte: todayStart },
      },
    });
    if (todayCount >= 5) {
      return {
        error: "Alcanzaste el límite de 5 publicaciones por día. Volvé mañana.",
      };
    }
  }

  await prisma.post.create({
    data: {
      title,
      content,
      section,
      isAnonymous,
      authorId: isAnonymous ? null : session!.user!.id,
      ipAddress: isAnonymous ? ip : null,
    },
  });

  revalidatePath("/");
  revalidatePath(`/?seccion=${section}`);
  return { success: true };
}

export async function getPostsBySection(section?: Section, page = 1, search?: string) {
  const session = await auth();
  const itemsPerPage = 20;

  const whereClause: any = {};
  if (section) {
    whereClause.section = section;
  }
  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: itemsPerPage,
    skip: (page - 1) * itemsPerPage,
    include: {
      author: {
        select: { id: true, username: true, displayName: true },
      },
      _count: {
        select: {
          comments: true,
          reactions: true,
          favorites: true,
        },
      },
    },
  });

  // Batch fetch top comments per post (limit total to avoid slow queries)
  const postIds = posts.map((p) => p.id);
  const allComments = postIds.length > 0
    ? await prisma.comment.findMany({
        where: { postId: { in: postIds }, parentId: null },
        orderBy: { createdAt: "desc" },
        take: 30,
        include: {
          author: {
            select: { id: true, username: true, displayName: true },
          },
          _count: { select: { likes: true } },
        },
      })
    : [];

  // Get which comments the current user has liked
  const userLikedIds: string[] = [];
  if (session?.user?.id && allComments.length > 0) {
    const likes = await prisma.commentLike.findMany({
      where: {
        commentId: { in: allComments.map((c) => c.id) },
        userId: session.user.id,
      },
      select: { commentId: true },
    });
    userLikedIds.push(...likes.map((l) => l.commentId));
  }

  // Sort by like count DESC, take 3 per post
  allComments.sort((a, b) => b._count.likes - a._count.likes || b.createdAt.getTime() - a.createdAt.getTime());
  const commentsByPost = new Map<string, typeof allComments>();
  for (const comment of allComments) {
    const list = commentsByPost.get(comment.postId) ?? [];
    if (list.length < 3) {
      list.push(comment);
      commentsByPost.set(comment.postId, list);
    }
  }

  const total = posts.length < itemsPerPage
    ? (page - 1) * itemsPerPage + posts.length
    : await prisma.post.count({
        where: whereClause,
      });

  return {
    posts: posts.map((p) => {
      const postComments = (commentsByPost.get(p.id) ?? []).slice(0, 3);
      return {
        id: p.id,
        title: p.title,
        content: p.content,
        section: p.section,
        isAnonymous: p.isAnonymous,
        createdAt: p.createdAt,
        author: p.isAnonymous
          ? { displayName: "Anónimo" }
          : p.author ?? { displayName: "Usuario eliminado" },
        commentCount: p._count.comments,
        reactionCount: p._count.reactions,
        favoriteCount: p._count.favorites,
        recentComments: postComments.map((c) => ({
          id: c.id,
          content: c.content,
          createdAt: c.createdAt,
          likeCount: c._count.likes,
          isLiked: userLikedIds.includes(c.id),
          author: c.author
            ? { displayName: c.author.displayName ?? c.author.username }
            : { displayName: "Anónimo" },
        })),
      };
    }),
    totalPages: Math.ceil(total / itemsPerPage),
  };
}

export async function getPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, username: true, displayName: true },
      },
      _count: {
        select: {
          comments: true,
          reactions: true,
          favorites: true,
        },
      },
    },
  });

  if (!post) return null;

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    section: post.section,
    isAnonymous: post.isAnonymous,
    createdAt: post.createdAt,
    author: post.isAnonymous
      ? { displayName: "Anónimo" }
      : post.author ?? { displayName: "Usuario eliminado" },
    commentCount: post._count.comments,
    reactionCount: post._count.reactions,
    favoriteCount: post._count.favorites,
  };
}
