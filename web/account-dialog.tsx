import { useEffect, useRef, useState } from 'react';
import { createAccount, signIn } from './account';
import { supabase } from './supabase';

export default function AccountDialog({close,account}:{close:()=>void;account?:{username:string}}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [mode,setMode]=useState<'login'|'signup'|'password'>(account?'password':'login');
 const [username,setUsername]=useState(account?.username||''),[nickname,setNickname]=useState('');
 const [password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[oldPassword,setOldPassword]=useState('');
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 useEffect(()=>{dialog.current?.showModal();return()=>dialog.current?.close();},[]);
 function switchMode(next:'login'|'signup'){setMode(next);setError('');setNotice('');setPassword('');setConfirm('');}
 async function submit(event:React.FormEvent){
  event.preventDefault();if(busy)return;setBusy(true);setError('');setNotice('');
  try {
   if(mode!=='login'&&password!==confirm)throw Error('비밀번호 확인이 일치하지 않아요.');
   if(mode==='signup'){
    await createAccount(username,nickname,password);
    try {await signIn(username,password);}catch{setMode('login');setNotice('가입했어요. 같은 아이디와 비밀번호로 로그인해 주세요.');return;}
   }else if(mode==='password'){
    await signIn(username,oldPassword);
    const {error}=await supabase.auth.updateUser({password});
    if(error)throw Error('비밀번호를 바꾸지 못했어요. 잠시 후 다시 시도해 주세요.');
   }else await signIn(username,password);
   close();
  }catch(error){setError(error instanceof Error?error.message:'계정 연결을 확인해 주세요.');}finally{setBusy(false);}
 }
 return <dialog ref={dialog} className='modal' onCancel={close} onClick={e=>{if(e.target===e.currentTarget&&!busy)close();}}>
  <div className='window-bar'><span>✦ {mode==='signup'?'나의 계정 만들기':mode==='password'?'비밀번호 변경':'나의 취향방 로그인'}</span><button className='chrome-button' aria-label='닫기' disabled={busy} onClick={close}>×</button></div>
  <div className='modal-body auth-panel'>
   <h2>{mode==='signup'?'나만의 취향방을 만들어요':mode==='password'?'새 비밀번호를 정해요':'내 방을 이어서 꾸며요'}</h2>
   {!account&&<div className='mini-tabs account-tabs'><button type='button' disabled={busy} aria-pressed={mode==='login'} className={mode==='login'?'active':''} onClick={()=>switchMode('login')}>로그인</button><button type='button' disabled={busy} aria-pressed={mode==='signup'} className={mode==='signup'?'active':''} onClick={()=>switchMode('signup')}>회원가입</button></div>}
   <form className='account-form' onSubmit={e=>void submit(e)}>
    <label htmlFor='account-id'>아이디<input id='account-id' required disabled={busy||!!account} autoComplete='username' autoCapitalize='none' spellCheck={false} minLength={4} maxLength={24} pattern='[a-zA-Z][a-zA-Z0-9_]{3,23}' value={username} onChange={e=>setUsername(e.target.value)} aria-describedby={mode==='signup'?'account-id-hint':undefined}/></label>
    {mode==='signup'&&<><small id='account-id-hint'>영문으로 시작하는 4~24자의 영문·숫자·밑줄</small><label htmlFor='account-nickname'>별명<input id='account-nickname' required disabled={busy} maxLength={20} autoComplete='nickname' value={nickname} onChange={e=>setNickname(e.target.value)}/></label></>}
    {mode==='password'&&<label htmlFor='account-old-password'>현재 비밀번호<input id='account-old-password' required disabled={busy} type='password' autoComplete='current-password' maxLength={128} value={oldPassword} onChange={e=>setOldPassword(e.target.value)}/></label>}
    <label htmlFor='account-password'>{mode==='password'?'새 비밀번호':'비밀번호'}<input id='account-password' required disabled={busy} type='password' autoComplete={mode==='login'?'current-password':'new-password'} minLength={mode==='login'?1:10} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/></label>
    {mode!=='login'&&<><small>10~128자</small><label htmlFor='account-confirm'>비밀번호 확인<input id='account-confirm' required disabled={busy} type='password' autoComplete='new-password' minLength={10} maxLength={128} value={confirm} onChange={e=>setConfirm(e.target.value)}/></label></>}
    {error&&<p role='alert' className='auth-error'>{error}</p>}{notice&&<p role='status'>{notice}</p>}
    <button className='button primary' disabled={busy} type='submit'>{busy?'연결하는 중…':mode==='signup'?'계정 만들기':mode==='password'?'비밀번호 변경':'로그인'}</button>
   </form>
   <p className='quiet-note'>구글 계정 없이 이용해요.<br/>같은 아이디로 로그인하면 다른 기기에서도 방을 이어갈 수 있어요.</p>
   {!account&&<button className='text-button' disabled={busy} onClick={close}>지금은 둘러볼게요</button>}
  </div>
 </dialog>;
}
