"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const sizes = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-28 text-3xl",
} as const;

export function Avatar({
  src,
  name = "?",
  size = "md",
  className,
}: {
  src?: string | null;
  name?: string | null;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const [cacheBuster, setCacheBuster] = useState("0");
  useEffect(() => { setCacheBuster(Date.now().toString()); }, [src]);
  const imgSrc = src
    ? `${src}${src.includes("?") ? "&" : "?"}t=${cacheBuster}`
    : "/tuntun_sahur.jpg";
  const displayName = name ?? "?";

  if (broken) {
    return (
      <div
        className={cn(
          "rounded-full overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center font-bold text-primary",
          sizes[size],
          className,
        )}
      >
        {getInitials(displayName)}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden shrink-0",
        sizes[size],
        className,
      )}
    >
      <img
        src={imgSrc}
        alt={displayName}
        className="size-full object-cover"
        onError={() => setBroken(true)}
      />
    </div>
  );
}
