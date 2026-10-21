export const characterPoses = [
  { id: 'idle', label: '기본 대기', description: '가볍게 숨 쉬며 쉬고 있어요.' },
  { id: 'read', label: '독서', description: '좋아하는 책을 읽는 시간.' },
  { id: 'sit', label: '앉기', description: '바닥에 편하게 앉아 쉬어요.' },
  { id: 'dance', label: '춤추기', description: '제자리에서 작은 춤을 춰요.' },
] as const;

export type CharacterPose = typeof characterPoses[number]['id'];
export type CharacterPlacement = { x: number; y: number; pose: CharacterPose; animated: boolean; frame:number };
export const CHARACTER_SELECTION = '__room_character__';
export const DEFAULT_CHARACTER: Readonly<CharacterPlacement> = { x: 3.43, y: 3.05, pose: 'idle', animated: true, frame:0 };
export const ROOM_MIN = .2, ROOM_MAX = 4.8;

export function clampRoomCoordinate(value: number, fallback = ROOM_MIN) {
  return Number.isFinite(value) ? Math.max(ROOM_MIN, Math.min(ROOM_MAX, value)) : fallback;
}

export function normalizeCharacter(input?: Partial<CharacterPlacement> | null): CharacterPlacement {
  return {
    x: clampRoomCoordinate(input?.x ?? DEFAULT_CHARACTER.x, DEFAULT_CHARACTER.x),
    y: clampRoomCoordinate(input?.y ?? DEFAULT_CHARACTER.y, DEFAULT_CHARACTER.y),
    pose: characterPoses.some(p => p.id === input?.pose) ? input!.pose! : DEFAULT_CHARACTER.pose,
    animated: typeof input?.animated === 'boolean' ? input.animated : DEFAULT_CHARACTER.animated,
    frame: Number.isInteger(input?.frame) ? Math.max(0,Math.min(input?.pose==='dance'?4:3,input!.frame!)) : 0,
  };
}

export function projectRoomPoint(x: number, y: number): [number, number] {
  return [350 + (x - y) * 44, 255 + (x + y) * 23];
}

export function unprojectRoomPoint(x: number, y: number): [number, number] {
  const a = (x - 350) / 44, b = (y - 255) / 23;
  return [(a + b) / 2, (b - a) / 2];
}

/** Arrow keys follow the screen axes, rather than the diagonals of the isometric floor. */
export function roomArrowDelta(key: string, step = .16): [number, number] | null {
  switch (key) {
    case 'ArrowLeft': return [-step, step];
    case 'ArrowRight': return [step, -step];
    case 'ArrowUp': return [-step, -step];
    case 'ArrowDown': return [step, step];
    default: return null;
  }
}
