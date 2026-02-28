import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../systems/Physics';

const BIG_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 42,
  fill: 0xff4444,
  fontWeight: 'bold',
  stroke: { color: 0x440000, width: 5 },
  dropShadow: { color: 0x000000, distance: 3, angle: Math.PI / 4, blur: 0 },
});

const SUB_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 20,
  fill: 0xffffff,
  fontWeight: 'bold',
  stroke: { color: 0x000000, width: 3 },
});

export class GameOverScene extends Container {
  private blink = 0;
  private restartText: Text;
  private scoreText: Text;

  constructor(score: number) {
    super();
    const bg = new Graphics();
    bg.rect(0, 0, GAME_WIDTH, GAME_HEIGHT).fill(0x331111);
    this.addChild(bg);

    const title = new Text({ text: 'GAME OVER', style: BIG_STYLE });
    title.anchor.set(0.5);
    title.x = GAME_WIDTH / 2;
    title.y = 220;
    this.addChild(title);

    this.scoreText = new Text({ text: `Score: ${score} / 10`, style: SUB_STYLE });
    this.scoreText.anchor.set(0.5);
    this.scoreText.x = GAME_WIDTH / 2;
    this.scoreText.y = 290;
    this.addChild(this.scoreText);

    this.restartText = new Text({ text: 'Press SPACE to try again', style: SUB_STYLE });
    this.restartText.anchor.set(0.5);
    this.restartText.x = GAME_WIDTH / 2;
    this.restartText.y = 360;
    this.addChild(this.restartText);
  }

  update(dt: number) {
    this.blink += dt * 0.05;
    this.restartText.alpha = Math.sin(this.blink * 3) > 0 ? 1 : 0.3;
  }
}
