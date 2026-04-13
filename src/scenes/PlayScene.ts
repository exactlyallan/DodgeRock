import { Container, Graphics } from 'pixi.js';
import { Player } from '../entities/Player';
import { Boulder } from '../entities/Boulder';
import { Mountain } from '../entities/Mountain';
import { HUD } from '../entities/HUD';
import { Input } from '../systems/Input';
import { SoundManager } from '../systems/SoundManager';
import type { LevelDef } from '../systems/LevelConfig';
import { intersects, GROUND_Y } from '../systems/Physics';

const SPAWN_INTERVAL_MIN = 60;
const SPAWN_INTERVAL_MAX = 150;
const PICKUP_RANGE = 40;
const THROW_DISTANCE = 25;
const GRACE_PERIOD = 60;

export type PlaySceneOptions = {
  level: LevelDef;
  levelIndex: number;
  levelCount: number;
};

export class PlayScene extends Container {
  private player: Player;
  private boulders: Boulder[] = [];
  private hud: HUD;
  private input: Input;
  private sound: SoundManager;
  private spawnTimer: number;
  private boulderLayer = new Container();
  private particleLayer = new Container();
  private shakeTimer = 0;
  private shakeIntensity = 0;
  private difficulty = 1;
  private graceTimer = GRACE_PERIOD;

  private readonly boulderQuota: number;
  private readonly levelIndex: number;
  private readonly levelCount: number;
  private spawnedCount = 0;
  private levelFinishEmitted = false;

  public onLevelComplete?: () => void;
  public onGameOver?: (throwsCount: number) => void;

  constructor(input: Input, sound: SoundManager, options: PlaySceneOptions) {
    super();
    this.input = input;
    this.sound = sound;
    this.boulderQuota = options.level.boulders;
    this.levelIndex = options.levelIndex;
    this.levelCount = options.levelCount;

    this.addChild(new Mountain());
    this.addChild(this.boulderLayer);
    this.addChild(this.particleLayer);

    this.player = new Player();
    this.addChild(this.player);

    this.hud = new HUD();
    this.addChild(this.hud);
    this.hud.setLevelProgress(this.levelIndex, this.levelCount, 0, this.boulderQuota);

    this.spawnTimer = 80;
    this.difficulty = Math.min(2.5, 1 + this.levelIndex * 0.12);
  }

  update(dt: number) {
    if (this.graceTimer > 0) this.graceTimer -= dt;

    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
      this.x = (Math.random() - 0.5) * this.shakeIntensity;
      this.y = (Math.random() - 0.5) * this.shakeIntensity;
      if (this.shakeTimer <= 0) {
        this.x = 0;
        this.y = 0;
      }
    }

    this.player.update(dt, this.input, this.sound);

    if (this.input.wasPressed('Space')) {
      if (this.player.isHolding) {
        this.throwBoulder();
      } else {
        this.tryPickup();
      }
    }

    // Spawn waves until this level's quota is met
    if (this.spawnedCount < this.boulderQuota) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnBoulder();
        const range = SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN;
        this.spawnTimer = SPAWN_INTERVAL_MIN + (Math.random() * range) / this.difficulty;
      }
    }

    for (let i = this.boulders.length - 1; i >= 0; i--) {
      const b = this.boulders[i];
      const alive = b.update(dt, () => this.sound.bounce());
      if (!alive) {
        if (b.thrown) {
          this.spawnBreakParticles(b.x, b.y);
        }
        this.boulderLayer.removeChild(b);
        this.boulders.splice(i, 1);
        continue;
      }

      if (b.stopped || b.beingHeld || b.thrown) continue;

      if (this.graceTimer <= 0 && !this.player.invincible && intersects(this.player.getHitbox(), b.getHitbox())) {
        this.playerHit();
      }
    }

    if (!this.levelFinishEmitted && this.isLevelSettled()) {
      this.levelFinishEmitted = true;
      this.onLevelComplete?.();
    }
  }

  /** All rocks for this level are out, and nothing is still rolling, flying, or stuck in the player's hands. */
  private isLevelSettled(): boolean {
    if (this.spawnedCount < this.boulderQuota) return false;
    for (const b of this.boulders) {
      if (b.beingHeld) return false;
      if (b.thrown) return false;
      if (!b.stopped) return false;
    }
    return true;
  }

  private spawnBoulder() {
    const speed = 0.5 + Math.random() * 2;
    const b = new Boulder(speed * this.difficulty);
    this.boulders.push(b);
    this.boulderLayer.addChild(b);
    this.spawnedCount++;
    this.hud.setLevelProgress(this.levelIndex, this.levelCount, this.spawnedCount, this.boulderQuota);
  }

  private tryPickup() {
    const ph = this.player.getHitbox();
    const pcx = ph.x + ph.width / 2;
    const pcy = ph.y + ph.height / 2;

    for (let i = 0; i < this.boulders.length; i++) {
      const b = this.boulders[i];
      if (!b.stopped || b.beingHeld) continue;
      const dx = b.x - pcx;
      const dy = b.y - pcy;
      if (Math.sqrt(dx * dx + dy * dy) < PICKUP_RANGE) {
        b.beingHeld = true;
        b.visible = false;
        this.player.isHolding = true;
        this.sound.pickup();
        return;
      }
    }
  }

  private throwBoulder() {
    this.player.isHolding = false;
    this.sound.throwRock();

    for (const b of this.boulders) {
      if (b.beingHeld) {
        b.beingHeld = false;
        b.stopped = false;
        b.thrown = true;
        b.visible = true;
        b.x = this.player.x + this.player.hitWidth / 2;
        b.y = this.player.y - 10;
        b.vx = 4;
        b.vy = -3;
        b.thrownTimer = THROW_DISTANCE;

        this.hud.setThrows(this.hud.throws + 1);
        return;
      }
    }
  }

  private playerHit() {
    this.player.takeHit();
    this.sound.hit();
    this.shakeTimer = 12;
    this.shakeIntensity = 6;
    this.hud.setHearts(this.hud.hearts - 1);
    if (this.hud.hearts <= 0) {
      this.onGameOver?.(this.hud.throws);
    }
  }

  private spawnBreakParticles(bx: number, by: number) {
    const colors = [0x888888, 0x999999, 0x777777, 0xaaaaaa, 0x666666];
    for (let i = 0; i < 8; i++) {
      const p = new Graphics();
      const size = 3 + Math.random() * 4;
      p.rect(-size / 2, -size / 2, size, size).fill(colors[i % colors.length]);
      p.x = bx;
      p.y = by;
      const pvx = (Math.random() - 0.5) * 6;
      const pvy = -1 - Math.random() * 4;
      this.particleLayer.addChild(p);

      let life = 30;
      const tick = () => {
        life--;
        p.x += pvx;
        p.y += pvy + (30 - life) * 0.15;
        p.alpha = life / 30;
        if (life <= 0) {
          this.particleLayer.removeChild(p);
        } else {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    }
  }
}
