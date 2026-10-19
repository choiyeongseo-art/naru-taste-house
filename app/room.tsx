'use client';
import { useRef, useState } from 'react';
import { furniture, type HomeState, type Item, type FurnitureKind } from './data';

export const themes={blue:{wall:'#dceefa',wall2:'#edf5fc',floor:'#e4e9f3',accent:'#99cbe8',dark:'#79add0'},pink:{wall:'#f6e1ec',wall2:'#fff0f5',floor:'#eee3ea',accent:'#eab7cd',dark:'#cf91ad'},lavender:{wall:'#e8e1f8',wall2:'#f2edff',floor:'#e6e3f3',accent:'#c2b1e7',dark:'#a293cb'},mint:{wall:'#dcefe7',wall2:'#eef8f2',floor:'#e3ece6',accent:'#a1d2c1',dark:'#7fb5a0'}};
const project=(x:number,y:number)=>[350+(x-y)*44,255+(x+y)*23];

export function Avatar({hair=0,outfit=0,accessory=0}:HomeState['avatar']){
 const hc=['#8cc8e8','#705b6a','#efb9cf','#b6a3df'][hair],oc=['#9bcdea','#eebbd2','#c4b4e7','#a9d7c6'][outfit];
 return <g stroke='#576b82' strokeWidth='1.7' strokeLinejoin='round'>
  <ellipse cx='0' cy='2' rx='30' ry='8' fill='#7f9caf' opacity='.18' stroke='none'/>
  <path d='M-20-70Q-39-49-29-25L30-25Q40-53 19-71' fill={hc}/>
  {hair===2&&<><ellipse cx='-34' cy='-51' rx='13' ry='25' fill={hc}/><ellipse cx='34' cy='-51' rx='13' ry='25' fill={hc}/></>}
  <path d='M-13-23v20h10l3-17 3 17h11v-21' fill='#ffe8d9'/>
  <path d='M-17-4h14v9h-19q-3-7 5-9M4-4h13q9 2 6 9H4Z' fill='#fffaf5'/>
  <path d='M-19-47Q-31-41-33-27q4 6 9 0l6-12M18-47q14 6 15 20-5 6-10 0l-5-12' fill='#ffe8d9'/>
  <path d={outfit===1?'M-16-48H16L24-19H-24Z':'M-16-49H16L20-23H-20Z'} fill={oc}/>
  <path d='M-17-47q17 14 34 0' fill='none' stroke='#fff'/><path d='M-15-23h30' stroke='#fff' strokeWidth='3'/>
  <path d='M-29-70Q-28-95 0-95T29-69v14Q25-37 0-38T-29-55Z' fill='#ffeadb'/>
  <path d='M-31-63v-16Q-28-105 0-103q30 0 33 28v15l-10-4-3-17-10 10-4-9-9 10-7-8-11 15Z' fill={hc}/>
  {hair===3&&<><circle cx='-26' cy='-99' r='12' fill={hc}/><circle cx='26' cy='-99' r='12' fill={hc}/></>}
  <ellipse cx='-13' cy='-58' rx='4.2' ry='7' fill='#37485b' stroke='none'/><ellipse cx='13' cy='-58' rx='4.2' ry='7' fill='#37485b' stroke='none'/>
  <ellipse cx='-12' cy='-60' rx='1.4' ry='2.6' fill='white' stroke='none'/><ellipse cx='14' cy='-60' rx='1.4' ry='2.6' fill='white' stroke='none'/>
  <ellipse cx='-22' cy='-50' rx='5' ry='2.5' fill='#efb7bd' opacity='.65' stroke='none'/><ellipse cx='22' cy='-50' rx='5' ry='2.5' fill='#efb7bd' opacity='.65' stroke='none'/>
  <path d='M-3-48q3 4 6 0' fill='none'/>
  {accessory===1&&<g transform='translate(24 -81) rotate(15)' stroke='#81acc9' strokeWidth='1'><path d='M-11 0Q-7-10 0-4q4-8 10-3l-5 6 4 5Q1 8-2 2q-5 6-9-2' fill='#fffdf5'/></g>}
  {accessory===2&&<g fill='none' stroke='#7b678f' strokeWidth='2'><rect x='-24' y='-66' width='19' height='15' rx='4'/><rect x='5' y='-66' width='19' height='15' rx='4'/><path d='M-5-60H5'/></g>}
  {accessory===3&&<><path d='M-32-63q-3-40 32-40t32 40' fill='none' stroke='#fff5d8' strokeWidth='7'/><rect x='-37' y='-68' width='10' height='19' rx='4' fill='#c2b3e3'/><rect x='27' y='-68' width='10' height='19' rx='4' fill='#c2b3e3'/></>}
  {outfit===3&&<path d='M-19-37h38v6h-38' fill='#fffcf0' stroke='none'/>}
 </g>;
}
function Block({x=0,y=0,w=36,d=25,h=25,color='#bdd8ec',side='#a1bcd5',top='#e8f3fb'}:{x?:number;y?:number;w?:number;d?:number;h?:number;color?:string;side?:string;top?:string}){
 const p=(a:number,b:number,c:number)=>[x+(a-b)*.9,y+(a+b)*.46-c].join(',');
 return <g stroke='#7496b0' strokeOpacity='.35' strokeWidth='1'><polygon points={[p(0,0,0),p(w,0,0),p(w,0,h),p(0,0,h)].join(' ')} fill={color}/><polygon points={[p(w,0,0),p(w,d,0),p(w,d,h),p(w,0,h)].join(' ')} fill={side}/><polygon points={[p(0,0,h),p(w,0,h),p(w,d,h),p(0,d,h)].join(' ')} fill={top}/></g>;
}
export function Furniture({kind,accent='#a9d8f3'}:{kind:FurnitureKind;accent?:string}){
 switch(kind){
 case 'sofa':return <g><ellipse cy='11' rx='70' ry='23' fill='#718ca0' opacity='.12'/><Block x={-39} y={-6} w={84} d={34} h={18} color={accent} side='#a2bad6' top='#deebfa'/><path d='M-65-27q-5-24 8-31l67 29q10 5 7 20L-1 5-64-22Z' fill='#c4c5ed' stroke='#a2a7cf' strokeWidth='1.2'/><path d='m-62-43 64 28M-41-49v25M-17-38v25' fill='none' stroke='#e9e6ff' strokeWidth='2'/><path d='m-58-15 58 27 42-20-63-29Z' fill='#dcd9f6' stroke='#adaed4'/><path d='M-67-29q-6-9-11-1v24q0 8 9 10l13 4v-18Z' fill='#c4c6e9' stroke='#a3a7cb'/><path d='M2-1q-9-10-15-3v23q-1 8 9 10l15-8v-22Z' fill='#bbc0e5' stroke='#a3a7cb'/><path d='m-35-31 17 7 2 17-20-7Z' fill='#fff8de' stroke='#d8d0b0'/><path d='m-57-40 17 8-2 17-17-9Z' fill='#f1cde2' stroke='#ccafc4'/><path d='M-65 6v8M4 28v9M38 6v9' stroke='#9d92a4' strokeWidth='4'/></g>;
 case 'desk':return <g><ellipse cy='16' rx='52' ry='15' fill='#718ca0' opacity='.12'/><path d='M-35-4v28M34-5v28M12-28v26' stroke='#9fb8c8' strokeWidth='5'/><Block x={-13} y={-12} w={59} d={35} h={8} color='#b8d5e6' side='#a1b9cc' top='#f5fafc'/><path d='M-5-18v-32l27 12v30Z' fill='#a0bad0' stroke='#7496b0'/><path d='M-1-32v-12l18 8v13Z' fill='#d9edff'/><path d='M0-28l11 4' stroke='white'/><path d='m-7-8 17 8 16-7-17-8Z' fill='#d6e1ef' stroke='#a3b7cc'/><path d='m-35-20 12 6 12-5-13-6Z' fill='#eed6e6'/><path d='M-32-21v-9' stroke='#a9a5bc' strokeWidth='3'/><ellipse cx='-32' cy='-31' rx='5' ry='3' fill='#fff3ce'/></g>;
 case 'plant':return <g><ellipse cy='9' rx='23' ry='9' fill='#718ca0' opacity='.1'/><path d='M-15-15-11 9q11 8 22 0l4-24' fill='#fff2d8' stroke='#d4bf9b'/><ellipse cy='-15' rx='15' ry='6' fill='#e3c9ac' stroke='#d4bf9b'/><path d='M0-15v-46' stroke='#83ad8b' strokeWidth='3'/><path d='M0-31Q-38-58-20-65q24 4 20 34M0-43Q8-82 24-68q9 16-24 25M0-20q-28-4-28-24 16-10 28 24M0-26q26-33 32-13-2 13-32 13' fill='#a6cdb0' stroke='#88b394' strokeWidth='1.1'/></g>;
 case 'lamp':return <g><ellipse rx='21' ry='8' fill='#c0cde0' stroke='#a5b7ce'/><path d='M0-2v-68' stroke='#aebdd3' strokeWidth='4'/><path d='M-16-91h32l13 30q-29 13-58 0Z' fill='#fff3cd' stroke='#d6c898'/><ellipse cy='-91' rx='16' ry='5' fill='#fff9e3' stroke='#d6c898'/><path d='M8-63v14' stroke='#b5a66b'/><circle cx='8' cy='-48' r='2' fill='#b5a66b'/></g>;
 case 'shelf':return <g><Block x={-18} w={50} d={20} h={82} color='#c4dced' side='#b2cade' top='#f0f7fc'/>{[0,1,2].map(i=><g key={i} transform={`translate(0 ${i*24})`}><path d='m-15-75 38 18v19l-38-18Z' fill='#edf6fc'/>{[0,1,2,3].map(j=><path key={j} d={`m${-12+j*8} ${-70+j*3.7} 5 2v13l-5-2Z`} fill={['#f0c5d7','#c0b7dd','#a8c6da','#e9dcac'][j]}/>)}</g>)}<path d='m-15-53 38 18M-15-29l38 18' stroke='#a5bfd3' strokeWidth='2'/><circle cx='9' cy='-81' r='8' fill='#fff3c9' stroke='#d8ceaa'/></g>;
 case 'rug':return <g transform='scale(1 .49) rotate(-3)'><ellipse rx='105' ry='74' fill='#fff8e8' stroke='#e2d8c3' strokeWidth='3'/><ellipse rx='94' ry='63' fill='none' stroke='#eadde1' strokeWidth='2' strokeDasharray='3 5'/><path d='M-25 8Q-20-37 0-17q25-23 31 7L0 34Z' fill='#efccdc' opacity='.7'/></g>;
 case 'cat':return <g fill='#fff2d8' stroke='#bda88d' strokeWidth='1.2'><ellipse cy='-2' rx='26' ry='13'/><path d='M-22-4q-22 8-17-6 3-8 8-3' fill='none' strokeWidth='5'/><path d='M2-11 0-24l12 7 11-6 2 20Q14 8 1-3Z'/><path d='m6-6 4 2m7-2 4-2' stroke='#806e64'/></g>;
 case 'stereo':return <g><Block x={-9} y={0} w={30} d={18} h={23} color='#c5d7e8' side='#a7bed4' top='#e9f3fb'/><ellipse cx='2' cy='-10' rx='6' ry='8' transform='rotate(25 2 -10)' fill='#aec3d7' stroke='#89a7c0'/><ellipse cx='14' cy='-4' rx='3' ry='4' fill='#e9f3ff'/><path d='M-5-28v-9l22 10v9' fill='none' stroke='#91aec6' strokeWidth='3'/></g>;
 case 'flowers':return <g><path d='M-8-21-6 3q6 6 12 0l2-24' fill='#d0e8f5' stroke='#93bdd3'/><path d='M0-16v-28M0-16l-13-23M0-16l12-24' stroke='#8db897' strokeWidth='2'/>{[[0,-47],[-14,-39],[13,-41]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`} fill={i%2?'#f2c5da':'#ded1f3'}><circle cx='-5' r='6'/><circle cx='5' r='6'/><circle cy='-5' r='6'/><circle cy='5' r='6'/><circle r='3' fill='#fff0bf'/></g>)}</g>;
 }
}
export default function Room({state,editing=false,selected,onSelect,onMove,exportRef}:{state:HomeState;editing?:boolean;selected?:string|null;onSelect?:(id:string)=>void;onMove?:(id:string,x:number,y:number)=>void;exportRef?:React.RefObject<SVGSVGElement|null>}){
 const svgRef=useRef<SVGSVGElement|null>(null),drag=useRef<string|null>(null);const [dragged,setDragged]=useState(false);const t=themes[state.mood];
 function point(e:React.PointerEvent<SVGSVGElement>){const el=svgRef.current;if(!el)return null;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(el.getScreenCTM()!.inverse());const a=(p.x-350)/44,b=(p.y-255)/23;return [Math.max(.2,Math.min(4.8,(a+b)/2)),Math.max(.2,Math.min(4.8,(b-a)/2))];}
 const ordered=[...state.items].sort((a,b)=>a.kind==='rug'&&b.kind!=='rug'?-1:b.kind==='rug'&&a.kind!=='rug'?1:a.x+a.y-b.x-b.y);
 return <svg ref={el=>{svgRef.current=el;if(exportRef)exportRef.current=el;}} className={'room-svg '+(editing?'editing':'')} viewBox='85 35 530 485' xmlns='http://www.w3.org/2000/svg' role={editing?'group':'img'} aria-label='파스텔 쿼터뷰 취향방. 소파, 책상, 선반과 나의 캐릭터' onPointerMove={e=>{if(drag.current){const p=point(e);if(p){setDragged(true);onMove?.(drag.current,p[0],p[1]);}}}} onPointerUp={()=>{drag.current=null;setDragged(false);}} onPointerCancel={()=>{drag.current=null;setDragged(false);}}>
  <defs><linearGradient id='sky' x2='0' y2='1'><stop stopColor='#e6f3ff'/><stop offset='1' stopColor='#fffdf8'/></linearGradient><linearGradient id='glass' x2='1' y2='1'><stop stopColor='#fff' stopOpacity='.9'/><stop offset='1' stopColor='#a9d8f3' stopOpacity='.25'/></linearGradient><filter id='roomshadow'><feGaussianBlur stdDeviation='10'/></filter><clipPath id='floorclip'><polygon points='350,255 570,370 350,485 130,370'/></clipPath></defs>
  <ellipse cx='353' cy='463' rx='232' ry='44' fill='#7897b0' opacity='.12' filter='url(#roomshadow)'/>
  <polygon points='130,370 350,485 570,370 570,386 350,502 130,386' fill='#bdcfe0'/><polygon points='130,370 350,485 350,502 130,386' fill='#cddde9'/>
  <polygon points='130,175 350,60 350,255 130,370' fill={t.wall}/><polygon points='350,60 570,175 570,370 350,255' fill={t.wall2}/>
  <g stroke='#fff' opacity='.4' strokeWidth='1'>{Array.from({length:10},(_,i)=><path key={i} d={`M${130+i*22} ${175-i*11.5}v195M${350+i*22} ${60+i*11.5}v195`}/>)}</g>
  <polygon points='350,255 570,370 350,485 130,370' fill={t.floor}/>
  <g clipPath='url(#floorclip)' stroke='#c2cedd' strokeWidth='1' opacity='.75'>{Array.from({length:11},(_,i)=>{const a=project(i/2,0),b=project(i/2,5),c=project(0,i/2),d=project(5,i/2);return <g key={i}><path d={`M${a}L${b}`}/><path d={`M${c}L${d}`}/></g>})}</g>
  <path d='M130 362 350 247 570 362' stroke='#b4ccdf' strokeWidth='6' fill='none'/><path d='M130 177 350 62 570 177' stroke='white' strokeWidth='5' fill='none'/>
  <g transform='matrix(1 -.52 0 1 176 194)'><rect x='-4' y='-4' width='114' height='111' rx='8' fill='#b6cadc'/><rect width='106' height='103' rx='4' fill='url(#sky)'/><path d='M0 77q26-7 52 1t54-2v27H0' fill='#b6dff3'/><path d='M0 87q26-7 52 1t54-2' stroke='white' strokeWidth='3' fill='none'/><circle cx='76' cy='25' r='12' fill='#fff8d2'/><path d='M5 36q4-15 17-10 8-14 18 0 15-1 14 10' fill='white'/><path d='M53 0v103M0 54h106' stroke='#fffdf9' strokeWidth='5'/><path d='M-12-7v118M116-7v118' stroke='#f6f3ed' strokeWidth='13'/><path d='M-13-8h131' stroke='#9cb7cf' strokeWidth='5'/></g>
  <g transform='matrix(1 .52 0 1 421 139)'><rect x='-4' y='-4' width='54' height='62' rx='4' fill='#c9b3ca'/><rect width='46' height='54' fill='#fffaf2'/><path d='M4 42 20 24l10 11 12-18v33H4' fill='#b4d7df'/><circle cx='15' cy='14' r='7' fill='#f5d5d4'/></g>
  <g transform='matrix(1 .52 0 1 493 211)'><path d='M-10 0H42v5H-10' fill='#abc5d9'/><rect x='0' y='-19' width='13' height='19' rx='2' fill='#dfcee8'/><path d='M6-19v-10' stroke='#9ebaa5' strokeWidth='2'/><circle cx='6' cy='-30' r='8' fill='#d0e6c8'/><rect x='23' y='-13' width='10' height='13' fill='#f4e3b9'/></g>
  <g fill='#fff' opacity='.9'><path d='m104 246 3-9 3 9 9 3-9 3-3 9-3-9-9-3Z'/><path d='m593 291 2-7 2 7 7 2-7 2-2 7-2-7-7-2Z'/><circle cx='109' cy='277' r='2'/><circle cx='596' cy='314' r='3'/></g>
  {ordered.map(item=>{const [x,y]=project(item.x,item.y);return <g key={item.id} transform={`translate(${x} ${y})`} role={editing?'button':undefined} tabIndex={editing?0:undefined} aria-label={editing?`${furniture.find(f=>f.kind===item.kind)?.name} 선택, 방향키로 이동`:undefined} onKeyDown={e=>{if(!editing)return;let dx=0,dy=0;if(e.key==='ArrowRight')dx=.25;if(e.key==='ArrowLeft')dx=-.25;if(e.key==='ArrowDown')dy=.25;if(e.key==='ArrowUp')dy=-.25;if(dx||dy){e.preventDefault();onSelect?.(item.id);onMove?.(item.id,Math.max(.2,Math.min(4.8,item.x+dx)),Math.max(.2,Math.min(4.8,item.y+dy)));}}} onPointerDown={e=>{if(editing){e.stopPropagation();onSelect?.(item.id);drag.current=item.id;svgRef.current?.setPointerCapture(e.pointerId);}}} style={{cursor:editing?(dragged?'grabbing':'grab'):'default'}}>{editing&&selected===item.id&&<ellipse rx='47' ry='20' fill='#fff' fillOpacity='.3' stroke='#5794c5' strokeWidth='2' strokeDasharray='5 4'/>}<g transform={item.flip?'scale(-1 1)':undefined}><Furniture kind={item.kind} accent={t.accent}/></g></g>})}
  <g transform='translate(367 404) scale(.96)'><Avatar {...state.avatar}/></g>
  <g transform='translate(307 278)'><path d='M0 0q-4-8-11-4-7 7 11 18 18-11 11-18Q4-8 0 0' fill='#f1c1d7' stroke='#d69ab7'/></g>
 </svg>;
}
