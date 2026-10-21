import test from 'node:test';
import assert from 'node:assert/strict';
import {entryPage,hasCompletedTaste,mergeCompletedTaste} from '../app/onboarding.ts';
import {PlazaPeer,PlazaChat,PlazaMove,projectBeach,unprojectBeach,clampBeach,stepToward} from '../app/plaza-model.ts';

test('a new or unfinished visitor must enter the taste test',()=>{
  for(const state of [null,undefined,{}, {result:null},{result:undefined},{result:'0'},{result:4},{result:-1},{result:NaN}])assert.equal(entryPage(state),'test');
});
test('every persisted result enters home on the next visit',()=>{
  for(let result=0;result<4;result++){assert.equal(hasCompletedTaste({result}),true);assert.equal(entryPage({result}),'home');}
});
test('logging in imports the completed guest test while preserving the member room',()=>{
  const older={date:'2026-10-20T00:00:00Z',type:1},latest={date:'2026-10-21T00:00:00Z',type:3};
  const member={nickname:'내 별명',result:1,mood:'pink',avatar:{outfit:1},items:[{id:'my-sofa'}],saved:['my-course'],history:[older]};
  const guest={nickname:'취향 여행자',result:3,mood:'mint',avatar:{outfit:3},items:[],saved:[],history:[latest,older]};
  const merged=mergeCompletedTaste(member,guest);
  assert.equal(merged.nickname,member.nickname);assert.equal(merged.result,3);assert.equal(merged.avatar.outfit,3);assert.deepEqual(merged.items,member.items);assert.deepEqual(merged.saved,member.saved);assert.deepEqual(merged.history,[latest,older]);
  assert.equal(mergeCompletedTaste(member,{...guest,result:null}),member);
});
test('beach projection round-trips across the playable sand',()=>{
  for(const x of [.06,.5,.94])for(const y of [.30,.6,.94]){const screen=projectBeach(x,y),point=unprojectBeach(screen.x,screen.y);assert.ok(Math.abs(point.x-x)<1e-9);assert.ok(Math.abs(point.y-y)<1e-9);}
});
test('clicks beyond the map stay in the sand and cannot enter the water',()=>{
  assert.deepEqual(clampBeach(-8,-8),{x:.06,y:.30});assert.deepEqual(clampBeach(8,8),{x:.94,y:.94});
});
test('movement has bounded speed and arrives without overshooting',()=>{
  assert.deepEqual(stepToward({x:0,y:0},{x:.1,y:0},.2),{x:.1,y:0});
  const p=stepToward({x:0,y:0},{x:1,y:1},.1);assert.ok(Math.abs(Math.hypot(p.x,p.y)-.1)<1e-9);
});
test('untrusted realtime presence, movement and chat are validated',()=>{
  const id='14af4de9-130b-4480-8416-6c7ae6bf0d47';
  const person={id,nickname:'나루',avatar:{hair:0,outfit:0,accessory:0},x:.4,y:.6,pose:'idle'};
  assert.equal(PlazaPeer.safeParse(person).success,true);
  for(const patch of [{nickname:''},{nickname:'x'.repeat(21)},{avatar:{hair:999,outfit:0,accessory:0}},{x:Infinity},{y:.1},{pose:'invalid'},{id:'not-a-session'}])assert.equal(PlazaPeer.safeParse({...person,...patch}).success,false);
  assert.equal(PlazaMove.safeParse({id,x:.4,y:.6,pose:'dance'}).success,true);
  for(const text of ['','  ','x'.repeat(161)])assert.equal(PlazaChat.safeParse({id,sender:id,text}).success,false);
  assert.equal(PlazaChat.parse({id,sender:id,text:' 안녕! '}).text,'안녕!');
});
