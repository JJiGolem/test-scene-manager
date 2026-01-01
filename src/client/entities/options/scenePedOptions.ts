import { ISceneEntityOptions } from "./sceneEntityOptions"

export interface IScenePedOptions extends ISceneEntityOptions {
  model: HashOrString | RageEnums.Ped.Hash
  position: Vector3
  heading: number
  dimension?: number
}