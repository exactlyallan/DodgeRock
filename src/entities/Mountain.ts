import { Container, Graphics } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, MOUNTAIN_X, SKY_STRIPES } from '../systems/Physics';
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
    for (const s of SKY_STRIPES) {
      sky.rect(0, s.y, GAME_WIDTH, s.h).fill(s.c);
    }
    this.addChild(sky);
  }

  private drawClouds() {
    const clouds = new Graphics();
    drawCloud(clouds, 144, 72, 1.5);
    drawCloud(clouds, 451, 144, 1);
    drawCloud(clouds, 811, 53, 1.2);
    drawCloud(clouds, 269, 252, 0.8);
    drawCloud(clouds, 684, 216, 1);
    this.addChild(clouds);
  }

  private drawMountain() {
    const mtn = new Graphics();

    mtn.moveTo(MOUNTAIN_X - 96, GROUND_Y)
      .lineTo(MOUNTAIN_X + 48, 96)
      .lineTo(GAME_WIDTH, 48)
      .lineTo(GAME_WIDTH, GROUND_Y)
      .closePath()
      .fill(0x665544);

    mtn.moveTo(MOUNTAIN_X - 48, GROUND_Y)
      .lineTo(MOUNTAIN_X + 96, 144)
      .lineTo(GAME_WIDTH, 96)
      .lineTo(GAME_WIDTH, GROUND_Y)
      .closePath()
      .fill(0x776655);

    const detailColors = [0x554433, 0x887766, 0x998877];
    for (let i = 0; i < 30; i++) {
      const dx = MOUNTAIN_X + Math.random() * (GAME_WIDTH - MOUNTAIN_X);
      const dy = 144 + Math.random() * (GROUND_Y - 192);
      const size = 5 + Math.random() * 14;
      mtn.rect(dx, dy, size, size).fill(detailColors[i % detailColors.length]);
    }

    const snowLine = 216;
    mtn.moveTo(MOUNTAIN_X + 60, snowLine)
      .lineTo(MOUNTAIN_X + 36, 96)
      .lineTo(GAME_WIDTH, 48)
      .lineTo(GAME_WIDTH, snowLine - 96)
      .closePath()
      .fill(0xeeeeff);

    this.addChild(mtn);
  }

  private drawGround() {
    const ground = new Graphics();
    const grassH = GAME_HEIGHT - GROUND_Y;
    ground.rect(0, GROUND_Y, GAME_WIDTH, grassH).fill(0x44aa44);
    ground.rect(0, GROUND_Y, GAME_WIDTH, 14).fill(0x338833);

    for (let i = 0; i < 40; i++) {
      const gx = Math.random() * GAME_WIDTH;
      const gy = GROUND_Y + 19 + Math.random() * (grassH - 29);
      ground.rect(gx, gy, 7, 7).fill(0x339933);
    }
    this.addChild(ground);
  }
}
