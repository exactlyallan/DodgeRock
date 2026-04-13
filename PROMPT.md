### Prompt 1
    I want to do a lilttle browser mini game called: dodge rock.

    The style is old bit graphic side scrolling. Use https://pixijs.com/  as the game engine. It should run in the browser. 

    The controls are arrow keys. Space the jump. Down the duck. Left to move left. Right to move right. Up to pick up. 

    The game is simple but colorful graphics. Simple sound effects, blips and boops. The player can only move on a simple surface left and right and they must dodge boulders that are falling and bouncing off a very tall mountain to the right of the screen. The boulders move from right to left. 

    Depending on the speed the boulder can roll off the screen to the left or come to a slow stop. It does not hurt the player if it is stopped but they have to jump over it. If a moving boulder hits them they lose a heart. They player has 3 hearts. 

    The player can pick up a boulder with the up button and throw it by pressing the up button again. This tosses the boulder a short distance and it breaks and disappears. The player gets a point for doing this. The player wins after 10 points.

### Rules
Added some cursor rules

### Prompt 2A (pre optimized)
    Okay here is my list - consider as whole first, then implement one at a time.

    Game settings:
    - Remove @src/scenes/GameOverScene.ts and just go back to @src/scenes/TitleScene.ts with "Game Over" added to it. 
    - Switch the controls: spacebar grabs a bolder, up arrow jumps. Be sure to update the title screen control instructions. 
    - Make the game screen size dynamic to fit the window size. But keep a standard 16:9 screen ratio , filling the the rest with a repeat of the respective edge color.  
    - Animate the clouds so they move across the screen very slowly.

    Gameplay:
    - There are 6 (for now) levels. Create a level config file. Each level has a set number of bolders. For level 1, start with 20 bolders. If a player survies all the bolders (and all have stopped) they progress to the next level. Each level the number of bolders increases. 
    - Replace score with coins. For each bolder the player picks up and throws, there is a chance it will contain a coin. The player coin count is saved even after a game over. 

    Player Sprite:
    - Add arms to the player
    - Add a hair to the player as a simple top row of color above the head
    - So a simple leg animation when the player moves or jumps
    - When a player ducks, they cover their eyes with their arms

### Prompt 2A (optimized)
    Instruction: Act as my DodgeRock Lead Dev. Consider this entire roadmap first, then we will implement them one by one.

    Project Rules to Apply: > - Reference @skill-docs-keeper.md to track these changes.

    Reference @skill-content-driver.md for the Level and Coin logic.

    Reference @skill-sprite-alchemy.md for the Player Sprite updates.

    The Roadmap:

    UX Polish: Remove GameOverScene.ts. Update TitleScene.ts to handle a "Game Over" state. Switch controls: Space = Grab/Throw, Up = Jump.

    Responsive Display: Implement a 16:9 fixed-ratio resize system. Fill the "dead space" with a repeated texture of the edge pixels (Pillarboxing).

    Level System: Create src/assets/configs/levels.json. Level 1 starts with 20 boulders. Progression triggers only when all boulders are cleared/stopped.

    Economy: Replace "Score" with "Coins." Use LocalStorage to persist coin counts across sessions. Boulders have a % chance to drop coins on impact.

    Procedural Sprite: Update Player.ts using PixelArt.ts. Add arms (covering eyes when ducking), a hair-row, and a simple "sine-wave" leg animation for movement.

    First Task: Let's start with Task 1 (UX Polish). Please refactor the Scene management and controls first.


### Prompt 2B
    Works 80% as expected. 

    Some fixes:
    - The Game Over screen should BE the TitleScene with just "Game Over" text added.
    - The coins should only be added IF the user throws the rock contianing the coin. Otherwise it is lost.
    - When a player is hit, the screen shows the old boundary jitter. Instead make the full screen flash.
    - The player should lift their arms up when picking up a bolder
    - Make the default size 1920×1080 to improve the resolution
