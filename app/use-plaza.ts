import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../web/supabase';
import type { HomeState } from './data';
import { PlazaChat, PlazaMove, PlazaPeer, type ChatMessage, type PlazaPerson } from './plaza-model';

export function usePlaza(state:HomeState){
  const [id]=useState(()=>crypto.randomUUID());
  const [people,setPeople]=useState<Record<string,PlazaPerson>>({});
  const [messages,setMessages]=useState<ChatMessage[]>([]);
  const [status,setStatus]=useState<'connecting'|'online'|'offline'>('connecting');
  const [error,setError]=useState('');
  const channel=useRef<RealtimeChannel|null>(null),peers=useRef<Record<string,PlazaPerson>>({});
  const me=useRef<PlazaPerson>({id,nickname:state.nickname,avatar:state.avatar,x:.35+Math.random()*.3,y:.52+Math.random()*.3,pose:'idle'});
  const lastSent=useRef(0),lastChat=useRef(0),seen=useRef(new Set<string>()),received=useRef(new Map<string,number>());
  const addChat=useCallback((m:ChatMessage)=>{if(seen.current.has(m.id))return;seen.current.add(m.id);if(seen.current.size>500)seen.current.delete(seen.current.values().next().value!);setMessages(list=>[...list,m].slice(-80));},[]);
  useEffect(()=>{
    let active=true;
    // Keep automated localhost preview conversations separate from the public beach.
    const room=window.location.hostname==='localhost'?'naru-haeundae-plaza-qa-v1':'naru-haeundae-plaza-v1';
    const c=supabase.channel(room,{config:{broadcast:{self:true,ack:true},presence:{key:id}}});
    channel.current=c;
    c.on('presence',{event:'sync'},()=>{
      if(!active)return;
      const next:Record<string,PlazaPerson>={};
      for(const [key,entries] of Object.entries(c.presenceState())){
        const person=PlazaPeer.safeParse(entries[entries.length-1]);
        if(person.success&&person.data.id===key){const old=peers.current[key];next[key]=old?{...person.data,x:old.x,y:old.y,pose:old.pose}:person.data;}
        if(Object.keys(next).length>=100)break;
      }
      next[id]={...me.current};peers.current=next;setPeople(next);
    }).on('broadcast',{event:'move'},({payload})=>{
      if(!active)return;const m=PlazaMove.safeParse(payload);
      if(!m.success||m.data.id===id||!peers.current[m.data.id])return;
      const next={...peers.current,[m.data.id]:{...peers.current[m.data.id],...m.data}};peers.current=next;setPeople(next);
    }).on('broadcast',{event:'chat'},({payload})=>{
      if(!active)return;const m=PlazaChat.safeParse(payload);if(!m.success)return;
      const sender=m.data.sender===id?me.current:peers.current[m.data.sender];if(!sender)return;
      const at=Date.now();if(m.data.sender!==id&&at-(received.current.get(m.data.sender)||0)<700)return;
      received.current.set(m.data.sender,at);addChat({...m.data,nickname:sender.nickname,at});
    }).subscribe(async s=>{
      if(!active)return;
      if(s==='SUBSCRIBED'){
        const result=await c.track(me.current);
        if(active){setStatus(result==='ok'?'online':'offline');setError(result==='ok'?'':'접속 정보를 전송하지 못했어요. 다시 연결해 주세요.');}
      }else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT'||s==='CLOSED'){
        setStatus('offline');setError('실시간 연결이 끊겼어요. 다시 연결하면 함께 만날 수 있어요.');
        peers.current={[id]:me.current};setPeople({...peers.current});
      }
    });
    const timeout=setTimeout(()=>{if(active)setStatus(s=>s==='connecting'?'offline':s);},15000);
    return()=>{active=false;clearTimeout(timeout);channel.current=null;void supabase.removeChannel(c);};
  },[id,addChat]);
  useEffect(()=>{
    me.current={...me.current,nickname:state.nickname,avatar:state.avatar};
    setPeople(p=>({...p,[id]:{...me.current}}));
    if(status==='online')void channel.current?.track(me.current);
  },[state.nickname,state.avatar,id,status]);
  const move=useCallback((position:Pick<PlazaPerson,'x'|'y'|'pose'>,force=false)=>{
    me.current={...me.current,...position};
    setPeople(p=>({...p,[id]:{...me.current}}));
    if(channel.current&&Date.now()-lastSent.current>(force?0:180)){
      lastSent.current=Date.now();void channel.current.send({type:'broadcast',event:'move',payload:{id,...position}});
      // Presence also carries the latest location for people joining after us.
      if(force)void channel.current.track(me.current);
    }
  },[id]);
  async function send(text:string){
    const payload=PlazaChat.safeParse({id:crypto.randomUUID(),sender:id,text});
    if(!payload.success){setError('메시지는 1~160자로 입력해 주세요.');return false;}
    if(status!=='online'||!channel.current){setError('실시간 연결 후에 메시지를 보낼 수 있어요.');return false;}
    if(Date.now()-lastChat.current<1200){setError('잠깐 쉬었다가 보내 주세요.');return false;}
    lastChat.current=Date.now();
    const result=await channel.current.send({type:'broadcast',event:'chat',payload:payload.data});
    if(result!=='ok'){setError('메시지를 보내지 못했어요. 다시 시도해 주세요.');return false;}
    addChat({...payload.data,nickname:me.current.nickname,at:Date.now()});setError('');return true;
  }
  return {id,people,messages,status,error,move,send,initial:me.current};
}
