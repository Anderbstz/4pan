"use client";

import { useActionState } from "react";
import { createComment } from "@/actions/comments";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CommentForm({ postId }: { postId: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      formData.set("postId", postId);
      return createComment(formData);
    },
    undefined,
  );

  return (
    <form action={formAction} className="flex gap-2">
      <Input
        name="content"
        placeholder="Escribí un comentario..."
        required
        maxLength={1000}
        className="flex-1"
      />
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Enviando..." : "Enviar"}
      </Button>
      {state?.error && (
        <p className="text-sm text-destructive-foreground">{state.error}</p>
      )}
    </form>
  );
}
