import { Application, TextureStyle } from 'pixi.js';
import { Input } from './systems/Input';
import { SoundManager } from './systems/SoundManager';
import { TitleScene } from './scenes/TitleScene';
import { PlayScene } from './scenes/PlayScene';
import { WinScene } from './scenes/WinScene';
import { GameOverScene } from './scenes/GameOverScene';
import { GAME_WIDTH, GAME_HEIGHT } from './systems/Physics';

type Scene = TitleScene | PlayScene | WinScene | GameOverScene;

async function main() {
  TextureStyle.defaultOptions.scaleMode = 'nearest';

  const app = new Application();
  await app.init({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: 0x87ceeb,
    antialias: false,
  });
  document.getElementById('game')!.appendChild(app.canvas);

  const input = new Input();
  const sound = new SoundManager();

  let currentScene: Scene | null = null;

  function setScene(scene: Scene) {
    if (currentScene) {
      app.stage.removeChild(currentScene);
    }
    currentScene = scene;
    app.stage.addChild(scene);
  }

  function startTitle() {
    const scene = new TitleScene();
    setScene(scene);
  }

  function startGame() {
    const scene = new PlayScene(input, sound);
    scene.onWin = () => {
      sound.win();
      const win = new WinScene();
      setScene(win);
    };
    scene.onGameOver = (score: number) => {
      sound.lose();
      const over = new GameOverScene(score);
      setScene(over);
    };
    setScene(scene);
  }

  startTitle();

  app.ticker.add((ticker) => {
    const dt = ticker.deltaTime;

    if (currentScene instanceof TitleScene) {
      currentScene.update(dt);
      if (input.wasPressed('Space')) {
        startGame();
      }
    } else if (currentScene instanceof PlayScene) {
      currentScene.update(dt);
    } else if (currentScene instanceof WinScene) {
      currentScene.update(dt);
      if (input.wasPressed('Space')) {
        startGame();
      }
    } else if (currentScene instanceof GameOverScene) {
      currentScene.update(dt);
      if (input.wasPressed('Space')) {
        startGame();
      }
    }

    input.endFrame();
  });
}

main();
