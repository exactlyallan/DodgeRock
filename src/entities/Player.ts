import { Container, Graphics } from 'pixi.js';
import { GROUND_Y, GAME_WIDTH, GRAVITY } from '../systems/Physics';
import { Input } from '../systems/Input';
import { SoundManager } from '../systems/SoundManager';
import { drawPlayerCarrying, drawPlayerDucking, drawPlayerStanding } from '../utils/PixelArt';

const SPEED = 8.4;
const JUMP_FORCE = -24;
export const PLAYER_W = 48;
export const PLAYER_H = 86;
export const DUCK_H = 48;

export class Player extends Container {
  public vx = 0;
  public vy = 0;
  public onGround = false;
  public isDucking = false;
  public isHolding = false;
  public invincible = false;
  private invTimer = 0;
  private gfx = new Graphics();
  private heldGfx = new Graphics();
  private walkPhase = 0;
  public hitWidth = PLAYER_W;
  public hitHeight = PLAYER_H;

  constructor() {
    super();
    this.addChild(this.gfx);
    this.addChild(this.heldGfx);
    this.x = 288;
    this.y = GROUND_Y - PLAYER_H;
    drawPlayerStanding(this.gfx, this.walkPhase);
  }

  private drawHeldBoulder() {
    this.heldGfx.clear();
    if (!this.isHolding) return;
    this.heldGfx.circle(24, -29, 19).fill(0x888888);
    this.heldGfx.rect(14, -38, 7, 7).fill(0x666666);
    this.heldGfx.rect(29, -24, 5, 5).fill(0x666666);
  }

  update(dt: number, input: Input, sound: SoundManager) {
    if (this.invincible) {
      this.invTimer -= dt;
      this.alpha = Math.sin(this.invTimer * 10) > 0 ? 1 : 0.3;
      if (this.invTimer <= 0) {
        this.invincible = false;
        this.alpha = 1;
      }
    }

    this.vx = 0;
    if (input.isDown('ArrowLeft')) this.vx = -SPEED;
    if (input.isDown('ArrowRight')) this.vx = SPEED;

    const wantDuck = input.isDown('ArrowDown') && this.onGround && !this.isHolding;
    if (wantDuck && !this.isDucking) {
      this.isDucking = true;
      drawPlayerDucking(this.gfx);
      this.y = GROUND_Y - DUCK_H;
      this.hitHeight = DUCK_H;
    } else if (!wantDuck && this.isDucking) {
      this.isDucking = false;
      this.y = GROUND_Y - PLAYER_H;
      this.hitHeight = PLAYER_H;
      this.redrawBody();
    }

    if (input.wasPressed('ArrowUp') && this.onGround) {
      this.vy = JUMP_FORCE;
      this.onGround = false;
      sound.jump();
    }

    if (!this.onGround) {
      this.vy += GRAVITY * dt;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    const groundLevel = this.isDucking ? GROUND_Y - DUCK_H : GROUND_Y - PLAYER_H;
    if (this.y >= groundLevel) {
      this.y = groundLevel;
      this.vy = 0;
      this.onGround = true;
    }

    if (this.x < 0) this.x = 0;
    if (this.x > GAME_WIDTH - 480) this.x = GAME_WIDTH - 480;

    if (this.onGround && !this.isDucking && this.vx !== 0) {
      this.walkPhase += dt * 0.24 * Math.sign(this.vx);
    }

    if (!this.isDucking) {
      this.redrawBody();
    }

    this.drawHeldBoulder();
  }

  private redrawBody() {
    if (this.isHolding) {
      drawPlayerCarrying(this.gfx, this.walkPhase);
    } else {
      drawPlayerStanding(this.gfx, this.walkPhase);
    }
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.hitWidth,
      height: this.hitHeight,
    };
  }

  takeHit() {
    this.invincible = true;
    this.invTimer = 90;
  }
}
