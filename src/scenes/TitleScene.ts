import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../systems/Physics';
import { drawCloud } from '../utils/PixelArt';

const TITLE_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 48,
  fill: 0xffee44,
  fontWeight: 'bold',
  stroke: { color: 0x442200, width: 6 },
  dropShadow: { color: 0x000000, distance: 4, angle: Math.PI / 4, blur: 0 },
});

const SUB_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 18,
  fill: 0xffffff,
  fontWeight: 'bold',
  stroke: { color: 0x000000, width: 3 },
});

const CONTROLS_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 14,
  fill: 0xdddddd,
  stroke: { color: 0x000000, width: 2 },
  lineHeight: 22,
});

export class TitleScene extends Container {
  private blink = 0;
  private pressText: Text;

  constructor() {
    super();
    const bg = new Graphics();
    bg.rect(0, 0, GAME_WIDTH, GAME_HEIGHT).fill(0x335588);
    this.addChild(bg);

    const clouds = new Graphics();
    drawCloud(clouds, 120, 80, 2);
    drawCloud(clouds, 400, 50, 1.5);
    drawCloud(clouds, 600, 100, 1.8);
    this.addChild(clouds);

    // boulder deco
    const deco = new Graphics();
    for (let i = 0; i < 5; i++) {
      const bx = 100 + i * 150;
      const by = 420 + Math.sin(i * 1.5) * 20;
      deco.circle(bx, by, 14 + i * 2).fill(0x888888);
      deco.rect(bx - 3, by - 2, 5, 2).fill(0x666666);
    }
    // ground
    deco.rect(0, 460, GAME_WIDTH, GAME_HEIGHT - 460).fill(0x44aa44);
    deco.rect(0, 460, GAME_WIDTH, 6).fill(0x338833);
    this.addChild(deco);

    const title = new Text({ text: 'DODGE ROCK', style: TITLE_STYLE });
    title.anchor.set(0.5);
    title.x = GAME_WIDTH / 2;
    title.y = 180;
    this.addChild(title);

    const sub = new Text({ text: 'A retro boulder-dodging adventure', style: SUB_STYLE });
    sub.anchor.set(0.5);
    sub.x = GAME_WIDTH / 2;
    sub.y = 240;
    this.addChild(sub);

    this.pressText = new Text({ text: 'Press SPACE to start', style: SUB_STYLE });
    this.pressText.anchor.set(0.5);
    this.pressText.x = GAME_WIDTH / 2;
    this.pressText.y = 300;
    this.addChild(this.pressText);

    const controls = new Text({
      text: [
        'Controls:',
        '← →  Move left / right',
        'SPACE  Jump',
        '↓  Duck',
        '↑  Pick up / Throw boulder',
      ].join('\n'),
      style: CONTROLS_STYLE,
    });
    controls.anchor.set(0.5, 0);
    controls.x = GAME_WIDTH / 2;
    controls.y = 350;
    this.addChild(controls);
  }

  update(dt: number) {
    this.blink += dt * 0.05;
    this.pressText.alpha = Math.sin(this.blink * 3) > 0 ? 1 : 0.3;
  }
}
