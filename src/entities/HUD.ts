import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { drawHeart } from '../utils/PixelArt';

const RETRO_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 20,
  fill: 0xffffff,
  fontWeight: 'bold',
  stroke: { color: 0x000000, width: 3 },
});

export class HUD extends Container {
  private heartsGfx = new Graphics();
  private scoreText: Text;
  private _hearts = 3;
  private _score = 0;

  constructor() {
    super();
    this.addChild(this.heartsGfx);
    this.scoreText = new Text({ text: 'Score: 0 / 10', style: RETRO_STYLE });
    this.scoreText.x = 640;
    this.scoreText.y = 12;
    this.addChild(this.scoreText);
    this.redraw();
  }

  get hearts() { return this._hearts; }
  get score() { return this._score; }

  setHearts(n: number) {
    this._hearts = n;
    this.redraw();
  }

  setScore(n: number) {
    this._score = n;
    this.scoreText.text = `Score: ${n} / 10`;
  }

  private redraw() {
    this.heartsGfx.clear();
    for (let i = 0; i < 3; i++) {
      drawHeart(this.heartsGfx, 12 + i * 24, 12, i < this._hearts);
    }
  }
}
