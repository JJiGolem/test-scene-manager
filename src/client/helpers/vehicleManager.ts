import entityManager from "./entityManager";

const vehicleManager = {
  isDriver(vehicle: VehicleMp, player: PlayerMp): boolean {
    return this.getDriver(vehicle) == player?.handle;
  },

  isSeatIn(player: PlayerMp, vehicle: VehicleMp, seat: RageEnums.Vehicle.Seat): boolean {
    return this.getPedInSeat(vehicle, seat) === player?.handle;
  },

  forcePlayerIntoVehicle(player: PlayerMp, vehicle: VehicleMp, seat: RageEnums.Vehicle.Seat): Promise<boolean> {
    if (!entityManager.exists(vehicle)) {
      return Promise.resolve(false);
    }

    const distance = mp.game.misc.getDistanceBetweenCoords(
      player.position.x,
      player.position.y,
      player.position.z,
      vehicle.position.x,
      vehicle.position.y,
      vehicle.position.z,
      true
    );

    if (distance > 30) {
      player.setCoordsNoOffset(
        vehicle.position.x,
        vehicle.position.y,
        vehicle.position.z + 1.5,
        false,
        false,
        false
      );
    }

    return mp.game.waitForAsync(() => {
      if (!entityManager.exists(vehicle)) {
        return false;
      }
      
      player.setIntoVehicle(vehicle.handle, seat);
      return this.isSeatIn(player, vehicle, seat)
    }, 2000)
  },

  getDriver(vehicle: VehicleMp): Handle | undefined {
    return this.getPedInSeat(vehicle, RageEnums.Vehicle.Seat.Driver);
  },

  getPedInSeat(vehicle: VehicleMp, seat: RageEnums.Vehicle.Seat): Handle | undefined {
    if (!vehicle || !mp.vehicles.exists(vehicle)) {
      return undefined;
    }

    return vehicle.getPedInSeat(seat);
  }
}

export default vehicleManager;
