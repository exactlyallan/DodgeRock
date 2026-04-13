import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../systems/Physics';
import { drawCloud } from '../utils/PixelArt';

const TITLE_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 115,
  fill: 0xffee44,
  fontWeight: 'bold',
  stroke: { color: 0x442200, width: 14 },
  dropShadow: { color: 0x000000, distance: 10, angle: Math.PI / 4, blur: 0 },
});

const GAME_OVER_LINE_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 96,
  fill: 0xff4444,
  fontWeight: 'bold',
  stroke: { color: 0x440000, width: 12 },
  dropShadow: { color: 0x000000, distance: 7, angle: Math.PI / 4, blur: 0 },
});

const SUB_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 43,
  fill: 0xffffff,
  fontWeight: 'bold',
  stroke: { color: 0x000000, width: 7 },
});

const CONTROLS_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 34,
  fill: 0xdddddd,
  stroke: { color: 0x000000, width: 5 },
  lineHeight: 53,
});

export type TitleSceneOptions = {
  gameOver?: { throws: number; coins: number };
};

export class TitleScene extends Container {
  private blink = 0;
  private pressText: Text;

  constructor(options: TitleSceneOptions = {}) {
    super();
    const isGameOver = options.gameOver !== undefined;
    const throws = options.gameOver?.throws ?? 0;
    const coins = options.gameOver?.coins ?? 0;

    const bg = new Graphics();
    bg.rect(0, 0, GAME_WIDTH, GAME_HEIGHT).fill(0x335588);
    this.addChild(bg);

    const clouds = new Graphics();
    drawCloud(clouds, 216, 144, 2);
    drawCloud(clouds, 720, 91, 1.5);
    drawCloud(clouds, 1080, 180, 1.8);
    this.addChild(clouds);

    const deco = new Graphics();
    for (let i = 0; i < 5; i++) {
      const bx = 240 + i * 360;
      const by = 756 + Math.sin(i * 1.5) * 36;
      deco.circle(bx, by, 34 + i * 5).fill(0x888888);
      deco.rect(bx - 7, by - 5, 12, 5).fill(0x666666);
    }
    deco.rect(0, 828, GAME_WIDTH, GAME_HEIGHT - 828).fill(0x44aa44);
    deco.rect(0, 828, GAME_WIDTH, 14).fill(0x338833);
    this.addChild(deco);

    const title = new Text({ text: 'DODGE ROCK', style: TITLE_STYLE });
    title.anchor.set(0.5);
    title.x = GAME_WIDTH / 2;
    title.y = 324;
    this.addChild(title);

    if (isGameOver) {
      const go = new Text({ text: 'GAME OVER', style: GAME_OVER_LINE_STYLE });
      go.anchor.set(0.5);
      go.x = GAME_WIDTH / 2;
      go.y = 410;
      this.addChild(go);

      const throwsLine = new Text({ text: `Throws this run: ${throws}`, style: SUB_STYLE });
      throwsLine.anchor.set(0.5);
      throwsLine.x = GAME_WIDTH / 2;
      throwsLine.y = 480;
      this.addChild(throwsLine);

      const coinsLine = new Text({ text: `Coins in bank: ${coins}`, style: SUB_STYLE });
      coinsLine.anchor.set(0.5);
      coinsLine.x = GAME_WIDTH / 2;
      coinsLine.y = 566;
      this.addChild(coinsLine);
    } else {
      const sub = new Text({ text: 'A retro boulder-dodging adventure', style: SUB_STYLE });
      sub.anchor.set(0.5);
      sub.x = GAME_WIDTH / 2;
      sub.y = 432;
      this.addChild(sub);
    }

    this.pressText = new Text({
      text: isGameOver ? 'Press SPACE to try again' : 'Press SPACE to start',
      style: SUB_STYLE,
    });
    this.pressText.anchor.set(0.5);
    this.pressText.x = GAME_WIDTH / 2;
    this.pressText.y = isGameOver ? 648 : 540;
    this.addChild(this.pressText);

    if (!isGameOver) {
      const controls = new Text({
        text: [
          'Controls:',
          '← →  Move left / right',
          '↑  Jump',
          '↓  Duck',
          'SPACE  Pick up stopped boulder / Throw held boulder',
        ].join('\n'),
        style: CONTROLS_STYLE,
      });
      controls.anchor.set(0.5, 0);
      controls.x = GAME_WIDTH / 2;
      controls.y = 629;
      this.addChild(controls);
    }
  }

  update(dt: number) {
    this.blink += dt * 0.05;
    this.pressText.alpha = Math.sin(this.blink * 3) > 0 ? 1 : 0.3;
  }
}
