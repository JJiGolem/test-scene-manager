import { ISceneBlipOptions } from "@/entities/options/sceneBlipOptions";
import { ISceneCameraOptions } from "@/entities/options/sceneCameraOptions";
import { ISceneEntityOptions } from "@/entities/options/sceneEntityOptions";
import { IScenePedOptions } from "@/entities/options/scenePedOptions";
import { ISceneVehicleOptions } from "@/entities/options/sceneVehicleOptions";
import { SceneBlip } from "@/entities/sceneBlip";
import { SceneCamera } from "@/entities/sceneCamera";
import { ISceneEntity, SceneEntityType } from "@/entities/sceneEntity";
import { ScenePed } from "@/entities/scenePed";
import { SceneVehicle } from "@/entities/sceneVehicle";
import { NumberUID } from "@shared/uid";
import { IUidGenerator, NumberUIDGenerator } from "@shared/uidGenerator";
import { SceneEntityPool } from "./sceneEntityPool";

type SceneEntityFactory = (uid: NumberUID, options: ISceneEntityOptions) => ISceneEntity

const idGenerator: IUidGenerator<NumberUID> = new NumberUIDGenerator();
const entityFactories: Record<SceneEntityType, SceneEntityFactory> = {
  [SceneEntityType.Ped]: (uid, options) => new ScenePed(uid, options as IScenePedOptions),
  [SceneEntityType.Vehicle]: (uid, options) => new SceneVehicle(uid, options as ISceneVehicleOptions),
  [SceneEntityType.Camera]: (uid, options) => new SceneCamera(uid, options as ISceneCameraOptions),
  [SceneEntityType.Blip]: (uid, options) => new SceneBlip(uid, options as ISceneBlipOptions),
}

export class Scene {
  public readonly name: string;
  private readonly entityPool: SceneEntityPool;
  private mountHandler?: () => void;

  constructor(name: string) {
    this.name = name;
    this.entityPool = new SceneEntityPool();
  }

  public set onMount(handler: () => void) {
    this.mountHandler = handler;
  }

  public get peds(): Map<NumberUID, ScenePed> {
    return this.entityPool.getOrAddMap(SceneEntityType.Ped) as Map<NumberUID, ScenePed>;
  }

  public get vehicles(): Map<NumberUID, SceneVehicle> {
    return this.entityPool.getOrAddMap(SceneEntityType.Vehicle) as Map<NumberUID, SceneVehicle>;
  }

  public get cameras(): Map<NumberUID, SceneCamera> {
    return this.entityPool.getOrAddMap(SceneEntityType.Camera) as Map<NumberUID, SceneCamera>;
  }

  public get blips(): Map<NumberUID, SceneBlip> {
    return this.entityPool.getOrAddMap(SceneEntityType.Blip) as Map<NumberUID, SceneBlip>;
  }

  public async mount(): Promise<void> {
    mp.console.logInfo(`mount scene: ${this.name}`);
    for (const entity of this.entityPool.getAllEntity()) {
      entity.create();
    }

    // await all entity created ?

    if (this.mountHandler !== undefined) {
      this.mountHandler.call(this);
    }
  }

  public destroy() {
    for (const entity of this.entityPool.getAllEntity()) {
      entity.destroy();
    }
  }

  public addPed(options: IScenePedOptions) {
    return this.addEntity(SceneEntityType.Ped, options);
  }

  public addVehicle(options: ISceneVehicleOptions) {
    return this.addEntity(SceneEntityType.Vehicle, options);
  }

  public addCamera(options: ISceneCameraOptions) {
    return this.addEntity(SceneEntityType.Camera, options);
  }

  public addBlip(options: ISceneBlipOptions) {
    return this.addEntity(SceneEntityType.Blip, options);
  }

  private addEntity(type: SceneEntityType, options: ISceneEntityOptions): undefined | NumberUID {
    try {
      const id = idGenerator.generate();
      const entity = entityFactories[type](id, options);
      this.entityPool.add(entity);
      return id;
    } catch (e) {
      mp.console.logError(`addEntity: ${e}`);
      return undefined;
    }
  }
}