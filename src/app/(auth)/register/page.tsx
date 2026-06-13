import { RegisterForm } from "./form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Crear cuenta</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Unite a Migaforos para compartir lo que sentís
          </p>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿Ya tenés cuenta?{" "}
            <a href="/login" className="underline hover:text-primary">
              Iniciá sesión
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
