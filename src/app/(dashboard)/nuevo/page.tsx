import { Navbar, sectionLabels } from "@/components/navbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NewPostForm } from "./form";
import { Section } from "@/generated/prisma/client";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <h1 className="text-xl font-bold mb-1">Nueva publicación</h1>
        <p className="text-sm text-gray-500 mb-6">
          Límite de 5 publicaciones por día. Elegí bien lo que querés compartir.
        </p>
        <NewPostForm />
      </main>
    </>
  );
}
