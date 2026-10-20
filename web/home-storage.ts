import type { HomeStorage } from '../app/taste-house';
import { HomeSchema } from './home-schema';
import { supabase } from './supabase';
export function memberStorage(userId: string): HomeStorage {
  async function requireOwner(){
    const { data, error } = await supabase.auth.getSession();
    if(error || data.session?.user.id !== userId) throw Error('로그인을 다시 확인해 주세요.');
  }
  return {
    async load(){
      await requireOwner();
      const { data, error } = await supabase.from('member_homes').select('state,updated_at').eq('user_id',userId).maybeSingle();
      if(error) throw error;
      return { state: data ? HomeSchema.parse(data.state) : null, updatedAt: data?.updated_at ?? null };
    },
    async save(input){
      await requireOwner();
      const state=HomeSchema.parse(input), updatedAt=Date.now();
      const { error }=await supabase.from('member_homes').upsert({user_id:userId,nickname:state.nickname,state,updated_at:updatedAt},{onConflict:'user_id'});
      if(error) throw error;
      return { updatedAt };
    }
  };
}
