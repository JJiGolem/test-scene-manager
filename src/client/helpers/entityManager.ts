import '@shared/extensions/objectExtensions'

type RageEntity = EntityMp | BrowserMp | BlipMp | DummyEntityMp | CameraMp
type RageClientEntity = EntityMp | BlipMp | DummyEntityMp

const enum RageEntityTypeNames {
  Player = 'player',
  Ped = 'ped',
  Vehicle = 'vehicle',
  Object = 'object',
  Pickup = 'pickup',
  Blip = 'blip',
  Checkpoint = 'checkpoint',
  Marker = 'marker',
  Colshape = 'colshape',
  TextLabel = 'textlabel',
  Dummy = 'dummy',
  Camera = 'camera',
  Browser = 'browser'
}

const entityPools: Record<RageEntityTypeNames, EntityMpPool<RageEntity>> = {
  "player": mp.players,
  "ped": mp.peds,
  "vehicle": mp.vehicles,
  "object": mp.objects,
  "pickup": mp.pickups,
  "blip": mp.blips,
  "checkpoint": mp.checkpoints,
  "marker": mp.markers,
  "colshape": mp.colshapes,
  "textlabel": mp.labels,
  "dummy": mp.dummies,
  "camera": mp.cameras,
  "browser": mp.browsers
} as const;

const MAX_UNSIGNED_SHORT = 65535;

const entityManager = {
  isClientEntity: function (entity: null | undefined | RageClientEntity) {
    return entity?.remoteId === MAX_UNSIGNED_SHORT;
  },

  exists: function (entity: null | undefined | RageEntity) {
    if (!entity || typeof entity === 'undefined') {
      return false;
    }

    const pool = this.pool(entity);
    return Boolean(pool && pool.exists && pool.exists(entity));
  },

  streamed: function (entity: null | undefined | EntityMp) {
    if (!this.exists(entity)) {
      return false;
    }

    return Boolean(this.pool(entity)?.streamed.includes(entity!));
  },

  pool: function (entity: null | undefined | RageEntity) {
    if (!entity || typeof entity !== 'object') {
      return undefined;
    }

    if (Object.hasProperty(entity, 'url')) {
      return entityPools[RageEntityTypeNames.Browser];
    }

    if (Object.hasProperty(entity, 'getFov')) {
      return entityPools[RageEntityTypeNames.Camera];
    }

    if (!Object.hasProperty(entity, 'type')) {
      return undefined;
    }

    return entityPools[(entity as EntityMp).type];
  }
}

export default entityManager;