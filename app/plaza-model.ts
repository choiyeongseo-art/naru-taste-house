import { z } from 'zod';

export const plazaPoses=['idle','read','sit','dance'] as const;
export const PlazaPosition=z.object({x:z.number().finite().min(.06).max(.94),y:z.number().finite().min(.30).max(.94)});
export const PlazaPeer=PlazaPosition.extend({
  id:z.string().uuid(),nickname:z.string().trim().min(1).max(20),
  avatar:z.object({hair:z.number().int().min(0).max(6),outfit:z.number().int().min(0).max(6),accessory:z.number().int().min(0).max(5),face:z.number().int().min(0).max(2).optional()}),
  pose:z.enum(plazaPoses),
});
export type PlazaPerson=z.infer<typeof PlazaPeer>;
export const PlazaMove=PlazaPosition.extend({id:z.string().uuid(),pose:z.enum(plazaPoses)});
export const PlazaChat=z.object({id:z.string().uuid(),sender:z.string().uuid(),text:z.string().trim().min(1).max(160)});
export type ChatMessage={id:string;sender:string;nickname:string;text:string;at:number};
export function clampBeach(x:number,y:number){return {x:Math.max(.06,Math.min(.94,x)),y:Math.max(.30,Math.min(.94,y))};}
export function projectBeach(x:number,y:number){return {x:500+(x-y)*440,y:80+(x+y)*270};}
export function unprojectBeach(x:number,y:number){return clampBeach(((x-500)/440+(y-80)/270)/2,((y-80)/270-(x-500)/440)/2);}
export function stepToward(from:{x:number;y:number},to:{x:number;y:number},distance:number){
  const dx=to.x-from.x,dy=to.y-from.y,d=Math.hypot(dx,dy);
  if(d<=distance)return {...to};
  return {x:from.x+dx/d*distance,y:from.y+dy/d*distance};
}
