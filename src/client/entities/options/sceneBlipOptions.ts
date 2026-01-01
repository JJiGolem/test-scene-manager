import { ISceneEntityOptions } from "./sceneEntityOptions"

export interface ISceneBlipOptions extends ISceneEntityOptions {
  sprite: number
  position: Vector3
  name?: string
  rotation?: number
  scale?: number
  color?: number
  alpha?: number
  dimension?: number
  drawDistance?: number
  shortRange?: boolean
}