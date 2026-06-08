"use client";

import { useActionState } from "react";
import { createComment } from "@/actions/comments";

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
      <input
        name="content"
        placeholder="Escribí un comentario..."
        required
        maxLength={1000}
        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 shrink-0"
      >
        {pending ? "Enviando..." : "Enviar"}
      </button>
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}
