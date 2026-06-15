"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export type UploadState = { error?: string; success?: boolean } | undefined;

export async function uploadAvatar(
  _prevState: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const file = formData.get("avatar") as File;
  if (!file) return { error: "Seleccioná una imagen" };
  if (file.size > 2 * 1024 * 1024) return { error: "La imagen no puede superar los 2MB" };

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${session.user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: urlData.publicUrl },
  });

  revalidatePath("/perfil");
  return { success: true };
}
