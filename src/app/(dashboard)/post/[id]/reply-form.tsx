"use client";

import { useActionState, useState } from "react";
import { createComment } from "@/actions/comments";
import { Button } from "@/components/ui/button";

export function ReplyForm({
  postId,
  parentId,
}: {
  postId: string;
  parentId: string;
}) {
  const [open, setOpen] = useState(false);

  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      formData.set("postId", postId);
      formData.set("parentId", parentId);
      const result = await createComment(formData);
      if (result?.success) setOpen(false);
      return result;
    },
    undefined,
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        Responder
      </button>
    );
  }

  return (
    <form action={formAction} className="flex gap-2 mt-2">
      <input
        name="content"
        placeholder="Escribí una respuesta..."
        required
        maxLength={1000}
        className="flex-1 border border-border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-ring/50"
      />
      <Button type="submit" disabled={pending} size="xs">
        {pending ? "..." : "Enviar"}
      </Button>
      {state?.error && (
        <p className="text-xs text-destructive-foreground">{state.error}</p>
      )}
    </form>
  );
}
