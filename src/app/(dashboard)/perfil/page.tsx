import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProfileForm } from "./form";
import { getUserProfile } from "@/actions/profile";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await getUserProfile();
  if (!profile) redirect("/login");

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Mi perfil</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Avatar + info */}
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <img
                src={profile.image ?? "/tuntun_sahur.jpg"}
                alt={profile.displayName ?? profile.username ?? "Avatar"}
                className="size-28 rounded-full object-cover border-4 border-border mb-4"
              />
              <h2 className="text-xl font-bold">{profile.displayName ?? profile.username}</h2>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
              <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>

              <div className="flex gap-6 mt-4 text-sm text-muted-foreground">
                <span><strong className="text-foreground">{profile._count.posts}</strong> posts</span>
                <span><strong className="text-foreground">{profile._count.comments}</strong> comentarios</span>
                <span><strong className="text-foreground">{profile._count.reactions}</strong> reacciones</span>
              </div>
            </CardContent>
          </Card>

          {/* Edit form */}
          <Card>
            <CardHeader>
              <CardTitle>Editar perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm displayName={profile.displayName ?? profile.username ?? ""} />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
