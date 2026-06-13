"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { sectionLabels } from "@/lib/sections";
import { cn } from "@/lib/utils";
import {
  LayoutList,
  Feather,
  Mail,
  MessageSquare,
  BookOpen,
  Heart,
} from "lucide-react";

const SECTIONS: { value: string; icon: React.ReactNode }[] = [
  { value: "POESIA", icon: <Feather className="size-4" /> },
  { value: "CARTAS_NO_ENVIADAS", icon: <Mail className="size-4" /> },
  { value: "CONFESIONES", icon: <MessageSquare className="size-4" /> },
  { value: "MICRORRELATOS", icon: <BookOpen className="size-4" /> },
  { value: "DESAHOGO", icon: <Heart className="size-4" /> },
];

export function Sidebar() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("seccion") ?? null;

  return (
    <aside className="w-52 shrink-0">
      <nav className="space-y-1 sticky top-20">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
            !activeSection
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          <LayoutList className="size-4" />
          Todas las secciones
        </Link>

        {SECTIONS.map(({ value, icon }) => (
          <Link
            key={value}
            href={`/?seccion=${value}`}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
              activeSection === value
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {icon}
            {sectionLabels[value]}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
