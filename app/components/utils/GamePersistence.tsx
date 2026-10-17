'use client';

import { useEffect } from 'react';
import { game, type SavedGameProgress } from './Store';

const SAVE_KEY = 'freetown-life-game-save-v2';
const LEGACY_SAVE_KEY = 'freetown-life-game-save-v1';

function readSelectedDream(): string | null {
  try {
    const choices = localStorage.getItem('freetown-life-player-choices');
    if (!choices) return null;
    const parsed = JSON.parse(choices) as { dream?: unknown };
    return typeof parsed.dream === 'string' ? parsed.dream : null;
  } catch {
    return null;
  }
}

export default function GamePersistence() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SavedGameProgress>;
        const previousDream = parsed.dream;
        game.restoreSave(parsed);
        const selectedDream = readSelectedDream();
        if (selectedDream && selectedDream !== previousDream) game.setDream(selectedDream);
      } else {
        const legacySave = localStorage.getItem(LEGACY_SAVE_KEY);
        if (legacySave) {
          const parsed = JSON.parse(legacySave) as Partial<SavedGameProgress>;
          if (parsed.needs && Number.isFinite(parsed.needs.bladder)) {
            parsed.needs = { ...parsed.needs, bladder: 100 - parsed.needs.bladder };
          }
          const previousDream = parsed.dream;
          game.restoreSave(parsed);
          const selectedDream = readSelectedDream();
          if (selectedDream && selectedDream !== previousDream) game.setDream(selectedDream);
          localStorage.setItem(SAVE_KEY, JSON.stringify(game.getSave()));
        }
      }
    } catch {
      // Ignore a missing or malformed local save and start a fresh session.
    }

    let lastSaved = JSON.stringify(game.getSave());
    let saveTimer: number | undefined;
    const save = () => {
      const next = JSON.stringify(game.getSave());
      if (next === lastSaved) return;
      lastSaved = next;
      try {
        localStorage.setItem(SAVE_KEY, next);
      } catch {
        // Keep playing if storage is full or unavailable.
      }
    };
    const unsubscribe = game.subscribe(() => {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(save, 250);
    });
    const saveOnExit = () => save();
    window.addEventListener('pagehide', saveOnExit);

    return () => {
      window.clearTimeout(saveTimer);
      save();
      unsubscribe();
      window.removeEventListener('pagehide', saveOnExit);
    };
  }, []);

  return null;
}
