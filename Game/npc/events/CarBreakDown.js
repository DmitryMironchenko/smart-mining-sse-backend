import _ from 'lodash';
import uuid from 'uuid/v4';
import game from '../../game';
import Car from '../cars/car';

class CarBreakDownEvent {
  static EVENT_TYPE = 'car breakdown';
  static TITLE = 'Car has broken down';
  static DESCRIPTION = `Engine failure code #AEF${Math.round(Math.random() * 1e6)}`;
  static LEVEL = 'ERROR';
  static DURATION = 20e3;


  constructor(unregister) {
    const cars = game.npcs
      .filter(n => n.type === Car.TYPE)
      .filter(n => n.affects.length < 1);

    this.id = uuid();
    this.car = cars[Math.floor(cars.length * Math.random())];
    // console.log('[INFO] CarBreakDownEvent car chosen', this.car);
    if(!this.car) {
      this.error = 'No car selected for CarBreakDownEvent';
    } else {
      this.startTime = null;
      this.endTime = null;
      this.status = null;
      this.unregister = unregister;

      this._breakDownCar();
      setTimeout(() => { this._fixCar(); }, CarBreakDownEvent.DURATION);
    }
  }

  render(time) {
    return {
      id: this.id,
      type: CarBreakDownEvent.EVENT_TYPE,
      title: `Truck #${this.car.id} has broken down`,
      description: CarBreakDownEvent.DESCRIPTION,
      level: CarBreakDownEvent.LEVEL,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      carId: this.car.id,
    }
  }

  _breakDownCar() {
    this.status = 'active';
    this.car.affects.push({
      id: this.id,
      type: CarBreakDownEvent.EVENT_TYPE,
      title: `Truck #${this.car.id} has broken down`,
      description: CarBreakDownEvent.DESCRIPTION,
      level: CarBreakDownEvent.LEVEL,
      startTime: this.startTime,
      status: this.status,
    });
    this.startTime = Date.now();
  }

  _fixCar() {
    this.status = 'finished';
    _.remove(this.car.affects, a => a.id === this.id);

    this.endTime = Date.now();
    this.unregister(this);
  }
}

export default CarBreakDownEvent;