'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { getFurnitureArt, roomArt } from './art';
import { furnitureView, getFurnitureRotation, type FurnitureRotation } from './furniture-rotation';
import { furniture, type HomeState, type Item, type FurnitureKind } from './data';
import { CHARACTER_SELECTION, characterPoses, normalizeCharacter, clampRoomCoordinate, projectRoomPoint, unprojectRoomPoint, roomArrowDelta, type CharacterPlacement } from './character';
import { getCharacterAtlas, poseDisplayScale, type SpriteViewport } from './character-sprites';

export const themes={blue:{wall:'#d6f6fd',wall2:'#fff9dc',floor:'#e5f0f5',accent:'#c1dfea',dark:'#9ebcca'},pink:{wall:'#ffd7f2',wall2:'#fff5f9',floor:'#f2e7ed',accent:'#ebcadc',dark:'#c4a7b7'},lavender:{wall:'#ecd7ff',wall2:'#f5edff',floor:'#eae4f3',accent:'#d9c9ec',dark:'#b5a6c8'},mint:{wall:'#d2fad3',wall2:'#f2fbef',floor:'#e5efe5',accent:'#c1e0cb',dark:'#a3bdad'}};

export function Avatar({hair=0,outfit=0,accessory=0,sprite}:HomeState['avatar']&{sprite?:SpriteViewport}){
 const id='avatar-'+useId().replace(/:/g,'');
 const src=['./art/avatar-base.webp','./art/avatar-pink.webp','./art/avatar-lilac.webp','./art/avatar-mint.webp'][outfit]||'./art/avatar-base.webp';
 const hairTone=[[1,1,1],[.84,.72,.64],[1,.80,.87],[.87,.77,.98]][hair]||[1,1,1];
 const tintMatrix=`0 0 ${hairTone[0]} 0 0.04  0 0 ${hairTone[1]} 0 0.04  0 0 ${hairTone[2]} 0 0.04  0 0 0 1 0`;
 return <g transform={sprite?`scale(${sprite.scale})`:undefined}>
  {hair!==0&&<defs><filter id={id} colorInterpolationFilters='sRGB' x='-5%' y='-5%' width='110%' height='110%'>
   <feColorMatrix in='SourceGraphic' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -8 8 0 0 -0.15' result='green-over-red'/>
   <feColorMatrix in='SourceGraphic' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 -12 12 0 -0.05' result='blue-over-green'/>
   <feComposite in='green-over-red' in2='blue-over-green' operator='in' result='hair-mask'/>
   <feColorMatrix in='SourceGraphic' type='matrix' values={tintMatrix} result='tinted-hair'/>
   <feComposite in='tinted-hair' in2='hair-mask' operator='in' result='masked-tint'/>
   <feComposite in='masked-tint' in2='SourceGraphic' operator='over'/>
  </filter></defs>}
  {sprite?<g clipPath={`url(#${id}-crop)`} data-sprite-crop='true'><defs><clipPath id={`${id}-crop`} clipPathUnits='userSpaceOnUse'><rect x='-54' y='-133' width='108' height='144'/></clipPath></defs><image className='generated-avatar' href={sprite.atlas.src} x={-54-sprite.frame.x*108/sprite.frame.w} y={-133-sprite.frame.y*144/sprite.frame.h} width={sprite.atlas.width*108/sprite.frame.w} height={sprite.atlas.height*144/sprite.frame.h} preserveAspectRatio='none' filter={hair!==0?'url(#'+id+')':undefined}/></g>:<image className='generated-avatar' href={src} x='-49' y='-118' width='98' height='134' preserveAspectRatio='xMidYMax meet' filter={hair!==0?'url(#'+id+')':undefined}/>}
  <g transform={sprite?.frame.face?`translate(${sprite.frame.face.x} ${sprite.frame.face.y}) rotate(${sprite.frame.face.angle}) translate(0 64)`:undefined}>
  {accessory===1&&<g transform='translate(23 -78)' fill='#fff9dc' stroke='#a1bed1' strokeWidth='1'><path d='M-8 0q4-9 10-4-4 2-3 5 5-3 9 1-8 9-16-2Z'/></g>}
  {accessory===2&&<g fill='none' stroke='#82768c' strokeWidth='1.8'><rect x='-23' y='-72' width='19' height='15' rx='4'/><rect x='4' y='-72' width='19' height='15' rx='4'/><path d='M-4-66H4'/></g>}
  {accessory===3&&<g><path d='M-31-66v-15q0-25 31-25t31 25v15' fill='none' stroke='#ded1ec' strokeWidth='5'/><path d='M-35-75h9v18h-9Zm61 0h9v18h-9Z' fill='#c5dfed' stroke='#a2b9cb'/></g>}
  </g>
 </g>;
}
export function RoomAvatar({appearance,placement,preview=false}:{appearance:HomeState['avatar'];placement:CharacterPlacement;preview?:boolean}){
 const atlas=getCharacterAtlas(appearance.outfit),animation=atlas.states[placement.pose];
 const [frame,setFrame]=useState(placement.frame),[reducedMotion,setReducedMotion]=useState(false),frameRef=useRef(placement.frame);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReducedMotion(media.matches);change();media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
 useEffect(()=>{frameRef.current=placement.frame;setFrame(placement.frame);},[atlas.src,placement.pose,placement.frame]);
 useEffect(()=>{
  if(!placement.animated||reducedMotion||preview)return;
  let current=frameRef.current%animation.frames.length,timer:ReturnType<typeof setTimeout>;
  const advance=()=>{const next=current+1;if(next>=animation.frames.length&&!animation.loop)return;current=next%animation.frames.length;frameRef.current=current;setFrame(current);timer=setTimeout(advance,animation.durations[current]||1000/animation.fps);};
  timer=setTimeout(advance,animation.durations[0]||1000/animation.fps);
  return()=>clearTimeout(timer);
 },[atlas.src,animation,placement.animated,placement.frame,reducedMotion,preview]);
 const shown=animation.frames[(preview?(placement.pose==='dance'?2:0):frame)%animation.frames.length];
 return <g data-pose={placement.pose} data-frame={preview?0:frame} data-animated={placement.animated&&!reducedMotion&&!preview?'true':'false'}><Avatar {...appearance} sprite={{atlas,frame:shown,scale:poseDisplayScale[placement.pose]}}/></g>;
}
export function Furniture({kind,rotation=0}:{kind:FurnitureKind;rotation?:FurnitureRotation;accent?:string}){
 const {src,...frame}=getFurnitureArt(kind,rotation),view=furnitureView(rotation);
 return <g data-furniture-rotation={rotation} data-facing={view.rear?'rear':'front'} data-mirrored={view.mirrored?'true':'false'} transform={view.mirrored?'scale(-1 1)':undefined}><image className='generated-furniture' href={src} {...frame} preserveAspectRatio='xMidYMax meet'/></g>;
}
type RoomProps={state:HomeState;editing?:boolean;selected?:string|null;onSelect?:(id:string)=>void;onMove?:(id:string,x:number,y:number)=>void;onMoveCharacter?:(x:number,y:number)=>void;exportRef?:React.RefObject<SVGSVGElement|null>};
export default function Room({state,editing=false,selected,onSelect,onMove,onMoveCharacter,exportRef}:RoomProps){
 const svgRef=useRef<SVGSVGElement|null>(null);
 const drag=useRef<{id:string;offset:[number,number];pointerId:number}|null>(null);
 const [dragged,setDragged]=useState(false);
 const character=normalizeCharacter(state.character);
 const interactive=editing||Boolean(onMoveCharacter);
 function point(e:React.PointerEvent<SVGElement>):[number,number]|null{
  const matrix=svgRef.current?.getScreenCTM();if(!matrix)return null;
  const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());
  return unprojectRoomPoint(p.x,p.y);
 }
 function move(id:string,x:number,y:number){
  const nextX=clampRoomCoordinate(x),nextY=clampRoomCoordinate(y);
  if(id===CHARACTER_SELECTION)onMoveCharacter?.(nextX,nextY);else onMove?.(id,nextX,nextY);
 }
 function start(e:React.PointerEvent<SVGGElement>,id:string,x:number,y:number){
  if(e.button!==0)return;
  const p=point(e);if(!p)return;
  e.preventDefault();e.stopPropagation();e.currentTarget.focus({preventScroll:true});onSelect?.(id);
  drag.current={id,offset:[p[0]-x,p[1]-y],pointerId:e.pointerId};
  svgRef.current?.setPointerCapture(e.pointerId);
 }
 function finish(e:React.PointerEvent<SVGSVGElement>){
  if(svgRef.current?.hasPointerCapture(e.pointerId))svgRef.current.releasePointerCapture(e.pointerId);
  drag.current=null;setDragged(false);
 }
 function keyMove(e:React.KeyboardEvent<SVGGElement>,id:string,x:number,y:number){
  if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect?.(id);return;}
  const delta=roomArrowDelta(e.key,e.shiftKey?.4:.16);if(!delta)return;
  e.preventDefault();onSelect?.(id);move(id,x+delta[0],y+delta[1]);
 }
 const ordered:({id:string;x:number;y:number;character:true}|(Item&{character?:false}))[]=[...state.items,{id:CHARACTER_SELECTION,x:character.x,y:character.y,character:true}];
 ordered.sort((a,b)=>{
  const rugA=!a.character&&a.kind==='rug',rugB=!b.character&&b.kind==='rug';
  if(rugA!==rugB)return rugA?-1:1;
  return a.x+a.y-b.x-b.y;
 });
 return <svg ref={el=>{svgRef.current=el;if(exportRef)exportRef.current=el;}} className={'room-svg '+(editing?'editing ':'')+(onMoveCharacter?'character-movable':'')} viewBox='85 35 530 485' xmlns='http://www.w3.org/2000/svg' role={interactive?'group':'img'} aria-label={interactive?'나의 취향방. 캐릭터를 드래그하거나 선택 후 방향키로 이동할 수 있어요.':'나의 취향방. 가구와 나의 캐릭터'} onPointerMove={e=>{const active=drag.current;if(active&&active.pointerId===e.pointerId){const p=point(e);if(p){setDragged(true);move(active.id,p[0]-active.offset[0],p[1]-active.offset[1]);}}}} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={()=>{drag.current=null;setDragged(false);}}>
  <image href={roomArt} x='115' y='40' width='470' height='480' preserveAspectRatio='none' style={{filter:state.mood==='pink'?'hue-rotate(290deg)':state.mood==='lavender'?'hue-rotate(28deg)':state.mood==='mint'?'hue-rotate(320deg)':undefined}}/>
  {ordered.map(entity=>{
   const [x,y]=projectRoomPoint(entity.x,entity.y);
   const canMove=entity.character?Boolean(onMoveCharacter):editing;
   const label=entity.character?'내 캐릭터':furniture.find(f=>f.kind===entity.kind)?.name;
   return <g key={entity.id} data-room-entity={entity.character?'character':entity.id} transform={`translate(${x} ${y})`} role={canMove?'button':undefined} tabIndex={canMove?0:undefined} aria-label={canMove?`${label} 선택, 방향키로 이동`:undefined} aria-pressed={canMove?selected===entity.id:undefined} onKeyDown={canMove?e=>keyMove(e,entity.id,entity.x,entity.y):undefined} onPointerDown={canMove?e=>start(e,entity.id,entity.x,entity.y):undefined} style={{cursor:canMove?(dragged?'grabbing':'grab'):'default',touchAction:canMove?'none':undefined}}>
    {canMove&&selected===entity.id&&<ellipse className='placement-ring' rx={entity.character?34:47} ry={entity.character?13:20} cy='4' fill='#d7f3ff' fillOpacity='.5' stroke='#2574be' strokeWidth='1.6' strokeDasharray='5 4'/>}
    {entity.character?<><ellipse rx='23' ry='7' cy='3' fill='#577da8' opacity='.13'/><RoomAvatar appearance={state.avatar} placement={character}/>{canMove&&<rect x='-52' y='-126' width='104' height='140' fill='transparent' className='character-hit-area'/>}</>:<Furniture kind={entity.kind} rotation={getFurnitureRotation(entity)}/>}
   </g>;
  })}
 </svg>;
}
