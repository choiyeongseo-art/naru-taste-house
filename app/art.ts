import type { FurnitureKind } from './data';
import rearFrames from './furniture-rear.json';
import type { FurnitureRotation } from './furniture-rotation';

export const avatarArt = './art/avatar-base.webp';
export const roomArt = './art/room.webp';

// All sprites share a floor contact anchor at (0, 0).
export const furnitureArt: Record<FurnitureKind, {src:string;x:number;y:number;width:number;height:number}> = {
  sofa: {src:'./art/sofa.webp',x:-88,y:-105,width:176,height:128},
  desk: {src:'./art/desk.webp',x:-67,y:-113,width:134,height:134},
  plant: {src:'./art/plant.webp',x:-37,y:-94,width:74,height:100},
  lamp: {src:'./art/lamp.webp',x:-32,y:-128,width:64,height:134},
  shelf: {src:'./art/shelf.webp',x:-49,y:-142,width:98,height:150},
  rug: {src:'./art/rug.webp',x:-105,y:-57,width:210,height:114},
  cat: {src:'./art/cat.webp',x:-42,y:-46,width:84,height:60},
  stereo: {src:'./art/stereo.webp',x:-35,y:-53,width:70,height:65},
  flowers: {src:'./art/flowers.webp',x:-28,y:-80,width:56,height:86},
};

export function getFurnitureArt(kind:FurnitureKind,rotation:FurnitureRotation=0){
  const rear=rearFrames as Partial<typeof furnitureArt>;
  return rotation>=2?(rear[kind]||furnitureArt[kind]):furnitureArt[kind];
}
