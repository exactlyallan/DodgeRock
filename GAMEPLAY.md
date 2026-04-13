# Gameplay Guide
How to play the game and how the game works.

## Controls

| Key | Action |
|---|---|
| Arrow Left / Right | Move |
| Arrow Up | Jump |
| Arrow Down | Duck |
| Space | Pick up stopped boulder / Throw held boulder |

## Hero

Your runner is drawn with code, not PNGs: there is a **hair fringe**, **sleeves and hands** at the sides, and when you **duck** the arms cover the face like you are bracing for impact. When you **walk**, the legs wiggle in a tiny sine-wave shuffle.

## Display

The playfield is a fixed **16:9** picture (800×450 logical pixels) scaled to fit your browser window. Extra space outside that frame is filled with **tiled copies** of the sky and ground colors at the edges—like wallpaper that matches the game’s border.

## Game 

- Boulders roll down the mountain from right to left. Dodge them or duck under them.
- A moving boulder that hits you costs one heart (you have 3).
- Boulders that slow to a stop are harmless but block your path — jump over them.
- Walk up to a stopped boulder and press **Space** to pick it up, then press **Space** again to throw it. The boulder breaks apart (that counts as a **throw** on the small line under your coin count).
- **Coins** are the long-term score: when a rock **slams** the mountain or the ground and bounces, there is a random chance a coin pops out (see `economy.json` for the exact odds). Coins are saved in your browser—like a piggy bank that survives even when you get squashed.
- The mountain sends a fixed number of rocks per **level** (see `src/assets/configs/levels.json`). You clear a level only when **every rock for that level is accounted for**: nothing still rolling, nothing mid-throw, nothing in your hands, and nothing off doing its own thing—only harmless stopped rocks on the ground (or rocks that already left the screen / exploded).
- After level 1’s batch is fully settled, you climb to the next level until you finish the list. Survive **all levels** to see the victory screen. Lose all **3 hearts** and it is game over.
- Later levels send more rocks and run a little faster—like the mountain is waking up grumpy.
