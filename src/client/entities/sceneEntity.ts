import { ISceneEntityOptions } from "./options/sceneEntityOptions"
import { NumberUID } from "../../shared/uid"

export const enum SceneEntityType {
  Ped = 'ped',
  Vehicle = 'vehicle',
  Camera = 'camera',
  Blip = 'blip'
}

export interface ISceneEntity<T> {
  uid: NumberUID
  get type(): SceneEntityType
  get entity(): null | T
  create(): void
  destroy(): void
}

export abstract class SceneEntity<TEntity, TOptions extends ISceneEntityOptions> implements ISceneEntity<TEntity> {
  public readonly uid: NumberUID
  protected readonly options: TOptions
  protected _entity: null | TEntity = null;

  constructor(uid: NumberUID, options: TOptions) {
    this.uid = Object.freeze(uid);
    this.options = Object.freeze(options);
  }

  public get entity() {
    return this._entity;
  }

  abstract get type(): SceneEntityType;
  abstract create(): void
  abstract destroy(): void
}