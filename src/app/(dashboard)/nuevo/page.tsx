import { Navbar } from "@/components/navbar";
import { auth } from "@/lib/auth";
import { NewPostForm } from "./form";

export default async function NewPostPage() {
  const session = await auth();

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <h1 className="text-xl font-bold mb-1">Nueva publicación</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Límite de 5 publicaciones anónimas por IP por día. Si querés publicar con tu nombre, iniciá sesión.
        </p>
        <NewPostForm session={session} />
      </main>
    </>
  );
}
