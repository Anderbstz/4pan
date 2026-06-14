"use client";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" size="sm" className="text-xs sm:text-sm sm:h-9">
        <span className="hidden sm:inline">Cerrar sesión</span>
        <span className="sm:hidden">Salir</span>
      </Button>
    </form>
  );
}
