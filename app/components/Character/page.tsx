'use client';

import { useRouter } from 'next/navigation';
import CharacterCreator, { type SimAppearance } from './CharacterCreator';
import { game } from '../utils/Store';
import { PLAYER_HOME_INFO } from '../zoned/Interior/playerHomeInfo';

export default function CharacterCreationPage() {
  const router = useRouter();

  function handleComplete(_appearance: SimAppearance) {
    // CharacterCreator persists the appearance locally.
    game.enter(PLAYER_HOME_INFO);
    router.replace('/');
  }

  return <CharacterCreator onComplete={handleComplete} />;
}
