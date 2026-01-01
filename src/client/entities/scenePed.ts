import entityManager from "@/helpers/entityManager";
import { IScenePedOptions } from "./options/scenePedOptions";
import { SceneEntity, SceneEntityType } from "./sceneEntity";

export class ScenePed extends SceneEntity<PedMp, IScenePedOptions> {
  get type(): SceneEntityType {
    return SceneEntityType.Ped;
  }

  create(): void {
    const pedModel = typeof this.options.model === 'string'
      ? mp.game.joaat(this.options.model)
      : this.options.model >> 0;

    this._entity = mp.peds.new(pedModel,
      this.options.position,
      this.options.heading,
      this.options.dimension
    );
  }

  destroy(): void {
    if (!entityManager.exists(this._entity)) {
      return;
    }

    this._entity?.destroy();
    this._entity = null;
  }
}