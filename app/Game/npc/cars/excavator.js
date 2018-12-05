import _ from 'lodash';
import route1 from './ExcavatorRoute1.json';
import route2 from './ExcavatorRoute2.json';
import CarBreakDownEvent from '../events/CarBreakDown';
import DriverBloodPressureLoweredEvent from '../events/DriverBloodPressureLowered';
import DriverGotTired from '../events/DriverGotTired';

const drivers = [
  {
    fullName: 'Jorge Rodriguez',
    photo: 'assets/JorgeRodriguez.jpg',
    age: 42,
    fuelTankCapacity: 900,
    fuelConsumptionPerHour: 90,
  }, {
    fullName: 'Lee Rigby',
    photo: 'assets/NickolayOsipov.jpg',
    age: 56,
    fuelTankCapacity: 900,
    fuelConsumptionPerHour: 90,
  },
];

const cars = [
  {
    image: 'assets/HitachiEX5600-6.jpg',
    label: 'Hitachi EX5600-6',
    fuelTankCapacity: 900,
    fuelConsumptionPerHour: 90,
  },
  {
    image: 'assets/KomatsuPC8000-6.jpg',
    label: 'Komatsu PC8000-6',
    fuelTankCapacity: 700,
    fuelConsumptionPerHour: 70,
  },
];

const routes = {
  'ExcavatorRoute1': route1,
  'ExcavatorRoute2': route2,
  DEFAULT: route1,
};

export default class Excavator {
  static TYPE = 'excavator';
  static AMOUNT = 0;

  constructor({ randomPosition, routeName = 'ExcavatorRoute1' }) {
    this.driver = drivers[Math.floor(Math.random() * drivers.length)];
    this.car = cars[Math.floor(Math.random() * cars.length)];
    this.route = routes[routeName] || routes.DEFAULT;

    const index = !randomPosition ? 0 : Math.round((Math.random() * this.route.length));
    this.dTime = this.route[index].time;
    this.type = Excavator.TYPE;
    this.lastRenderTime = Date.now() + this.dTime;
    this.id = `${this.constructor.TYPE}-${++Excavator.AMOUNT}`;
    this.lat = this.route[index].lat;
    this.lng = this.route[index].lng;
    this.affects = [];
    this.breakStartTime = 0;
    this.totalIdleTime = 0;
    this.fuelAmount = this.car.fuelTankCapacity;
    this.lastTimestamp = 0;

    this.carStatus = 'NORMAL';
    this.driverStatus = 'NORMAL';
    this.driverTemperature = 36.5;
    this.driverHeartRate = 85;
    this.driverBloodPressure1 = 110;
    this.driverBloodPressure2 = 80;
    this.driverShiftLength = 0;
  }

  render(timestamp) {
    timestamp += this.dTime - this.totalIdleTime;

    if (timestamp > _.last(this.route).time) {
      timestamp = timestamp % _.last(this.route).time;
    }

    let newPoint = null;

    if(this.affects.find(e => e.type === CarBreakDownEvent.EVENT_TYPE)) {
      // Break down
      this.breakStartTime = this.breakStartTime === 0 ? timestamp : this.breakStartTime;
      // this.totalIdleTime += (timestamp - this.breakStartTime);
      newPoint = { lat: this.lat, lng: this.lng };
      this.carStatus = 'CRITICAL';
    } else {
      // Repaired
      if (this.breakStartTime > 0) {
        this.totalIdleTime += (timestamp - this.breakStartTime);
        this.breakStartTime = 0;
      }
      newPoint = this.route.find(point => point.time > timestamp) || this.route[0];
      if(!newPoint) {
        console.log('[ERROR] Excavator: Not found new point for route', timestamp);
        return null;
      }

      this.lat = newPoint.lat;
      this.lng = newPoint.lng;
      this.carStatus = 'NORMAL';
    }

    this.fuelAmount = this.fuelAmount - ((timestamp - this.lastTimestamp) / (60 * 60 * 1e3)) * this.car.fuelConsumptionPerHour;
    if(this.fuelAmount < 0) {
      // re-fuel
      this.fuelAmount = this.car.fuelTankCapacity;
    }


    this.driverShiftLength += this.lastTimestamp > 0 ? (timestamp - this.lastTimestamp) : this.lastTimestamp;

    this.driverStatus = 'NORMAL';

    if (this.affects.find(e => e.type === DriverGotTired.EVENT_TYPE)) {
      this.driverStatus = 'TIRED';
    }

    if (this.affects.find(e => e.type === DriverBloodPressureLoweredEvent.EVENT_TYPE)) {
      this.driverStatus = 'CRITICAL';
    }

    this.lastTimestamp = timestamp;
    // console.log('[INFO] New Point for the car', timeSinceLastRender, newPoint);

    if(!newPoint) {
      console.log('[ERROR] Excavator: Not found new point for route');
      return null;
    }

    return {
      type: Excavator.TYPE,
      ...this.car,
      id: this.id,
      title: this.title,
      lat: newPoint.lat,
      lng: newPoint.lng,
      affects: this.affects,
      driver: this.driver,
      fuelAmount: this.fuelAmount,
      coolantTemp: 194,
      powerOutput: 10,
      driverTemperature: this.driverTemperature,
      driverHeartRate: this.driverHeartRate,
      driverBloodPressure1: this.driverBloodPressure1,
      driverBloodPressure2: this.driverBloodPressure2,
      driverShiftLength: this.driverShiftLength,
      driverStatus: this.driverStatus,
      carStatus: this.carStatus,
    };
  }
}