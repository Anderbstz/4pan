"use client";

import { useActionState, useEffect, useState } from "react";
import { createPost } from "@/actions/posts";
import { sectionLabels } from "@/lib/sections";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const SECTION_VALUES = [
  "POESIA",
  "CARTAS_NO_ENVIADAS",
  "CONFESIONES",
  "MICRORRELATOS",
  "DESAHOGO",
] as const;

const sections = SECTION_VALUES.map((s) => ({ value: s, label: sectionLabels[s] }));

export function NewPostForm({
  session: _session,
}: {
  session: unknown;
}) {
  const isLoggedIn = !!_session;
  const router = useRouter();
  const [anonymous, setAnonymous] = useState(!isLoggedIn);
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
        <p className="text-sm text-destructive-foreground bg-destructive/10 px-3 py-2 rounded">
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" type="text" required maxLength={200} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="section">Sección</Label>
        <Select name="section" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccioná una sección" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido</Label>
        <Textarea id="content" name="content" required rows={8} />
      </div>

      <Label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          name="isAnonymous"
          value="true"
          checked={anonymous}
          disabled={!isLoggedIn}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="rounded border-border"
        />
        {isLoggedIn
          ? "Publicar como anónimo"
          : "Publicando como anónimo (sin cuenta)"}
      </Label>
      {!isLoggedIn && (
        <p className="text-xs text-muted-foreground -mt-2">
          Si querés publicar con tu nombre,{" "}
          <a href="/login" className="underline hover:text-primary">
            iniciá sesión
          </a>
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Publicando..." : "Publicar"}
      </Button>
    </form>
  );
}
