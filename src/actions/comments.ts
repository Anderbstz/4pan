"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createComment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Tenés que iniciar sesión para comentar" };
  }

  const postId = formData.get("postId") as string;
  const content = formData.get("content") as string;
  const parentId = (formData.get("parentId") as string) || null;

  if (!postId || !content) {
    return { error: "Faltan datos para comentar" };
  }
  if (content.length > 1000) {
    return { error: "El comentario no puede superar los 1000 caracteres" };
  }

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

export async function getComments(postId: string) {
  const comments = await prisma.comment.findMany({
    where: { postId, parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, username: true, displayName: true },
      },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: { id: true, username: true, displayName: true },
          },
        },
      },
    },
  });

  return comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    author: c.author
      ? { displayName: c.author.displayName ?? c.author.username }
      : { displayName: "Anónimo" },
    replies: c.replies.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt,
      author: r.author
        ? { displayName: r.author.displayName ?? r.author.username }
        : { displayName: "Anónimo" },
    })),
  }));
}
