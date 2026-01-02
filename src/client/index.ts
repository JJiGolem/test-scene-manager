import sceneManager from './sceneManager';
import entityManager from './helpers/entityManager';
import dimension from './world/dimension';
import { Scene } from './scenes/scene';
import vehicleManager from './helpers/vehicleManager';

mp.events.add('playerReady', async () => {
  mp.console.logInfo(`${mp.players.local.name} is ready!`);

  const mainWorldScene = sceneManager.mainScene;

  const authScene = new Scene("auth")
  const testDriveScene = new Scene("test-drive");

  {
    const pedHandle = authScene.addPed({
      model: RageEnums.Ped.Hash.A_F_O_SOUCENT_01,
      position: new mp.Vector3(-2.57, 7.0, 71.5),
      heading: 90.0
    });
    const cameraHandle = authScene.addCamera({
      name: 'default',
      position: new mp.Vector3(-2.28, 4.50, 72),
      rotation: new mp.Vector3(0, 0, 0),
      fov: 80
    });

    authScene.onMount = function () {
      const ped = this.peds.get(pedHandle!);
      const camera = this.cameras.get(cameraHandle!);

      if (!ped || !camera) return this.destroy();

      const { x, y, z } = ped.entity?.position!
      camera.entity!.pointAtCoord(x, y, z);
      camera.entity!.setActive(true);
      mp.game.cam.renderScriptCams(true, true, 500, true, false, 0);

      // Автоматическое перемещение в нулевой дименшен через 3 секунды
      setTimeout(() => {
        dimension.requestServerZeroDimension();
      }, 5_000)
    }
  }

  {
    const vehicleHandle = testDriveScene.addVehicle({
      model: RageEnums.Vehicle.Hash.ZENTORNO,
      position: new mp.Vector3(-8.60, 8.13, 72)
    });
    const finishBlipHandle = testDriveScene.addBlip({
      sprite: 1,
      color: 6,
      position: new mp.Vector3(100, 100, 50)
    });

    testDriveScene.onMount = async function () {
      const vehicle = this.vehicles.get(vehicleHandle!);
      const blip = this.blips.get(finishBlipHandle!)

      if (!vehicle?.entity || !blip?.entity) return this.destroy();

      await vehicleManager.forcePlayerIntoVehicle(mp.players.local, vehicle.entity!, RageEnums.Vehicle.Seat.Driver);

      const render = () => {
        if (!entityManager.exists(blip.entity)) {
          // Need dismount ?
          return;
        }

        const playerPosition = mp.players.local.position;
        const blipPosition = mp.game.ui.getBlipCoords(blip.entity!.handle);
        const distance = mp.game.misc.getDistanceBetweenCoords(
          playerPosition.x,
          playerPosition.y,
          playerPosition.z,
          blipPosition.x,
          blipPosition.y,
          blipPosition.z,
          false
        );

        if (distance <= 3) {
          mp.events.remove("render", render);
          dimension.requestServerZeroDimension();
        }
      }

      mp.events.add("render", render)
    }
  }

  {

    mainWorldScene.onMount = function () {

      mp.game.cam.renderScriptCams(false, true, 500, false, false, 0);

      const onF2Down = async () => {
        mp.keys.unbind(0x71, true, onF2Down);
        await dimension.requestServerNonZeroDimension();
        sceneManager.mountScene(testDriveScene)
      }

      mp.keys.bind(0x71, true, onF2Down);
    }
  }

  await dimension.requestServerNonZeroDimension();
  sceneManager.mountScene(authScene);
});

mp.events.add('render', () => {
  const pos = mp.players.local.position;
  const scale = 0.25;
  mp.game.graphics.drawText(
    `X: ${pos.x.toFixed(2)} Y: ${pos.y.toFixed(2)} Z: ${pos.z.toFixed(2)} | Dim: ${mp.players.local.dimension}`,
    [0.06, 0.98],
    {
      color: [255, 255, 255, 255],
      scale: [1, scale]
    }
  );
})