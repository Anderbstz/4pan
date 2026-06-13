"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ResetState = { error?: string; success?: boolean } | undefined;

export async function sendResetEmail(
  _prevState: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const email = formData.get("email") as string;
  if (!email) return { error: "Ingresá tu email" };

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal whether the email exists — return generic success
    return { success: true };
  }

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({ where: { email } });

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.passwordResetToken.create({
    data: { email, token, expiresAt },
  });

  // Send email via Resend
  const resetUrl = `${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "noreply@migaforos.com",
      to: email,
      subject: "Restablecé tu contraseña en Migaforos",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#2E1C50;">Restablecé tu contraseña</h2>
          <p>Hacé clic en el siguiente enlace para crear una nueva contraseña. Este enlace es válido por 1 hora.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#2E1C50;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">
            Restablecer contraseña
          </a>
          <p style="color:#666;font-size:14px;">Si no solicitaste este cambio, ignorá este mensaje.</p>
        </div>
      `,
    });
  } catch {
    return { error: "Error al enviar el email. Intentá de nuevo." };
  }

  return { success: true };
}

export async function resetPassword(
  _prevState: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token || !password) return { error: "Faltan datos" };
  if (password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres" };

  // Find valid token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) return { error: "Token inválido" };
  if (resetToken.usedAt) return { error: "Este enlace ya fue usado" };
  if (resetToken.expiresAt < new Date()) return { error: "Este enlace expiró. Solicitá uno nuevo." };

  // Hash new password
  const passwordHash = await bcrypt.hash(password, 10);

  // Update user password
  await prisma.user.update({
    where: { email: resetToken.email },
    data: { passwordHash },
  });

  // Mark token as used
  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { usedAt: new Date() },
  });

  return { success: true };
}
