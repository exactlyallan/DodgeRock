import { Application, Container, TextureStyle } from 'pixi.js';
import { Input } from './systems/Input';
import { SoundManager } from './systems/SoundManager';
import { getLevels } from './systems/LevelConfig';
import { CoinWallet } from './systems/CoinWallet';
import { TitleScene } from './scenes/TitleScene';
import { PlayScene } from './scenes/PlayScene';
import { WinScene } from './scenes/WinScene';
import { createPillarboxLayer } from './utils/Pillarbox';

type Scene = TitleScene | PlayScene | WinScene;

async function main() {
  TextureStyle.defaultOptions.scaleMode = 'nearest';

  const app = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: 0x111111,
    antialias: false,
  });
  document.getElementById('game')!.appendChild(app.canvas);

  const gameWorld = new Container();
  const pillarbox = createPillarboxLayer(gameWorld);
  app.stage.addChild(pillarbox.root);

  const layout = () => {
    pillarbox.layout(app.renderer.width, app.renderer.height);
  };
  layout();
  window.addEventListener('resize', layout);

  const input = new Input();
  const sound = new SoundManager();
  const levels = getLevels();
  const wallet = new CoinWallet();

  let currentScene: Scene | null = null;
  let runLevelIndex = 0;

  function setScene(scene: Scene) {
    if (currentScene) {
      gameWorld.removeChild(currentScene);
    }
    currentScene = scene;
    gameWorld.addChild(scene);
  }

  function startTitle(gameOver?: { throws: number; coins: number }) {
    const scene = gameOver !== undefined ? new TitleScene({ gameOver }) : new TitleScene();
    setScene(scene);
  }

  function startGame(continueRun: boolean) {
    if (!continueRun) {
      runLevelIndex = 0;
    }

    const level = levels[runLevelIndex];
    if (!level) {
      return;
    }

    const scene = new PlayScene(input, sound, {
      level,
      levelIndex: runLevelIndex,
      levelCount: levels.length,
      wallet,
    });

    scene.onLevelComplete = () => {
      runLevelIndex++;
      if (runLevelIndex >= levels.length) {
        sound.win();
        setScene(new WinScene());
      } else {
        sound.levelComplete();
        startGame(true);
      }
    };

    scene.onGameOver = (throwsCount: number, coinBalance: number) => {
      sound.lose();
      startTitle({ throws: throwsCount, coins: coinBalance });
    };

    setScene(scene);
  }

  startTitle();

  app.ticker.add((ticker) => {
    const dt = ticker.deltaTime;

    if (currentScene instanceof TitleScene) {
      currentScene.update(dt);
      if (input.wasPressed('Space')) {
        startGame(false);
      }
    } else if (currentScene instanceof PlayScene) {
      currentScene.update(dt);
    } else if (currentScene instanceof WinScene) {
      currentScene.update(dt);
      if (input.wasPressed('Space')) {
        startGame(false);
      }
    }

    input.endFrame();
  });
}

main();
