import _ from 'lodash';
import uuid from 'uuid/v4';
import game from '../../game';
import Car from '../cars/car';
import Pedestrian from '../pedestrians/pedestrian';
import Excavator from '../cars/excavator';

class DriverGotTired {
  static EVENT_TYPE = 'driver got tired';
  static TITLE = 'Driver is tired';
  static DESCRIPTION = `The driver is tired currently`;
  static LEVEL = 'WARNING';
  static DURATION = 120e3;


  constructor(unregister) {
    const cars = game.npcs
      .filter(n => n.type === Car.TYPE || n.type === Pedestrian.TYPE || n.type === Excavator.TYPE)
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

      this._breakDownDriver();
      setTimeout(() => {
        this._fixDriver();
      }, DriverGotTired.DURATION);
    }
  }

  render(time) {
    return {
      id: this.id,
      type: DriverGotTired.EVENT_TYPE,
      title: this.car.type === Pedestrian.TYPE ? `Employee #${this.car.id} is Tired` : `Engine #${this.car.id} Driver Is Tired`,
      description: DriverGotTired.DESCRIPTION,
      level: DriverGotTired.LEVEL,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      carId: this.car.id,
    }
  }

  _breakDownDriver() {
    this.status = 'active';
    this.car.affects.push({
      id: this.id,
      type: DriverGotTired.EVENT_TYPE,
      title: this.car.type === Pedestrian.TYPE ? `Employee #${this.car.id} is Tired` : `Engine #${this.car.id} Driver Is Tired`,
      description: DriverGotTired.DESCRIPTION,
      level: DriverGotTired.LEVEL,
      startTime: this.startTime,
      status: this.status,
    });
    this.startTime = Date.now();
  }

  _fixDriver() {
    this.status = 'finished';
    _.remove(this.car.affects, a => a.id === this.id);
    this.endTime = Date.now();
    this.unregister(this);
  }
}

export default DriverGotTired;