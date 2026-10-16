'use client';

import { useEffect } from 'react';
import { game } from './Store';

// One real second advances one in-game minute while the player is online.
export const SIM_MINUTES_PER_REAL_SECOND = 1;

export default function NeedSimulation({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;

    let previousTime = Date.now();
    const interval = window.setInterval(() => {
      if (document.visibilityState !== 'visible') {
        previousTime = Date.now();
        return;
      }

      const now = Date.now();
      const elapsedSeconds = Math.min((now - previousTime) / 1000, 5);
      previousTime = now;
      game.advanceSimulation(elapsedSeconds * SIM_MINUTES_PER_REAL_SECOND);
    }, 1000);

    const resetTime = () => { previousTime = Date.now(); };
    document.addEventListener('visibilitychange', resetTime);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', resetTime);
    };
  }, [active]);

  return null;
}
