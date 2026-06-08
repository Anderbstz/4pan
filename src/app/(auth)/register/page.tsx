import { RegisterForm } from "./form";

export default function RegisterPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-1">Crear cuenta</h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Unite a Migaforos para compartir lo que sentís
        </p>
        <RegisterForm />
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta?{" "}
          <a href="/login" className="underline hover:text-black">
            Iniciá sesión
          </a>
        </p>
      </div>
    </main>
  );
}
