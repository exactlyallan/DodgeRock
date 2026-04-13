import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../systems/Physics';
import { getLevels } from '../systems/LevelConfig';

const BIG_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 101,
  fill: 0x44ff66,
  fontWeight: 'bold',
  stroke: { color: 0x004400, width: 12 },
  dropShadow: { color: 0x000000, distance: 7, angle: Math.PI / 4, blur: 0 },
});

const SUB_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 48,
  fill: 0xffffff,
  fontWeight: 'bold',
  stroke: { color: 0x000000, width: 7 },
});

export class WinScene extends Container {
  private blink = 0;
  private restartText: Text;

  constructor() {
    super();
    const bg = new Graphics();
    bg.rect(0, 0, GAME_WIDTH, GAME_HEIGHT).fill(0x224422);
    this.addChild(bg);

    const particles = new Graphics();
    for (let i = 0; i < 40; i++) {
      const px = Math.random() * GAME_WIDTH;
      const py = Math.random() * GAME_HEIGHT;
      const colors = [0xffee44, 0xff4488, 0x44ff88, 0x4488ff, 0xff8844];
      particles.rect(px, py, 10 + Math.random() * 10, 10 + Math.random() * 10).fill(colors[i % colors.length]);
    }
    this.addChild(particles);

    const title = new Text({ text: 'YOU WIN!', style: BIG_STYLE });
    title.anchor.set(0.5);
    title.x = GAME_WIDTH / 2;
    title.y = 528;
    this.addChild(title);

    const n = getLevels().length;
    const sub = new Text({ text: `All ${n} levels survived!`, style: SUB_STYLE });
    sub.anchor.set(0.5);
    sub.x = GAME_WIDTH / 2;
    sub.y = 696;
    this.addChild(sub);

    this.restartText = new Text({ text: 'Press SPACE to play again', style: SUB_STYLE });
    this.restartText.anchor.set(0.5);
    this.restartText.x = GAME_WIDTH / 2;
    this.restartText.y = 888;
    this.addChild(this.restartText);
  }

  update(dt: number) {
    this.blink += dt * 0.05;
    this.restartText.alpha = Math.sin(this.blink * 3) > 0 ? 1 : 0.3;
  }
}
