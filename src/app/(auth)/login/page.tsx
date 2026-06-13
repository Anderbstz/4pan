import { LoginForm } from "./form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Iniciar sesión</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Bienvenido de vuelta a Migaforos
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tenés cuenta?{" "}
            <a href="/register" className="underline hover:text-primary">
              Registrate
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
