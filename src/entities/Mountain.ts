import { Container, Graphics } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, MOUNTAIN_X } from '../systems/Physics';
import { drawCloud } from '../utils/PixelArt';

export class Mountain extends Container {
  constructor() {
    super();
    this.drawSky();
    this.drawClouds();
    this.drawMountain();
    this.drawGround();
  }

  private drawSky() {
    const sky = new Graphics();
    const stripes = [
      { y: 0, h: 100, c: 0x4488cc },
      { y: 100, h: 100, c: 0x55aadd },
      { y: 200, h: 100, c: 0x66bbee },
      { y: 300, h: 120, c: 0x77ccee },
      { y: 420, h: 100, c: 0x88ddff },
    ];
    for (const s of stripes) {
      sky.rect(0, s.y, GAME_WIDTH, s.h).fill(s.c);
    }
    this.addChild(sky);
  }

  private drawClouds() {
    const clouds = new Graphics();
    drawCloud(clouds, 80, 40, 1.5);
    drawCloud(clouds, 250, 80, 1);
    drawCloud(clouds, 450, 30, 1.2);
    drawCloud(clouds, 150, 140, 0.8);
    drawCloud(clouds, 380, 120, 1);
    this.addChild(clouds);
  }

  private drawMountain() {
    const mtn = new Graphics();

    mtn.moveTo(MOUNTAIN_X - 40, GROUND_Y)
      .lineTo(MOUNTAIN_X + 20, 40)
      .lineTo(GAME_WIDTH, 20)
      .lineTo(GAME_WIDTH, GROUND_Y)
      .closePath()
      .fill(0x665544);

    mtn.moveTo(MOUNTAIN_X - 20, GROUND_Y)
      .lineTo(MOUNTAIN_X + 40, 60)
      .lineTo(GAME_WIDTH, 40)
      .lineTo(GAME_WIDTH, GROUND_Y)
      .closePath()
      .fill(0x776655);

    const detailColors = [0x554433, 0x887766, 0x998877];
    for (let i = 0; i < 30; i++) {
      const dx = MOUNTAIN_X + Math.random() * (GAME_WIDTH - MOUNTAIN_X);
      const dy = 60 + Math.random() * (GROUND_Y - 80);
      const size = 2 + Math.random() * 6;
      mtn.rect(dx, dy, size, size).fill(detailColors[i % detailColors.length]);
    }

    const snowLine = 120;
    mtn.moveTo(MOUNTAIN_X + 25, snowLine)
      .lineTo(MOUNTAIN_X + 15, 40)
      .lineTo(GAME_WIDTH, 20)
      .lineTo(GAME_WIDTH, snowLine - 40)
      .closePath()
      .fill(0xeeeeff);

    this.addChild(mtn);
  }

  private drawGround() {
    const ground = new Graphics();
    ground.rect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y).fill(0x44aa44);
    ground.rect(0, GROUND_Y, GAME_WIDTH, 6).fill(0x338833);

    for (let i = 0; i < 40; i++) {
      const gx = Math.random() * GAME_WIDTH;
      const gy = GROUND_Y + 8 + Math.random() * (GAME_HEIGHT - GROUND_Y - 12);
      ground.rect(gx, gy, 3, 3).fill(0x339933);
    }
    this.addChild(ground);
  }
}
