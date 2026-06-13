"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";

export type RegisterState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const displayName = formData.get("displayName") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !username || !password) {
    return { error: "Email, usuario y contraseña son obligatorios" };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres" };
  }
  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden" };
  }
  if (username.length < 3) {
    return { error: "El usuario debe tener al menos 3 caracteres" };
  }

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
