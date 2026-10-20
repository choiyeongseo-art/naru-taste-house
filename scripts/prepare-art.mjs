import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

// Asset preparation only: preserve the generated art and alpha, resize and encode.
const require=createRequire(import.meta.url);
const sharp=require(process.env.SHARP_MODULE || 'sharp');
const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(await fs.readFile(path.join(root,'outputs/art-direction/manifest.json'),'utf8'));
await fs.mkdir(path.join(root,'public/art'),{recursive:true});
for(const item of manifest){
  const name=item.id==='avatar-base-gen'?'avatar-base':item.id.replace(/^flat-/,'');
  const size=name==='room'?1200:name.startsWith('place-')?960:768;
  const target=path.join(root,'public/art',name+'.webp');
  await sharp(item.source).resize({width:size,height:size,fit:'inside',withoutEnlargement:true})
    .webp({quality:92,alphaQuality:100,effort:5}).toFile(target);
  console.log(name+': '+(await fs.stat(target)).size+' bytes');
}
