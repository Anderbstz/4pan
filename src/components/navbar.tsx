import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Avatar } from "@/components/avatar";
import { SearchInput } from "@/components/search-input";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="border-border/80 border-b sticky top-0 bg-background/85 backdrop-blur-md z-50 transition-colors">
      <div className="max-w-5xl lg:max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <img src="/4pan-banner.png" alt="4pan" className="h-8 sm:h-10 w-auto" />
          <span className="font-bold text-xl sm:text-2xl tracking-tight text-foreground">4pan</span>
        </Link>

        {/* Center: Search Box */}
        <div className="flex-1 justify-center hidden sm:flex">
          <SearchInput />
        </div>

        {/* Right: User menu & Dark mode toggle */}
        <nav className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link href="/nuevo">
            <Button variant="default" size="sm" className="text-xs sm:text-sm h-9 px-3 sm:px-4 rounded-xl font-semibold shadow-sm">
              + Nuevo
            </Button>
          </Link>
          
          <ThemeToggle />

          <div className="h-5 w-px bg-border/80 hidden sm:block" />

          {session?.user ? (
            <div className="flex items-center gap-1.5 sm:gap-3">
              <Link href="/perfil" className="hover:opacity-90 transition-opacity">
                <Avatar
                  src={session.user.image}
                  name={session.user.name}
                  size="sm"
                  className="border border-border size-8 shadow-sm"
                />
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-9 rounded-xl font-medium">
                Iniciar sesión
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
