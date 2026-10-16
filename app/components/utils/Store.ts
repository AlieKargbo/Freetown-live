import { create } from 'zustand';
import type { BuildingInfo } from './Info';
import type { SimAppearance } from '../Game-setup/CharacterCreator';

// Shared currency prefix for Sierra Leonean leones.
export const CURRENCY = 'SLE';
export const AUTH_STORAGE_KEY = 'lagos-life-authenticated';

type Chat = { text: string; t: number };

type State = {
  authenticated: boolean;
  money: number;
  player: SimAppearance | null;
  popup: BuildingInfo | null; // building whose "enter" popup is open
  interior: BuildingInfo | null; // building the player is currently inside
  chat: Chat | null; // last thing the player said (shown as a bubble for a few seconds)
};

type Actions = {
  setAuthenticated: (authenticated: boolean) => void;
  setPlayer: (player: SimAppearance) => void;
  openPopup: (info: BuildingInfo) => void;
  closePopup: () => void;
  enter: (info: BuildingInfo, cost?: number) => void;
  exit: () => void;
  say: (text: string) => void;
};

type GameStore = State & Actions;

const useGameStore = create<GameStore>()((set, get) => ({
  authenticated: false,
  money: 1_091_000,
  player: null,
  popup: null,
  interior: null,
  chat: null,
  setAuthenticated: (authenticated) => set({ authenticated }),
  setPlayer: (player) => set({ player }),
  openPopup: (info) => set({ popup: info }),
  closePopup: () => set({ popup: null }),
  enter: (info, cost = 0) => set((state) => ({
    interior: info,
    popup: null,
    money: state.money - cost,
    chat: null,
  })),
  exit: () => set({ interior: null, chat: null }),
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
    const { authenticated, money, player, popup, interior, chat } = useGameStore.getState();
    return { authenticated, money, player, popup, interior, chat };
  },
  setAuthenticated: (authenticated: boolean) => useGameStore.getState().setAuthenticated(authenticated),
  setPlayer: (player: SimAppearance) => useGameStore.getState().setPlayer(player),
  openPopup: (info: BuildingInfo) => useGameStore.getState().openPopup(info),
  closePopup: () => useGameStore.getState().closePopup(),
  enter: (info: BuildingInfo, cost = 0) => useGameStore.getState().enter(info, cost),
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