import { Container, Graphics } from 'pixi.js';
import { GROUND_Y, GRAVITY, MOUNTAIN_X, GAME_WIDTH } from '../systems/Physics';

const BOULDER_RADIUS = 29;
const BOUNCE_FACTOR = 0.55;
const GROUND_FRICTION = 0.985;
const MIN_SPEED = 0.36;
const MOUNTAIN_LEFT = MOUNTAIN_X - 96;
const SLOPE_TOP_Y = 96;

export class Boulder extends Container {
  public vx: number;
  public vy: number;
  public radius = BOULDER_RADIUS;
  public stopped = false;
  public onMountain = true;
  public beingHeld = false;
  public thrown = false;
  public thrownTimer = 0;
  /** Rolled once on first bounce; if true, a coin is inside until thrown away or lost. */
  public hasCoinInside = false;
  public lootRollDone = false;
  private gfx = new Graphics();
  private rotation_speed: number;

  constructor(speed: number) {
    super();
    this.x = MOUNTAIN_X + 144 + Math.random() * 144;
    this.y = 72 + Math.random() * 192;
    this.vx = -(1.5 + speed);
    this.vy = 0.5;
    this.rotation_speed = (0.02 + Math.random() * 0.04) * (this.vx < 0 ? -1 : 1);
    this.addChild(this.gfx);
    this.drawBoulder();
  }

  private drawBoulder() {
    const g = this.gfx;
    g.clear();
    g.circle(0, 0, BOULDER_RADIUS).fill(0x888888);
    g.circle(-2, -2, BOULDER_RADIUS - 2).fill(0x999999);
    // cracks
    g.rect(-4, -2, 6, 2).fill(0x666666);
    g.rect(2, 3, 4, 2).fill(0x666666);
    g.rect(-5, 4, 3, 2).fill(0x777777);
    // highlight
    g.rect(-4, -6, 3, 2).fill(0xaaaaaa);
  }

  update(dt: number, onBounce?: () => void): boolean {
    if (this.beingHeld || this.stopped) return true;

    if (this.thrown) {
      this.thrownTimer -= dt;
      if (this.thrownTimer <= 0) return false;
      this.x += this.vx * dt;
      this.vy += GRAVITY * 0.5 * dt;
      this.y += this.vy * dt;
      return true;
    }

    this.vy += GRAVITY * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.gfx.rotation += this.rotation_speed * dt;

    const slopeY = this.getMountainSlopeY(this.x);

    if (this.onMountain && this.x > MOUNTAIN_LEFT) {
      if (this.y + this.radius > slopeY) {
        this.y = slopeY - this.radius;
        this.vy *= -BOUNCE_FACTOR;
        if (Math.abs(this.vy) < 2.4) {
          this.vy = -4.8;
        }
        this.vx -= 0.72;
        onBounce?.();
      }
    } else {
      this.onMountain = false;
    }

    if (this.y + this.radius > GROUND_Y) {
      this.y = GROUND_Y - this.radius;
      if (Math.abs(this.vy) > 4.8) {
        this.vy *= -BOUNCE_FACTOR;
        onBounce?.();
      } else {
        this.vy = 0;
      }
      this.vx *= GROUND_FRICTION;

      if (Math.abs(this.vx) < MIN_SPEED) {
        this.vx = 0;
        this.stopped = true;
      }
    }

    if (this.x < -72) return false;
    if (this.x > GAME_WIDTH + 72) return false;

    return true;
  }

  private getMountainSlopeY(x: number): number {
    const t = (x - MOUNTAIN_LEFT) / (GAME_WIDTH - MOUNTAIN_LEFT);
    return GROUND_Y - t * (GROUND_Y - SLOPE_TOP_Y);
  }

  getHitbox() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2,
    };
  }
}
