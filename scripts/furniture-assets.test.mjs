import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createServer} from 'vite';

const server=await createServer({configFile:false,optimizeDeps:{noDiscovery:true,include:[]},server:{hmr:false,middlewareMode:true,watch:{ignored:['**/outputs/**','**/vendor/skills/**']}},appType:'custom'});
after(()=>server.close());
const {furnitureArt,getFurnitureArt}=await server.ssrLoadModule('/app/art.ts');

test('all nine furniture pieces have shipped front and rear assets in the runtime mapping',()=>{
 assert.equal(Object.keys(furnitureArt).length,9);
 for(const kind of Object.keys(furnitureArt)){
   const front=getFurnitureArt(kind,0),rear=getFurnitureArt(kind,2);
   assert.equal(getFurnitureArt(kind,1).src,front.src);
   assert.equal(getFurnitureArt(kind,3).src,rear.src);
   assert.notEqual(rear.src,front.src,kind+' needs a real rear asset');
   for(const frame of [front,rear]){
     assert.ok(fs.existsSync('public/'+frame.src.replace(/^\.\//,'')),frame.src);
     for(const k of ['x','y','width','height'])assert.ok(Number.isFinite(frame[k]),kind+' '+k);
     assert.ok(frame.width>0&&frame.height>0);
   }
 }
});
