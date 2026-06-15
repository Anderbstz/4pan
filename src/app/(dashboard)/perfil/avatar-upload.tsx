"use client";

import { useActionState } from "react";
import { useSession } from "next-auth/react";
import { uploadAvatar, type UploadState } from "@/actions/upload-avatar";
import { toast } from "sonner";
import { useEffect } from "react";

export function AvatarUpload() {
  const { update } = useSession();
  const [state, formAction, pending] = useActionState<UploadState, FormData>(uploadAvatar, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success("Avatar actualizado");
      update({ image: state.url });
    }
    if (state?.error) toast.error(state.error);
  }, [state, update]);

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
