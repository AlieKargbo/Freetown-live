import {
  changeNeed,
  type NeedName,
  type SimNeeds,
} from "./needs";

export type NeedAction =
  | "eat"
  | "snack"
  | "sleep"
  | "nap"
  | "shower"
  | "toilet"
  | "chat"
  | "call_friend"
  | "play_game"
  | "dance";

const ACTION_EFFECTS: Record<
  NeedAction,
  Partial<Record<NeedName, number>>
> = {
  eat:         { hunger: 65, fun: 5 },
  snack:       { hunger: 25 },
  sleep:       { energy: 100 },
  nap:         { energy: 30 },
  shower:      { hygiene: 85 },
  toilet:      { bladder: 100 },
  chat:        { social: 20, fun: 3 },
  call_friend: { social: 12 },
  play_game:   { fun: 25, energy: -5 },
  dance:       { fun: 20, social: 8, energy: -10, hygiene: -5 },
};

export function performNeedAction(
  needs: SimNeeds,
  action: NeedAction,
): SimNeeds {
  const next = { ...needs };
  const effects = ACTION_EFFECTS[action];

  for (const [key, amount] of Object.entries(effects)) {
    next[key as NeedName] = Math.max(
      0,
      Math.min(100, next[key as NeedName] + amount!),
    );
  }

  return next;
}