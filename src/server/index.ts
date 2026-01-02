import './setup';
import './world/dimension'

mp.events.add('playerReady', (player) => {
	console.log(`${player.name} is ready!`);
});
