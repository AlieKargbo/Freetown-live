import { useSyncExternalStore } from 'react';
import type { BuildingInfo } from './Info';
import type { SimAppearance } from '../Character/CharacterCreator';

// Change this one constant to switch the currency symbol everywhere (₦, Le, ...).
export const CURRENCY = '₦';

type Chat = { text: string; t: number };

type State = {
  money: number;
  player: SimAppearance | null;
  popup: BuildingInfo | null; // building whose "enter" popup is open
  interior: BuildingInfo | null; // building the player is currently inside
  chat: Chat | null; // last thing the player said (shown as a bubble for a few seconds)
};

let state: State = { money: 1_091_000, player: null, popup: null, interior: null, chat: null };

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

// A module-level store, so building pins (inside the R3F canvas) and the HTML popups
// (outside it) share state without any context bridging.
export const game = {
  get: () => state,
  setPlayer: (player: SimAppearance) => set({ player }),
  openPopup: (info: BuildingInfo) => set({ popup: info }),
  closePopup: () => set({ popup: null }),
  enter: (info: BuildingInfo, cost = 0) => set({ interior: info, popup: null, money: state.money - cost, chat: null }),
  exit: () => set({ interior: null, chat: null }),
  say: (text: string) => {
    const t = Date.now();
    set({ chat: { text, t } });
    setTimeout(() => {
      if (state.chat?.t === t) set({ chat: null });
    }, 5000);
  },
};

export function useGame<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(state),
    () => select(state),
  );
}

export function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

// How many players are inside a building (you included), stable per building: 3 to 7.
export const playersIn = (id: string) => 3 + (hash(id) % 5);