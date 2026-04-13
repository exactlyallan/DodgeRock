import { Graphics } from 'pixi.js';

export function drawPixelRect(g: Graphics, x: number, y: number, w: number, h: number, color: number) {
  g.rect(x, y, w, h).fill(color);
}

/** Palette for the procedural hero — tweak here like costume DNA. */
const P = {
  skin: 0xffcc88,
  skinArm: 0xeebb99,
  shirt: 0x3366cc,
  pants: 0x4444aa,
  shoes: 0x553311,
  belt: 0x884422,
  hair: 0x5c3d2e,
  hairHi: 0x7a5544,
  eye: 0x222222,
};

/**
 * Side-view runner (scaled for 1920×1080 logical space). ~48×86 px hit box.
 * @param legPhase radians — advance while walking on the ground for a stride wave.
 */
export function drawPlayerStanding(g: Graphics, legPhase: number) {
  g.clear();

  const leftShift = Math.round(Math.sin(legPhase) * 5);
  const rightShift = Math.round(Math.sin(legPhase + Math.PI) * 5);

  drawPixelRect(g, 7, 0, 34, 5, P.hairHi);
  drawPixelRect(g, 10, 2, 29, 2, P.hair);

  drawPixelRect(g, 10, 5, 29, 24, P.skin);
  drawPixelRect(g, 14, 12, 7, 7, P.eye);
  drawPixelRect(g, 29, 12, 7, 7, P.eye);

  drawPixelRect(g, 0, 31, 7, 19, P.shirt);
  drawPixelRect(g, 0, 48, 7, 7, P.skinArm);
  drawPixelRect(g, 41, 31, 7, 19, P.shirt);
  drawPixelRect(g, 41, 48, 7, 7, P.skinArm);

  drawPixelRect(g, 5, 29, 38, 22, P.shirt);
  drawPixelRect(g, 5, 50, 38, 7, P.belt);

  drawPixelRect(g, 7 + leftShift, 58, 14, 12, P.pants);
  drawPixelRect(g, 7 + leftShift, 70, 14, 12, P.pants);
  drawPixelRect(g, 26 + rightShift, 58, 14, 12, P.pants);
  drawPixelRect(g, 26 + rightShift, 70, 14, 12, P.pants);

  drawPixelRect(g, 5 + leftShift, 81, 17, 5, P.shoes);
  drawPixelRect(g, 26 + rightShift, 81, 17, 5, P.shoes);
}

/** Arms lifted to hold a boulder overhead — legs still walk with `legPhase`. */
export function drawPlayerCarrying(g: Graphics, legPhase: number) {
  g.clear();

  const leftShift = Math.round(Math.sin(legPhase) * 5);
  const rightShift = Math.round(Math.sin(legPhase + Math.PI) * 5);

  drawPixelRect(g, 7, 0, 34, 5, P.hairHi);
  drawPixelRect(g, 10, 2, 29, 2, P.hair);

  drawPixelRect(g, 10, 5, 29, 22, P.skin);
  drawPixelRect(g, 14, 10, 7, 7, P.eye);
  drawPixelRect(g, 29, 10, 7, 7, P.eye);

  // arms straight up (sleeves + skin)
  drawPixelRect(g, 5, -14, 10, 22, P.shirt);
  drawPixelRect(g, 5, -18, 10, 7, P.skinArm);
  drawPixelRect(g, 33, -14, 10, 22, P.shirt);
  drawPixelRect(g, 33, -18, 10, 7, P.skinArm);

  drawPixelRect(g, 5, 27, 38, 22, P.shirt);
  drawPixelRect(g, 5, 48, 38, 7, P.belt);

  drawPixelRect(g, 7 + leftShift, 56, 14, 12, P.pants);
  drawPixelRect(g, 7 + leftShift, 68, 14, 12, P.pants);
  drawPixelRect(g, 26 + rightShift, 56, 14, 12, P.pants);
  drawPixelRect(g, 26 + rightShift, 68, 14, 12, P.pants);

  drawPixelRect(g, 5 + leftShift, 79, 17, 5, P.shoes);
  drawPixelRect(g, 26 + rightShift, 79, 17, 5, P.shoes);
}

/** Crouch — arms over eyes. ~48×48 px hit box. */
export function drawPlayerDucking(g: Graphics) {
  g.clear();

  drawPixelRect(g, 7, 0, 34, 5, P.hair);
  drawPixelRect(g, 10, 5, 29, 14, P.skin);
  drawPixelRect(g, 2, 7, 43, 14, P.skinArm);

  drawPixelRect(g, 0, 22, 48, 12, P.shirt);
  drawPixelRect(g, 0, 31, 48, 7, P.belt);
  drawPixelRect(g, 5, 38, 38, 10, P.pants);
}

export function drawCloud(g: Graphics, cx: number, cy: number, scale = 1) {
  const s = scale;
  g.rect(cx - 12 * s, cy, 24 * s, 8 * s).fill(0xffffff);
  g.rect(cx - 8 * s, cy - 6 * s, 16 * s, 6 * s).fill(0xffffff);
  g.rect(cx - 16 * s, cy + 2 * s, 32 * s, 4 * s).fill(0xeeeeee);
}

export function drawHeart(g: Graphics, x: number, y: number, filled: boolean) {
  const c = filled ? 0xff2244 : 0x444444;
  const z = 2.4;
  const X = (n: number) => Math.round(n * z);
  g.rect(x + X(2), y, X(4), X(2)).fill(c);
  g.rect(x + X(10), y, X(4), X(2)).fill(c);
  g.rect(x, y + X(2), X(8), X(2)).fill(c);
  g.rect(x + X(8), y + X(2), X(8), X(2)).fill(c);
  g.rect(x, y + X(4), X(16), X(2)).fill(c);
  g.rect(x + X(2), y + X(6), X(12), X(2)).fill(c);
  g.rect(x + X(4), y + X(8), X(8), X(2)).fill(c);
  g.rect(x + X(6), y + X(10), X(4), X(2)).fill(c);
}
