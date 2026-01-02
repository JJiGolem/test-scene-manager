import { ISceneEntity, SceneEntityType } from "@/entities/sceneEntity";
import { NumberUID } from "@shared/uid";

export class SceneEntityPool {
  private readonly pool: { [key in SceneEntityType]?: Map<NumberUID, ISceneEntity> } = {}

  public add(entity: ISceneEntity): void {
    const map = this.getOrAddMap(entity.type);

    if (map.has(entity.uid)) {
      throw new Error(`Entity with UID ${entity.uid} already exists.`);
    }

    map.set(entity.uid, entity);
  }

  public getAt(id: NumberUID, type: SceneEntityType) {
    const map = this.getMap(type);
    return map?.get(id);
  }

  public getAllByType(type: SceneEntityType): ISceneEntity[] {
    return Array.from(this.getMap(type)?.values() ?? []);
  }

  public getAllEntity(): ISceneEntity[] {
    return Object
      .values(this.pool)
      .filter(map => map !== undefined)
      .flatMap(map => Array.from(map.values()));
  }

  public getOrAddMap(type: SceneEntityType): Map<NumberUID, ISceneEntity> {
    const existingMap = this.getMap(type);

    if (existingMap) {
      return existingMap;
    }

    const newMap = new Map<NumberUID, ISceneEntity>();
    this.pool[type] = newMap;

    return newMap;
  }

  private getMap(type: SceneEntityType): undefined | Map<NumberUID, ISceneEntity> {
    return this.pool[type];
  }
}