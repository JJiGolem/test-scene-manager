class PrivateDimensionService {
  private readonly MIN_DIMENSION: number = 100;
  private readonly dimensionsInUse: Map<number, PlayerMp | null> = new Map();

  constructor() {
    const maxDimension = mp.config.maxplayers + this.MIN_DIMENSION;

    for (let i = this.MIN_DIMENSION; i <= maxDimension; i++) {
      this.dimensionsInUse.set(i, null);
    }
  }

  public request(player: PlayerMp): number {
    for (const [dimension, p] of this.dimensionsInUse.entries()) {
      if (p === player) {
        return dimension;
      }
    }

    for (const [dimension, p] of this.dimensionsInUse.entries()) {
      if (p === null) {
        this.dimensionsInUse.set(dimension, player);
        return dimension;
      }
    }

    throw new Error("No available private dimension");
  }

  public dismiss(requester: PlayerMp): void {
    try {
      for (const [dimension, player] of this.dimensionsInUse.entries()) {
        if (player === requester) {
          this.dimensionsInUse.set(dimension, null);
          break;
        }
      }
    } catch (e) {
      console.error("DismissPrivateDimension", e as Error);
    }
  }

  public onPlayerDisconnected(player: PlayerMp): void {
    try {
      this.dismiss(player);
    } catch (e) {
      console.error("OnPlayerDisconnected", e as Error);
    }
  }
}

const privateDimension = new PrivateDimensionService();

mp.events.add('playerQuit', (player: PlayerMp) => privateDimension.onPlayerDisconnected(player))

mp.events.addProc(ServerProc.Dimension.RequestReturnInZeroDimension, (player: PlayerMp) => {
  console.log('request return zero dimension');
  if (player.dimension === 0) {
    return;
  }

  privateDimension.dismiss(player);
  player.dimension = 0;
})

mp.events.addProc(ServerProc.Dimension.RequestNonZeroDimension, (player: PlayerMp) => {
  console.log('request return non zero dimension');
  try {
    const personalDimension = privateDimension.request(player);
    player.dimension = personalDimension;
    return true;
  } catch (e) {
    console.error(ServerProc.Dimension.RequestNonZeroDimension, e as Error)
    return false;
  }
})

export default privateDimension;