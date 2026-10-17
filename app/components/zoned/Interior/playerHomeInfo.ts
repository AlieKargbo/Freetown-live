
import type { BuildingInfo } from '../../utils/Info';
import type { HomeOption } from '../../Game-setup/CharacterData';

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

const HOME_LAYOUTS: Record<string, BuildingInfo['interior']> = {
  'Self-contain': {
    size: [14, 12],
    floor: ['#8a6846', '#b18a60'],
    wall: '#dfc69b',
    ground: '#77835a',
    furniture: [
      { type: 'bed', at: [-4.2, -3.8], size: [3, 3.2] },
      { type: 'desk', at: [-1.2, -4], size: [1.7, 1] },
      { type: 'chair', at: [-1.2, -2.7] },
      { type: 'sofa', at: [3, -3.8], size: [2.8, 1.3] },
      { type: 'table', at: [3, -1.6], size: [1.7, 1] },
      { type: 'tv', at: [5.4, -1.5] },
      { type: 'shelf', at: [-5.7, 1], size: [1.1, 0.6] },
      { type: 'plant', at: [-5.5, 3] },
      { type: 'toilet', at: [5.2, 2] },
      { type: 'shower', at: [5.2, 4] },
      { type: 'rug', at: [0.8, 1], size: [4, 2.6] },
      { type: 'lamp', at: [-5.5, -1] },
    ],
  },
  "2'2 Rooms-en-Paller": {
    size: [8, 8],
    floor: ['#65513f', '#80664e'],
    wall: '#58776b',
    ground: '#626d43',
    furniture: [
      { type: 'bed', at: [-2.2, -2.3], size: [2.3, 2.1] },
      { type: 'shelf', at: [-3.4, 0.4], size: [0.5, 1.2] },
      { type: 'table', at: [0.6, -2.5], size: [1.2, 0.9] },
      { type: 'chair', at: [0.6, -1.3] },
      { type: 'plant', at: [-3.2, 2.7] },
      { type: 'toilet', at: [2.6, 1.8] },
      { type: 'shower', at: [2.6, 3] },
      { type: 'lamp', at: [2.8, -2.5] },
    ],
  },
  'Decent Flat': {
    size: [10, 10],
    floor: ['#81735e', '#a39479'],
    wall: '#b6c6b7',
    ground: '#697b5f',
    furniture: [
      { type: 'bed', at: [-3, -3.2], size: [2.7, 2.8] },
      { type: 'desk', at: [-0.8, -3.5], size: [1.4, 0.9] },
      { type: 'chair', at: [-0.8, -2.3] },
      { type: 'counter', at: [3.3, -3], size: [1.1, 1.8] },
      { type: 'sofa', at: [2.3, 0], size: [2.5, 1.1] },
      { type: 'table', at: [2.3, 1.7], size: [1.4, 0.9] },
      { type: 'tv', at: [4.1, 1.7] },
      { type: 'toilet', at: [3.5, 3.5] },
      { type: 'shower', at: [1.7, 3.5] },
      { type: 'plant', at: [-4, 3.5] },
      { type: 'rug', at: [0, 1], size: [3.5, 2.3] },
    ],
  },
  'Mini-flat': PLAYER_HOME_INFO.interior,
};

export function createPlayerHomeInfo(home: HomeOption): BuildingInfo {
  return {
    ...PLAYER_HOME_INFO,
    name: home.name,
    area: home.area,
    banner: { badge: home.name.toUpperCase(), line: PLAYER_HOME_INFO.banner?.line ?? '' },
    interior: HOME_LAYOUTS[home.name] ?? PLAYER_HOME_INFO.interior,
  };
}
