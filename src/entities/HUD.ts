import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { GAME_WIDTH } from '../systems/Physics';
import { drawHeart } from '../utils/PixelArt';

const RETRO_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 18,
  fill: 0xffffff,
  fontWeight: 'bold',
  stroke: { color: 0x000000, width: 3 },
});

const PROGRESS_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 15,
  fill: 0xeeffff,
  fontWeight: 'bold',
  stroke: { color: 0x000000, width: 2 },
});

export class HUD extends Container {
  private heartsGfx = new Graphics();
  private throwsText: Text;
  private progressText: Text;
  private _hearts = 3;
  private _throws = 0;

  constructor() {
    super();
    this.addChild(this.heartsGfx);

    this.progressText = new Text({ text: 'Lv 1/1 — Rocks 0/0', style: PROGRESS_STYLE });
    this.progressText.anchor.set(0.5, 0);
    this.progressText.x = GAME_WIDTH / 2;
    this.progressText.y = 8;
    this.addChild(this.progressText);

    this.throwsText = new Text({ text: 'Throws: 0', style: RETRO_STYLE });
    this.throwsText.x = GAME_WIDTH - 12;
    this.throwsText.y = 8;
    this.throwsText.anchor.set(1, 0);
    this.addChild(this.throwsText);

    this.redraw();
  }

  get hearts() {
    return this._hearts;
  }
  get throws() {
    return this._throws;
  }

  setHearts(n: number) {
    this._hearts = n;
    this.redraw();
  }

  setThrows(n: number) {
    this._throws = n;
    this.throwsText.text = `Throws: ${n}`;
  }

  /** Level index is 0-based in code; shown as 1-based to the player. */
  setLevelProgress(levelIndex: number, levelCount: number, deployed: number, quota: number) {
    const lv = levelIndex + 1;
    this.progressText.text = `Lv ${lv}/${levelCount} — Rocks ${deployed}/${quota}`;
  }

  private redraw() {
    this.heartsGfx.clear();
    for (let i = 0; i < 3; i++) {
      drawHeart(this.heartsGfx, 12 + i * 24, 12, i < this._hearts);
    }
  }
}
