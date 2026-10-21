import runtime from './character-motion.json';
import type { CharacterPose } from './character';

export type SpriteFrame = { x:number; y:number; w:number; h:number; face?:{x:number;y:number;angle:number} };
type SpriteState = { frames:SpriteFrame[]; fps:number; durations:number[]; loop:boolean };
export type CharacterAtlas = { src:string; width:number; height:number; states:Record<CharacterPose,SpriteState> };
export type SpriteViewport = { atlas:CharacterAtlas; frame:SpriteFrame; scale:number };
const atlases=runtime.atlases as Record<string,CharacterAtlas>;

export function getCharacterAtlas(outfit:number):CharacterAtlas {
  // Keep the same fallback as the original avatar renderer for unfinished wardrobe entries.
  return atlases[outfit]||atlases[0];
}

export const poseDisplayScale:Record<CharacterPose,number>={idle:1,read:.9,sit:.9,dance:1};
