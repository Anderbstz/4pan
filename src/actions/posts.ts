"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Section } from "@/generated/prisma/client";

export type CreatePostState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function createPost(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Tenés que iniciar sesión para publicar" };
  }

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

  await prisma.post.create({
    data: {
      title,
      content,
      section,
      isAnonymous,
      authorId: session.user.id,
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

  const total = await prisma.post.count({
    where: section ? { section } : undefined,
  });

  return {
    posts: posts.map((p) => ({
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
    })),
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
