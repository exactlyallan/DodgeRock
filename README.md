# Dodge Rock
A retro pixel-art side-scrolling browser game built with PixiJS. Dodge boulders tumbling down a mountain, pick them up, and throw them.

## Built With Cursor 

---------

## Getting Starte (playing)
Check out [Gameplay Guide](GAMEPLAY.MD)

## Getting Started (dev)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)

### Install

```bash
npm install
```

### Run (Development)

```bash
npm run dev
```

Opens a local Vite dev server with hot reload. Visit the URL printed in the terminal (typically `http://localhost:5173`).

### Build for Production

```bash
npm run build
```

Outputs optimized static files to `dist/`.

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

| Tool | Purpose |
|---|---|
| [PixiJS](https://pixijs.com/) v8 | 2D rendering engine |
| TypeScript 5.7 | Language |
| Vite 6 | Dev server & bundler |

All graphics are procedurally drawn with the PixiJS Graphics API (no sprite sheets). Sound effects are generated at runtime via the Web Audio API (no audio files).

## Architecture

The project follows an **Entity–System–Scene** pattern:

```
src/
├── main.ts              # App init, scene management, game loop
├── entities/            # Game objects (PixiJS Containers)
│   ├── Player.ts        # Controllable character with movement & states
│   ├── Boulder.ts       # Physics-driven obstacles
│   ├── Mountain.ts      # Layered background scenery
│   └── HUD.ts           # Hearts, coins (bank), throws, level / quota
├── scenes/              # Screen-level containers
│   ├── TitleScene.ts    # Title screen, controls guide, and game-over state
│   ├── PlayScene.ts     # Core gameplay, spawning, collisions
│   └── WinScene.ts      # Victory screen
├── systems/             # Shared services
│   ├── Input.ts         # Keyboard state tracking
│   ├── LevelConfig.ts   # Loads & validates `assets/configs/levels.json`
│   ├── EconomyConfig.ts # Coin drop odds from `assets/configs/economy.json`
│   ├── CoinWallet.ts    # localStorage-backed coin balance
│   ├── Physics.ts       # Constants & AABB collision
│   └── SoundManager.ts  # Procedural chiptune sounds
├── assets/
│   └── configs/
│       ├── levels.json  # Boulder count per level (data-driven waves)
│       └── economy.json # Coin drop chance on boulder impact
└── utils/
    ├── PixelArt.ts      # Clouds, hearts, procedural player (stand / duck)
    └── Pillarbox.ts     # 16:9 scale-to-fit + TilingSprite edge gutters
```

### Key Files

**`src/main.ts`** — Entry point. Initialises PixiJS with `resizeTo: window`, a 16:9 letterboxed `gameWorld` (1920×1080 logical pixels), `TilingSprite` gutters (`src/utils/Pillarbox.ts`), and a fullscreen **hit flash** overlay. Runs a multi-level session from `levels.json` (Title → chained Play levels → Win; on defeat, Title with game-over copy).

**`src/entities/Player.ts`** — The player character. Movement, jump, duck, i-frames; hitbox shrinks when ducking. The look is drawn via `PixelArt.ts` helpers (hair, side arms, sine-shimmied legs, duck pose with arms over the eyes).

**`src/entities/Boulder.ts`** — Boulders that spawn on the mountain, bounce down the slope, and roll across the ground. Tracks state (moving, stopped, held, thrown) and applies gravity, friction, and rotation.

**`src/scenes/PlayScene.ts`** — The main gameplay scene. Spawns a finite quota of boulders per level from config, runs collisions, pickup/throw (Space), screen shake, break particles, and fires **level complete** when every rock is settled (or gone), or **game over** when hearts hit zero.

**`src/systems/Input.ts`** — Lightweight keyboard manager exposing `isDown(key)` and `wasPressed(key)` per frame.

**`src/systems/SoundManager.ts`** — Generates retro sound effects (jump, hit, bounce, pickup, throw, level complete, win, lose) using oscillators and noise via the Web Audio API.

**`src/systems/Physics.ts`** — Exports shared constants (`GRAVITY`, `GROUND_Y`, `GAME_WIDTH`, `GAME_HEIGHT`, `MOUNTAIN_X`) and an AABB `intersects` helper.

## Project Configuration

| File | Role |
|---|---|
| `package.json` | Dependencies & npm scripts |
| `tsconfig.json` | TypeScript — strict mode, ES2020 target, bundler resolution |
| `vite.config.ts` | Vite — relative base path (`./`) |
| `index.html` | Minimal HTML shell with `#game` container and pixelated CSS |
| `src/assets/configs/levels.json` | Per-level boulder quotas (extend the array to add waves) |
| `src/assets/configs/economy.json` | `coinDropChanceOnImpact` (0–1) for loot on boulder bounce |
