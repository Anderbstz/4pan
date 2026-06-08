"use client";

import { toggleReaction } from "@/actions/reactions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOptimistic, startTransition } from "react";

const EMOJIS = ["❤️", "🔥", "😢", "🤯", "🕯️", "💔"];

type Reactions = { emoji: string; count: number }[];

export function ReactionButtons({
  postId,
  initialReactions,
}: {
  postId: string;
  initialReactions: Reactions;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [optimisticReactions, addOptimistic] = useOptimistic(
    initialReactions,
    (state, emoji: string) => {
      const existing = state.find((r) => r.emoji === emoji);
      if (existing) {
        return state.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1 } : r,
        );
      }
      return [...state, { emoji, count: 1 }];
    },
  );

  async function handleReact(emoji: string) {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    startTransition(() => {
      addOptimistic(emoji);
    });
    await toggleReaction(postId, emoji);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {EMOJIS.map((emoji) => {
        const reaction = optimisticReactions.find((r) => r.emoji === emoji);
        return (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm hover:bg-gray-50 transition-colors"
          >
            <span>{emoji}</span>
            {reaction && reaction.count > 0 && (
              <span className="text-xs text-gray-500">{reaction.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
