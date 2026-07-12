"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createPost, type CreatePostState } from "@/actions/posts";
import { createPostSchema, type CreatePostInput } from "@/lib/schemas";
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

const sections = Object.entries(sectionLabels).map(([value, label]) => ({ value, label }));

export function NewPostForm({
  session: _session,
}: {
  session: unknown;
}) {
  const isLoggedIn = !!_session;
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [anonymous, setAnonymous] = useState(!isLoggedIn);
  const [state, formAction, pending] = useActionState<CreatePostState, FormData>(
    createPost, undefined,
  );
  const { register, handleSubmit, control, formState: { errors } } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Publicación creada");
      const t = setTimeout(() => { router.push("/"); router.refresh(); }, 800);
      return () => clearTimeout(t);
    }
    if (state?.error) toast.error(state.error);
  }, [state, router]);

  function onSubmit(data: CreatePostInput) {
    const formData = new FormData();
    formData.set("title", data.title);
    formData.set("content", data.content);
    formData.set("section", data.section);
    if (data.isAnonymous || !isLoggedIn) {
      formData.set("isAnonymous", "true");
    }
    formAction(formData);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {state?.error && (
        <p className="text-sm text-destructive-foreground bg-destructive/10 px-3 py-2 rounded">
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" type="text" maxLength={50} {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="section">Sección</Label>
        <Controller
          name="section"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
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
          )}
        />
        {errors.section && <p className="text-xs text-destructive">{errors.section.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido</Label>
        <Textarea id="content" rows={8} {...register("content")} />
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
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
