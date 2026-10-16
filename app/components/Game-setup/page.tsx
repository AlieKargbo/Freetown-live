'use client';

import { useRouter } from 'next/navigation';
import CharacterCreator, {
  type PlayerChoices,
} from './CharacterCreator';
import { game } from '../utils/Store';
import { PLAYER_HOME_INFO } from '../zoned/Interior/playerHomeInfo';

export default function CharacterCreationPage() {
  const router = useRouter();

  function handleComplete(choices: PlayerChoices) {
    const customization = {
      Look: choices.appearance,
      Personality: choices.traits,
      Dream: choices.dream,
      'Birth Lottery': choices.birthOutcome,
      Home: choices.home,
    };

    try {
      localStorage.setItem(
        'freetown-life-player-customization',
        JSON.stringify(customization),
      );
      localStorage.setItem(
        'freetown-life-player-appearance',
        JSON.stringify(choices.appearance),
      );
      localStorage.setItem(
        'freetown-life-player-choices',
        JSON.stringify(choices),
      );
      localStorage.setItem(
        'freetong-life-welcome-tour-pending',
        'true',
      );
    } catch {
      // Continue into the game if storage is unavailable.
    }

    game.setPlayer(choices.appearance);
    game.enter(PLAYER_HOME_INFO);
    console.log('Player customization after move-in:', customization);

    router.replace('/');
  }

  return <CharacterCreator onComplete={handleComplete} />;
}