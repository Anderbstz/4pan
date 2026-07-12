"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Avoid triggering search on mount if value hasn't changed from URL parameter
      const currentQuery = searchParams.get("q") ?? "";
      if (value === currentQuery) return;

      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }

      startTransition(() => {
        // Redirect to homepage feed if they search from another page (e.g. post detail, profile)
        const targetPath = pathname === "/" ? "/" : "/";
        router.push(`${targetPath}?${params.toString()}`);
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [value, router, pathname, searchParams]);

  const handleClear = () => {
    setValue("");
  };

  return (
    <div className="relative w-full sm:max-w-[280px] md:max-w-[340px] group">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar en 4pan..."
        className="pl-9 pr-8 h-9 bg-muted/40 hover:bg-muted/65 focus:bg-background border-border/80 rounded-xl transition-all"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground size-4 flex items-center justify-center rounded-md"
          type="button"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
