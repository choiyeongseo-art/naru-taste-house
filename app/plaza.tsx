'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, MessageCircle, Radio, Send, Users, VolumeX, Waves } from 'lucide-react';
import { RoomAvatar } from './room';
import { characterPoses, DEFAULT_CHARACTER, type CharacterPose } from './character';
import type { HomeState } from './data';
import { clampBeach, projectBeach, stepToward, unprojectBeach } from './plaza-model';
import { usePlaza } from './use-plaza';

export default function Plaza({state,onExit}:{state:HomeState;onExit:()=>void}){
  const [attempt,setAttempt]=useState(0);
  return <PlazaSession key={attempt} state={state} onExit={onExit} reconnect={()=>setAttempt(n=>n+1)}/>;
}
function PlazaSession({state,onExit,reconnect}:{state:HomeState;onExit:()=>void;reconnect:()=>void}){
  const {id,people,messages,status,error,move,send,initial}=usePlaza(state);
  const [draft,setDraft]=useState(''),[sending,setSending]=useState(false),[pose,setPose]=useState<CharacterPose>('idle'),[muted,setMuted]=useState<string[]>([]),[now,setNow]=useState(Date.now());
  const scene=useRef<SVGSVGElement>(null),log=useRef<HTMLDivElement>(null),input=useRef<HTMLInputElement>(null);
  const position=useRef({x:initial.x,y:initial.y}),target=useRef({...position.current}),poseRef=useRef(pose);
  poseRef.current=pose;
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
  useEffect(()=>{log.current?.scrollTo({top:log.current.scrollHeight,behavior:'smooth'});},[messages]);
  useEffect(()=>{
    let frame=0,last=0,wasMoving=false;
    function tick(t:number){
      const dt=Math.min(.05,(t-(last||t))/1000);last=t;
      const next=stepToward(position.current,target.current,dt*.32);
      const moving=Math.hypot(next.x-position.current.x,next.y-position.current.y)>.00001;
      if(moving){position.current=next;move({...next,pose:'idle'});wasMoving=true;}
      else if(wasMoving){move({...next,pose:poseRef.current},true);wasMoving=false;}
      frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[move]);
  function choosePose(value:CharacterPose){setPose(value);poseRef.current=value;target.current={...position.current};move({...position.current,pose:value},true);}
  const present=Object.values(people).sort((a,b)=>a.x+a.y-b.x-b.y);
  const visibleMessages=messages.filter(m=>!muted.includes(m.sender));
  async function submit(e:React.FormEvent){e.preventDefault();if(sending)return;setSending(true);try{if(await send(draft))setDraft('');}finally{setSending(false);input.current?.focus();}}
  return <section className='plaza-page' aria-label='해운대 실시간 광장'>
    <div className='plaza-heading'><div><span className='eyebrow'><Radio size={13}/> HAEUNDAE / LIVE PLAZA</span><h1>우리, 해운대에서 만나<span className='emoji' aria-hidden='true'>🫧</span></h1><p>내 캐릭터로 걷고, 같은 바다 앞에서 이야기해요.</p></div><button className='button' onClick={onExit}><ArrowLeft size={15}/> 내 방으로</button></div>
    <div className='plaza-layout'>
      <div className='plaza-world-panel'>
        <div className='plaza-world-bar'><span><Waves size={18}/> 해운대 모래사장</span><span className={'plaza-connection '+status} role='status'><i/>{status==='online'?'실시간 연결됨':status==='connecting'?'연결하는 중…':'연결 확인 필요'}</span><span><Users size={14}/>{status==='online'?`${present.length}명 접속`:'나만 보기'}</span></div>
        <svg ref={scene} className='plaza-scene' viewBox='0 0 1000 667' role='application' aria-label='해운대 모래사장. 바닥을 클릭하거나 방향키로 캐릭터를 이동하세요.' tabIndex={0}
          onClick={e=>{if(e.button!==0)return;const svg=scene.current,ctm=svg?.getScreenCTM();if(!svg||!ctm)return;const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const point=p.matrixTransform(ctm.inverse());target.current=unprojectBeach(point.x,point.y);svg.focus({preventScroll:true});}}
          onKeyDown={e=>{const steps:Record<string,[number,number]>={ArrowLeft:[-.025,.025],ArrowRight:[.025,-.025],ArrowUp:[-.025,-.025],ArrowDown:[.025,.025]};const d=steps[e.key];if(d){e.preventDefault();target.current=clampBeach(target.current.x+d[0],target.current.y+d[1]);}else if(e.key==='Enter'){e.preventDefault();input.current?.focus();}}}>
          <image href='./art/destinations/haeundae-plaza-v2.png' width='1000' height='667' preserveAspectRatio='none'/>
          <g className='plaza-shore-hint' pointerEvents='none'><text x='784' y='142' textAnchor='middle'>AQUA COAST</text><path d='m771 156 13 7 13-7' fill='none' stroke='#effeff' strokeWidth='2'/></g>
          {Math.hypot(target.current.x-position.current.x,target.current.y-position.current.y)>.01&&(()=>{const p=projectBeach(target.current.x,target.current.y);return <ellipse cx={p.x} cy={p.y} rx='15' ry='7' fill='#fff9' stroke='#498fc5' strokeDasharray='3 3' pointerEvents='none'/>;})()}
          {present.map(person=>{const p=projectBeach(person.x,person.y),mine=person.id===id;const message=visibleMessages.findLast(m=>m.sender===person.id&&now-m.at<6500);const labelWidth=Math.min(190,Math.max(70,[...person.nickname].length*12+28));return <g key={person.id} data-plaza-peer={person.id} data-self={mine?'true':'false'} transform={`translate(${p.x} ${p.y})`} className={mine?'plaza-person mine':'plaza-person'} pointerEvents='none'>
            <ellipse cy='3' rx='23' ry='9' fill='#52768527'/>{mine&&<ellipse cy='3' rx='27' ry='11' fill='none' stroke='#639fcc' strokeWidth='1.5' strokeDasharray='4 3'/>}
            <g className='plaza-person-body' transform='scale(.64)'><RoomAvatar appearance={{...person.avatar,face:person.avatar.face||0}} placement={{...DEFAULT_CHARACTER,pose:person.pose}}/></g>
            <g className='plaza-nametag' transform='translate(0 24)'><rect x={-labelWidth/2} y='-12' width={labelWidth} height='24' rx='8' fill={mine?'#e7ffb5':'#f4fcfff2'} stroke={mine?'#8dba4b':'#6c9fbe'}/><text textAnchor='middle' y='4'>{person.nickname}{mine?' · 나':''}</text></g>
            {message&&<foreignObject className='plaza-speech' x='-106' y='-174' width='212' height='92'><div className='plaza-bubble'><span>{message.text}</span></div></foreignObject>}
          </g>;})}
        </svg>
        <div className='plaza-controls'><span><span className='emoji emoji-mono' aria-hidden='true'>🎮</span> 클릭·터치 또는 방향키로 걷기 <small>Enter 키로 채팅</small></span><label>포즈 <select aria-label='광장 캐릭터 포즈' value={pose} onChange={e=>choosePose(e.target.value as CharacterPose)}>{characterPoses.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label></div>
        {status!=='online'&&<div className='plaza-reconnect'><span>{status==='connecting'?'바다에 접속하고 있어요. 잠시만 기다려 주세요.':'다른 사람을 만나려면 실시간 연결이 필요해요.'}</span>{status==='offline'&&<button className='button' onClick={reconnect}>다시 연결</button>}</div>}
      </div>
      <aside className='plaza-chat-panel' aria-label='광장 채팅'>
        <div className='plaza-chat-heading'><MessageCircle size={18}/><h2>파도 채팅</h2><span>LIVE CHAT</span></div>
        <div className='plaza-people'><span><Users size={13}/> 함께 있는 사람</span><div>{present.map(p=><button key={p.id} className={muted.includes(p.id)?'muted':''} disabled={p.id===id} title={p.id===id?'내 캐릭터':`${p.nickname} 채팅 ${muted.includes(p.id)?'다시 보기':'숨기기'}`} onClick={()=>setMuted(m=>m.includes(p.id)?m.filter(i=>i!==p.id):[...m,p.id])}>{p.nickname}{p.id===id?' · 나':muted.includes(p.id)?<VolumeX size={11}/>:''}</button>)}</div></div>
        <div className='plaza-chat-log' ref={log} role='log' aria-label='광장 대화' aria-live='polite' aria-relevant='additions'>
          <p className='plaza-chat-welcome'><span className='emoji' aria-hidden='true'>🐚</span> 해운대에 온 걸 환영해요!<small>지금 접속한 사람들과 인사를 나눠 보세요.<br/>대화는 이 광장에 머무는 동안만 보여요.</small></p>
          {visibleMessages.map(m=><div className={'plaza-chat-message '+(m.sender===id?'own':'')} key={m.id}><span><b>{m.nickname}{m.sender===id?' · 나':''}</b><time dateTime={new Date(m.at).toISOString()}>{new Date(m.at).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})}</time></span><p>{m.text}</p></div>)}
        </div>
        {error&&<p className='plaza-chat-error' role='alert'>{error}</p>}
        <form className='plaza-chat-form' onSubmit={submit}><label htmlFor='plaza-message'>모래사장에 한마디</label><div><input id='plaza-message' ref={input} value={draft} onChange={e=>setDraft(e.target.value)} maxLength={160} placeholder={status==='online'?'안녕! 어떤 취향을 좋아해?':'연결 후 이야기할 수 있어요'} autoComplete='off' disabled={status!=='online'}/><button type='submit' aria-label='광장 메시지 보내기' disabled={status!=='online'||sending||!draft.trim()}><Send size={18}/></button></div><small>{draft.length}/160 · 서로의 취향을 존중해 주세요.</small></form>
      </aside>
    </div>
  </section>;
}
