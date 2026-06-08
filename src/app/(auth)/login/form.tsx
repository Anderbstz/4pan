"use client";

import { useActionState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

async function loginUser(_prev: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Completá todos los campos" };
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Email o contraseña incorrectos" };
    }

    return { success: true };
  } catch {
    return { error: "Error al iniciar sesión. Intentalo de nuevo." };
  }
}

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginUser, undefined);

  useEffect(() => {
    if (state?.success) {
      router.push("/");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {pending ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
