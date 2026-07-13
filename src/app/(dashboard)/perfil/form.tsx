"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { updateDisplayName, type ProfileState } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ProfileForm({ displayName }: { displayName: string }) {
  const router = useRouter();
  const { update } = useSession();
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(
    updateDisplayName, undefined
  );
  const handledRef = useRef<string | null>(null);

  // Reset cuando arranca una nueva submission
  useEffect(() => {
    if (pending) handledRef.current = null;
  }, [pending]);

  // Toast único por estado + refresh de sesión y de la página
  useEffect(() => {
    if (!state?.success && !state?.error) return;
    const key = state.success ? `ok:${state.displayName ?? ""}` : state.error ?? null;
    if (handledRef.current === key) return;
    handledRef.current = key;

    if (state.success) {
      toast.success("Nombre actualizado");
      if (state.displayName) {
        update({ name: state.displayName }); // refresca el JWT → Navbar se actualiza
        router.refresh();                     // re-render del server component
      }
    }
    if (state.error) toast.error(state.error);
  }, [state, pending, router, update]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Nombre público</Label>
        <Input
          id="displayName"
          name="displayName"
          defaultValue={displayName}
          required
          maxLength={50}
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
