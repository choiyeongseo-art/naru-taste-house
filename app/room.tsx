'use client';
import { useId, useRef, useState } from 'react';
import { furnitureArt, roomArt } from './art';
import { furniture, type HomeState, type Item, type FurnitureKind } from './data';

export const themes={blue:{wall:'#d6f6fd',wall2:'#fff9dc',floor:'#e5f0f5',accent:'#c1dfea',dark:'#9ebcca'},pink:{wall:'#ffd7f2',wall2:'#fff5f9',floor:'#f2e7ed',accent:'#ebcadc',dark:'#c4a7b7'},lavender:{wall:'#ecd7ff',wall2:'#f5edff',floor:'#eae4f3',accent:'#d9c9ec',dark:'#b5a6c8'},mint:{wall:'#d2fad3',wall2:'#f2fbef',floor:'#e5efe5',accent:'#c1e0cb',dark:'#a3bdad'}};
const project=(x:number,y:number)=>[350+(x-y)*44,255+(x+y)*23];

export function Avatar({hair=0,outfit=0,accessory=0}:HomeState['avatar']){
 const id='avatar-'+useId().replace(/:/g,'');
 const src=['./art/avatar-base.webp','./art/avatar-pink.webp','./art/avatar-lilac.webp','./art/avatar-mint.webp'][outfit]||'./art/avatar-base.webp';
 const hairTone=[[1,1,1],[.84,.72,.64],[1,.80,.87],[.87,.77,.98]][hair]||[1,1,1];
 const tintMatrix=`0 0 ${hairTone[0]} 0 0.04  0 0 ${hairTone[1]} 0 0.04  0 0 ${hairTone[2]} 0 0.04  0 0 0 1 0`;
 return <g>
  {hair!==0&&<defs><filter id={id} colorInterpolationFilters='sRGB' x='-5%' y='-5%' width='110%' height='110%'>
   <feColorMatrix in='SourceGraphic' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -8 8 0 0 -0.15' result='green-over-red'/>
   <feColorMatrix in='SourceGraphic' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 -12 12 0 -0.05' result='blue-over-green'/>
   <feComposite in='green-over-red' in2='blue-over-green' operator='in' result='hair-mask'/>
   <feColorMatrix in='SourceGraphic' type='matrix' values={tintMatrix} result='tinted-hair'/>
   <feComposite in='tinted-hair' in2='hair-mask' operator='in' result='masked-tint'/>
   <feComposite in='masked-tint' in2='SourceGraphic' operator='over'/>
  </filter></defs>}
  <image className='generated-avatar' href={src} x='-49' y='-118' width='98' height='134' preserveAspectRatio='xMidYMax meet' filter={hair!==0?'url(#'+id+')':undefined}/>
  {accessory===1&&<g transform='translate(23 -78)' fill='#fff9dc' stroke='#a1bed1' strokeWidth='1'><path d='M-8 0q4-9 10-4-4 2-3 5 5-3 9 1-8 9-16-2Z'/></g>}
  {accessory===2&&<g fill='none' stroke='#82768c' strokeWidth='1.8'><rect x='-23' y='-72' width='19' height='15' rx='4'/><rect x='4' y='-72' width='19' height='15' rx='4'/><path d='M-4-66H4'/></g>}
  {accessory===3&&<g><path d='M-31-66v-15q0-25 31-25t31 25v15' fill='none' stroke='#ded1ec' strokeWidth='5'/><path d='M-35-75h9v18h-9Zm61 0h9v18h-9Z' fill='#c5dfed' stroke='#a2b9cb'/></g>}
 </g>;
}
export function Furniture({kind}:{kind:FurnitureKind;accent?:string}){
 const {src,...frame}=furnitureArt[kind];
 return <image className='generated-furniture' href={src} {...frame} preserveAspectRatio='xMidYMax meet'/>;
}
export default function Room({state,editing=false,selected,onSelect,onMove,exportRef}:{state:HomeState;editing?:boolean;selected?:string|null;onSelect?:(id:string)=>void;onMove?:(id:string,x:number,y:number)=>void;exportRef?:React.RefObject<SVGSVGElement|null>}){
 const svgRef=useRef<SVGSVGElement|null>(null),drag=useRef<string|null>(null);const [dragged,setDragged]=useState(false);
 function point(e:React.PointerEvent<SVGSVGElement>){const el=svgRef.current;if(!el)return null;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(el.getScreenCTM()!.inverse());const a=(p.x-350)/44,b=(p.y-255)/23;return [Math.max(.2,Math.min(4.8,(a+b)/2)),Math.max(.2,Math.min(4.8,(b-a)/2))];}
 const ordered=[...state.items].sort((a,b)=>a.kind==='rug'&&b.kind!=='rug'?-1:b.kind==='rug'&&a.kind!=='rug'?1:a.x+a.y-b.x-b.y);
 return <svg ref={el=>{svgRef.current=el;if(exportRef)exportRef.current=el;}} className={'room-svg '+(editing?'editing':'')} viewBox='85 35 530 485' xmlns='http://www.w3.org/2000/svg' role={editing?'group':'img'} aria-label='파스텔 쿼터뷰 취향방. 소파, 책상, 선반과 나의 캐릭터' onPointerMove={e=>{if(drag.current){const p=point(e);if(p){setDragged(true);onMove?.(drag.current,p[0],p[1]);}}}} onPointerUp={()=>{drag.current=null;setDragged(false);}} onPointerCancel={()=>{drag.current=null;setDragged(false);}}>
  <image href={roomArt} x='115' y='40' width='470' height='480' preserveAspectRatio='none' style={{filter:state.mood==='pink'?'hue-rotate(290deg)':state.mood==='lavender'?'hue-rotate(28deg)':state.mood==='mint'?'hue-rotate(320deg)':undefined}}/>
  {ordered.map(item=>{const [x,y]=project(item.x,item.y);return <g key={item.id} transform={`translate(${x} ${y})`} role={editing?'button':undefined} tabIndex={editing?0:undefined} aria-label={editing?`${furniture.find(f=>f.kind===item.kind)?.name} 선택, 방향키로 이동`:undefined} onKeyDown={e=>{if(!editing)return;let dx=0,dy=0;if(e.key==='ArrowRight')dx=.25;if(e.key==='ArrowLeft')dx=-.25;if(e.key==='ArrowDown')dy=.25;if(e.key==='ArrowUp')dy=-.25;if(dx||dy){e.preventDefault();onSelect?.(item.id);onMove?.(item.id,Math.max(.2,Math.min(4.8,item.x+dx)),Math.max(.2,Math.min(4.8,item.y+dy)));}}} onPointerDown={e=>{if(editing){e.stopPropagation();onSelect?.(item.id);drag.current=item.id;svgRef.current?.setPointerCapture(e.pointerId);}}} style={{cursor:editing?(dragged?'grabbing':'grab'):'default'}}>{editing&&selected===item.id&&<ellipse rx='47' ry='20' fill='#fff' fillOpacity='.3' stroke='#5794c5' strokeWidth='2' strokeDasharray='5 4'/>}<g transform={item.flip?'scale(-1 1)':undefined}><Furniture kind={item.kind} /></g></g>})}
  <g transform='translate(367 404) scale(.96)'><Avatar {...state.avatar}/></g>
 </svg>;
}
