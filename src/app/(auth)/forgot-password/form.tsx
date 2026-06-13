"use client";

import { useActionState } from "react";
import { sendResetEmail } from "@/actions/reset-password";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(sendResetEmail, undefined);

  if (state?.success) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Si existe una cuenta con ese email, vas a recibir un link para restablecer tu contraseña.
        </p>
        <Link
          href="/login"
          className="text-sm text-primary underline hover:text-primary/80"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="text-sm text-destructive-foreground bg-destructive/10 px-3 py-2 rounded">
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando..." : "Enviar link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="underline hover:text-primary">
          Volver
        </Link>
      </p>
    </form>
  );
}
