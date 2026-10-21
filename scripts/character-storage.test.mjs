import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server=await createServer({configFile:false,server:{middlewareMode:true,watch:{ignored:['**/outputs/**','**/vendor/skills/**']}},appType:'custom'});
after(()=>server.close());
const {HomeSchema}=await server.ssrLoadModule('/web/home-schema.ts');
const {initialState}=await server.ssrLoadModule('/app/data.ts');

test('the actual member save schema upgrades a legacy room without losing its contents',()=>{
  const legacy=structuredClone(initialState);delete legacy.character;
  const parsed=HomeSchema.parse(legacy);
  assert.equal(parsed.character.pose,'idle');
  assert.equal(parsed.character.x,3.43);
  assert.deepEqual(parsed.items,legacy.items);
  assert.equal(parsed.nickname,legacy.nickname);
});

test('member save/load preserves a custom location, chosen pose and stopped frame',()=>{
  const character={x:1.2,y:4.3,pose:'dance',animated:false,frame:2};
  const parsed=HomeSchema.parse(JSON.parse(JSON.stringify({...initialState,character})));
  assert.deepEqual(parsed.character,character);
});

test('invalid character states are rejected before a member save',()=>{
  for(const patch of [{x:Infinity},{y:99},{pose:'unknown'},{animated:'yes'},{frame:9}]){
    assert.equal(HomeSchema.safeParse({...initialState,character:{...initialState.character,...patch}}).success,false);
  }
});
