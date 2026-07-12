"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { toggleReactionSchema } from "@/lib/schemas";

export async function toggleReaction(postId: string, emoji: string) {
  const parsed = toggleReactionSchema.safeParse({ postId, emoji });
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Tenés que iniciar sesión" };
  }

  const existing = await prisma.reaction.findUnique({
    where: {
      userId_postId_emoji: {
        userId: session.user.id,
        postId,
        emoji,
      },
    },
  });

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.reaction.create({
      data: {
        emoji,
        postId,
        userId: session.user.id,
      },
    });
  }

  revalidatePath(`/post/${postId}`);
  revalidatePath("/");
}

export async function getReactions(postId: string) {
  const session = await auth();

  const reactions = await prisma.reaction.groupBy({
    by: ["emoji"],
    where: { postId },
    _count: true,
  });

  // Get the current user's reactions for this post
  const userReactionEmojis: string[] = [];
  if (session?.user?.id) {
    const userReactions = await prisma.reaction.findMany({
      where: { postId, userId: session.user.id },
      select: { emoji: true },
    });
    userReactionEmojis.push(...userReactions.map((r) => r.emoji));
  }

  return {
    counts: reactions.map((r) => ({
      emoji: r.emoji,
      count: r._count,
    })),
    userReactions: userReactionEmojis,
  };
}

export async function toggleFavorite(postId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Tenés que iniciar sesión" };
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({
      data: { postId, userId: session.user.id },
    });
  }

  revalidatePath(`/post/${postId}`);
  revalidatePath("/");
}
