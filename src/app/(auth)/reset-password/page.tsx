import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResetPasswordForm } from "./form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Link inválido. Solicitá uno nuevo.
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Nueva contraseña</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Elegí una contraseña nueva para tu cuenta
          </p>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} />
        </CardContent>
      </Card>
    </main>
  );
}
