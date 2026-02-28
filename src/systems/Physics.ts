export const GRAVITY = 0.5;
export const GROUND_Y = 520;
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const MOUNTAIN_X = 650;

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
