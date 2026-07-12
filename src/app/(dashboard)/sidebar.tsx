"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sectionLabels } from "@/lib/sections";
import { cn } from "@/lib/utils";
import {
  LayoutList,
  Feather,
  Mail,
  MessageSquare,
  BookOpen,
  Heart,
  Loader2,
} from "lucide-react";

const SECTIONS: { value: string; icon: React.ReactNode }[] = [
  { value: "POESIA", icon: <Feather className="size-4" /> },
  { value: "CARTAS_NO_ENVIADAS", icon: <Mail className="size-4" /> },
  { value: "CONFESIONES", icon: <MessageSquare className="size-4" /> },
  { value: "MICRORRELATOS", icon: <BookOpen className="size-4" /> },
  { value: "DESAHOGO", icon: <Heart className="size-4" /> },
];

export function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("seccion") ?? null;

  const [pendingSection, setPendingSection] = useState<string | null | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  // Reset pending state when active section changes (navigation completed)
  useEffect(() => {
    setPendingSection(undefined);
  }, [activeSection]);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetUrl: string,
    sectionVal: string | null
  ) => {
    e.preventDefault();
    setPendingSection(sectionVal);
    startTransition(() => {
      router.push(targetUrl);
    });
  };

  const isAllPending = isPending && pendingSection === null;

  return (
    <aside className="hidden md:block w-52 shrink-0">
      <nav className="space-y-1.5 sticky top-20">
        <Link
          href="/"
          onClick={(e) => handleNavigation(e, "/", null)}
          className={cn(
            "group relative flex items-center gap-2.5 py-2.5 text-sm transition-all duration-300 ease-out active:scale-95 pl-4 rounded-xl",
            !activeSection
              ? "bg-primary/10 text-primary font-semibold"
              : "text-muted-foreground hover:text-primary hover:bg-primary/5 hover:translate-x-1.5",
            isAllPending && "animate-pulse opacity-85"
          )}
        >
          <span
            className={cn(
              "absolute left-0 w-[3px] bg-primary rounded-r-full transition-all duration-300 ease-out origin-center",
              !activeSection ? "top-2.5 bottom-2.5 opacity-100 scale-y-100" : "top-1/2 bottom-1/2 opacity-0 scale-y-0"
            )}
          />
          <div className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200 shrink-0">
            {isAllPending ? (
              <Loader2 className="size-4 animate-spin text-primary" />
            ) : (
              <LayoutList className="size-4" />
            )}
          </div>
          Todas las secciones
        </Link>

        {SECTIONS.map(({ value, icon }) => {
          const isItemPending = isPending && pendingSection === value;
          return (
            <Link
              key={value}
              href={`/?seccion=${value}`}
              onClick={(e) => handleNavigation(e, `/?seccion=${value}`, value)}
              className={cn(
                "group relative flex items-center gap-2.5 py-2.5 text-sm transition-all duration-300 ease-out active:scale-95 pl-4 rounded-xl",
                activeSection === value
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5 hover:translate-x-1.5",
                isItemPending && "animate-pulse opacity-85"
              )}
            >
              <span
                className={cn(
                  "absolute left-0 w-[3px] bg-primary rounded-r-full transition-all duration-300 ease-out origin-center",
                  activeSection === value ? "top-2.5 bottom-2.5 opacity-100 scale-y-100" : "top-1/2 bottom-1/2 opacity-0 scale-y-0"
                )}
              />
              <div className="group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-200 shrink-0">
                {isItemPending ? (
                  <Loader2 className="size-4 animate-spin text-primary" />
                ) : (
                  icon
                )}
              </div>
              {sectionLabels[value]}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
