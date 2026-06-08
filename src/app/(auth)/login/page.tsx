import { LoginForm } from "./form";

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-1">Iniciar sesión</h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Bienvenido de vuelta a Migaforos
        </p>
        <LoginForm />
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tenés cuenta?{" "}
          <a href="/register" className="underline hover:text-black">
            Registrate
          </a>
        </p>
      </div>
    </main>
  );
}
