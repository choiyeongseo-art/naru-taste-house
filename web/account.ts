import { supabase, supabaseUrl, publishableKey } from './supabase';

export const normalizeUsername = (value:string) => value.trim().toLowerCase();
export function accountEmail(username:string) {
  const id=normalizeUsername(username);
  if(!/^[a-z][a-z0-9_]{3,23}$/.test(id)) throw Error('아이디는 영문으로 시작하는 4~24자의 영문·숫자·밑줄로 입력해 주세요.');
  return id+'@accounts.naru.invalid';
}
export async function signIn(username:string,password:string) {
  const {error}=await supabase.auth.signInWithPassword({email:accountEmail(username),password});
  if(error) throw Error(error.status===429?'로그인 시도가 많아요. 잠시 후 다시 시도해 주세요.':'아이디 또는 비밀번호를 확인해 주세요.');
}
export async function createAccount(username:string,nickname:string,password:string) {
  accountEmail(username);
  const response=await fetch(supabaseUrl+'/functions/v1/create-account',{
    method:'POST',headers:{apikey:publishableKey,Authorization:'Bearer '+publishableKey,'Content-Type':'application/json'},
    body:JSON.stringify({username:normalizeUsername(username),nickname:nickname.trim(),password}),
  });
  let result:{error?:string}={};
  try {result=await response.json();}catch{}
  if(!response.ok) throw Error(result.error||'계정 서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.');
}
