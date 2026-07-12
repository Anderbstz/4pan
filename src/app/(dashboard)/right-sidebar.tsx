import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, BarChart2, Info, MessageSquare, FileText } from "lucide-react";

async function getStats() {
  try {
    const [postCount, commentCount] = await Promise.all([
      prisma.post.count(),
      prisma.comment.count(),
    ]);
    return { postCount, commentCount };
  } catch (error) {
    console.error("Error fetching right sidebar stats:", error);
    return { postCount: 0, commentCount: 0 };
  }
}

export async function RightSidebar() {
  const { postCount, commentCount } = await getStats();

  return (
    <aside className="hidden lg:block w-72 shrink-0 space-y-4">
      {/* Welcome Card */}
      <Card className="border border-border/80 bg-gradient-to-br from-card to-muted/20 shadow-sm hover:shadow transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Info className="size-4" />
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Sobre 4pan 🍞</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            Un rincón seguro y anónimo para expresarte libremente. 
            Compartí tus poemas, cartas no enviadas, confesiones o microrrelatos con total libertad, 
            sin juzgar ni ser juzgado.
          </p>
          <p className="font-medium text-foreground/80">
            Aquí las palabras tienen más peso que los nombres.
          </p>
        </CardContent>
      </Card>

      {/* Rules Card */}
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <ScrollText className="size-4" />
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Reglas de la casa 📜</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-primary">1.</span>
              <span><strong>Sé respetuoso/a:</strong> No toleramos hostigamiento, acoso ni discursos de odio.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary">2.</span>
              <span><strong>Respetá el anonimato:</strong> No compartas datos personales tuyos ni de terceros.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary">3.</span>
              <span><strong>Uso de secciones:</strong> Clasificá tus textos en la sección correcta para mantener el orden.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary">4.</span>
              <span><strong>Leé con empatía:</strong> Recordá que detrás de cada pantalla hay una persona desahogándose.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Community Stats Card */}
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <BarChart2 className="size-4" />
            <CardTitle className="text-sm font-bold uppercase tracking-wider">La Comunidad 📊</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-muted/40 p-2.5 rounded-lg border border-border/40 hover:border-primary/20 hover:bg-muted/65 transition-all">
              <div className="flex justify-center mb-1 text-primary/80">
                <FileText className="size-4" />
              </div>
              <span className="block text-lg font-bold text-foreground">{postCount}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">Publicaciones</span>
            </div>
            <div className="bg-muted/40 p-2.5 rounded-lg border border-border/40 hover:border-primary/20 hover:bg-muted/65 transition-all">
              <div className="flex justify-center mb-1 text-primary/80">
                <MessageSquare className="size-4" />
              </div>
              <span className="block text-lg font-bold text-foreground">{commentCount}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">Comentarios</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

export function RightSidebarSkeleton() {
  return (
    <aside className="hidden lg:block w-72 shrink-0 space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border border-border/60 shadow-none bg-muted/20">
          <CardHeader className="pb-2">
            <div className="h-4 bg-muted w-1/2 rounded" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
            {i === 3 && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="h-12 bg-muted rounded" />
                <div className="h-12 bg-muted rounded" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </aside>
  );
}
