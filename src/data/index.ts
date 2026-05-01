import { a1 } from './a1';
import { a2 } from './a2';
import { b1 } from './b1';
import { b2 } from './b2';
import type { Level, Centurion } from '../types';

export const vocabulary: Record<Level, Centurion[]> = {
  'A1': a1,
  'A2': a2,
  'B1': b1,
  'B2': b2,
};