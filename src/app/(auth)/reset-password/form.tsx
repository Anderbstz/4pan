"use client";

import { useActionState } from "react";
import { resetPassword } from "@/actions/reset-password";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, undefined);

  if (state?.success) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Contraseña actualizada correctamente. Ya podés iniciar sesión con tu nueva contraseña.
        </p>
        <Link
          href="/login"
          className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      {state?.error && (
        <p className="text-sm text-destructive-foreground bg-destructive/10 px-3 py-2 rounded">
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Nueva contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Guardando..." : "Guardar contraseña"}
      </Button>
    </form>
  );
}
