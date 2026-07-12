"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createCommentSchema } from "@/lib/schemas";

export async function createComment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Tenés que iniciar sesión para comentar" };
  }

  const parsed = createCommentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { error: firstError };
  }
  const { postId, content, parentId } = parsed.data;

  await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: session.user.id,
      parentId,
    },
  });

  revalidatePath(`/post/${postId}`);
  return { success: true };
}

export async function toggleCommentLike(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Tenés que iniciar sesión" };

  const existing = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId: session.user.id,
        commentId,
      },
    },
  });

  if (existing) {
    await prisma.commentLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.commentLike.create({
      data: { commentId, userId: session.user.id },
    });
  }

  revalidatePath(`/post/${commentId}`);
  return { success: true };
}

export async function getComments(postId: string) {
  const session = await auth();

  const comments = await prisma.comment.findMany({
    where: { postId, parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, username: true, displayName: true },
      },
      _count: { select: { likes: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: { id: true, username: true, displayName: true },
          },
          _count: { select: { likes: true } },
        },
      },
    },
  });

  // Get the current user's liked comment IDs
  const likedCommentIds = session?.user?.id
    ? (
        await prisma.commentLike.findMany({
          where: {
            commentId: { in: comments.flatMap((c) => [c.id, ...c.replies.map((r) => r.id)]) },
            userId: session.user.id,
          },
          select: { commentId: true },
        })
      ).map((l) => l.commentId)
    : [];

  return comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    likeCount: c._count.likes,
    isLiked: likedCommentIds.includes(c.id),
    author: c.author
      ? { displayName: c.author.displayName ?? c.author.username }
      : { displayName: "Anónimo" },
    replies: c.replies.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt,
      likeCount: r._count.likes,
      isLiked: likedCommentIds.includes(r.id),
      author: r.author
        ? { displayName: r.author.displayName ?? r.author.username }
        : { displayName: "Anónimo" },
    })),
  }));
}

export async function getCommentsForFeed(postId: string) {
  const comments = await prisma.comment.findMany({
    where: { postId, parentId: null },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      author: {
        select: { id: true, username: true, displayName: true },
      },
      _count: { select: { likes: true } },
    },
  });

  return comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    likeCount: c._count.likes,
    author: c.author
      ? { displayName: c.author.displayName ?? c.author.username }
      : { displayName: "Anónimo" },
  }));
}
