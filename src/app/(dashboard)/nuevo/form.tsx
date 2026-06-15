"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { createPost, type CreatePostState } from "@/actions/posts";
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

type Errors = {
  title?: string;
  section?: string;
  content?: string;
};

function validate(formData: FormData): Errors {
  const errors: Errors = {};
  const title = (formData.get("title") as string)?.trim();
  const section = formData.get("section") as string;
  const content = (formData.get("content") as string)?.trim();

  if (!title) errors.title = "El título es obligatorio";
  else if (title.length > 200) errors.title = "El título no puede superar los 200 caracteres";

  if (!section) errors.section = "Seleccioná una sección";

  if (!content) errors.content = "El contenido es obligatorio";
  else if (content.length < 10) errors.content = "El contenido debe tener al menos 10 caracteres";

  return errors;
}

export function NewPostForm({
  session: _session,
}: {
  session: unknown;
}) {
  const isLoggedIn = !!_session;
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [anonymous, setAnonymous] = useState(!isLoggedIn);
  const [errors, setErrors] = useState<Errors>({});
  const [state, formAction, pending] = useActionState<CreatePostState, FormData>(
    createPost, undefined,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Publicación creada");
      const t = setTimeout(() => { router.push("/"); router.refresh(); }, 800);
      return () => clearTimeout(t);
    }
    if (state?.error) toast.error(state.error);
  }, [state, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const v = validate(data);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      toast.error("Completá todos los campos correctamente");
      return;
    }
    // Use the form action directly
    const formData = new FormData(form);
    formAction(formData);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
      {state?.error && (
        <p className="text-sm text-destructive-foreground bg-destructive/10 px-3 py-2 rounded">
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" type="text" maxLength={200} />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="section">Sección</Label>
        <Select name="section">
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
        {errors.section && <p className="text-xs text-destructive">{errors.section}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido</Label>
        <Textarea id="content" name="content" rows={8} />
        {errors.content && <p className="text-xs text-destructive">{errors.content}</p>}
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
        {!isLoggedIn && <input type="hidden" name="isAnonymous" value="true" />}
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
