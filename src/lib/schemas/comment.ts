import { z } from "zod";

export const createCommentSchema = z.object({
  postId: z.string().min(1, "Falta el ID del post"),
  content: z.string().min(1, "El comentario no puede estar vacío").max(1000, "El comentario no puede superar los 1000 caracteres"),
  parentId: z.string().nullable().optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
