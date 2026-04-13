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
 * Side-view runner: hair fringe, shirt, arms at sides, sine-offset legs when `legPhase` moves.
 * Fits in **36px** tall box (y 0–35) to match the player hitbox.
 * @param legPhase radians — advance while walking on the ground for a stride wave.
 */
export function drawPlayerStanding(g: Graphics, legPhase: number) {
  g.clear();

  const leftShift = Math.round(Math.sin(legPhase) * 2);
  const rightShift = Math.round(Math.sin(legPhase + Math.PI) * 2);

  // hair — top rows (reads as a fringe above the face)
  drawPixelRect(g, 3, 0, 14, 2, P.hairHi);
  drawPixelRect(g, 4, 1, 12, 1, P.hair);

  // head + eyes (head starts under hair)
  drawPixelRect(g, 4, 2, 12, 10, P.skin);
  drawPixelRect(g, 6, 5, 3, 3, P.eye);
  drawPixelRect(g, 12, 5, 3, 3, P.eye);

  // arms — sleeves + hands beside torso
  drawPixelRect(g, 0, 13, 3, 8, P.shirt);
  drawPixelRect(g, 0, 20, 3, 3, P.skinArm);
  drawPixelRect(g, 17, 13, 3, 8, P.shirt);
  drawPixelRect(g, 17, 20, 3, 3, P.skinArm);

  // torso (in front of inner arm lines) + belt
  drawPixelRect(g, 2, 12, 16, 9, P.shirt);
  drawPixelRect(g, 2, 21, 16, 3, P.belt);

  // legs + shoes (horizontal sine = alternating stride)
  drawPixelRect(g, 3 + leftShift, 24, 6, 5, P.pants);
  drawPixelRect(g, 3 + leftShift, 29, 6, 5, P.pants);
  drawPixelRect(g, 11 + rightShift, 24, 6, 5, P.pants);
  drawPixelRect(g, 11 + rightShift, 29, 6, 5, P.pants);

  drawPixelRect(g, 2 + leftShift, 34, 7, 2, P.shoes);
  drawPixelRect(g, 11 + rightShift, 34, 7, 2, P.shoes);
}

/** Crouch: arms blanket the eyes — peek of hair still visible. Fits **20px** tall (y 0–19). */
export function drawPlayerDucking(g: Graphics) {
  g.clear();

  drawPixelRect(g, 3, 0, 14, 2, P.hair);
  drawPixelRect(g, 4, 2, 12, 6, P.skin);
  drawPixelRect(g, 1, 3, 18, 6, P.skinArm);

  drawPixelRect(g, 0, 9, 20, 5, P.shirt);
  drawPixelRect(g, 0, 13, 20, 3, P.belt);
  drawPixelRect(g, 2, 16, 16, 4, P.pants);
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
