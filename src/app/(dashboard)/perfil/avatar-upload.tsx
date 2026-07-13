"use client";

import { useActionState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { uploadAvatar, type UploadState } from "@/actions/upload-avatar";
import { toast } from "sonner";

export function AvatarUpload() {
  const { update } = useSession();
  const [state, formAction, pending] = useActionState<UploadState, FormData>(uploadAvatar, undefined);
  const handledRef = useRef<string | null>(null);

  // Resetear cuando arranca una subida nueva
  useEffect(() => {
    if (pending) handledRef.current = null;
  }, [pending]);

  useEffect(() => {
    if (!state?.success && !state?.error) return;
    const key: string | null = state.success ? state.url ?? null : state.error ?? null;
    if (handledRef.current === key) return;

    handledRef.current = key;

    if (state.success) {
      toast.success("Avatar actualizado");
      update({ image: state.url });
    }
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="mt-3">
      <label className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">
        <input
          type="file"
          name="avatar"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              const form = e.target.closest("form");
              if (form) form.requestSubmit();
            }
          }}
        />
        {pending ? "Subiendo..." : "Cambiar foto"}
      </label>
    </form>
  );
}
