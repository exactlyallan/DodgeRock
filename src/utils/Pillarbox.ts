import { Container, Texture, TilingSprite } from 'pixi.js';
import { GAME_HEIGHT, GAME_WIDTH, GROUND_Y, SKY_STRIPES } from '../systems/Physics';

const STRIP_W = 4;

function hexCss(c: number): string {
  return `#${c.toString(16).padStart(6, '0')}`;
}

/** Left bezel: same vertical bands as column x=0 in the playfield (sky + grass). */
function createLeftEdgeTexture(): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = STRIP_W;
  canvas.height = GAME_HEIGHT;
  const ctx = canvas.getContext('2d')!;
  for (const s of SKY_STRIPES) {
    ctx.fillStyle = hexCss(s.c);
    ctx.fillRect(0, s.y, STRIP_W, s.h);
  }
  ctx.fillStyle = hexCss(0x44aa44);
  ctx.fillRect(0, GROUND_Y, STRIP_W, GAME_HEIGHT - GROUND_Y);
  ctx.fillStyle = hexCss(0x338833);
  ctx.fillRect(0, GROUND_Y, STRIP_W, 6);
  return Texture.from(canvas);
}

/**
 * Right bezel: sky at the top, then mountain rock (the right edge is mostly cliff),
 * then the same grass strip as the playfield.
 */
function createRightEdgeTexture(): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = STRIP_W;
  canvas.height = GAME_HEIGHT;
  const ctx = canvas.getContext('2d')!;
  for (const s of SKY_STRIPES) {
    ctx.fillStyle = hexCss(s.c);
    ctx.fillRect(0, s.y, STRIP_W, s.h);
  }
  ctx.fillStyle = hexCss(0x665544);
  ctx.fillRect(0, 120, STRIP_W, GROUND_Y - 120);
  ctx.fillStyle = hexCss(0x44aa44);
  ctx.fillRect(0, GROUND_Y, STRIP_W, GAME_HEIGHT - GROUND_Y);
  ctx.fillStyle = hexCss(0x338833);
  ctx.fillRect(0, GROUND_Y, STRIP_W, 6);
  return Texture.from(canvas);
}

/** Top edge of the playfield (row y≈0): first sky band. */
function createTopEdgeTexture(): Texture {
  const canvas = document.createElement('canvas');
  const h = 4;
  canvas.width = GAME_WIDTH;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = hexCss(SKY_STRIPES[0].c);
  ctx.fillRect(0, 0, GAME_WIDTH, h);
  return Texture.from(canvas);
}

/** Bottom edge: grass + dark grass line. */
function createBottomEdgeTexture(): Texture {
  const canvas = document.createElement('canvas');
  const h = 8;
  canvas.width = GAME_WIDTH;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = hexCss(0x44aa44);
  ctx.fillRect(0, 0, GAME_WIDTH, h - 2);
  ctx.fillStyle = hexCss(0x338833);
  ctx.fillRect(0, h - 4, GAME_WIDTH, 4);
  return Texture.from(canvas);
}

export type PillarboxLayer = {
  root: Container;
  left: TilingSprite;
  right: TilingSprite;
  top: TilingSprite;
  bottom: TilingSprite;
  layout: (rw: number, rh: number) => void;
};

/**
 * Full-window pillarboxing: scales the game container to fit the window while keeping 16:9,
 * and fills the horizontal gutters with `TilingSprite`s built from thin edge strips (repeated across the gutter).
 */
export function createPillarboxLayer(gameWorld: Container): PillarboxLayer {
  const root = new Container();
  const texLeft = createLeftEdgeTexture();
  const texRight = createRightEdgeTexture();
  const texTop = createTopEdgeTexture();
  const texBottom = createBottomEdgeTexture();

  const mk = (tex: Texture) =>
    new TilingSprite({
      texture: tex,
      width: 64,
      height: 64,
      roundPixels: true,
    });

  const left = mk(texLeft);
  const right = mk(texRight);
  const top = mk(texTop);
  const bottom = mk(texBottom);

  root.addChild(top);
  root.addChild(bottom);
  root.addChild(left);
  root.addChild(right);
  root.addChild(gameWorld);

  const layout = (rw: number, rh: number) => {
    const scale = Math.min(rw / GAME_WIDTH, rh / GAME_HEIGHT);
    const dw = GAME_WIDTH * scale;
    const dh = GAME_HEIGHT * scale;
    const ox = Math.floor((rw - dw) / 2);
    const oy = Math.floor((rh - dh) / 2);

    gameWorld.scale.set(scale);
    gameWorld.position.set(ox, oy);

    const padL = ox;
    const padR = rw - ox - dw;
    const padT = oy;
    const padB = rh - oy - dh;
    const vStretch = dh / GAME_HEIGHT;

    top.position.set(0, 0);
    top.width = rw;
    top.height = Math.max(0, padT);
    top.tileScale.set(1, padT > 0 ? padT / texTop.height : 1);

    bottom.position.set(0, oy + dh);
    bottom.width = rw;
    bottom.height = Math.max(0, padB);
    bottom.tileScale.set(1, padB > 0 ? padB / texBottom.height : 1);

    left.position.set(0, oy);
    left.width = Math.max(0, padL);
    left.height = dh;
    left.tileScale.set(1, vStretch);

    right.position.set(ox + dw, oy);
    right.width = Math.max(0, padR);
    right.height = dh;
    right.tileScale.set(1, vStretch);
  };

  return { root, left, right, top, bottom, layout };
}
