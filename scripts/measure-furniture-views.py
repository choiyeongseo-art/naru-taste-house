"""Read sprite alpha bounds and align rear views; never modify image pixels."""
import json
import sys
from pathlib import Path
from PIL import Image

root=Path(__file__).resolve().parents[1]
front=json.loads((root/'outputs/furniture-front-frames.json').read_text(encoding='utf-8'))
assets={a['kind']:a for a in json.loads((root/'outputs/furniture-rear-generation.json').read_text(encoding='utf-8'))['assets']}
frames={}
report={}
for kind,frame in front.items():
    rear_path=root/assets[kind]['destination']
    with Image.open(root/'public'/frame['src'].removeprefix('./')) as original, Image.open(rear_path) as rear:
        def bounds(im):
            if 'A' not in im.getbands():
                raise ValueError(f'{kind}: sprite has no alpha channel')
            if im.getchannel('A').getextrema()[0]!=0:
                raise ValueError(f'{kind}: sprite does not have a transparent background')
            return im.getchannel('A').point(lambda a:255 if a>16 else 0).getbbox()
        fb,rb=bounds(original),bounds(rear)
        if not fb or not rb:
            raise ValueError(f'{kind}: empty sprite')
        scale=min(frame['width']/original.width,frame['height']/original.height)
        ox=frame['x']+(frame['width']-original.width*scale)/2
        oy=frame['y']+frame['height']-original.height*scale
        fw,fh=(fb[2]-fb[0])*scale,(fb[3]-fb[1])*scale
        center=ox+(fb[0]+fb[2])/2*scale
        bottom=oy+fb[3]*scale
        rear_scale=min(fw/(rb[2]-rb[0]),fh/(rb[3]-rb[1]))
        frames[kind]={
            'src':'./'+rear_path.relative_to(root/'public').as_posix(),
            'x':round(center-(rb[0]+rb[2])/2*rear_scale,6),
            'y':round(bottom-rb[3]*rear_scale,6),
            'width':round(rear.width*rear_scale,6),
            'height':round(rear.height*rear_scale,6),
        }
        report[kind]={'frontAlpha':fb,'rearAlpha':rb,'floorContact':bottom,'centerX':center,'rearSize':[rear.width,rear.height],'rearVisibleSize':[(rb[2]-rb[0])*rear_scale,(rb[3]-rb[1])*rear_scale]}
(root/'app/furniture-rear.json').write_text(json.dumps(frames,indent=2)+'\n',encoding='utf-8')
(root/'outputs/furniture-rear-alignment.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(f'Aligned {len(frames)} rear sprites to existing floor contacts; no image pixels changed.')
