import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Session } from '@supabase/supabase-js';
import TasteHouse from '../app/taste-house';
import Providers from '../app/providers';
import { supabase, googleLoginEnabled } from './supabase';
import { memberStorage } from './home-storage';
import '../app/globals.css';
import './public.css';

function Login({close}:{close:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{dialog.current?.showModal();return()=>dialog.current?.close();},[]);
 async function login(){
  setBusy(true);setError('');
  try {
   if(!await googleLoginEnabled()){setError('Google 로그인 연결을 준비하고 있어요. 지금은 로그인 없이 둘러볼 수 있어요.');setBusy(false);return;}
   const redirectTo=location.origin+location.pathname;
   const {error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo,queryParams:{prompt:'select_account'}}});
   if(error)throw error;
  }catch{setError('Google 로그인에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.');setBusy(false);}
 }
 return <dialog ref={dialog} className="modal" onCancel={close} onClick={e=>{if(e.target===e.currentTarget)close();}}><div className="window-bar"><span>✦ 나의 취향방 이어가기</span><button className="chrome-button" aria-label="닫기" onClick={close}>×</button></div><div className="modal-body auth-panel"><span className="auth-flower">✿</span><h2>좋아하는 것들을<br/>오래 간직해요.</h2><p>Google 계정으로 로그인하면 방·옷·테스트 결과와<br/>보관한 부산 코스를 다른 기기에서도 이어갈 수 있어요.</p><button className="button primary google-login" disabled={busy} onClick={()=>void login()}><b aria-hidden="true">G</b>{busy?'Google로 이동 중…':'Google로 계속하기'}</button>{error&&<p role="alert" className="auth-error">{error}</p>}<p className="quiet-note">로그인을 위해 Google 계정의 이름·이메일을 Supabase와 연결해요.<br/>방과 취향 정보는 본인 계정에서만 볼 수 있어요.</p><button className="text-button" onClick={close}>지금은 둘러볼게요</button></div></dialog>;
}
function App(){
 const [session,setSession]=useState<Session|null>(null),[ready,setReady]=useState(false),[authError,setAuthError]=useState(''),[loginOpen,setLoginOpen]=useState(false);
 useEffect(()=>{
  let active=true;
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>{if(active){setSession(next);setReady(true);}});
  void supabase.auth.getSession().then(({data,error})=>{if(!active)return;setSession(data.session);setReady(true);if(error)setAuthError('로그인 정보를 확인하지 못했어요. 다시 로그인해 주세요.');}).catch(()=>{if(active){setReady(true);setAuthError('로그인 연결을 확인해 주세요.');}});
  const params=new URLSearchParams(location.hash.slice(1));
  if(params.has('error_description')){setAuthError('Google 로그인을 완료하지 못했어요. 다시 시도해 주세요.');history.replaceState(null,'',location.pathname);}
  return()=>{active=false;subscription.unsubscribe();};
 },[]);
 const id=session?.user.id;
 const storage=useMemo(()=>id?memberStorage(id):undefined,[id]);
 const user=useMemo(()=>session?{name:String(session.user.user_metadata.full_name||session.user.user_metadata.name||''),email:session.user.email||''}:null,[session?.user.id]);
 async function logout(){
  const {error}=await supabase.auth.signOut({scope:'local'});
  if(error)setAuthError('로그아웃하지 못했어요. 다시 시도해 주세요.');
 }
 if(!ready)return <div className="auth-loading" role="status">✦ 작은 취향방을 여는 중…</div>;
 return <><TasteHouse key={id||'guest'} user={user} storage={storage} onLogin={()=>setLoginOpen(true)} onLogout={()=>void logout()}/>{loginOpen&&<Login close={()=>setLoginOpen(false)}/>} {authError&&<div role="alert" className="auth-notice">{authError}<button onClick={()=>setAuthError('')}>닫기</button></div>}</>;
}
createRoot(document.getElementById('root')!).render(<Providers><App/></Providers>);
