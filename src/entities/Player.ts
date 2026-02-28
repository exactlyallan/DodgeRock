import { Container, Graphics } from 'pixi.js';
import { GROUND_Y, GAME_WIDTH, GRAVITY } from '../systems/Physics';
import { Input } from '../systems/Input';
import { SoundManager } from '../systems/SoundManager';

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
  public hitWidth = PLAYER_W;
  public hitHeight = PLAYER_H;

  constructor() {
    super();
    this.addChild(this.gfx);
    this.addChild(this.heldGfx);
    this.x = 120;
    this.y = GROUND_Y - PLAYER_H;
    this.drawStanding();
  }

  private drawStanding() {
    const g = this.gfx;
    g.clear();
    // head
    g.rect(4, 0, 12, 10).fill(0xffcc88);
    // eyes
    g.rect(6, 3, 3, 3).fill(0x222222);
    g.rect(12, 3, 3, 3).fill(0x222222);
    // body
    g.rect(2, 10, 16, 14).fill(0x3366cc);
    // belt
    g.rect(2, 20, 16, 3).fill(0x884422);
    // legs
    g.rect(3, 24, 6, 12).fill(0x4444aa);
    g.rect(11, 24, 6, 12).fill(0x4444aa);
    // feet
    g.rect(2, 34, 7, 2).fill(0x553311);
    g.rect(11, 34, 7, 2).fill(0x553311);
    this.hitWidth = PLAYER_W;
    this.hitHeight = PLAYER_H;
  }

  private drawDucking() {
    const g = this.gfx;
    g.clear();
    // head (lower)
    g.rect(4, 0, 12, 8).fill(0xffcc88);
    g.rect(6, 2, 3, 3).fill(0x222222);
    g.rect(12, 2, 3, 3).fill(0x222222);
    // crouched body
    g.rect(0, 8, 20, 8).fill(0x3366cc);
    g.rect(0, 14, 20, 3).fill(0x884422);
    // legs tucked
    g.rect(2, 16, 16, 4).fill(0x4444aa);
    this.hitWidth = PLAYER_W;
    this.hitHeight = DUCK_H;
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

    // horizontal movement
    this.vx = 0;
    if (input.isDown('ArrowLeft')) this.vx = -SPEED;
    if (input.isDown('ArrowRight')) this.vx = SPEED;

    // ducking
    const wantDuck = input.isDown('ArrowDown') && this.onGround && !this.isHolding;
    if (wantDuck && !this.isDucking) {
      this.isDucking = true;
      this.drawDucking();
      this.y = GROUND_Y - DUCK_H;
    } else if (!wantDuck && this.isDucking) {
      this.isDucking = false;
      this.drawStanding();
      this.y = GROUND_Y - PLAYER_H;
    }

    // jump
    if (input.wasPressed('Space') && this.onGround) {
      this.vy = JUMP_FORCE;
      this.onGround = false;
      sound.jump();
    }

    // gravity
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

    // clamp to screen (leave room for mountain)
    if (this.x < 0) this.x = 0;
    if (this.x > GAME_WIDTH - 200) this.x = GAME_WIDTH - 200;

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
