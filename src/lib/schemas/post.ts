import { z } from "zod";
import { SECTION_VALUES } from "@/lib/sections";

export const createPostSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(50, "El título no puede superar los 50 caracteres"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres").max(7500, "El contenido no puede superar los 7500 caracteres"),
  section: z.enum(SECTION_VALUES, "Seleccioná una sección válida"),
  isAnonymous: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
