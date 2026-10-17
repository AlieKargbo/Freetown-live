export const REAL_WORLD_MS_PER_GAME_DAY = 10 * 60 * 1000;
const GAME_DAY_MS = 24 * 60 * 60 * 1000;
const GAME_CLOCK_EPOCH = Date.UTC(2026, 0, 1, 6, 0, 0);

export type GameClock = {
  hour: number;
  minute: number;
  hourOfDay: number;
  day: number;
  daylight: number;
  night: number;
  isDay: boolean;
};

export function getGameClock(now = Date.now()): GameClock {
  const elapsedRealMs = Math.max(0, now - GAME_CLOCK_EPOCH);
  const elapsedGameMs = elapsedRealMs * (GAME_DAY_MS / REAL_WORLD_MS_PER_GAME_DAY);
  const gameDayIndex = Math.floor(elapsedGameMs / GAME_DAY_MS);
  const timeOfDayMs = elapsedGameMs % GAME_DAY_MS;
  const hourOfDay = timeOfDayMs / (60 * 60 * 1000);
  const hour = Math.floor(hourOfDay);
  const minute = Math.floor((timeOfDayMs % (60 * 60 * 1000)) / (60 * 1000));
  const daylight = Math.max(0, Math.sin(((hourOfDay - 6) / 12) * Math.PI));

  return {
    hour,
    minute,
    hourOfDay,
    day: (gameDayIndex % 30) + 1,
    daylight,
    night: 1 - daylight,
    isDay: hourOfDay >= 6 && hourOfDay < 18,
  };
}

export function formatGameTime(clock: GameClock) {
  const hour12 = clock.hour % 12 || 12;
  return `${hour12}:${String(clock.minute).padStart(2, '0')} ${clock.hour < 12 ? 'AM' : 'PM'}`;
}
