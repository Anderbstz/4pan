import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Avatar } from "@/components/avatar";
import { sectionLabels } from "@/lib/sections";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="border-border border-b sticky top-0 bg-background z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
          <img src="/4pan-banner.png" alt="4pan" className="h-8 sm:h-10 w-auto" />
          <span className="font-bold text-xl sm:text-2xl tracking-tight text-foreground">4pan</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/nuevo">
            <Button variant="default" size="sm" className="text-xs sm:text-sm sm:h-9">
              + Nuevo
            </Button>
          </Link>
          {session?.user ? (
            <>
              <Link href="/perfil">
                <Avatar
                  src={session.user.image}
                  name={session.user.name}
                  size="sm"
                />
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm sm:h-9">
                Iniciar sesión
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
