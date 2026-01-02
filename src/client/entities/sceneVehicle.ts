import entityManager from "@/helpers/entityManager";
import { ISceneVehicleOptions } from "./options/sceneVehicleOptions";
import { SceneEntity, SceneEntityType } from "./sceneEntity";

export class SceneVehicle extends SceneEntity<VehicleMp, ISceneVehicleOptions> {
  get type(): SceneEntityType {
    return SceneEntityType.Vehicle;
  }

  create(): void {
    this._entity = mp.vehicles.new(
      this.options.model,
      this.options.position,
      {
        heading: this.options.heading,
        alpha: this.options.alpha,
        dimension: this.options.dimension ?? mp.players.local.dimension,
        engine: this.options.engine,
        locked: this.options.locked,
        numberPlate: this.options.numberPlate,
        color: this.options.color
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