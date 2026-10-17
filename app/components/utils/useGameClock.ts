'use client';

import { useEffect, useState } from 'react';
import { getGameClock } from '@/app/Game/clock';

export default function useGameClock() {
  const [clock, setClock] = useState(() => getGameClock());

  useEffect(() => {
    const updateClock = () => setClock(getGameClock());
    const interval = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return clock;
}
