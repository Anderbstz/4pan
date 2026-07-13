"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUnreadCount, getRecentNotifications, markAsRead, markAllAsRead, type NotificationItem } from "@/actions/notifications";

export function NotificationBell({ initialCount }: { initialCount: number }) {
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Polling cada 5s + refetch al enfocar la pestaña
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let currentInterval = 5_000;

    async function poll() {
      const c = await getUnreadCount();
      setCount(c);
    }

    function start() {
      stop();
      intervalId = setInterval(poll, currentInterval);
    }

    function stop() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function onVisibility() {
      if (document.hidden) {
        stop();
      } else {
        poll();       // refesh inmediato al volver
        start();      // reanudar polling
      }
    }

    function onFocus() {
      poll(); // refesh inmediato al enfocar la ventana
    }

    start();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function toggle() {
    if (!open) {
      const items = await getRecentNotifications(10);
      setNotifications(items);
      // Marcar todas como leídas al abrir el panel
      if (count > 0) {
        await markAllAsRead();
        setCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    }
    setOpen(!open);
  }

  async function handleMarkRead(id: string) {
    await markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setCount((c) => Math.max(0, c - 1));
  }

  async function handleClickNotification(e: React.MouseEvent, n: NotificationItem) {
    e.preventDefault();
    if (!n.read) await handleMarkRead(n.id);
    router.push(n.link);
  }

  async function handleMarkAll() {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setCount(0);
  }

  function timeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "ahora";
    if (mins < 60) return `hace ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `hace ${days}d`;
  }

  return (
    <div ref={dropdownRef} className="relative">
      <Button variant="ghost" size="icon" onClick={toggle} className="size-9 rounded-xl relative shrink-0">
        <Bell className="size-[18px]" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold">Notificaciones</span>
            {count > 0 && (
              <button onClick={handleMarkAll} className="text-xs text-primary hover:underline">
                Marcar todas leídas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {count > 0 ? "Cargando..." : "No hay notificaciones"}
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-border/50 last:border-0 transition-colors ${
                    n.read ? "bg-background" : "bg-muted/30"
                  }`}
                >
                  <a
                    href={n.link}
                    onClick={(e) => handleClickNotification(e, n)}
                    className="block space-y-1"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${n.read ? "text-foreground" : "font-semibold text-foreground"}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0 pt-0.5">{timeAgo(n.createdAt)}</span>
                    </div>
                    {n.body && <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>}
                  </a>
                </div>
              ))
            )}
          </div>

          <a
            href="/notificaciones"
            className="block text-center text-xs text-primary py-2.5 border-t border-border hover:bg-muted/50 transition-colors"
          >
            Ver todas las notificaciones
          </a>
        </div>
      )}
    </div>
  );
}
