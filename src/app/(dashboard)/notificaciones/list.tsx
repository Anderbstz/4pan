"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markAsRead } from "@/actions/notifications";
import type { NotificationItem } from "@/actions/notifications";

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days}d`;
  return new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export function NotificationList({ initial }: { initial: NotificationItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string, read: boolean, link: string) {
    e.preventDefault();
    if (!read) {
      await markAsRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }
    router.push(link);
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">No tenés notificaciones todavía.</p>
        <p className="text-xs mt-1">Cuando alguien comente o reaccione a tus publicaciones, aparecerán acá.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((n) => (
        <a
          key={n.id}
          href={n.link}
          onClick={(e) => handleClick(e, n.id, n.read, n.link)}
          className={`block px-4 py-3 rounded-lg border border-border/60 transition-colors ${
            n.read ? "bg-background hover:bg-muted/30" : "bg-muted/20 border-primary/20 hover:bg-muted/40"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 min-w-0">
              <p className={`text-sm truncate ${n.read ? "text-foreground" : "font-semibold text-foreground"}`}>
                {n.title}
              </p>
              {n.body && <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>}
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0 pt-0.5">{timeAgo(n.createdAt)}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
