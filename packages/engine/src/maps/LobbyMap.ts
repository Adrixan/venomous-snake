export interface ProceduralMapConfig {
  width: number;
  height: number;
  tileSize: number;
  rooms: ProceduralRoom[];
  connections: Array<{ from: string; to: string; door: { x: number; y: number } }>;
}

export interface ProceduralRoom {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  interactives: Array<{
    type: 'terminal' | 'npc' | 'door' | 'item';
    x: number;
    y: number;
    properties: Record<string, string>;
  }>;
}

export const LOBBY_MAP: ProceduralMapConfig = {
  width: 60,
  height: 40,
  tileSize: 32,
  rooms: [
    {
      id: 'reception',
      name: 'Reception',
      x: 5,
      y: 15,
      width: 12,
      height: 10,
      interactives: [
        {
          type: 'terminal',
          x: 10,
          y: 18,
          properties: { challengeId: 'ch01_01_hello_world', label: 'Security Terminal' },
        },
        {
          type: 'npc',
          x: 8,
          y: 20,
          properties: { name: 'Guard Torres', dialogId: 'guard_torres' },
        },
      ],
    },
    {
      id: 'security',
      name: 'Security Checkpoint',
      x: 20,
      y: 15,
      width: 10,
      height: 10,
      interactives: [
        {
          type: 'terminal',
          x: 24,
          y: 18,
          properties: { challengeId: 'ch01_02_variables', label: 'Badge Reader' },
        },
        {
          type: 'terminal',
          x: 26,
          y: 20,
          properties: { challengeId: 'ch01_03_math_ops', label: 'Keypad' },
        },
      ],
    },
    {
      id: 'server_closet',
      name: 'Server Closet',
      x: 33,
      y: 15,
      width: 8,
      height: 8,
      interactives: [
        {
          type: 'terminal',
          x: 36,
          y: 18,
          properties: { challengeId: 'ch01_04_string_types', label: 'Server Console' },
        },
        {
          type: 'terminal',
          x: 37,
          y: 20,
          properties: { challengeId: 'ch01_05_float_calculations', label: 'Diagnostic Panel' },
        },
      ],
    },
    {
      id: 'break_room',
      name: 'Break Room',
      x: 20,
      y: 5,
      width: 10,
      height: 8,
      interactives: [
        { type: 'npc', x: 24, y: 8, properties: { name: 'Dr. Silva', dialogId: 'dr_silva' } },
        {
          type: 'terminal',
          x: 27,
          y: 8,
          properties: { challengeId: 'ch01_06_string_concatenation', label: 'Coffee Machine' },
        },
      ],
    },
    {
      id: 'elevator',
      name: 'Elevator Lobby',
      x: 44,
      y: 15,
      width: 8,
      height: 10,
      interactives: [
        {
          type: 'door',
          x: 48,
          y: 19,
          properties: {
            targetFloor: 'floor1',
            locked: 'true',
            requiresChallenge: 'ch01_08_comments',
          },
        },
        {
          type: 'terminal',
          x: 46,
          y: 22,
          properties: { challengeId: 'ch01_07_multiple_prints', label: 'Elevator Panel' },
        },
        {
          type: 'terminal',
          x: 46,
          y: 17,
          properties: { challengeId: 'ch01_08_comments', label: 'Access Control' },
        },
      ],
    },
  ],
  connections: [
    { from: 'reception', to: 'security', door: { x: 17, y: 19 } },
    { from: 'security', to: 'server_closet', door: { x: 30, y: 19 } },
    { from: 'security', to: 'break_room', door: { x: 24, y: 14 } },
    { from: 'server_closet', to: 'elevator', door: { x: 41, y: 19 } },
  ],
};
