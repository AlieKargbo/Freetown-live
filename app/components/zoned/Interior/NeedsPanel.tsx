"use client";

import type { SimNeeds, NeedName } from "@/app/Game/needs";

export const NEED_INFO: {
  key: NeedName;
  label: string;
  emoji: string;
  color: string;
}[] = [
  { key: "hunger", label: "Hunger", emoji: "🍲", color: "#ff8500" },
  { key: "energy", label: "Energy", emoji: "⚡", color: "#3478f6" },
  { key: "fun", label: "Fun", emoji: "🎉", color: "#ffbd00" },
  { key: "social", label: "Social", emoji: "💬", color: "#f52f98" },
  { key: "hygiene", label: "Hygiene", emoji: "🫧", color: "#00bba5" },
  { key: "bladder", label: "Bladder", emoji: "🚽", color: "#9b87dc" },
];

export default function NeedsPanel({
  needs,
}: {
  needs: SimNeeds;
}) {
  return (
    <div className="space-y-5">
      {NEED_INFO.map((item) => {
        const value = Math.round(needs[item.key]);

        return (
          <div key={item.key} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                {item.emoji}
              </div>

              <span className="flex-1 font-semibold text-slate-800">
                {item.label}
              </span>

              <span className="text-sm font-semibold text-slate-500">
                {value}%
              </span>
            </div>

            <div
              className="ml-15 h-2.5 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label={item.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={value}
            >
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${value}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
