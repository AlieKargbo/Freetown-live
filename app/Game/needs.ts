export type NeedName =
  | "hunger"
  | "energy"
  | "fun"
  | "social"
  | "hygiene"
  | "bladder";

export type SimNeeds = Record<NeedName, number>;
export const NEED_NAMES: NeedName[] = ["hunger", "energy", "fun", "social", "hygiene", "bladder"];

export const INITIAL_NEEDS: SimNeeds = {
  hunger: 100,
  energy: 100,
  fun: 100,
  social: 100,
  hygiene: 100,
  bladder: 0,
};

export const NEED_DECAY_PER_MINUTE: SimNeeds = {
  hunger: 0.22,
  energy: 0.12,
  fun: 0.08,
  social: 0.06,
  hygiene: 0.04,
  bladder: 0.16,
};

export function clampNeed(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export function sanitizeNeeds(needs: Partial<SimNeeds>): SimNeeds {
  return Object.fromEntries(NEED_NAMES.map((need) => [need, clampNeed(needs[need] ?? 0)])) as SimNeeds;
}

export function changeNeed(
  needs: SimNeeds,
  need: NeedName,
  amount: number,
): SimNeeds {
  if (!Number.isFinite(amount)) return { ...needs };
  return {
    ...needs,
    [need]: clampNeed(needs[need] + amount),
  };
}

export function advanceNeeds(
  needs: SimNeeds,
  elapsedMinutes: number,
  sleeping = false,
): SimNeeds {
  const next = { ...needs };

  for (const need of Object.keys(next) as NeedName[]) {
    const direction = need === 'bladder' ? 1 : -1;
    next[need] = clampNeed(next[need] + direction * NEED_DECAY_PER_MINUTE[need] * elapsedMinutes);
  }

  // Sleeping restores energy and reduces the rate of other needs.
  if (sleeping) {
    next.energy = clampNeed(
      needs.energy + 1.5 * elapsedMinutes,
    );
    next.hunger = clampNeed(
      needs.hunger - 0.08 * elapsedMinutes,
    );
    next.fun = clampNeed(
      needs.fun + 0.04 * elapsedMinutes,
    );
  }

  return next;
}

export type SimMood = "Miserable" | "Unhappy" | "Uncomfortable" | "Okay" | "Happy";

export function needSatisfaction(needs: SimNeeds, need: NeedName): number {
  return need === 'bladder' ? 100 - needs.bladder : needs[need];
}

export function calculateMood(needs: SimNeeds): SimMood {
  const lowestNeed = Math.min(...NEED_NAMES.map((need) => needSatisfaction(needs, need)));
  if (lowestNeed <= 10) return "Miserable";
  if (lowestNeed <= 25) return "Unhappy";
  if (lowestNeed <= 50) return "Uncomfortable";
  if (lowestNeed <= 75) return "Okay";
  return "Happy";
}
