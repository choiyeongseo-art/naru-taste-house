import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play, RotateCcw } from 'lucide-react';
import { RoomAvatar } from './room';
import { characterPoses, DEFAULT_CHARACTER, normalizeCharacter, roomArrowDelta, type CharacterPlacement } from './character';
import type { HomeState } from './data';

export default function CharacterControls({state,onChange,onSelect,onToggleMotion}:{state:HomeState;onChange:(patch:Partial<CharacterPlacement>)=>void;onSelect:()=>void;onToggleMotion:()=>void}) {
  const placement=normalizeCharacter(state.character);
  function nudge(key:string){const d=roomArrowDelta(key,.3);if(d){onSelect();onChange({x:placement.x+d[0],y:placement.y+d[1]});}}
  return <div className='character-controls'>
    <div className='character-controls-heading'><h3>오늘의 포즈</h3><span>CHOOSE A POSE</span></div>
    <div className='pose-grid'>
      {characterPoses.map(p=><button key={p.id} type='button' className={'pose-option '+(placement.pose===p.id?'selected':'')} aria-pressed={placement.pose===p.id} onClick={()=>{onSelect();onChange({pose:p.id,frame:0});}}>
        <span className='pose-preview'><svg viewBox='-68 -142 136 160' aria-hidden='true'><RoomAvatar appearance={state.avatar} placement={{...placement,pose:p.id,animated:false}} preview/></svg></span><span>{p.label}</span>{placement.pose===p.id&&<span className='pose-indicator' aria-hidden='true'>✦</span>}
      </button>)}
    </div>
    <p className='pose-description'>{characterPoses.find(p=>p.id===placement.pose)?.description}</p>
    <button type='button' className='motion-toggle' aria-pressed={placement.animated} onClick={onToggleMotion}>{placement.animated?<Pause size={15}/>:<Play size={15}/>} {placement.animated?'동작 멈추기':'동작 재생하기'}</button>
    <div className='character-position-heading'><h3>캐릭터 위치</h3><button type='button' className='text-button' onClick={()=>{onSelect();onChange({x:DEFAULT_CHARACTER.x,y:DEFAULT_CHARACTER.y});}}><RotateCcw size={13}/> 처음 위치</button></div>
    <div className='character-position-controls'><div className='character-dpad'>
      <button type='button' className='dpad-up' aria-label='캐릭터를 위로 이동' onClick={()=>nudge('ArrowUp')}><ArrowUp size={19}/></button>
      <button type='button' className='dpad-left' aria-label='캐릭터를 왼쪽으로 이동' onClick={()=>nudge('ArrowLeft')}><ArrowLeft size={19}/></button>
      <span className='dpad-center emoji emoji-mono' aria-hidden='true'>⭐</span>
      <button type='button' className='dpad-right' aria-label='캐릭터를 오른쪽으로 이동' onClick={()=>nudge('ArrowRight')}><ArrowRight size={19}/></button>
      <button type='button' className='dpad-down' aria-label='캐릭터를 아래로 이동' onClick={()=>nudge('ArrowDown')}><ArrowDown size={19}/></button>
    </div><p>방 안의 캐릭터를<br/>드래그해 옮겨 보세요.<br/><small>선택 후 방향키로도 이동해요.</small></p></div>
    <p className='character-save-hint'>위치와 포즈는 방과 함께 자동 저장돼요.</p>
  </div>;
}
