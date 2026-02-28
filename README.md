# Dodge Rock
A retro pixel-art side-scrolling browser game built with PixiJS. Dodge boulders tumbling down a mountain, pick them up, and throw them to score points.

## Prompt
    I want to do a lilttle browser mini game called: dodge rock.

    The style is old bit graphic side scrolling. Use https://pixijs.com/  as the game engine. It should run in the browser. 

    The controls are arrow keys. Space the jump. Down the duck. Left to move left. Right to move right. Up to pick up. 

    The game is simple but colorful graphics. Simple sound effects, blips and boops. The player can only move on a simple surface left and right and they must dodge boulders that are falling and bouncing off a very tall mountain to the right of the screen. The boulders move from right to left. 

    Depending on the speed the boulder can roll off the screen to the left or come to a slow stop. It does not hurt the player if it is stopped but they have to jump over it. If a moving boulder hits them they lose a heart. They player has 3 hearts. 

    The player can pick up a boulder with the up button and throw it by pressing the up button again. This tosses the boulder a short distance and it breaks and disappears. The player gets a point for doing this. The player wins after 10 points.



## Getting Started

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

## Controls

| Key | Action |
|---|---|
| Arrow Left / Right | Move |
| Space | Jump |
| Arrow Down | Duck |
| Arrow Up | Pick up stopped boulder / Throw held boulder |

## How to Play

- Boulders roll down the mountain from right to left. Dodge them or duck under them.
- A moving boulder that hits you costs one heart (you have 3).
- Boulders that slow to a stop are harmless but block your path — jump over them.
- Walk up to a stopped boulder and press **Up** to pick it up, then press **Up** again to throw it. The boulder breaks and you score a point.
- Reach **10 points** to win. Lose all **3 hearts** and it's game over.
- Difficulty increases as your score climbs.

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
│   └── HUD.ts           # Hearts and score display
├── scenes/              # Screen-level containers
│   ├── TitleScene.ts    # Title screen with controls guide
│   ├── PlayScene.ts     # Core gameplay, spawning, collisions
│   ├── WinScene.ts      # Victory screen
│   └── GameOverScene.ts # Defeat screen
├── systems/             # Shared services
│   ├── Input.ts         # Keyboard state tracking
│   ├── Physics.ts       # Constants & AABB collision
│   └── SoundManager.ts  # Procedural chiptune sounds
└── utils/
    └── PixelArt.ts      # Reusable drawing helpers
```

### Key Files

**`src/main.ts`** — Entry point. Initialises the PixiJS application (800 × 600, nearest-neighbour scaling), wires up the game loop via the ticker, and manages scene transitions (Title → Play → Win / Game Over).

**`src/entities/Player.ts`** — The player character. Handles horizontal movement, jumping, ducking, boulder pickup/throw, invincibility frames with a blink effect, and hitbox resizing when ducking.

**`src/entities/Boulder.ts`** — Boulders that spawn on the mountain, bounce down the slope, and roll across the ground. Tracks state (moving, stopped, held, thrown) and applies gravity, friction, and rotation.

**`src/scenes/PlayScene.ts`** — The main gameplay scene. Owns the update loop for spawning boulders at random intervals, running collision checks, managing screen shake on hit, particle effects on boulder break, and triggering win/lose conditions.

**`src/systems/Input.ts`** — Lightweight keyboard manager exposing `isDown(key)` and `wasPressed(key)` per frame.

**`src/systems/SoundManager.ts`** — Generates retro sound effects (jump, hit, bounce, pickup, throw, win, lose) using oscillators and noise via the Web Audio API.

**`src/systems/Physics.ts`** — Exports shared constants (`GRAVITY`, `GROUND_Y`, `GAME_WIDTH`, `GAME_HEIGHT`, `MOUNTAIN_X`) and an AABB `intersects` helper.

## Project Configuration

| File | Role |
|---|---|
| `package.json` | Dependencies & npm scripts |
| `tsconfig.json` | TypeScript — strict mode, ES2020 target, bundler resolution |
| `vite.config.ts` | Vite — relative base path (`./`) |
| `index.html` | Minimal HTML shell with `#game` container and pixelated CSS |
