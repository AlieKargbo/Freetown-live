import { BUY_ITEMS } from './storeCatalog';
import { SKILL_LEVEL_THRESHOLDS } from './skills';

export type DreamProgress = {
  careerTasksCompleted: number;
  lifetimeCareerEarnings: number;
  friendshipPoints: Record<string, number>;
  nightlifeChoices: number;
  startupFunded: boolean;
  completed: boolean;
};

export const INITIAL_DREAM_PROGRESS: DreamProgress = {
  careerTasksCompleted: 0,
  lifetimeCareerEarnings: 0,
  friendshipPoints: {},
  nightlifeChoices: 0,
  startupFunded: false,
  completed: false,
};

export type DreamObjective = {
  label: string;
  value: number;
  target: number;
  complete: boolean;
};

type DreamState = {
  dream: string | null;
  progress: DreamProgress;
  hasCafeJob: boolean;
  money: number;
  purchases: Record<string, number>;
  skills: Partial<Record<'music' | 'hustle', number>>;
};

export function getDreamObjectives(state: DreamState): DreamObjective[] {
  const { dream, progress, hasCafeJob, money, purchases, skills } = state;
  if (!dream) return [];

  if (dream === 'Big Arlehjor') {
    return [
      { label: 'Choose the cafe career', value: hasCafeJob ? 1 : 0, target: 1, complete: hasCafeJob },
      { label: 'Reach career level 10 by completing shifts', value: Math.min(progress.careerTasksCompleted, 30), target: 30, complete: progress.careerTasksCompleted >= 30 },
    ];
  }

  if (dream === 'Freetong Landlord') {
    const assetValue = BUY_ITEMS.reduce((sum, item) => sum + item.price * (purchases[item.id] ?? 0), 0);
    return [
      { label: 'Earn SLE 1,000,000 from work', value: Math.min(progress.lifetimeCareerEarnings, 1_000_000), target: 1_000_000, complete: progress.lifetimeCareerEarnings >= 1_000_000 },
      { label: 'Keep your net worth at SLE 1,000,000', value: Math.min(money + assetValue, 1_000_000), target: 1_000_000, complete: money + assetValue >= 1_000_000 },
    ];
  }

  if (dream === 'Kriofusion Star') {
    const musicXp = skills.music ?? 0;
    const target = SKILL_LEVEL_THRESHOLDS[10];
    return [{ label: 'Reach Music level 10 by dancing', value: Math.min(musicXp, target), target, complete: musicXp >= target }];
  }

  if (dream === 'All Man Sabi Mi') {
    const bestFriends = Object.values(progress.friendshipPoints).filter((points) => points >= 5).length;
    return [{ label: 'Become best friends with 4 players (5 chats each)', value: Math.min(bestFriends, 4), target: 4, complete: bestFriends >= 4 }];
  }

  if (dream === 'Tech Unicorn') {
    const hustleXp = skills.hustle ?? 0;
    return [
      { label: 'Build Hustle to level 5', value: Math.min(hustleXp, SKILL_LEVEL_THRESHOLDS[5]), target: SKILL_LEVEL_THRESHOLDS[5], complete: hustleXp >= SKILL_LEVEL_THRESHOLDS[5] },
      { label: 'Choose to invest SLE 100,000 in your startup pitch', value: progress.startupFunded ? 1 : 0, target: 1, complete: progress.startupFunded },
    ];
  }

  if (dream === 'Alaki') {
    return [{ label: 'Choose nightlife over work 25 times', value: Math.min(progress.nightlifeChoices, 25), target: 25, complete: progress.nightlifeChoices >= 25 }];
  }

  return [];
}

export function isDreamComplete(state: DreamState): boolean {
  const objectives = getDreamObjectives(state);
  return state.progress.completed || (objectives.length > 0 && objectives.every((objective) => objective.complete));
}

export function canFundStartup(state: DreamState): boolean {
  return state.dream === 'Tech Unicorn'
    && !state.progress.startupFunded
    && (state.skills.hustle ?? 0) >= SKILL_LEVEL_THRESHOLDS[5]
    && state.money >= 100_000;
}
