"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { Section } from "@/generated/prisma/client";

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

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const section = formData.get("section") as Section;
  const isAnonymous = formData.get("isAnonymous") === "true";

  if (!title || !content || !section) {
    return { error: "Faltan campos obligatorios" };
  }
  if (title.length > 200) {
    return { error: "El título no puede superar los 200 caracteres" };
  }
  if (!Object.values(Section).includes(section)) {
    return { error: "Sección inválida" };
  }

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

export async function getPostsBySection(section?: Section, page = 1) {
  const itemsPerPage = 20;

  const posts = await prisma.post.findMany({
    where: section ? { section } : undefined,
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

  // Batch fetch comments per post (sorted by likes, top 3)
  const postIds = posts.map((p) => p.id);
  const allComments = postIds.length > 0
    ? await prisma.comment.findMany({
        where: { postId: { in: postIds }, parentId: null },
        include: {
          author: {
            select: { id: true, username: true, displayName: true },
          },
          _count: { select: { likes: true } },
        },
      })
    : [];

  // Sort by like count DESC, then by createdAt DESC, take 3 per post
  allComments.sort((a, b) => b._count.likes - a._count.likes || b.createdAt.getTime() - a.createdAt.getTime());

  // Group comments by post, take 3 per post
  const commentsByPost = new Map<string, typeof allComments>();
  for (const comment of allComments) {
    const list = commentsByPost.get(comment.postId) ?? [];
    if (list.length < 3) {
      list.push(comment);
      commentsByPost.set(comment.postId, list);
    }
  }

  const total = await prisma.post.count({
    where: section ? { section } : undefined,
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
