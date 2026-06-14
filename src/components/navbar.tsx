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
        <Link href="/" className="flex items-center gap-2">
          <img src="/4pan-banner.png" alt="4pan" className="h-10 w-auto" />
          <span className="font-bold text-2xl tracking-tight text-foreground">4pan</span>
        </Link>

        <nav className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/nuevo">
                <Button variant="default" size="lg" className="text-base">
                  + Nuevo post
                </Button>
              </Link>
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
              <Button variant="ghost" size="lg" className="text-base">
                Iniciar sesión
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
