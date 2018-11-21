import _ from 'lodash';
import Car from './npc/cars';
import DangerZone from './npc/zones/DangerZone';
import eventEmitter from './npc/events/EventEmitter';

class Game {
  constructor() {
    this.npcs = [
      eventEmitter,
      new DangerZone(),
    ];
  }

  render(time) {
    // console.log('[INFO] Game.render ', this.npcs.length);
    const timestamp = Date.now();

    const data = this.npcs.map(npc => npc.render(timestamp)).filter(i => i);

    return _.flatten(data);
  }

  spawnCars(amount) {
    const newCars = _.times(amount).map(i => new Car({ randomPosition: true }));
    this.npcs.unshift(...newCars);
  }

  spawnEvent(type, ...args) {
    eventEmitter.spawnEvent(type, ...args);
  }

  startSpawningRandomEvents(...args) {
    eventEmitter.startSpawningRandomEvents(...args);
  }
}

export default new Game();
