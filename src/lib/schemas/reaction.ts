import { z } from "zod";

export const toggleReactionSchema = z.object({
  postId: z.string().min(1),
  emoji: z.string().max(10, "Emoji inválido"),
});

export type ToggleReactionInput = z.infer<typeof toggleReactionSchema>;
