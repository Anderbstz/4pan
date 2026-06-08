"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleReaction(postId: string, emoji: string) {
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
  const reactions = await prisma.reaction.groupBy({
    by: ["emoji"],
    where: { postId },
    _count: true,
  });

  return reactions.map((r) => ({
    emoji: r.emoji,
    count: r._count,
  }));
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
