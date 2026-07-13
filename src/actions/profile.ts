"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ProfileState = { error?: string; success?: boolean; displayName?: string } | undefined;

export async function updateDisplayName(
  _prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const displayName = formData.get("displayName") as string;
  if (!displayName || displayName.length < 2) {
    return { error: "El nombre debe tener al menos 2 caracteres" };
  }
  if (displayName.length > 50) {
    return { error: "El nombre no puede superar los 50 caracteres" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { displayName },
  });

  revalidatePath("/perfil");
  return { success: true, displayName };
}

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      displayName: true,
      email: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: {
        select: { posts: true, comments: true, reactions: true },
      },
    },
  });

  return user;
}
