import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Session } from '@supabase/supabase-js';
import TasteHouse from '../app/taste-house';
import Providers from '../app/providers';
import { supabase } from './supabase';
import AccountDialog from './account-dialog';
import { memberStorage } from './home-storage';
import '../app/globals.css';
import './public.css';

function App(){
 const [session,setSession]=useState<Session|null>(null),[ready,setReady]=useState(false),[authError,setAuthError]=useState(''),[accountOpen,setAccountOpen]=useState<'login'|'password'|null>(null);
 useEffect(()=>{
  let active=true;
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>{if(active){setSession(next);setReady(true);}});
  void supabase.auth.getSession().then(({data,error})=>{if(!active)return;setSession(data.session);setReady(true);if(error)setAuthError('로그인 정보를 확인하지 못했어요. 다시 로그인해 주세요.');}).catch(()=>{if(active){setReady(true);setAuthError('로그인 연결을 확인해 주세요.');}});
  return()=>{active=false;subscription.unsubscribe();};
 },[]);
 const id=session?.user.id;
 const storage=useMemo(()=>id?memberStorage(id):undefined,[id]);
 const user=useMemo(()=>session?{name:String(session.user.user_metadata.nickname||session.user.user_metadata.full_name||''),email:String(session.user.user_metadata.username||session.user.email||'')}:null,[session?.user.id]);
 async function logout(){
  const {error}=await supabase.auth.signOut({scope:'local'});
  if(error)setAuthError('로그아웃하지 못했어요. 다시 시도해 주세요.');
 }
 if(!ready)return <div className="auth-loading" role="status">✦ 작은 취향방을 여는 중…</div>;
 return <><TasteHouse key={id||'guest'} user={user} storage={storage} onLogin={()=>setAccountOpen('login')} onLogout={()=>void logout()} onManageAccount={()=>setAccountOpen('password')}/>{accountOpen&&<AccountDialog close={()=>setAccountOpen(null)} account={accountOpen==='password'&&session?{username:String(session.user.user_metadata.username||'')}:undefined}/>} {authError&&<div role="alert" className="auth-notice">{authError}<button onClick={()=>setAuthError('')}>닫기</button></div>}</>;
}
createRoot(document.getElementById('root')!).render(<Providers><App/></Providers>);
