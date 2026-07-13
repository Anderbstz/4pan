"use client";

import { useSession } from "next-auth/react";
import { Avatar } from "@/components/avatar";
import Link from "next/link";

export function NavbarAvatar() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <Link href="/perfil" className="hover:opacity-90 transition-opacity">
      <Avatar
        src={session.user.image}
        name={session.user.name}
        size="sm"
        className="border border-border size-8 shadow-sm"
      />
    </Link>
  );
}
