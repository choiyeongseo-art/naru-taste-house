import test from 'node:test';
import assert from 'node:assert/strict';
import {getFurnitureRotation,nextFurnitureRotation,furnitureView,withFurnitureRotation} from '../app/furniture-rotation.ts';
import {FurnitureItemSchema} from '../lib/furniture-schema.ts';

test('old flipped rooms retain their exact front/mirrored orientation',()=>{
 assert.equal(getFurnitureRotation({}),0);
 assert.equal(getFurnitureRotation({flip:false}),0);
 assert.equal(getFurnitureRotation({flip:true}),1);
 assert.equal(getFurnitureRotation({rotation:2,flip:true}),2);
});
test('rotation cycles through all four views and returns to the original',()=>{
 let item={id:'desk-1',kind:'desk',x:2.2,y:3.6,flip:true};
 const saved=[];
 for(let i=0;i<4;i++){item=withFurnitureRotation(item,nextFurnitureRotation(item));saved.push(item.rotation);assert.equal(item.id,'desk-1');assert.equal(item.x,2.2);assert.equal(item.y,3.6);assert.equal('flip' in item,false);}
 assert.deepEqual(saved,[2,3,0,1]);
});
test('four views use the requested front/rear and mirror combination',()=>{
 assert.deepEqual([0,1,2,3].map(furnitureView),[{rear:false,mirrored:false},{rear:false,mirrored:true},{rear:true,mirrored:false},{rear:true,mirrored:true}]);
});
test('new orientations survive a storage round trip and legacy data stays valid',()=>{
 const item={id:'sofa-1',kind:'sofa',x:1.3,y:2.7};
 assert.equal(getFurnitureRotation(FurnitureItemSchema.parse({...item,flip:true})),1);
 for(const rotation of [0,1,2,3])assert.equal(FurnitureItemSchema.parse(JSON.parse(JSON.stringify({...item,rotation}))).rotation,rotation);
 for(const rotation of [-1,4,.5,'2',Infinity])assert.equal(FurnitureItemSchema.safeParse({...item,rotation}).success,false);
});
