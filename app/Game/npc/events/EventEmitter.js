import _ from 'lodash';
import CarBreakDownEvent from './CarBreakDown';
import DriverBloodPressureLowered from './DriverBloodPressureLowered';
import DriverGotTired from './DriverGotTired';
import ZoneRestrictionViolation from './ZoneRestrictionViolation';

const eventTypes = {
  [CarBreakDownEvent.EVENT_TYPE]: (...args) => (new CarBreakDownEvent(...args)),
  [DriverBloodPressureLowered.EVENT_TYPE]: (...args) => (new DriverBloodPressureLowered(...args)),
  [DriverGotTired.EVENT_TYPE]: (...args) => (new DriverGotTired(...args)),
  [ZoneRestrictionViolation.EVENT_TYPE]: (...args) => (new ZoneRestrictionViolation(...args)),
};

let randomEventsInterval = null;

class EventEmitter {
  events = [];

  spawnEvent(type, ...args) {
    // console.log('[INFO] spawnEvent', type);
    const event = eventTypes[type](this.unregisterEvent.bind(this), ...args);
    if (!event.error){
      this.events.push(event);
    } else {
      // console.error(`[ERROR] failed to spawn event ${event.constructor.EVENT_TYPE}`, event.error);
    }
  }

  startSpawningRandomEvents(interval = 30e3) {
    // console.log('[INFO] startSpawningRandomEvents');
    randomEventsInterval = setInterval(() => {
      this._spawnRandomEventInfinitely(30e3, 180e3);
    }, interval);
  }

  stopSpawningRandomEvents() {
    clearInterval(randomEventsInterval);
    randomEventsInterval = null;
  }

  _spawnRandomEventInfinitely(minInterval, maxInterval) {
    // console.log('[INFO] _spawnRandomEvent');
    const types = _.keys(eventTypes);
    const randomType = types[Math.floor((types.length) * Math.random())];
    // console.log('[INFO] _spawnRandomEvent', randomType);

    setTimeout(() => {
      // this._spawnRandomEventInfinitely(minInterval, maxInterval);
      this.spawnEvent(randomType);
    }, minInterval + Math.round(Math.random() * (maxInterval - minInterval)));
  }

  unregisterEvent(event) {
    // TODO: archive event
    _.remove(this.events, e => e.id === event.id);
  }

  render(time) {
    // console.log('[INFO] render events', this.events.length);
    return this.events.map(e => e.render(time));
  }
}

export default new EventEmitter();
