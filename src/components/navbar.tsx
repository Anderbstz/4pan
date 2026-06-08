import { auth, signOut } from "@/lib/auth";
import Link from "next/link";

const sectionLabels: Record<string, string> = {
  POESIA: "Poesía",
  CARTAS_NO_ENVIADAS: "Cartas no enviadas",
  CONFESIONES: "Confesiones",
  MICRORRELATOS: "Microrrelatos",
  DESAHOGO: "Desahogo",
};

export async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          migaforos
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {session?.user ? (
            <>
              <Link
                href="/nuevo"
                className="bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800"
              >
                Nuevo post
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button type="submit" className="text-gray-500 hover:text-black">
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-gray-500 hover:text-black">
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export { sectionLabels };
