"use client";

import { useActionState } from "react";
import { updateDisplayName } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ProfileForm({ displayName }: { displayName: string }) {
  const [state, formAction, pending] = useActionState(updateDisplayName, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {state?.success && (
        <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded">
          Nombre actualizado
        </p>
      )}
      {state?.error && (
        <p className="text-sm text-destructive-foreground bg-destructive/10 px-3 py-2 rounded">
          {state.error}
        </p>
      )}

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
