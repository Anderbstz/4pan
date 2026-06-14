"use client";

import { useState, useRef, useEffect } from "react";
import { toggleReaction } from "@/actions/reactions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOptimistic, startTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const QUICK_EMOJIS = [
  "❤️", "🔥", "😢", "🤯", "🕯️", "💔",
  "💜", "✨", "🫂", "🥺", "😭", "💀",
  "👏", "🌟", "💕", "🌈",
];

const PICKER_EMOJIS = [
  "😀","😃","😄","😁","😅","😂","🤣","😊","😇","🙂","😉","😌","😍","🥰","😘","😗",
  "😋","😛","😜","🤪","😝","🤑","🤗","🤭","🫢","🫣","🤫","🤔","🤐","🤨","😐","😑",
  "😶","🫥","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢",
  "🤮","🥴","😵","🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","🫤","😟","🙁","😮","😯",
  "😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩",
  "😫","🥱","😤","😡","😠","🤬","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾",
  "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖",
  "👍","👎","👊","✊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✌️","🤞","🫰","🤟",
  "🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍🏻","👍🏼","👍🏽","👍🏾","👍🏿",
  "⭐","🌟","✨","🔥","💯","🎉","🎊","🥳","💪","🫡","🫠","🥹","🫣","🫤","🥸","🫢",
];

type ReactionCounts = { emoji: string; count: number }[];

export function ReactionButtons({
  postId,
  initialReactions,
  userReactions,
}: {
  postId: string;
  initialReactions: ReactionCounts;
  userReactions: string[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const [optimisticReactions, addOptimistic] = useOptimistic(
    initialReactions,
    (state, emoji: string) => {
      const existing = state.find((r) => r.emoji === emoji);
      if (existing) {
        const newCount = existing.count - 1;
        if (newCount <= 0) return state.filter((r) => r.emoji !== emoji);
        return state.map((r) => r.emoji === emoji ? { ...r, count: newCount } : r);
      }
      return [...state, { emoji, count: 1 }];
    },
  );
  const [optimisticUser, addOptimisticUser] = useOptimistic(
    userReactions,
    (state, emoji: string) => {
      if (state.includes(emoji)) return state.filter((e) => e !== emoji);
      return [...state, emoji];
    },
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleReact(emoji: string) {
    if (!session?.user) { router.push("/login"); return; }
    setShowPicker(false);
    startTransition(() => { addOptimistic(emoji); addOptimisticUser(emoji); });
    await toggleReaction(postId, emoji);
    router.refresh();
  }

  return (
    <div className="relative">
      <div className="flex gap-2 flex-wrap max-w-lg">
        {QUICK_EMOJIS.map((emoji) => {
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

        {/* + button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPicker(!showPicker)}
          className="px-2.5"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Emoji picker dropdown */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute left-0 top-full mt-2 z-50 bg-card border border-border rounded-xl shadow-lg p-2 w-[320px] max-h-[240px] overflow-y-auto"
        >
          <div className="grid grid-cols-8 gap-1">
            {PICKER_EMOJIS.map((emoji) => {
              const isActive = optimisticUser.includes(emoji);
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleReact(emoji)}
                  className={`text-lg p-1 rounded-md hover:bg-muted transition-colors ${
                    isActive ? "bg-primary/10 ring-1 ring-primary" : ""
                  }`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
