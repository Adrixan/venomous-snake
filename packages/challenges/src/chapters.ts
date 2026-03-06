import type { Chapter } from '@venomous-snake/shared-types';

export const chapters: Chapter[] = [
  {
    id: 1,
    titleKey: 'chapters.ch01.title',
    descriptionKey: 'chapters.ch01.description',
    floor: 'lobby',
    challenges: ['ch01_01_hello_world', 'ch01_02_variables', 'ch01_03_math_ops'],
    conceptsCovered: ['print', 'strings', 'variables', 'int', 'float', 'arithmetic'],
  },
  // Chapters 2-12 will be added as we build content
];
