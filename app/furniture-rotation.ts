export type FurnitureRotation=0|1|2|3;
export const furnitureDirections=[
  {value:0,label:'기본',description:'현재 방향 · 앞면'},
  {value:1,label:'회전1',description:'반대 방향 · 앞면 좌우 반전'},
  {value:2,label:'회전2',description:'후면'},
  {value:3,label:'회전3',description:'반대 방향 · 후면 좌우 반전'},
] as const;

/** Older saved rooms only had a horizontal flip flag. */
export function getFurnitureRotation(item:{rotation?:unknown;flip?:boolean}):FurnitureRotation {
  if(typeof item.rotation==='number'&&Number.isInteger(item.rotation)&&item.rotation>=0&&item.rotation<=3)return item.rotation as FurnitureRotation;
  return item.flip?1:0;
}
export function nextFurnitureRotation(item:{rotation?:unknown;flip?:boolean}):FurnitureRotation {
  return ((getFurnitureRotation(item)+1)%4) as FurnitureRotation;
}
export function furnitureView(rotation:FurnitureRotation){return {rear:rotation>=2,mirrored:rotation===1||rotation===3};}
export function withFurnitureRotation<T extends {rotation?:FurnitureRotation;flip?:boolean}>(item:T,rotation:FurnitureRotation):T&{rotation:FurnitureRotation}{
  const next={...item,rotation};delete next.flip;return next;
}
