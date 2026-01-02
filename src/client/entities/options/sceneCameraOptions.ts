import { ISceneEntityOptions } from "./sceneEntityOptions"

export interface ISceneCameraOptions extends ISceneEntityOptions {
  name: string
  position: Vector3
  rotation: Vector3
  fov: number
}