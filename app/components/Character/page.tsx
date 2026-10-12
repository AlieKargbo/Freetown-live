'use client';

import { useRouter } from 'next/navigation';
import CharacterCreator, {
  type SimAppearance,
} from './CharacterCreator';
import { game } from '../utils/Store';
import { PLAYER_HOME_INFO } from '../zoned/Interior/playerHomeInfo';

export default function CharacterCreationPage() {
  const router = useRouter();

  function handleComplete(appearance: SimAppearance) {
    try {
      localStorage.setItem(
        'lagos-life-player-appearance',
        JSON.stringify(appearance),
      );
      localStorage.setItem(
        'lagos-life-welcome-tour-pending',
        'true',
      );
    } catch {
      // Continue into the game if storage is unavailable.
    }

    game.setPlayer(appearance);
    game.enter(PLAYER_HOME_INFO);

    router.replace('/');
  }

  return <CharacterCreator onComplete={handleComplete} />;
}