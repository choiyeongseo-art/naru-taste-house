"""Read composed sprite-gen atlases; measure eye anchors for existing SVG accessories.

This does not change sprites, extraction, frame placement or playback timing.
"""
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def eye_anchor(image):
    rgba = np.asarray(image.convert('RGBA'))
    mask = (rgba[:, :, :3].max(axis=2) < 80) & (rgba[:, :, 3] > 220)
    components = []
    remaining = set(map(tuple, np.argwhere(mask)))
    while remaining:
        seed = remaining.pop()
        stack, component = [seed], [seed]
        while stack:
            y, x = stack.pop()
            for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
                point = (y + dy, x + dx)
                if point in remaining:
                    remaining.remove(point)
                    stack.append(point)
                    component.append(point)
        if len(component) >= 8:
            components.append(component)
    eyes = sorted(components, key=len, reverse=True)[:2]
    if len(eyes) != 2:
        raise ValueError('Cannot locate both eyes; review the sprite instead of guessing an anchor.')
    centers = sorted([(sum(p[1] for p in c)/len(c), sum(p[0] for p in c)/len(c)) for c in eyes])
    left, right = centers
    if right[0] - left[0] < image.width * .1:
        raise ValueError('Eye separation is inconsistent with the character reference.')
    center = ((left[0]+right[0])/2, (left[1]+right[1])/2)
    # Match the SVG viewport in Avatar. The original accessories use eye centre (0, -64).
    return {'x': round(-54+108*center[0]/image.width, 3),
            'y': round(-133+144*center[1]/image.height, 3),
            'angle': round(math.degrees(math.atan2(right[1]-left[1], right[0]-left[0])), 3)}


root = Path(sys.argv[1])
result = {}
for name in sys.argv[2:]:
    run = root/'outputs'/'character-motion'/f'naru-{name}'
    manifest = json.loads((run/'manifest.json').read_text(encoding='utf-8'))
    atlas = Image.open(run/manifest['sprite_sheet_alpha'])
    result[name] = {}
    for state, frames in manifest['frame_layout']['rows'].items():
        result[name][state] = [eye_anchor(atlas.crop((f['x'],f['y'],f['x']+f['w'],f['y']+f['h']))) for f in frames]
print(json.dumps(result))
