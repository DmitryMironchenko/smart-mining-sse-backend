import _ from 'lodash';
import Cow from './npc/cows/cow';
import WaterPoint from './npc/cow-water-point/cow-water-point';
import eventEmitter from './npc/events/EventEmitter';
import zone from './npc/zones/DangerZone';

class Game {
  constructor() {
    this.npcs = [eventEmitter, new zone()];
  }

  render() {
    const timestamp = Date.now();
    const data = this.npcs.map(
      npc => npc.render(timestamp));

    return _.flatten(data).filter(i => (i !== null));
  }

  spawnCows(amount) {
    const newCows = _.times(amount).map(() => new Cow());
    this.npcs.unshift(...newCows);
  }

  spawnWaterPoint(amount) {
    const newWaterPoints = _.times(amount).map(i => new WaterPoint());
    this.npcs.unshift(...newWaterPoints);
  }

  spawnEvent(type, ...args) {
    eventEmitter.spawnEvent(type, ...args);
  }

  startSpawningRandomEvents(...args) {
    eventEmitter.startSpawningEvents(...args);
  }
}

export default new Game();
