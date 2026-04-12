# Skill: The Documentation & Legacy Keeper

## Objective
Maintain a high-fidelity "Map" of the project. This skill ensures that when you return to the code after weeks away, the documentation accurately reflects the current state of the game, its configurations, and its "Kid-friendly" logic.

## Core Responsibilities

### Key files:
- `GAMEPLAY.md` - Game behavior and tutorial
- `README.md` - Technical details and how to configure

### 1. The "Kid-Log" Synchronization
Whenever a new feature is added (e.g., a "Ghost" player type or a "Triple Jump" mechanic), immediately propose an update to `GAMEPLAY.md`
- **Constraint:** Use physical metaphors. If we added a "Friction" setting, explain it as "walking through invisible maple syrup."
- **Focus:** Highlight what a non-developer can change to see a "cool effect."

### 2. Config & Schema Mapping
DodgeRock is data-driven. When the code changes how it reads a config, the documentation must follow.
- **Player Specs:** If the Markdown frontmatter for player types changes (e.g., adding `jumpPower`), update the `README.md` "How to Build a Character" section.
- **Physics Constants:** Keep a running list of what the keys in `physics.yaml` actually do to the game world.

### 3. Automated "Human" Changelog
Translate technical commits into two distinct styles within a `CHANGELOG.md`:
- **The Technical:** "Refactored AABB collision to use SAT for rotation support."
- **The Fun:** "Rocks can now spin, and hitting their corners actually counts!"

### 4. Visual & Folder Architecture
Maintain the ASCII folder map in the main README. If a new system is added to `src/systems/`, update the map and explain the new system’s "Job Description."

## Technical Execution Rules
- **Passive Verification:** After generating code, check if any existing documentation (README, guides, or comments) has been rendered obsolete.
- **Signpost Maintenance:** Ensure "KID ZONE" comments in the code are accurate. If we moved the gravity variable, move the signpost with it.
- **Reference Logic:** Always check `@docs/KID_GUIDE.md` before explaining a concept to ensure the metaphors remain consistent across the project.

## Command Triggers
- `/summarize`: Analyze the recent changes and write a brief "Dev Log" entry for the session.
- `/update-guide`: Scan `src/entities/` and `/assets/players/` to ensure every object and character is documented in the guide.
- `/metaphor-check`: Review a block of code and suggest a kid-friendly metaphor for the README.