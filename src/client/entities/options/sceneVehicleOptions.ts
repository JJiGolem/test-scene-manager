import { ISceneEntityOptions } from "./sceneEntityOptions"

export interface ISceneVehicleOptions extends ISceneEntityOptions {
  model: HashOrString
  position: Vector3
  heading?: number
  alpha?: number
  dimension?: number
  engine?: boolean
  locked?: boolean
  numberPlate?: string
  color?: [Array2d, Array2d] | [RGB, RGB]
}