"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOptimistic, startTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleCommentLike } from "@/actions/comments";

type OptimisticState = { liked: boolean; count: number };

export function CommentLikeButton({
  commentId,
  initialLiked,
  initialCount,
}: {
  commentId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [optimistic, addOptimistic] = useOptimistic<OptimisticState, void>(
    { liked: initialLiked, count: initialCount },
    (state, _action: void) => ({
      liked: !state.liked,
      count: state.liked ? state.count - 1 : state.count + 1,
    }),
  );

  async function handleLike() {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    startTransition(() => addOptimistic(undefined));
    await toggleCommentLike(commentId);
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      className={cn(
        "inline-flex items-center gap-1 text-xs transition-colors",
        optimistic.liked
          ? "text-primary"
          : "text-muted-foreground hover:text-primary",
      )}
    >
      <Heart className={cn("size-3", optimistic.liked && "fill-current")} />
      {optimistic.count > 0 && <span>{optimistic.count}</span>}
    </button>
  );
}
