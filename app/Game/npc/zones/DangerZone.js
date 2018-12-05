import _ from 'lodash';
import uuid from 'uuid/v4';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { polygon, point } from '@turf/helpers';

import points from './DangerZone1.json';
import game from '../../game';
import eventEmitter from '../events/EventEmitter';
import Car from '../cars/car';

const turfPoly = polygon([points.map(p => [p.lat, p.lng])]);

class DangerZone {
  static TYPE = 'Danger Zone';
  static TITLE = 'Danger Zone #1';
  static DESCRIPTION = 'Speed Limit 3 mph';

  constructor() {
    this.id = uuid();
  }

  render(time) {
    const cars = game.npcs.filter(npc => npc.type === Car.TYPE);
    // console.log('[Info] DangerZone.render', game.npcs[0].type, cars.length);
    cars.forEach(car => {
      if (booleanPointInPolygon(point([car.lat, car.lng]), turfPoly)) {
        // console.log(`[WARNING]: Engine ${car.id} is inside polygon`);
        eventEmitter.spawnEvent('unit violates zone restrictions', car);
      }
    });

    return {
      id: this.id,
      type: DangerZone.TYPE,
      title: DangerZone.TITLE,
      description: DangerZone.DESCRIPTION,
      points: points,
    };
  }
}

export default DangerZone;
