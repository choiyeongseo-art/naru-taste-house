import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createServer } from 'vite';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'outputs/furniture-rear-generation.json'),'utf8'));
const directory=path.join(root,'public/art/furniture-rear');
fs.mkdirSync(directory,{recursive:true});
for(const asset of manifest.assets){
 const destination=path.resolve(root,asset.destination);
 if(!destination.startsWith(directory+path.sep))throw Error('Invalid furniture asset destination');
 fs.copyFileSync(asset.source,destination);
}
const server=await createServer({configFile:false,root,optimizeDeps:{noDiscovery:true,include:[]},server:{hmr:false,middlewareMode:true,watch:{ignored:['**/outputs/**','**/vendor/skills/**']}},appType:'custom'});
try{
 const {furnitureArt}=await server.ssrLoadModule('/app/art.ts');
 fs.writeFileSync(path.join(root,'outputs/furniture-front-frames.json'),JSON.stringify(furnitureArt,null,2));
}finally{await server.close();}
const python=process.env.FURNITURE_PYTHON||path.join(root,'vendor/skills/sprite-gen/.venv/Scripts/python.exe');
const result=spawnSync(python,['scripts/measure-furniture-views.py'],{cwd:root,encoding:'utf8'});
process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');
if(result.error)throw result.error;
if(result.status!==0)process.exit(result.status||1);
