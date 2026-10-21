import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CHARACTER, ROOM_MIN, ROOM_MAX, normalizeCharacter, projectRoomPoint, unprojectRoomPoint, roomArrowDelta } from '../app/character.ts';

const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-9,`${actual} should equal ${expected}`);

test('older saved rooms receive the previous character location and a playable idle pose',()=>{
  assert.deepEqual(normalizeCharacter(),{x:3.43,y:3.05,pose:'idle',animated:true,frame:0});
  const [x,y]=projectRoomPoint(DEFAULT_CHARACTER.x,DEFAULT_CHARACTER.y);
  assert.ok(Math.abs(x-367)<.4&&Math.abs(y-404)<.4);
});

test('a saved pose, stopped playback and custom position survive normalization',()=>{
  const saved={x:1.5,y:4.25,pose:'read',animated:false};
  assert.deepEqual(normalizeCharacter(saved),{...saved,frame:0});
  assert.notStrictEqual(normalizeCharacter(saved),saved);
});

test('the character cannot leave the floor or persist non-finite coordinates',()=>{
  assert.deepEqual(normalizeCharacter({x:-50,y:200,pose:'dance',animated:false}),{x:ROOM_MIN,y:ROOM_MAX,pose:'dance',animated:false,frame:0});
  assert.deepEqual(normalizeCharacter({x:NaN,y:Infinity,pose:'invalid',animated:'yes'}),DEFAULT_CHARACTER);
});

test('isometric pointer coordinates round-trip, including every floor corner',()=>{
  for(const position of [[.2,.2],[.2,4.8],[4.8,.2],[4.8,4.8],[2.15,3.7]]){
    const recovered=unprojectRoomPoint(...projectRoomPoint(...position));
    close(recovered[0],position[0]);close(recovered[1],position[1]);
  }
});

test('arrow controls move along the visible screen axes',()=>{
  const start=[2.5,2.5],origin=projectRoomPoint(...start);
  for(const [key,axis,sign] of [['ArrowLeft',0,-1],['ArrowRight',0,1],['ArrowUp',1,-1],['ArrowDown',1,1]]){
    const delta=roomArrowDelta(key);
    const screen=projectRoomPoint(start[0]+delta[0],start[1]+delta[1]);
    assert.ok((screen[axis]-origin[axis])*sign>0);
    close(screen[1-axis],origin[1-axis]);
  }
  assert.equal(roomArrowDelta('Tab'),null);
});
