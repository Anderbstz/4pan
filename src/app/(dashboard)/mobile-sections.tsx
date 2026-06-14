"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { sectionLabels } from "@/lib/sections";
import { cn } from "@/lib/utils";

const SECTION_VALUES = [
  "POESIA", "CARTAS_NO_ENVIADAS", "CONFESIONES",
  "MICRORRELATOS", "DESAHOGO",
] as const;

export function MobileSectionBar() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("seccion") ?? null;

  return (
    <div className="md:hidden overflow-x-auto pb-3 -mx-1 scrollbar-none">
      <div className="flex gap-2">
        <Link
          href="/"
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
            !activeSection
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary",
          )}
        >
          Todas
        </Link>
        {SECTION_VALUES.map((s) => (
          <Link
            key={s}
            href={`/?seccion=${s}`}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
              activeSection === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary",
            )}
          >
            {sectionLabels[s]}
          </Link>
        ))}
      </div>
    </div>
  );
}
