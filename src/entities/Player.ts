import { Container, Graphics } from 'pixi.js';
import { GROUND_Y, GAME_WIDTH, GRAVITY } from '../systems/Physics';
import { Input } from '../systems/Input';
import { SoundManager } from '../systems/SoundManager';
import { drawPlayerDucking, drawPlayerStanding } from '../utils/PixelArt';

const SPEED = 3.5;
const JUMP_FORCE = -10;
const PLAYER_W = 20;
const PLAYER_H = 36;
const DUCK_H = 20;

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
  /** Radians; advances while moving on the ground so leg pixels can sine-wiggle. */
  private walkPhase = 0;
  public hitWidth = PLAYER_W;
  public hitHeight = PLAYER_H;

  constructor() {
    super();
    this.addChild(this.gfx);
    this.addChild(this.heldGfx);
    this.x = 120;
    this.y = GROUND_Y - PLAYER_H;
    drawPlayerStanding(this.gfx, this.walkPhase);
  }

  private drawHeldBoulder() {
    this.heldGfx.clear();
    if (!this.isHolding) return;
    this.heldGfx.circle(10, -12, 8).fill(0x888888);
    this.heldGfx.rect(6, -16, 3, 3).fill(0x666666);
    this.heldGfx.rect(12, -10, 2, 2).fill(0x666666);
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
      drawPlayerStanding(this.gfx, this.walkPhase);
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
    if (this.x > GAME_WIDTH - 200) this.x = GAME_WIDTH - 200;

    if (this.onGround && !this.isDucking && this.vx !== 0) {
      this.walkPhase += dt * 0.24 * Math.sign(this.vx);
    }

    if (!this.isDucking) {
      drawPlayerStanding(this.gfx, this.walkPhase);
    }

    this.drawHeldBoulder();
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
