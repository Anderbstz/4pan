"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Determine initial theme after component mounts (browser context)
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="size-9 rounded-xl hover:bg-muted/60 transition-colors shrink-0"
      aria-label="Alternar modo oscuro"
    >
      {theme === "light" ? (
        <Moon className="size-[18px] text-muted-foreground hover:text-foreground transition-colors" />
      ) : (
        <Sun className="size-[18px] text-muted-foreground hover:text-foreground transition-colors" />
      )}
    </Button>
  );
}
