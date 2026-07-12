"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@/generated/prisma/client";

export async function getUnreadCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;

  try {
    return await prisma.notification.count({
      where: { userId: session.user.id, read: false },
    });
  } catch {
    return 0;
  }
}

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string;
  read: boolean;
  createdAt: Date;
};

export async function getRecentNotifications(limit = 10): Promise<NotificationItem[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, type: true, title: true, body: true, link: true, read: true, createdAt: true },
    });
  } catch {
    return [];
  }
}

export async function markAsRead(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { read: true },
  });
}

export async function markAllAsRead(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });
}

// Internal (not exported as server action) - called from other actions
export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link: string;
}): Promise<void> {
  try {
    // Check user's master preference
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { emailNotifications: true },
    });
    if (!user?.emailNotifications) return;

    // Check type-specific preference
    const pref = await prisma.notificationPreference.findUnique({
      where: { userId_type: { userId: params.userId, type: params.type } },
    });
    if (pref && !pref.enabled) return;

    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        link: params.link,
      },
    });
  } catch {
    // Silently fail — notification creation should never break the main action
  }
}
