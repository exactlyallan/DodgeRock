# Skill: State & Powerup Management
- **Status Stacks:** Powerups should be objects pushed onto an active array (e.g., `{ type: 'SPEED_BOOST', duration: 5000 }`).
- **Reversibility:** Every powerup must have a `start()` and an `end()` to clean up its mess (e.g., resetting gravity).
- **Chaos Modes:** Support global state modifiers that can toggle "Special Modes" in `PlayScene.ts`.