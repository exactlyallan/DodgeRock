import { Graphics } from 'pixi.js';

export function drawPixelRect(g: Graphics, x: number, y: number, w: number, h: number, color: number) {
  g.rect(x, y, w, h).fill(color);
}

export function drawCloud(g: Graphics, cx: number, cy: number, scale = 1) {
  const s = scale;
  g.rect(cx - 12 * s, cy, 24 * s, 8 * s).fill(0xffffff);
  g.rect(cx - 8 * s, cy - 6 * s, 16 * s, 6 * s).fill(0xffffff);
  g.rect(cx - 16 * s, cy + 2 * s, 32 * s, 4 * s).fill(0xeeeeee);
}

export function drawHeart(g: Graphics, x: number, y: number, filled: boolean) {
  const c = filled ? 0xff2244 : 0x444444;
  g.rect(x + 2, y, 4, 2).fill(c);
  g.rect(x + 10, y, 4, 2).fill(c);
  g.rect(x, y + 2, 8, 2).fill(c);
  g.rect(x + 8, y + 2, 8, 2).fill(c);
  g.rect(x, y + 4, 16, 2).fill(c);
  g.rect(x + 2, y + 6, 12, 2).fill(c);
  g.rect(x + 4, y + 8, 8, 2).fill(c);
  g.rect(x + 6, y + 10, 4, 2).fill(c);
}
