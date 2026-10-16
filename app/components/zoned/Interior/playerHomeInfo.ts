
import type { BuildingInfo } from '../../utils/Info';

export const PLAYER_HOME_INFO: BuildingInfo = {
  id: 'player-home',
  name: 'Home',
  area: 'Yaba',
  emoji: '🏠',
  tagline: 'Your space. Your life. Make yourself at home.',
  banner: {
    badge: 'MY HOME',
    line: '',
  },
  activities: [
    { emoji: '🛏️', label: 'Sleep' },
    { emoji: '🪑', label: 'Relax' },
    { emoji: '📚', label: 'Study' },
    { emoji: '📺', label: 'Watch TV' },
    { emoji: '🪴', label: 'Decorate' },
  ],
  interior: {
    size: [12, 12],
    floor: ['#754c2f', '#98643d'],
    wall: '#b88735',
    ground: '#626d43',
    furniture: [
      { type: 'bed', at: [-3.5, -4], size: [2.8, 3] },
      { type: 'desk', at: [-1, -4], size: [1.5, 1] },
      { type: 'chair', at: [-1, -2.7] },
      { type: 'sofa', at: [2.5, -3.8], size: [2.5, 1.2] },
      { type: 'table', at: [2.5, -1.7], size: [1.5, 1] },
      { type: 'tv', at: [4.7, -1.7] },
      { type: 'toilet', at: [4.5, 2] },
      { type: 'shower', at: [4.5, 4] },
      { type: 'shelf', at: [-4.5, 3], size: [1.2, 0.6] },
      { type: 'plant', at: [-4.5, 4.5] },
      { type: 'rug', at: [0, 1], size: [3.5, 2.5] },
      { type: 'lamp', at: [-4.5, 1] },
    ],
  },
};
