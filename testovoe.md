# Система сцен (на подобии игровых движков)

Сцена представляет собой пулл машин, педов, блипов и т.п. сущностей в движке, при старте сцены загружаются все необходимые ресурсы для работы, при уничтожении они удаляются.
В один момент может быть подгруженная одна сцена, в нулевом дименшене всегда используется `main-scene`, в остальных сценах клиент сам определяет сцену.
Необходимо реализовать логику согласно абстрактным классам (при необходимости можно добавить новые публичные методы)

## Сигнатура `SceneManager`
```ts
abstract class SceneManager {
	// Пока нету подгруженной сцены выводи черный экран, после вызова scene.destoy() так же удалять currentScene
	abstract get currentScene(): Scene | null
	abstract get mainScene(): Scene; // SceneManager сам создает основную сцену с именем "main-scene";
    abstract mountScene(scene: Scene): void;
    abstract dismountCurrentScene(): void;
}
```

## Сигнатура `Scene`

```ts
abstract class Scene {
	readonly name: string;
	
	constructor(name: string) {
		this.name = name;
    }

	// Уже созданые сущности
	abstract get peds(): Map<number, Ped>

	abstract get vehicles(): Map<number, Ped>

	abstract get blips(): Map<number, Ped>

	abstract get cameras(): Map<number, Ped>

	abstract addPed(...args /* Рейджовские аргументы сущности */): number; // Рандомный UID, сам объект создастся при старте сцены
	abstract addVehicle(...args /* Рейджовские аргументы сущности */): number;
	abstract addBlip(...args /* Рейджовские аргументы сущности */): number;
	abstract addCamera(...args /* Рейджовские аргументы сущности */): number;

	// Реализуй на сервер смену дименшена на ненулевой, всегда возвщарай `true` после смены
	abstract async requestServerNonZeroDimension(): Promise<boolean>;

	// По аналогии с методом выше, только возращение в нулевой дименшен
	abstract async requestServerZeroDimension(): Promise<void>;

	// Уничтожение всех сущностей сцены
	abstract destoy(): void;

	// Хук готовности сцены
	abstract onMount(): unknown;
}
```

## Код для проверки:

```ts
const sceneMenager = new SceneManager();

const mainWorldScene = sceneMenager.mainScene

const authScene = new Scene("auth")
const testDriveScene = new Scene("test-drive");

{
	// pedHandle !== ped.handle, это инкрементный UID
	const pedHandle = authScene.addPed("player_zero", new mp.Vector3(0, 0, 71), 0);
	const cameraHandle = authScene.addCamera('default', new mp.Vector3(1, 1, 71), new mp.Vector3(0,0,0), 80);

	authScene.onMount = function() {
		const ped = this.peds.get(pedHandle);
		const camera = this.cameras.get(cameraHandle);
		
		if(!ped || !camera) return this.destroy();
		
        camera.pointAtCoord(ped.position);
        camera.setActive(true);
		
		// Автоматическое перемещение в нулевой дименшен через 3 секунды
		setTimeout(() => {
			sceneMenager.dismountCurrentScene();
			void sceneMenager.requestServerZeroDimension();
        }, 3000)
	}
}

{
	const vehicleHandle = testDriveScene.addVehicle("zentorno", new mp.Vector3(0, 0, 71));
	const finishBlipHandle = testDriveScene.addBlip(1, new mp.Vector3(100, 100, 50));
	
	testDriveScene.onMount = function() {
		const vehicle = this.vehicles.get(vehicleHandle);
		const blip = this.blips.get(finishBlipHandle)
        
        if(!vehicle || !blip) return this.destroy();
		
        mp.players.local.setIntoVehicle(vehicle, -1);

        const render = () => {
            const distance = mp.players.local.dist(blip);
			if(distance <= 1) {
				mp.events.remove("render", render);
				sceneMenager.dismountCurrentScene();
				void sceneMenager.requestServerZeroDimension();
			}
        }

        mp.events.add("render", render)
	}
}

{

	mainScene.onMount = function() {
		
		const onF2Down = async () => {
			mp.keys.unbind(0x71, true, onF2Down);
			await requestServerNonZeroDimension();
			sceneManager.mountScene(testDriveScene)
		}
		
		mp.keys.bind(0x71, true, onF2Down);
	}
}

await sceneManager.requestServerNonZeroDimension();
sceneManager.mountScene(authScene);
```