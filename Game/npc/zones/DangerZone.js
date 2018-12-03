import _ from 'lodash';
import uuid from 'uuid/v4';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { polygon, point } from '@turf/helpers';

import points from './DangerZone1.json';
import game from '../../game';
import eventEmitter from '../events/EventEmitter';
import Car from '../cars/car';
import Cow from '../cows/cow';
import { eventTypes } from '../events/EventEmitter';
import ZoneRestriction from '../events/ZoneRestrictionViolation';


const turfPoly = polygon([points.map(p => [p.lat, p.lng])]);

class DangerZone {
  static TYPE = 'Danger Zone';
  static TITLE = 'Danger Zone #1';
  static DESCRIPTION = 'Speed Limit 3 mph';

  constructor() {
    this.id = uuid();
  }

  render(time) {
    const cows = game.npcs.filter(npc => npc.type === Cow.TYPE);
    // console.log('[Info] DangerZone.render', game.npcs[0].type, cars.length);
    cows.forEach(cow => {
      if (!booleanPointInPolygon(point([cow.state.lat, cow.state.lng]), turfPoly)) {
        // console.log(`[WARNING]: Engine ${car.id} is inside polygon`);
        console.log("КОРОВА ВЫШЛА ЗА ПРЕДЕЛЫ", cow.id);
        cow.setStatusLevel(1, 3);
        eventEmitter.spawnEvent(eventTypes[ZoneRestriction.EVENT_TYPE], cow);
      } else {
        cow.resolveStatusLevel(3, 1);
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
