type ClientDimensionChangedHandler = (newDimension: number, oldDimension: number) => void;

const clientDimensionChanged = "clientDimensionChanged";

let lastDimension: number = 0;

function checkDimension(): void {
  const dimension = mp.players.local.dimension;

  if (lastDimension != dimension) {
    const oldDimension = lastDimension;
    lastDimension = dimension;
    mp.events.call(clientDimensionChanged, dimension, oldDimension);
  }
}

mp.events.add('playerReady', () => {
  lastDimension = mp.players.local.dimension;
  mp.events.add("render", checkDimension);
})

export default {
  addChangeHandler(handler: ClientDimensionChangedHandler): void {
    mp.events.add(clientDimensionChanged, handler);
  },

  removeChangeHandler(handler: ClientDimensionChangedHandler): void {
    mp.events.remove(clientDimensionChanged, handler);
  },

  requestServerZeroDimension(): Promise<void> {
    if (mp.players.local.dimension === 0) {
      return Promise.resolve();
    }

    return mp.events.callRemoteProc(ServerProc.Dimension.RequestReturnInZeroDimension); 
  },

  requestServerNonZeroDimension(): Promise<boolean> {
    return mp.events.callRemoteProc<boolean>(ServerProc.Dimension.RequestNonZeroDimension);
  }
}