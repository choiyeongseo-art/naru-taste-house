import { z } from 'zod';
import { CharacterSchema } from '../lib/character-schema';
export const HomeSchema = z.object({
  nickname: z.string().trim().min(1).max(20), bio: z.string().max(100),
  mood: z.enum(['blue', 'pink', 'lavender', 'mint']),
  character: CharacterSchema,
  avatar: z.object({ hair: z.number().int().min(0).max(6), outfit: z.number().int().min(0).max(6), accessory: z.number().int().min(0).max(5), face: z.number().int().min(0).max(2).default(0) }),
  items: z.array(z.object({ id: z.string().max(50), kind: z.enum(['sofa','desk','plant','lamp','shelf','rug','cat','stereo','flowers']), x: z.number().min(0).max(5), y: z.number().min(0).max(5), flip: z.boolean().optional() })).max(30),
  result: z.number().int().min(0).max(3).nullable(),
  history: z.array(z.object({ type: z.number().int().min(0).max(3), date: z.string().max(40) })).max(30),
  saved: z.array(z.string().max(50)).max(100), visited: z.array(z.string().max(50)).max(100), rewards: z.array(z.string().max(50)).max(100), points: z.number().int().min(0).max(100000),
});
