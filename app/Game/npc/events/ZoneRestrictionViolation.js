import uuid from 'uuid/v4';
import game from '../../game';
import Car from '../cars/car';

class ZoneRestrictionViolation {
  static EVENT_TYPE = 'unit violates zone restrictions';
  static TITLE = 'Car speeding in danger zone';
  static DESCRIPTION = `Car speeding in danger zone`;
  static LEVEL = 'WARNING';
  static DURATION = 5e3;

  constructor(unregister, car) {
    const cars = game.npcs
      .filter(n => n.type === Car.TYPE)
      .filter(n => n.affects.length < 1);

    this.id = uuid();
    this.car = car;
    this.unregister = unregister;

    setTimeout(() => {
      this._tryToFixProblem();
    }, ZoneRestrictionViolation.DURATION);
  }

  render(time) {
    if(this.car) {
      return {
        id: this.id,
        type: ZoneRestrictionViolation.EVENT_TYPE,
        title: `Engine #${this.car.id} is violating zone restriction`,
        description: ZoneRestrictionViolation.DESCRIPTION,
        level: ZoneRestrictionViolation.LEVEL,
        carId: this.car.id,
      };
    }
    this.unregister(this);
  }

  _tryToFixProblem() {
    this.unregister(this);
  }
}

export default ZoneRestrictionViolation;