export const GRAVITY = 1.2;
/** Fixed 16:9 logical resolution (pillarboxed inside the browser window). Default 1920×1080. */
export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;
export const GROUND_Y = 936;
export const MOUNTAIN_X = 1560;

/** Sky bands used by `Mountain` and pillar edge textures (left side of the playfield). */
export const SKY_STRIPES: readonly { y: number; h: number; c: number }[] = [
  { y: 0, h: 180, c: 0x4488cc },
  { y: 180, h: 180, c: 0x55aadd },
  { y: 360, h: 180, c: 0x66bbee },
  { y: 540, h: 216, c: 0x77ccee },
  { y: 756, h: 180, c: 0x88ddff },
];

export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function intersects(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
