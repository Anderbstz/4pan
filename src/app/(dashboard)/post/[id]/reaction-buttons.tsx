"use client";

import { toggleReaction } from "@/actions/reactions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOptimistic, startTransition } from "react";
import { Button } from "@/components/ui/button";

const EMOJIS = [
  "❤️", "🔥", "😢", "🤯", "🕯️", "💔",
  "💜", "✨", "🫂", "🥺", "😭", "💀",
  "👏", "🌟", "💕", "🌈",
];

type Reactions = { emoji: string; count: number }[];

export function ReactionButtons({
  postId,
  initialReactions,
  userReactions,
}: {
  postId: string;
  initialReactions: Reactions;
  userReactions: string[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [optimisticReactions, addOptimistic] = useOptimistic(
    initialReactions,
    (state, emoji: string) => {
      const existing = state.find((r) => r.emoji === emoji);
      if (existing) {
        // Toggle: remove if user already reacted (count goes down)
        const newCount = existing.count - 1;
        if (newCount <= 0) {
          return state.filter((r) => r.emoji !== emoji);
        }
        return state.map((r) =>
          r.emoji === emoji ? { ...r, count: newCount } : r,
        );
      }
      return [...state, { emoji, count: 1 }];
    },
  );
  const [optimisticUser, addOptimisticUser] = useOptimistic(
    userReactions,
    (state, emoji: string) => {
      if (state.includes(emoji)) {
        return state.filter((e) => e !== emoji);
      }
      return [...state, emoji];
    },
  );

  async function handleReact(emoji: string) {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    startTransition(() => {
      addOptimistic(emoji);
      addOptimisticUser(emoji);
    });
    await toggleReaction(postId, emoji);
    router.refresh();
  }

  return (
    <div className="flex gap-2 flex-wrap max-w-lg">
      {EMOJIS.map((emoji) => {
        const reaction = optimisticReactions.find((r) => r.emoji === emoji);
        const isActive = optimisticUser.includes(emoji);
        return (
          <Button
            key={emoji}
            variant={isActive ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleReact(emoji)}
            className="px-2.5"
          >
            <span className="text-base leading-none">{emoji}</span>
            {reaction && reaction.count > 0 && (
              <span className="text-xs text-muted-foreground ml-1">{reaction.count}</span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
