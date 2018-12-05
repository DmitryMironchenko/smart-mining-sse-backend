import _ from 'lodash';
import CowLostConnection from './CowLostConnection';
import WaterPointEmpty from './WaterPointEmpty';
import CowEmergency from './CowEmergency';
import ZoneRestriction from './ZoneRestrictionViolation';
import CowRunner from './CowRunner';

export const eventTypes = {
  [CowRunner.EVENT_TYPE]: {
    event: (...args) => (new CowRunner(...args)),
    minPeriod: 55e3,
    maxPeriod: 70e3,
  },
  [ZoneRestriction.EVENT_TYPE]: {
    event: (...args) => (new ZoneRestriction(...args)),
    minPeriod: 1000e3,
    maxPeriod: 1000e3,
  },
  [CowLostConnection.EVENT_TYPE]: {
    event: (...args) => (new CowLostConnection(...args)),
    minPeriod: 13e3,
    maxPeriod: 30e3,
  },
  [CowEmergency.EVENT_TYPE]: {
    event: (...args) => (new CowEmergency(...args)),
    minPeriod: 31e3,
    maxPeriod: 40e3,
  },
  [WaterPointEmpty.EVENT_TYPE]: {
    event: (...args) => (new WaterPointEmpty(...args)),
    minPeriod: 48e3,
    maxPeriod: 47e3,
  },
};

class EventEmitter {
  events = [];
  eventsHandlers = [];

  spawnEvent(type, ...args) {
    const event = type.event(this.unregisterEvent.bind(this), ...args);
    if (!event.error){
      this.events.push(event);
    } else {
      console.error(`[ERROR] failed to spawn event ${event.constructor.EVENT_TYPE}`, event.error);
    }
  }

  startSpawningEvents() {
    for (let type in eventTypes) {
      if (eventTypes.hasOwnProperty(type)) {
        this.eventsHandlers.push =
          this._spawnEventInfinitely(eventTypes[type]);
      }
    }
  }

  stopSpawningRandomEvents() {
    this.eventsHandlers.map(event => {
      clearTimeout(event);
    });
    this.eventsHandlers = [];
  }

  _spawnEventInfinitely(type, period=type.minPeriod) {
    return setTimeout(() => {
      this.spawnEvent(type);
      this._spawnEventInfinitely(type, type.maxPeriod);
    }, period);
  }

  unregisterEvent(event) {
    // TODO: archive event
    _.remove(this.events, e => e.id === event.id);
  }

  render(time) {
    return this.events.map(event => {
      if(_.isFunction(event.render)){
        return event.render(time)
      }
    });
  }
}

export default new EventEmitter();
