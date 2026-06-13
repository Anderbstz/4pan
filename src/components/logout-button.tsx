"use client";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" size="lg" className="text-base">
        Cerrar sesión
      </Button>
    </form>
  );
}
