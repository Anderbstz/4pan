"use client";

import { useActionState, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type LoginState = { error?: string; success?: boolean } | undefined;
type Errors = { email?: string; password?: string };
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(formData: FormData): Errors {
  const e: Errors = {};
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  if (!email) e.email = "El email es obligatorio";
  else if (!emailRegex.test(email)) e.email = "Ingresá un email válido";
  if (!password) e.password = "La contraseña es obligatoria";
  else if (password.length < 6) e.password = "La contraseña debe tener al menos 6 caracteres";
  return e;
}

async function loginUser(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const result = await signIn("credentials", {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    redirect: false,
  });
  if (result?.error) return { error: "Email o contraseña incorrectos" };
  return { success: true };
}

export function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    async (prev, formData) => {
      const v = validate(formData);
      setErrors(v);
      if (Object.keys(v).length > 0) return prev;
      return loginUser(prev, formData);
    },
    undefined,
  );

  useEffect(() => {
    if (state?.success) { router.push("/"); router.refresh(); }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state?.error && (
        <p className="text-sm text-destructive-foreground bg-destructive/10 px-3 py-2 rounded">{state.error}</p>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
        {errors.email && <p className="text-xs text-destructive-foreground">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <a href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary underline">Olvidé mi contraseña</a>
        </div>
        <Input id="password" name="password" type="password" />
        {errors.password && <p className="text-xs text-destructive-foreground">{errors.password}</p>}
      </div>
      <Button type="submit" disabled={pending} className="w-full">{pending ? "Iniciando sesión..." : "Iniciar sesión"}</Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">o continuá con</span></div>
      </div>
      <Button type="button" variant="outline" className="w-full" onClick={() => signIn("google", { redirectTo: "/" })}>
        <svg className="size-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </Button>
    </form>
  );
}
