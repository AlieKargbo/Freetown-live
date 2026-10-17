import type { NeedName, SimNeeds } from "./needs";
import type { SkillName } from './skills';

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
  | "play_sport"
  | "dance";

export type NeedActivity = {
  action: NeedAction;
  elapsedMinutes: number;
  durationMinutes: number;
  targetPlayerName?: string;
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
  | "pitch"
  | "person";

export const ACTIVITY_CONTEXTS: Partial<Record<NeedActivityContext, NeedAction>> = {
  bed: "sleep",
  sofa: "nap",
  shower: "shower",
  toilet: "toilet",
  stage: "dance",
  pitch: "play_sport",
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
  play_sport: 45,
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
  toilet:      { bladder: -100 },
  chat:        { social: 20, fun: 3 },
  call_friend: { social: 12 },
  play_game:   { fun: 25, energy: -5 },
  play_sport:  { fun: 30, social: 20, energy: -15, hygiene: -5 },
  dance:       { fun: 20, social: 8, energy: -10, hygiene: -5 },
};

export function performNeedAction(
  needs: SimNeeds,
  action: NeedAction,
  skillLevels: Partial<Record<SkillName, number>> = {},
): SimNeeds {
  const next = { ...needs };
  const effects = ACTION_EFFECTS[action];

  for (const [key, amount] of Object.entries(effects)) {
    next[key as NeedName] = Math.max(
      0,
      Math.min(100, next[key as NeedName] + amount!),
    );
  }

  const cookingLevel = skillLevels.cooking ?? 0;
  const fitnessLevel = skillLevels.fitness ?? 0;
  const musicLevel = skillLevels.music ?? 0;
  const socialLevel = skillLevels.social ?? 0;
  if ((action === 'eat' || action === 'snack') && cookingLevel >= 2) {
    next.hunger = Math.min(100, next.hunger + 10);
  }
  if (action === 'dance') {
    if (fitnessLevel >= 2) next.energy = Math.min(100, next.energy + 5);
    if (musicLevel >= 2) next.fun = Math.min(100, next.fun + 8);
  }
  if (action === 'chat' && socialLevel >= 2) {
    next.social = Math.min(100, next.social + 8);
  }

  return next;
}
