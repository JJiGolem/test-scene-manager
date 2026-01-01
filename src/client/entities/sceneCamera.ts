import entityManager from "@/helpers/entityManager";
import { ISceneCameraOptions } from "./options/sceneCameraOptions";
import { SceneEntity, SceneEntityType } from "./sceneEntity";

export class SceneCamera extends SceneEntity<CameraMp, ISceneCameraOptions> {
  get type(): SceneEntityType {
    return SceneEntityType.Camera;
  }

  create(): void {
    this._entity = mp.cameras.new(
      this.options.name,
      this.options.position,
      this.options.rotation,
      this.options.fov
    );
  }

  destroy(): void {
    if (!entityManager.exists(this._entity)) {
      return;
    }

    if (this._entity!.isActive()) {
      this._entity!.setActive(false);
    }

    this._entity!.destroy();
    this._entity = null;
  }

}