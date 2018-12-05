import _ from 'lodash';
import Car from './npc/cars/car';
import Excavator from './npc/cars/excavator';
import DangerZone from './npc/zones/DangerZone';
import Pedestrian from './npc/pedestrians/pedestrian';
import eventEmitter from './npc/events/EventEmitter';
import CellTower from './npc/static/CellTower';
import SmallCell from './npc/static/SmallCell';

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

    const data = this.npcs.map(npc => npc.render(timestamp)).filter(i => !!i);

    return _.flatten(data);
  }

  spawnCars(amount, routeName) {
    const newCars = _.times(amount).map(i => new Car({ randomPosition: true, routeName }));
    this.npcs.unshift(...newCars);
  }

  spawnExcavators() {
    const excavator1 = new Excavator({ routeName: 'ExcavatorRoute1' });
    const excavator2 = new Excavator({ routeName: 'ExcavatorRoute2' });
    this.npcs.push(excavator1);
    this.npcs.push(excavator2);
  }

  spawnPedestrians(amount = 10) {
    _.times(amount, i => {
      this.npcs.push(new Pedestrian({ randomRoute: true }));
    })
  }

  spawnEvent(type, ...args) {
    eventEmitter.spawnEvent(type, ...args);
  }

  startSpawningRandomEvents(...args) {
    eventEmitter.startSpawningRandomEvents(...args);
  }

  spawnCellTowers() {
    this.npcs.unshift(...CellTower.spawn());
  }

  spawnSmallCells() {
    this.npcs.unshift(...SmallCell.spawn());
  }
}

export default new Game();
