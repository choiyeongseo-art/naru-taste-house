# Four furniture directions

Select a furniture piece in placement mode. The panel immediately below the inventory tabs shows four direction previews and a Rotate button. Rotation cycles:

| Stored value | UI | Rendering |
| --- | --- | --- |
| 0 | 기본 | Existing front resource |
| 1 | 회전1 | Existing front resource, horizontally mirrored |
| 2 | 회전2 | Generated rear resource |
| 3 | 회전3 | Rear resource, horizontally mirrored |

Direct preview buttons also select a direction. Rotation keeps the item's ID, floor position, order, price and the rest of the room state. Guest storage, member storage and exported room PNGs use the same rendering. No database migration is needed because rooms are stored as JSON.

Older rooms with no rotation field retain `flip: true` as direction 1 and unflipped items as direction 0. Explicit rotation takes precedence; rotating a legacy item replaces its old flip flag with the new value. Both browser and server schemas use the shared `FurnitureItemSchema` and reject invalid direction values.

## Artwork

Nine rear assets were generated with built-in `image_gen`, using each existing transparent front image as an exact identity/style reference. They keep the thin outlines, pastel fills and isometric perspective. The rug's opposite view is the decorated top rotated on the floor, not its underside. The sofa/desk/shelf/boombox show actual back panels; plant/lamp/flowers hide their front bows appropriately; the sleeping kitten turns its back to the viewer.

Final raster assets are `public/art/furniture-rear/*-rear-v*.png`. Full prompts and source paths are in the local `outputs/furniture-rear-generation.json` record. `scripts/package-furniture-rear.mjs` copies the generated PNGs without altering pixels. `scripts/measure-furniture-views.py` reads alpha bounds to calculate scale and offsets in `app/furniture-rear.json`, aligning each rear view's visible floor contact and horizontal center with its existing front resource. It writes metadata only; mirroring happens at runtime around the item's floor anchor.

## Checks

Automated tests cover legacy orientation, four-step cycling, unchanged positions/IDs, all four storage values and rejection of invalid values, full member state round trips, and existence of distinct front/rear resources for all nine pieces. Browser checks cover selecting/rotating furniture, direct rear/mirrored rear selection, restoring the direction after refresh, and responsive control layout.
