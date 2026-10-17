import { create } from 'zustand';
import type { BuildingInfo } from './Info';
import type { SimAppearance } from '../Game-setup/CharacterCreator';
import { advanceNeeds, changeNeed, INITIAL_NEEDS, sanitizeNeeds, type NeedName, type SimNeeds } from '@/app/Game/needs';
import { ACTIVITY_CONTEXTS, ACTIVITY_DURATIONS_MINUTES, performNeedAction, type NeedAction, type NeedActivity, type NeedActivityContext } from '@/app/Game/needActions';
import { BUY_ITEMS } from '@/app/Game/storeCatalog';
import { ACTION_SKILL_XP, INITIAL_SKILL_XP, SKILL_NAMES, sanitizeSkillXp, skillLevelForXp, type SkillName, type SkillXp } from '@/app/Game/skills';
import { FOOD_MENU } from '@/app/Game/foodMenu';
import { canFundStartup, getDreamObjectives, INITIAL_DREAM_PROGRESS, type DreamProgress } from '@/app/Game/dreams';

// Shared currency prefix for Sierra Leonean leones.
export const CURRENCY = 'SLE';
export const AUTH_STORAGE_KEY = 'lagos-life-authenticated';
export const PLAYER_USERNAME_STORAGE_KEY = 'freetown-life-player-username';

export type MultiplayerPlayer = {
  id: string;
  name: string;
  appearance: SimAppearance;
  buildingId: string | null;
  position: [number, number];
  target: [number, number] | null;
};

type Chat = { text: string; t: number };
export type DirectMessage = { id: string; from: string; to: string; text: string; sentAt: number };
export type WalletTransfer = { id: string; from: string; to: string; amount: number; sentAt: number };
export type CharacterSetup = { traits: string[]; birthOutcome: string; home: string };
export type TravelTrip = {
  id: string;
  from: BuildingInfo | null;
  to: BuildingInfo;
  ride: string;
  fare: number;
  startedAt: number;
};
export const TRAVEL_DURATION_MS = 2600;

type State = {
  authenticated: boolean;
  playerUsername: string;
  playerPosition: [number, number];
  playerTarget: [number, number] | null;
  remotePlayers: MultiplayerPlayer[];
  multiplayerStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  multiplayerError: string | null;
  needs: SimNeeds;
  activity: NeedActivity | null;
  money: number;
  purchases: Record<string, number>;
  hasCafeJob: boolean;
  isOnCafeShift: boolean;
  cafeShiftTasks: number;
  shiftsCompleted: number;
  firstDayComplete: boolean;
  skills: SkillXp;
  skillGoalRewarded: boolean;
  dream: string | null;
  dreamProgress: DreamProgress;
  characterSetup: CharacterSetup | null;
  contacts: string[];
  messages: DirectMessage[];
  messageNotification: DirectMessage | null;
  walletTransfers: WalletTransfer[];
  player: SimAppearance | null;
  playerHome: BuildingInfo | null;
  popup: BuildingInfo | null; // building whose "enter" popup is open
  interior: BuildingInfo | null; // building the player is currently inside
  currentLocation: BuildingInfo | null;
  travel: TravelTrip | null;
  chat: Chat | null; // last thing the player said (shown as a bubble for a few seconds)
  interactionPromptsHidden: boolean;
};

type Actions = {
  setAuthenticated: (authenticated: boolean) => void;
  setInteractionPromptsHidden: (hidden: boolean) => void;
  setPlayerUsername: (username: string) => void;
  reportPlayerMovement: (position: [number, number], target: [number, number] | null) => void;
  setRemotePlayers: (players: MultiplayerPlayer[]) => void;
  updateRemotePlayer: (player: MultiplayerPlayer) => void;
  removeRemotePlayer: (id: string) => void;
  setMultiplayerStatus: (status: State['multiplayerStatus'], error?: string | null) => void;
  setNeeds: (needs: SimNeeds) => void;
  updateNeed: (need: NeedName, amount: number) => void;
  startActivity: (action: NeedAction, context: NeedActivityContext, targetPlayerName?: string) => boolean;
  cancelActivity: () => void;
  advanceSimulation: (elapsedMinutes: number) => void;
  buyItem: (itemId: string) => boolean;
  buyFood: (foodId: string) => boolean;
  fundStartup: () => boolean;
  acceptCafeJob: () => void;
  startCafeShift: () => boolean;
  completeCafeTask: () => boolean;
  setPlayer: (player: SimAppearance) => void;
  setDream: (dream: string) => void;
  setCharacterSetup: (setup: CharacterSetup) => void;
  addContact: (username: string) => boolean;
  recordMessage: (message: DirectMessage) => void;
  receiveMessage: (message: DirectMessage) => void;
  dismissMessageNotification: () => void;
  receivePayment: (transfer: WalletTransfer) => void;
  sendPayment: (transfer: WalletTransfer) => boolean;
  restorePlayer: (player: SimAppearance) => void;
  setPlayerHome: (home: BuildingInfo) => void;
  openPopup: (info: BuildingInfo) => void;
  closePopup: () => void;
  enter: (info: BuildingInfo, cost?: number) => void;
  travelTo: (info: BuildingInfo, fare: number, ride: string) => boolean;
  completeTravel: (tripId: string) => void;
  exit: () => void;
  say: (text: string) => void;
};

type GameStore = State & Actions;

export type SavedGameProgress = Pick<State,
  'playerUsername' | 'playerPosition' | 'needs' | 'money' | 'purchases' |
  'hasCafeJob' | 'isOnCafeShift' | 'cafeShiftTasks' | 'shiftsCompleted' |
  'firstDayComplete' | 'skills' | 'skillGoalRewarded' | 'dream' | 'dreamProgress' | 'characterSetup' | 'contacts' | 'messages' | 'walletTransfers' | 'player' | 'playerHome' | 'currentLocation' | 'interior'
>;

const CAFE_SHIFT_TASKS = 3;
const CAFE_SHIFT_PAY = 25_000;
const FIRST_DAY_REWARD = 5_000;
const SKILL_GOAL_REWARD = 5_000;

function preserveDreamCompletion(
  state: State,
  progress: DreamProgress,
  updates: Partial<State> = {},
): DreamProgress {
  if (progress.completed || !state.dream) return progress;
  const candidate = { ...state, ...updates, dreamProgress: progress };
  const objectives = getDreamObjectives({
    dream: candidate.dream,
    progress: candidate.dreamProgress,
    hasCafeJob: candidate.hasCafeJob,
    money: candidate.money,
    purchases: candidate.purchases,
    skills: candidate.skills,
  });
  return objectives.length > 0 && objectives.every((objective) => objective.complete)
    ? { ...progress, completed: true }
    : progress;
}

const useGameStore = create<GameStore>()((set, get) => ({
  authenticated: false,
  playerUsername: '',
  playerPosition: [0, 0],
  playerTarget: null,
  remotePlayers: [],
  multiplayerStatus: 'connecting',
  multiplayerError: null,
  needs: INITIAL_NEEDS,
  activity: null,
  money: 1_091_000,
  purchases: {},
  hasCafeJob: false,
  isOnCafeShift: false,
  cafeShiftTasks: 0,
  shiftsCompleted: 0,
  firstDayComplete: false,
  skills: INITIAL_SKILL_XP,
  skillGoalRewarded: false,
  dream: null,
  dreamProgress: INITIAL_DREAM_PROGRESS,
  characterSetup: null,
  contacts: [],
  messages: [],
  messageNotification: null,
  walletTransfers: [],
  player: null,
  playerHome: null,
  popup: null,
  interior: null,
  currentLocation: null,
  travel: null,
  chat: null,
  interactionPromptsHidden: false,
  setAuthenticated: (authenticated) => set({ authenticated }),
  setInteractionPromptsHidden: (interactionPromptsHidden) => set({ interactionPromptsHidden }),
  setPlayerUsername: (playerUsername) => set({ playerUsername }),
  reportPlayerMovement: (playerPosition, playerTarget) => set({ playerPosition, playerTarget }),
  setRemotePlayers: (remotePlayers) => set({ remotePlayers }),
  updateRemotePlayer: (player) => set((state) => ({
    remotePlayers: [
      ...state.remotePlayers.filter((candidate) => candidate.id !== player.id),
      player,
    ],
  })),
  removeRemotePlayer: (id) => set((state) => ({
    remotePlayers: state.remotePlayers.filter((player) => player.id !== id),
  })),
  setMultiplayerStatus: (multiplayerStatus, multiplayerError = null) => set({ multiplayerStatus, multiplayerError }),
  setNeeds: (needs) => set({ needs: sanitizeNeeds(needs) }),
  updateNeed: (need, amount) => set((state) => ({ needs: changeNeed(state.needs, need, amount) })),
  startActivity: (action, context, targetPlayerName) => {
    const state = get();
    const interiorItems = state.interior?.interior.furniture ?? [];
    const validPersonContext = context === 'person'
      && action === 'chat'
      && Boolean(state.interior && ['night-club', 'youth-sport-center'].includes(state.interior.id) && playersIn(state.interior.id) > 1);
    const validFurnitureContext = context !== 'person'
      && ACTIVITY_CONTEXTS[context] === action
      && interiorItems.some((item) => item.type === context);
    const validVenueActivity = action === 'dance'
      ? state.interior?.id === 'night-club'
      : action === 'play_sport'
        ? state.interior?.id === 'youth-sport-center'
        : action === 'eat' || action === 'snack'
          ? false
          : true;
    if (state.activity || !validVenueActivity || (!validPersonContext && !validFurnitureContext)) return false;
    const durationMinutes = action === 'sleep'
      ? Math.max(1, Math.ceil((100 - state.needs.energy) / 1.5))
      : ACTIVITY_DURATIONS_MINUTES[action];
    set({ activity: { action, elapsedMinutes: 0, durationMinutes, ...(action === 'chat' && targetPlayerName ? { targetPlayerName: targetPlayerName.toLowerCase() } : {}) } });
    return true;
  },
  cancelActivity: () => set({ activity: null }),
  advanceSimulation: (elapsedMinutes) => {
    if (!Number.isFinite(elapsedMinutes) || elapsedMinutes <= 0) return;
    const state = get();
    const activity = state.activity;
    const isResting = activity?.action === 'sleep' || activity?.action === 'nap';
    const needs = advanceNeeds(state.needs, elapsedMinutes, isResting);
    if (!activity) {
      set({ needs });
      return;
    }

    const elapsed = Math.min(activity.durationMinutes, activity.elapsedMinutes + elapsedMinutes);
    const finished = elapsed >= activity.durationMinutes || (isResting && needs.energy >= 99.5);
    const skills = { ...state.skills };
    const dreamProgress = { ...state.dreamProgress, friendshipPoints: { ...state.dreamProgress.friendshipPoints } };
    if (finished) {
      for (const [skill, xp] of Object.entries(ACTION_SKILL_XP[activity.action] ?? {})) {
        skills[skill as SkillName] += xp ?? 0;
      }
      if (activity.action === 'chat' && activity.targetPlayerName) {
        dreamProgress.friendshipPoints[activity.targetPlayerName] = (dreamProgress.friendshipPoints[activity.targetPlayerName] ?? 0) + 1;
      }
      if (activity.action === 'dance') dreamProgress.nightlifeChoices += 1;
    }
    const skillLevels = Object.fromEntries(SKILL_NAMES.map((skill) => [skill, skillLevelForXp(skills[skill])])) as Record<SkillName, number>;
    const reachedSkillGoal = SKILL_NAMES.some((skill) => skillLevels[skill] >= 2);
    const rewardSkillGoal = reachedSkillGoal && !state.skillGoalRewarded;
    const nextDreamProgress = preserveDreamCompletion(state, dreamProgress, {
      skills,
      money: state.money + (rewardSkillGoal ? SKILL_GOAL_REWARD : 0),
    });
    set({
      needs: finished && activity.action !== 'sleep' && activity.action !== 'nap'
        ? performNeedAction(needs, activity.action, skillLevels)
        : needs,
      activity: finished ? null : { ...activity, elapsedMinutes: elapsed },
      skills,
      dreamProgress: nextDreamProgress,
      skillGoalRewarded: state.skillGoalRewarded || rewardSkillGoal,
      money: state.money + (rewardSkillGoal ? SKILL_GOAL_REWARD : 0),
    });
  },
  buyItem: (itemId) => {
    const item = BUY_ITEMS.find((candidate) => candidate.id === itemId);
    if (!item) return false;
    const state = get();
    if (state.money < item.price) return false;
    const firstDayComplete = state.shiftsCompleted > 0 && !state.firstDayComplete;
    const purchases = { ...state.purchases, [item.id]: (state.purchases[item.id] ?? 0) + 1 };
    const money = state.money - item.price + (firstDayComplete ? FIRST_DAY_REWARD : 0);
    const dreamProgress = preserveDreamCompletion(state, state.dreamProgress, { purchases, money });
    set({
      money,
      purchases,
      dreamProgress,
      firstDayComplete,
    });
    return true;
  },
  buyFood: (foodId) => {
    const food = FOOD_MENU.find((item) => item.id === foodId);
    const state = get();
    if (!food || state.interior?.id !== 'fish-grill' || state.money < food.price) return false;

    const skills = { ...state.skills, cooking: state.skills.cooking + 25 };
    const reachedSkillGoal = SKILL_NAMES.some((skill) => skillLevelForXp(skills[skill]) >= 2);
    const rewardSkillGoal = reachedSkillGoal && !state.skillGoalRewarded;
    const firstDayComplete = state.shiftsCompleted > 0 && !state.firstDayComplete;
    set({
      money: state.money - food.price + (rewardSkillGoal ? SKILL_GOAL_REWARD : 0) + (firstDayComplete ? FIRST_DAY_REWARD : 0),
      firstDayComplete,
      needs: {
        ...state.needs,
        hunger: Math.min(100, state.needs.hunger + food.hunger + (skillLevelForXp(skills.cooking) >= 2 ? 10 : 0)),
        fun: Math.min(100, state.needs.fun + food.fun),
      },
      skills,
      skillGoalRewarded: state.skillGoalRewarded || rewardSkillGoal,
    });
    return true;
  },
  fundStartup: () => {
    const state = get();
    if (!canFundStartup({
      dream: state.dream,
      progress: state.dreamProgress,
      hasCafeJob: state.hasCafeJob,
      money: state.money,
      purchases: state.purchases,
      skills: state.skills,
    }) || state.money < 100_000) return false;
    const dreamProgress = preserveDreamCompletion(state, { ...state.dreamProgress, startupFunded: true });
    set({
      money: state.money - 100_000,
      dreamProgress,
    });
    return true;
  },
  acceptCafeJob: () => set({ hasCafeJob: true }),
  startCafeShift: () => {
    const state = get();
    if (!state.hasCafeJob || state.interior?.id !== 'ice-cream-cafe' || state.isOnCafeShift) return false;
    set({ isOnCafeShift: true, cafeShiftTasks: 0 });
    return true;
  },
  completeCafeTask: () => {
    let state = get();
    if (!state.hasCafeJob || !state.isOnCafeShift || state.interior?.id !== 'ice-cream-cafe') return false;
    state.advanceSimulation(60);
    state = get();
    const tasks = state.cafeShiftTasks + 1;
    const careerTasksCompleted = state.dreamProgress.careerTasksCompleted + 1;
    if (tasks < CAFE_SHIFT_TASKS) {
      const skills = { ...state.skills, hustle: state.skills.hustle + 40 };
      const skillLevel = skillLevelForXp(skills.hustle);
      const rewardSkillGoal = skillLevel >= 2 && !state.skillGoalRewarded;
      const dreamProgress = preserveDreamCompletion(state, { ...state.dreamProgress, careerTasksCompleted }, { skills });
      set({
        cafeShiftTasks: tasks,
        dreamProgress,
        skills,
        skillGoalRewarded: state.skillGoalRewarded || rewardSkillGoal,
        money: state.money + (rewardSkillGoal ? SKILL_GOAL_REWARD : 0),
      });
      return true;
    }
    const skills = { ...state.skills, hustle: state.skills.hustle + 40 };
    const skillLevel = skillLevelForXp(skills.hustle);
    const rewardSkillGoal = skillLevel >= 2 && !state.skillGoalRewarded;
    const wage = CAFE_SHIFT_PAY * (skillLevel >= 2 ? 1.1 : 1);
    const lifetimeCareerEarnings = state.dreamProgress.lifetimeCareerEarnings + wage;
    const dreamProgress = preserveDreamCompletion(state, { ...state.dreamProgress, careerTasksCompleted, lifetimeCareerEarnings }, { skills, money: state.money + wage + (rewardSkillGoal ? SKILL_GOAL_REWARD : 0) });
    set({
      cafeShiftTasks: CAFE_SHIFT_TASKS,
      isOnCafeShift: false,
      shiftsCompleted: state.shiftsCompleted + 1,
      money: state.money + wage + (rewardSkillGoal ? SKILL_GOAL_REWARD : 0),
      skills,
      dreamProgress,
      skillGoalRewarded: state.skillGoalRewarded || rewardSkillGoal,
    });
    return true;
  },
  setPlayer: (player) => set({ player, needs: INITIAL_NEEDS, activity: null }),
  setDream: (dream) => set({ dream, dreamProgress: { ...INITIAL_DREAM_PROGRESS, friendshipPoints: {} } }),
  setCharacterSetup: (characterSetup) => set({ characterSetup }),
  addContact: (username) => {
    const normalized = username.trim().replace(/^@/, '').toLowerCase();
    if (!/^[a-z0-9_]{1,24}$/.test(normalized) || normalized === get().playerUsername.replace(/^@/, '').toLowerCase()) return false;
    set((state) => ({ contacts: state.contacts.includes(normalized) ? state.contacts : [...state.contacts, normalized] }));
    return true;
  },
  recordMessage: (message) => set((state) => ({
    contacts: state.contacts.includes(message.from === state.playerUsername.replace(/^@/, '').toLowerCase() ? message.to : message.from)
      ? state.contacts
      : [...state.contacts, message.from === state.playerUsername.replace(/^@/, '').toLowerCase() ? message.to : message.from],
    messages: state.messages.some((item) => item.id === message.id) ? state.messages : [...state.messages, message].slice(-500),
  })),
  receiveMessage: (message) => {
    const isNewMessage = !get().messages.some((item) => item.id === message.id);
    get().recordMessage(message);
    if (isNewMessage) set({ messageNotification: message });
  },
  dismissMessageNotification: () => set({ messageNotification: null }),
  receivePayment: (transfer) => set((state) => {
    if (state.walletTransfers.some((item) => item.id === transfer.id)) return state;
    const username = state.playerUsername.replace(/^@/, '').toLowerCase();
    return {
      money: transfer.to.toLowerCase() === username ? state.money + transfer.amount : state.money,
      walletTransfers: [...state.walletTransfers, transfer].slice(-100),
      contacts: state.contacts.includes(transfer.from.toLowerCase()) ? state.contacts : [...state.contacts, transfer.from.toLowerCase()],
    };
  }),
  sendPayment: (transfer) => {
    const state = get();
    if (!Number.isSafeInteger(transfer.amount) || transfer.amount <= 0 || transfer.amount > state.money) return false;
    if (state.walletTransfers.some((item) => item.id === transfer.id)) return false;
    set({ money: state.money - transfer.amount, walletTransfers: [...state.walletTransfers, transfer].slice(-100) });
    return true;
  },
  restorePlayer: (player) => set((state) => ({ player, needs: state.player ? state.needs : INITIAL_NEEDS })),
  setPlayerHome: (playerHome) => set({ playerHome }),
  openPopup: (info) => set({ popup: info }),
  closePopup: () => set({ popup: null }),
  enter: (info, cost = 0) => set((state) => ({
    interior: info,
    currentLocation: info,
    popup: null,
    travel: null,
    activity: null,
    money: state.money - cost,
    chat: null,
  })),
  travelTo: (info, fare, ride) => {
    const state = get();
    if (state.travel || !Number.isFinite(fare) || fare < 0 || fare > state.money) return false;
    set({
      money: state.money - fare,
      travel: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        from: state.currentLocation,
        to: info,
        ride,
        fare,
        startedAt: Date.now(),
      },
      popup: null,
      activity: null,
      chat: null,
    });
    return true;
  },
  completeTravel: (tripId) => {
    const trip = get().travel;
    if (!trip || trip.id !== tripId) return;
    set({ interior: trip.to, currentLocation: trip.to, travel: null, popup: null, activity: null, chat: null });
  },
  exit: () => set({ interior: null, chat: null, activity: null }),
  say: (text) => {
    const t = Date.now();
    set({ chat: { text, t } });
    setTimeout(() => {
      if (get().chat?.t === t) set({ chat: null });
    }, 5000);
  },
}));

export function useGame<T>(select: (state: State) => T): T {
  return useGameStore(select);
}

// Keep an imperative facade for events originating outside React components.
export const game = {
  get: (): State => {
    const { authenticated, playerUsername, playerPosition, playerTarget, remotePlayers, multiplayerStatus, multiplayerError, needs, activity, money, purchases, hasCafeJob, isOnCafeShift, cafeShiftTasks, shiftsCompleted, firstDayComplete, skills, skillGoalRewarded, dream, dreamProgress, characterSetup, contacts, messages, messageNotification, walletTransfers, player, playerHome, popup, interior, currentLocation, travel, chat, interactionPromptsHidden } = useGameStore.getState();
    return { authenticated, playerUsername, playerPosition, playerTarget, remotePlayers, multiplayerStatus, multiplayerError, needs, activity, money, purchases, hasCafeJob, isOnCafeShift, cafeShiftTasks, shiftsCompleted, firstDayComplete, skills, skillGoalRewarded, dream, dreamProgress, characterSetup, contacts, messages, messageNotification, walletTransfers, player, playerHome, popup, interior, currentLocation, travel, chat, interactionPromptsHidden };
  },
  getSave: (): SavedGameProgress => {
    const state = useGameStore.getState();
    return {
      playerUsername: state.playerUsername,
      playerPosition: state.playerPosition,
      needs: state.needs,
      money: state.money,
      purchases: state.purchases,
      hasCafeJob: state.hasCafeJob,
      isOnCafeShift: state.isOnCafeShift,
      cafeShiftTasks: state.cafeShiftTasks,
      shiftsCompleted: state.shiftsCompleted,
      firstDayComplete: state.firstDayComplete,
      skills: state.skills,
      skillGoalRewarded: state.skillGoalRewarded,
      dream: state.dream,
      dreamProgress: state.dreamProgress,
      characterSetup: state.characterSetup,
      contacts: state.contacts,
      messages: state.messages,
      walletTransfers: state.walletTransfers,
      player: state.player,
      playerHome: state.playerHome,
      currentLocation: state.currentLocation,
      interior: state.interior,
    };
  },
  restoreSave: (saved: Partial<SavedGameProgress>) => useGameStore.setState((state) => ({
    ...state,
    playerUsername: typeof saved.playerUsername === 'string' ? saved.playerUsername : state.playerUsername,
    playerPosition: Array.isArray(saved.playerPosition) && saved.playerPosition.length === 2 ? saved.playerPosition as [number, number] : state.playerPosition,
    needs: saved.needs && typeof saved.needs === 'object' ? sanitizeNeeds(saved.needs) : state.needs,
    money: Number.isFinite(saved.money) && (saved.money ?? -1) >= 0 ? saved.money! : state.money,
    purchases: saved.purchases && typeof saved.purchases === 'object' ? saved.purchases : state.purchases,
    hasCafeJob: typeof saved.hasCafeJob === 'boolean' ? saved.hasCafeJob : state.hasCafeJob,
    isOnCafeShift: typeof saved.isOnCafeShift === 'boolean' ? saved.isOnCafeShift : state.isOnCafeShift,
    cafeShiftTasks: Number.isInteger(saved.cafeShiftTasks) ? Math.max(0, Math.min(CAFE_SHIFT_TASKS, saved.cafeShiftTasks!)) : state.cafeShiftTasks,
    shiftsCompleted: Number.isInteger(saved.shiftsCompleted) ? Math.max(0, saved.shiftsCompleted!) : state.shiftsCompleted,
    firstDayComplete: typeof saved.firstDayComplete === 'boolean' ? saved.firstDayComplete : state.firstDayComplete,
    skills: saved.skills && typeof saved.skills === 'object' ? sanitizeSkillXp(saved.skills) : state.skills,
    skillGoalRewarded: typeof saved.skillGoalRewarded === 'boolean' ? saved.skillGoalRewarded : state.skillGoalRewarded,
    dream: typeof saved.dream === 'string' ? saved.dream : state.dream,
    characterSetup: saved.characterSetup && typeof saved.characterSetup === 'object' ? {
      traits: Array.isArray(saved.characterSetup.traits) ? saved.characterSetup.traits.filter((item): item is string => typeof item === 'string').slice(0, 2) : [],
      birthOutcome: typeof saved.characterSetup.birthOutcome === 'string' ? saved.characterSetup.birthOutcome : '',
      home: typeof saved.characterSetup.home === 'string' ? saved.characterSetup.home : '',
    } : state.characterSetup,
    dreamProgress: saved.dreamProgress && typeof saved.dreamProgress === 'object' ? {
      careerTasksCompleted: Number.isInteger(saved.dreamProgress.careerTasksCompleted) ? Math.max(0, saved.dreamProgress.careerTasksCompleted) : state.dreamProgress.careerTasksCompleted,
      lifetimeCareerEarnings: Number.isFinite(saved.dreamProgress.lifetimeCareerEarnings) ? Math.max(0, saved.dreamProgress.lifetimeCareerEarnings) : state.dreamProgress.lifetimeCareerEarnings,
      friendshipPoints: saved.dreamProgress.friendshipPoints && typeof saved.dreamProgress.friendshipPoints === 'object' ? saved.dreamProgress.friendshipPoints : state.dreamProgress.friendshipPoints,
      nightlifeChoices: Number.isInteger(saved.dreamProgress.nightlifeChoices) ? Math.max(0, saved.dreamProgress.nightlifeChoices) : state.dreamProgress.nightlifeChoices,
      startupFunded: typeof saved.dreamProgress.startupFunded === 'boolean' ? saved.dreamProgress.startupFunded : state.dreamProgress.startupFunded,
      completed: typeof saved.dreamProgress.completed === 'boolean' ? saved.dreamProgress.completed : state.dreamProgress.completed,
    } : state.dreamProgress,
    contacts: Array.isArray(saved.contacts) ? saved.contacts.filter((item): item is string => typeof item === 'string').slice(0, 500) : state.contacts,
    messages: Array.isArray(saved.messages)
      ? saved.messages
        .filter((item): item is DirectMessage => Boolean(
          item
          && typeof item.id === 'string'
          && typeof item.from === 'string'
          && typeof item.to === 'string'
          && typeof item.text === 'string'
          && Number.isFinite(item.sentAt),
        ))
        .slice(-500)
      : state.messages,
    walletTransfers: Array.isArray(saved.walletTransfers)
      ? saved.walletTransfers
        .filter((item): item is WalletTransfer => Boolean(
          item
          && typeof item.id === 'string'
          && typeof item.from === 'string'
          && typeof item.to === 'string'
          && Number.isSafeInteger(item.amount)
          && item.amount > 0
          && Number.isFinite(item.sentAt),
        ))
        .slice(-100)
      : state.walletTransfers,
    player: saved.player && typeof saved.player === 'object' ? saved.player : state.player,
    playerHome: saved.playerHome && typeof saved.playerHome === 'object' ? saved.playerHome : state.playerHome,
    currentLocation: saved.currentLocation && typeof saved.currentLocation === 'object' ? saved.currentLocation : state.currentLocation,
    interior: saved.interior && typeof saved.interior === 'object' ? saved.interior : state.interior,
    travel: null,
    activity: null,
    popup: null,
    chat: null,
  })),
  subscribe: (listener: () => void) => useGameStore.subscribe(listener),
  setAuthenticated: (authenticated: boolean) => useGameStore.getState().setAuthenticated(authenticated),
  setInteractionPromptsHidden: (hidden: boolean) => useGameStore.getState().setInteractionPromptsHidden(hidden),
  setPlayerUsername: (username: string) => useGameStore.getState().setPlayerUsername(username),
  reportPlayerMovement: (position: [number, number], target: [number, number] | null) => useGameStore.getState().reportPlayerMovement(position, target),
  setRemotePlayers: (players: MultiplayerPlayer[]) => useGameStore.getState().setRemotePlayers(players),
  updateRemotePlayer: (player: MultiplayerPlayer) => useGameStore.getState().updateRemotePlayer(player),
  removeRemotePlayer: (id: string) => useGameStore.getState().removeRemotePlayer(id),
  setMultiplayerStatus: (status: State['multiplayerStatus'], error?: string | null) => useGameStore.getState().setMultiplayerStatus(status, error),
  setNeeds: (needs: SimNeeds) => useGameStore.getState().setNeeds(needs),
  updateNeed: (need: NeedName, amount: number) => useGameStore.getState().updateNeed(need, amount),
  startActivity: (action: NeedAction, context: NeedActivityContext, targetPlayerName?: string) => useGameStore.getState().startActivity(action, context, targetPlayerName),
  cancelActivity: () => useGameStore.getState().cancelActivity(),
  advanceSimulation: (elapsedMinutes: number) => useGameStore.getState().advanceSimulation(elapsedMinutes),
  buyItem: (itemId: string) => useGameStore.getState().buyItem(itemId),
  buyFood: (foodId: string) => useGameStore.getState().buyFood(foodId),
  fundStartup: () => useGameStore.getState().fundStartup(),
  acceptCafeJob: () => useGameStore.getState().acceptCafeJob(),
  startCafeShift: () => useGameStore.getState().startCafeShift(),
  completeCafeTask: () => useGameStore.getState().completeCafeTask(),
  setPlayer: (player: SimAppearance) => useGameStore.getState().setPlayer(player),
  setDream: (dream: string) => useGameStore.getState().setDream(dream),
  setCharacterSetup: (setup: CharacterSetup) => useGameStore.getState().setCharacterSetup(setup),
  addContact: (username: string) => useGameStore.getState().addContact(username),
  recordMessage: (message: DirectMessage) => useGameStore.getState().recordMessage(message),
  receiveMessage: (message: DirectMessage) => useGameStore.getState().receiveMessage(message),
  dismissMessageNotification: () => useGameStore.getState().dismissMessageNotification(),
  receivePayment: (transfer: WalletTransfer) => useGameStore.getState().receivePayment(transfer),
  sendPayment: (transfer: WalletTransfer) => useGameStore.getState().sendPayment(transfer),
  restorePlayer: (player: SimAppearance) => useGameStore.getState().restorePlayer(player),
  setPlayerHome: (home: BuildingInfo) => useGameStore.getState().setPlayerHome(home),
  openPopup: (info: BuildingInfo) => useGameStore.getState().openPopup(info),
  closePopup: () => useGameStore.getState().closePopup(),
  enter: (info: BuildingInfo, cost = 0) => useGameStore.getState().enter(info, cost),
  travelTo: (info: BuildingInfo, fare: number, ride: string) => useGameStore.getState().travelTo(info, fare, ride),
  completeTravel: (tripId: string) => useGameStore.getState().completeTravel(tripId),
  exit: () => useGameStore.getState().exit(),
  say: (text: string) => useGameStore.getState().say(text),
};

export const playersIn = (buildingId: string) => {
  const state = useGameStore.getState();
  const localPlayerCount = state.interior?.id === buildingId && !state.travel ? 1 : 0;
  const remotePlayerCount = state.remotePlayers.filter((player) => player.buildingId === buildingId).length;
  return localPlayerCount + remotePlayerCount;
};
