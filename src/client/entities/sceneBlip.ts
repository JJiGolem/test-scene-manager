import entityManager from "@/helpers/entityManager";
import { ISceneBlipOptions } from "./options/sceneBlipOptions";
import { SceneEntity, SceneEntityType } from "./sceneEntity";

export class SceneBlip extends SceneEntity<BlipMp, ISceneBlipOptions> {
  get type(): SceneEntityType {
    return SceneEntityType.Blip
  }

  create(): void {
    this._entity = mp.blips.new(
      this.options.sprite,
      this.options.position,
      {
        name: this.options.name,
        rotation: this.options.rotation,
        scale: this.options.scale,
        color: this.options.color,
        alpha: this.options.alpha,
        dimension: this.options.dimension ?? mp.players.local.dimension,
        drawDistance: this.options.drawDistance,
        shortRange: this.options.shortRange
      }
    )
  }

  destroy(): void {
    if (!entityManager.exists(this._entity)) {
      return;
    }

    this._entity?.destroy();
    this._entity = null;
  }

}