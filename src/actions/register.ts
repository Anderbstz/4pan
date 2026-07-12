"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { registerSchema } from "@/lib/schemas";

export type RegisterState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { error: firstError };
  }
  const { email, username, displayName, password } = parsed.data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
  if (existingUser) {
    if (existingUser.email === email) {
      return { error: "Ya existe una cuenta con ese email" };
    }
    return { error: "Ese nombre de usuario ya está en uso" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      username,
      displayName: displayName || username,
      image: "/tuntun_sahur.jpg",
      passwordHash,
      emailVerified: new Date(),
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  return { success: true };
}
