import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const names=process.argv.includes('--base-only')?['base']:['base','pink','lilac','mint'];
const headAnchors=JSON.parse(execFileSync(path.join(root,'vendor/skills/sprite-gen/.venv/Scripts/python.exe'),['-X','utf8',path.join(root,'scripts/measure-room-sprite-heads.py'),root,...names],{encoding:'utf8'}));
const destination=path.join(root,'public/art/motions');
fs.mkdirSync(destination,{recursive:true});
const atlases={};
for(const [outfit,name] of names.entries()) {
  const run=path.join(root,'outputs/character-motion',`naru-${name}`);
  const manifest=JSON.parse(fs.readFileSync(path.join(run,'manifest.json'),'utf8'));
  const report=JSON.parse(fs.readFileSync(path.join(run,'sprite-sheet-alpha.report.json'),'utf8'));
  if(report.ok===false||manifest.degraded_static_fallback)throw Error(`${name}: sprite-gen did not publish a complete atlas`);
  const states={};
  for(const state of ['idle','read','sit','dance']) {
    const animation=manifest.animation.rows[state], frames=manifest.frame_layout.rows[state];
    if(!frames?.length||frames.length!==animation.frames)throw Error(`${name}/${state}: incomplete runtime frames`);
    states[state]={frames:frames.map((frame,index)=>({...frame,face:headAnchors[name][state][index]})),fps:animation.fps,durations:animation.durations_ms,loop:animation.loop};
  }
  fs.copyFileSync(path.join(run,manifest.sprite_sheet_alpha),path.join(destination,`${name}.png`));
  atlases[outfit]={src:`./art/motions/${name}.png`,width:manifest.frame_layout.sheetWidth,height:manifest.frame_layout.sheetHeight,states};
}
fs.writeFileSync(path.join(root,'app/character-motion.json'),JSON.stringify({generator:'sprite-gen',atlases},null,2)+'\n');
console.log(`Packaged ${names.length} sprite-gen atlases, ${names.length*4} motions from manifest.frame_layout.`);
