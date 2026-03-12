import type { Room } from '@venomous-snake/shared-types';

import { floor00Rooms } from './floor00-lobby';
import { floor01Rooms } from './floor01-server';
import { floor02Rooms } from './floor02-lab';
import { floor03Rooms } from './floor03-surveillance';
import { floor04Rooms } from './floor04-archives';
import { floor05Rooms } from './floor05-comms';
import { floor06Rooms } from './floor06-executive';
import { floor07Rooms } from './floor07-manufacturing';
import { floor08Rooms } from './floor08-vault';
import { floor09Rooms } from './floor09-aicore';
import { floor10Rooms } from './floor10-penthouse';
import { floor11Rooms } from './floor11-rooftop';

export const allRooms: Room[] = [
  ...floor00Rooms,
  ...floor01Rooms,
  ...floor02Rooms,
  ...floor03Rooms,
  ...floor04Rooms,
  ...floor05Rooms,
  ...floor06Rooms,
  ...floor07Rooms,
  ...floor08Rooms,
  ...floor09Rooms,
  ...floor10Rooms,
  ...floor11Rooms,
];
