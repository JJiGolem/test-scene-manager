import dimension from '@/world/dimension';
import { Scene } from "./scenes/scene";

const mainScene = new Scene("main");

class SceneManager {
  private activeScene: Scene | null;

  constructor() {
    this.activeScene = mainScene;
  }

  public get currentScene() {
    return this.activeScene;
  }

  public get mainScene() {
    return mainScene;
  }

  public mountScene(scene: Scene) {
    if (this.activeScene == scene) {
      return;
    }

    this.activeScene = scene;
    this.activeScene.mount();
  }

  public dismountCurrentScene() {
    this.activeScene?.destroy();
    this.activeScene = null;
  }
}

const sceneManager = new SceneManager();

// Установка главной сцены, при переходе в нулевой дименшион
dimension.addChangeHandler((newDimension: number) => {
  if (newDimension !== 0) {
    return;
  }

  if (sceneManager.currentScene === sceneManager.mainScene) {
    return;
  }

  sceneManager.dismountCurrentScene();
  sceneManager.mountScene(sceneManager.mainScene);
})

export default sceneManager;