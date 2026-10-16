import { create } from 'zustand';
import type { BuildingInfo } from './Info';
import type { SimAppearance } from '../Game-setup/CharacterCreator';
import { advanceNeeds, changeNeed, INITIAL_NEEDS, sanitizeNeeds, type NeedName, type SimNeeds } from '@/app/Game/needs';
import { ACTIVITY_CONTEXTS, ACTIVITY_DURATIONS_MINUTES, performNeedAction, type NeedAction, type NeedActivity, type NeedActivityContext } from '@/app/Game/needActions';
import { BUY_ITEMS } from '@/app/Game/storeCatalog';

// Shared currency prefix for Sierra Leonean leones.
export const CURRENCY = 'SLE';
export const AUTH_STORAGE_KEY = 'lagos-life-authenticated';

type Chat = { text: string; t: number };
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
  needs: SimNeeds;
  activity: NeedActivity | null;
  money: number;
  purchases: Record<string, number>;
  player: SimAppearance | null;
  playerHome: BuildingInfo | null;
  popup: BuildingInfo | null; // building whose "enter" popup is open
  interior: BuildingInfo | null; // building the player is currently inside
  currentLocation: BuildingInfo | null;
  travel: TravelTrip | null;
  chat: Chat | null; // last thing the player said (shown as a bubble for a few seconds)
};

type Actions = {
  setAuthenticated: (authenticated: boolean) => void;
  setPlayerUsername: (username: string) => void;
  setNeeds: (needs: SimNeeds) => void;
  updateNeed: (need: NeedName, amount: number) => void;
  startActivity: (action: NeedAction, context: NeedActivityContext) => boolean;
  cancelActivity: () => void;
  advanceSimulation: (elapsedMinutes: number) => void;
  buyItem: (itemId: string) => boolean;
  setPlayer: (player: SimAppearance) => void;
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

const useGameStore = create<GameStore>()((set, get) => ({
  authenticated: false,
  playerUsername: '',
  needs: INITIAL_NEEDS,
  activity: null,
  money: 1_091_000,
  purchases: {},
  player: null,
  playerHome: null,
  popup: null,
  interior: null,
  currentLocation: null,
  travel: null,
  chat: null,
  setAuthenticated: (authenticated) => set({ authenticated }),
  setPlayerUsername: (playerUsername) => set({ playerUsername }),
  setNeeds: (needs) => set({ needs: sanitizeNeeds(needs) }),
  updateNeed: (need, amount) => set((state) => ({ needs: changeNeed(state.needs, need, amount) })),
  startActivity: (action, context) => {
    const state = get();
    const interiorItems = state.interior?.interior.furniture ?? [];
    const validPersonContext = context === 'person'
      && action === 'chat'
      && Boolean(state.interior && state.interior.id !== 'player-home' && playersIn(state.interior.id) > 1);
    const validFurnitureContext = context !== 'person'
      && interiorItems.some((item) => item.type === context)
      && ACTIVITY_CONTEXTS[context] === action;
    if (state.activity || (!validPersonContext && !validFurnitureContext)) return false;
    const durationMinutes = action === 'sleep'
      ? Math.max(1, Math.ceil((100 - state.needs.energy) / 1.5))
      : ACTIVITY_DURATIONS_MINUTES[action];
    set({ activity: { action, elapsedMinutes: 0, durationMinutes } });
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
    set({
      needs: finished && activity.action !== 'sleep' && activity.action !== 'nap'
        ? performNeedAction(needs, activity.action)
        : needs,
      activity: finished ? null : { ...activity, elapsedMinutes: elapsed },
    });
  },
  buyItem: (itemId) => {
    const item = BUY_ITEMS.find((candidate) => candidate.id === itemId);
    if (!item) return false;
    const state = get();
    if (state.money < item.price) return false;
    set({
      money: state.money - item.price,
      purchases: { ...state.purchases, [item.id]: (state.purchases[item.id] ?? 0) + 1 },
    });
    return true;
  },
  setPlayer: (player) => set({ player, needs: INITIAL_NEEDS, activity: null }),
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
    const { authenticated, playerUsername, needs, activity, money, purchases, player, playerHome, popup, interior, currentLocation, travel, chat } = useGameStore.getState();
    return { authenticated, playerUsername, needs, activity, money, purchases, player, playerHome, popup, interior, currentLocation, travel, chat };
  },
  setAuthenticated: (authenticated: boolean) => useGameStore.getState().setAuthenticated(authenticated),
  setPlayerUsername: (username: string) => useGameStore.getState().setPlayerUsername(username),
  setNeeds: (needs: SimNeeds) => useGameStore.getState().setNeeds(needs),
  updateNeed: (need: NeedName, amount: number) => useGameStore.getState().updateNeed(need, amount),
  startActivity: (action: NeedAction, context: NeedActivityContext) => useGameStore.getState().startActivity(action, context),
  cancelActivity: () => useGameStore.getState().cancelActivity(),
  advanceSimulation: (elapsedMinutes: number) => useGameStore.getState().advanceSimulation(elapsedMinutes),
  buyItem: (itemId: string) => useGameStore.getState().buyItem(itemId),
  setPlayer: (player: SimAppearance) => useGameStore.getState().setPlayer(player),
  setPlayerHome: (home: BuildingInfo) => useGameStore.getState().setPlayerHome(home),
  openPopup: (info: BuildingInfo) => useGameStore.getState().openPopup(info),
  closePopup: () => useGameStore.getState().closePopup(),
  enter: (info: BuildingInfo, cost = 0) => useGameStore.getState().enter(info, cost),
  travelTo: (info: BuildingInfo, fare: number, ride: string) => useGameStore.getState().travelTo(info, fare, ride),
  completeTravel: (tripId: string) => useGameStore.getState().completeTravel(tripId),
  exit: () => useGameStore.getState().exit(),
  say: (text: string) => useGameStore.getState().say(text),
};

export function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

// How many players are inside a building (you included), stable per building: 3 to 7.
export const playersIn = (id: string) => 3 + (hash(id) % 5);
