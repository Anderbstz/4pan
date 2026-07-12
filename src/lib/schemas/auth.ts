import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Ingresá un email válido"),
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  displayName: z.string().optional(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Repetí la contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Ingresá un email válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginInput = z.infer<typeof loginSchema>;
