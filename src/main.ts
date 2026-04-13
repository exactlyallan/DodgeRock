import { Application, Container, TextureStyle } from 'pixi.js';
import { Input } from './systems/Input';
import { SoundManager } from './systems/SoundManager';
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

  let currentScene: Scene | null = null;

  function setScene(scene: Scene) {
    if (currentScene) {
      gameWorld.removeChild(currentScene);
    }
    currentScene = scene;
    gameWorld.addChild(scene);
  }

  function startTitle(gameOverScore?: number) {
    const scene =
      gameOverScore !== undefined ? new TitleScene({ gameOverScore }) : new TitleScene();
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
      startTitle(score);
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
    }

    input.endFrame();
  });
}

main();
