import { z } from 'zod';

export const FurnitureItemSchema=z.object({
  id:z.string().max(50),
  kind:z.enum(['sofa','desk','plant','lamp','shelf','rug','cat','stereo','flowers']),
  x:z.number().min(0).max(5),y:z.number().min(0).max(5),
  // Optional until the item is rotated, so legacy flip:true remains direction 1.
  rotation:z.union([z.literal(0),z.literal(1),z.literal(2),z.literal(3)]).optional(),
  flip:z.boolean().optional(),
});
