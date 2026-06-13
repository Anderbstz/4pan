import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ForgotPasswordForm } from "./form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Recuperar contraseña</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Te vamos a enviar un link para restablecerla
          </p>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </main>
  );
}
