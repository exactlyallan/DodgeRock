export const GRAVITY = 0.5;
/** Fixed 16:9 logical resolution (pillarboxed inside the browser window). */
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 450;
export const GROUND_Y = 390;
export const MOUNTAIN_X = 650;

/** Sky bands used by `Mountain` and pillar edge textures (left side of the playfield). */
export const SKY_STRIPES: readonly { y: number; h: number; c: number }[] = [
  { y: 0, h: 75, c: 0x4488cc },
  { y: 75, h: 75, c: 0x55aadd },
  { y: 150, h: 75, c: 0x66bbee },
  { y: 225, h: 90, c: 0x77ccee },
  { y: 315, h: 75, c: 0x88ddff },
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
