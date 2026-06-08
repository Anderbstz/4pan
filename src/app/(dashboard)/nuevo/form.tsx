"use client";

import { useActionState, useEffect } from "react";
import { createPost } from "@/actions/posts";
import { Section } from "@/generated/prisma/client";
import { sectionLabels } from "@/components/navbar";
import { useRouter } from "next/navigation";

const sections = Object.values(Section) as Section[];

export function NewPostForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createPost, undefined);

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
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Título
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      <div>
        <label htmlFor="section" className="block text-sm font-medium mb-1">
          Sección
        </label>
        <select
          id="section"
          name="section"
          required
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
        >
          <option value="">Seleccioná una sección</option>
          {sections.map((s) => (
            <option key={s} value={s}>
              {sectionLabels[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Contenido
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={8}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-y"
        />
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          name="isAnonymous"
          value="true"
          className="rounded border-gray-300"
        />
        Publicar como anónimo
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {pending ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}
