import type { NeedName, SimNeeds } from "./needs";

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

export type NeedActivity = {
  action: NeedAction;
  elapsedMinutes: number;
  durationMinutes: number;
};

export type NeedActivityContext =
  | "bed"
  | "sofa"
  | "table"
  | "counter"
  | "shower"
  | "toilet"
  | "tv"
  | "stage"
  | "person";

export const ACTIVITY_CONTEXTS: Record<NeedActivityContext, NeedAction> = {
  bed: "sleep",
  sofa: "nap",
  table: "eat",
  counter: "snack",
  shower: "shower",
  toilet: "toilet",
  tv: "play_game",
  stage: "dance",
  person: "chat",
};

export const ACTIVITY_DURATIONS_MINUTES: Record<NeedAction, number> = {
  eat: 10,
  snack: 5,
  sleep: 480,
  nap: 20,
  shower: 15,
  toilet: 5,
  chat: 10,
  call_friend: 8,
  play_game: 30,
  dance: 20,
};

const ACTION_EFFECTS: Record<
  NeedAction,
  Partial<Record<NeedName, number>>
> = {
  eat:         { hunger: 65, fun: 5 },
  snack:       { hunger: 25 },
  // Sleep and naps restore energy gradually in advanceNeeds while the activity runs.
  sleep:       {},
  nap:         {},
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
