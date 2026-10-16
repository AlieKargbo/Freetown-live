export type NeedName =
  | "hunger"
  | "energy"
  | "fun"
  | "social"
  | "hygiene"
  | "bladder";

export type SimNeeds = Record<NeedName, number>;

export const INITIAL_NEEDS: SimNeeds = {
  hunger: 100,
  energy: 100,
  fun: 100,
  social: 100,
  hygiene: 100,
  bladder: 100,
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
  return Math.max(0, Math.min(100, value));
}

export function changeNeed(
  needs: SimNeeds,
  need: NeedName,
  amount: number,
): SimNeeds {
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
    next[need] = clampNeed(
      next[need] -
        NEED_DECAY_PER_MINUTE[need] * elapsedMinutes,
    );
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