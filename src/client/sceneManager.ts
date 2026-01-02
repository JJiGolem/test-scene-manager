import dimension from '@/world/dimension';
import { Scene } from "./scenes/scene";

const fadeOutDuration = 1000;
const fadeInDuration = 1000;

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

  public async mountScene(scene: Scene): Promise<void> {
    if (this.activeScene == scene) {
      return;
    }

    await this.fadeOut();

    this.activeScene = scene;
    this.setupSceneDestroyHandler(scene);
    await this.activeScene.mount();

    this.fadeIn();
  }

  public dismountCurrentScene() {
    this.activeScene?.destroy();
  }

  private setupSceneDestroyHandler(scene: Scene) {
    scene.addDestroyHandler(() => {
      if (this.activeScene === scene) {
        this.setActiveSceneNull();
      }
    });
  }

  private setActiveSceneNull() {
    this.activeScene = null;
    this.fadeIn();
  }

  /*
    TODO: ощущение, что нужно больше логики при работе с затемнением экрана :/
    Будто затемнение экрана дело каждой сцены, и логика более подходит туда.
  */
  private fadeIn(duration = fadeInDuration) {
    mp.game.cam.doScreenFadeIn(duration);
  }

  private fadeOut(
    duration: number = fadeOutDuration,
    waitTime: number = fadeOutDuration * 3
  ): Promise<boolean> {
    mp.game.cam.doScreenFadeOut(duration);
    return mp.game.waitForAsync(
      () => mp.game.cam.isScreenFadedOut(),
      waitTime
    );
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