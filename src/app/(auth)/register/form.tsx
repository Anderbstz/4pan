"use client";

import { useActionState } from "react";
import { registerUser, type RegisterState } from "@/actions/register";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerUser, undefined as RegisterState);

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
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          minLength={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      <div>
        <label htmlFor="displayName" className="block text-sm font-medium mb-1">
          Nombre público (opcional)
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
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
          minLength={6}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-1"
        >
          Repetir contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {pending ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
