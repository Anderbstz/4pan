import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NotificationList } from "./list";

export default async function NotificacionesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, type: true, title: true, body: true, link: true, read: true, createdAt: true },
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Notificaciones</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">{unreadCount} sin leer</p>
          )}
        </div>
      </div>
      <NotificationList initial={notifications} />
    </div>
  );
}
