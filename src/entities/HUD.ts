import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { GAME_WIDTH } from '../systems/Physics';
import { drawHeart } from '../utils/PixelArt';

const RETRO_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 43,
  fill: 0xffdd66,
  fontWeight: 'bold',
  stroke: { color: 0x442200, width: 7 },
});

const PROGRESS_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 36,
  fill: 0xeeffff,
  fontWeight: 'bold',
  stroke: { color: 0x000000, width: 5 },
});

const SESSION_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 31,
  fill: 0xcccccc,
  fontWeight: 'bold',
  stroke: { color: 0x000000, width: 4 },
});

export class HUD extends Container {
  private heartsGfx = new Graphics();
  private coinsText: Text;
  private throwsSmall: Text;
  private progressText: Text;
  private _hearts = 3;
  private _throws = 0;

  constructor(initialCoins: number) {
    super();
    this.addChild(this.heartsGfx);

    this.progressText = new Text({ text: 'Lv 1/1 — Rocks 0/0', style: PROGRESS_STYLE });
    this.progressText.anchor.set(0.5, 0);
    this.progressText.x = GAME_WIDTH / 2;
    this.progressText.y = 19;
    this.addChild(this.progressText);

    this.coinsText = new Text({ text: `Coins: ${initialCoins}`, style: RETRO_STYLE });
    this.coinsText.x = GAME_WIDTH - 29;
    this.coinsText.y = 15;
    this.coinsText.anchor.set(1, 0);
    this.addChild(this.coinsText);

    this.throwsSmall = new Text({ text: 'Throws: 0', style: SESSION_STYLE });
    this.throwsSmall.x = GAME_WIDTH - 29;
    this.throwsSmall.y = 67;
    this.throwsSmall.anchor.set(1, 0);
    this.addChild(this.throwsSmall);

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

  setCoins(n: number) {
    this.coinsText.text = `Coins: ${n}`;
  }

  setThrows(n: number) {
    this._throws = n;
    this.throwsSmall.text = `Throws: ${n}`;
  }

  setLevelProgress(levelIndex: number, levelCount: number, deployed: number, quota: number) {
    const lv = levelIndex + 1;
    this.progressText.text = `Lv ${lv}/${levelCount} — Rocks ${deployed}/${quota}`;
  }

  private redraw() {
    this.heartsGfx.clear();
    for (let i = 0; i < 3; i++) {
      drawHeart(this.heartsGfx, 29 + i * 58, 29, i < this._hearts);
    }
  }
}
