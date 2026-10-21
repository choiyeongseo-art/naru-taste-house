import { z } from 'zod';
import { DEFAULT_CHARACTER, ROOM_MAX, ROOM_MIN } from '../app/character';

export const CharacterSchema = z.object({
  x: z.number().finite().min(ROOM_MIN).max(ROOM_MAX),
  y: z.number().finite().min(ROOM_MIN).max(ROOM_MAX),
  pose: z.enum(['idle', 'read', 'sit', 'dance']),
  animated: z.boolean(),
  frame: z.number().int().min(0).max(4).default(0),
}).default({ ...DEFAULT_CHARACTER });
