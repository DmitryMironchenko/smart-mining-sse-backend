import _ from 'lodash';
import uuid from 'uuid/v4';
import game from '../../game';
import Car from '../cars/car';
import Pedestrian from '../pedestrians/Pedestrian';
import Excavator from '../cars/excavator';

class DriverBloodPressureLowered {
  static EVENT_TYPE = 'driver blood pressure is not normal';
  static TITLE = 'Driver health danger';
  static DESCRIPTION = `Blood pressure is not normal`;
  static LEVEL = 'ERROR';
  static DURATION = 10e3;


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
      }, DriverBloodPressureLowered.DURATION);
    }
  }

  render(time) {
    const driverBloodPressure1 = Math.round(150 + Math.random() * 100);
    const driverBloodPressure2 = Math.round(50 + Math.random() * 70);

    this.car.driverBloodPressure1 = driverBloodPressure1;
    this.car.driverBloodPressure2 = driverBloodPressure2;

    return {
      id: this.id,
      type: DriverBloodPressureLowered.EVENT_TYPE,
      title: this.car.type === Pedestrian.TYPE ? `Employee #${this.car.id} Feels Bad` : `Engine #${this.car.id} Driver Feels Bad`,
      description: DriverBloodPressureLowered.DESCRIPTION,
      level: DriverBloodPressureLowered.LEVEL,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      carId: this.car.id,
      driverBloodPressure1,
      driverBloodPressure2,
    }
  }

  _breakDownDriver() {
    this.status = 'active';
    this.car.affects.push({
      id: this.id,
      type: DriverBloodPressureLowered.EVENT_TYPE,
      title: this.car.type === Pedestrian.TYPE ? `Employee #${this.car.id} Feels Bad` : `Engine #${this.car.id} Driver Feels Bad`,
      description: DriverBloodPressureLowered.DESCRIPTION,
      level: DriverBloodPressureLowered.LEVEL,
      startTime: this.startTime,
      status: this.status,
    });
    this.startTime = Date.now();
  }

  _fixDriver() {
    this.status = 'finished';
    _.remove(this.car.affects, a => a.id === this.id);
    this.car.driverBloodPressure1 = 110;
    this.car.driverBloodPressure2 = 80;
    this.endTime = Date.now();
    this.unregister(this);
  }
}

export default DriverBloodPressureLowered;