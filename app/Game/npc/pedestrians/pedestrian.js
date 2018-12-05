import _ from 'lodash';
import route1 from './PedestrianRoute1.json';
import route2 from './PedestrianRoute2.json';
import route3 from './PedestrianRoute3.json';
import route4 from './PedestrianRoute4.json';
import route5 from './PedestrianRoute5.json';
import route6 from './PedestrianRoute6.json';

import DriverBloodPressureLoweredEvent from '../events/DriverBloodPressureLowered';
import DriverGotTired from '../events/DriverGotTired';

const pedestrians = [
  {
    fullName: 'Alexander Daynichenko',
    photo: 'assets/Alexander Daynichenko.jpg',
    age: 42,
  }, {
    fullName: 'Bertram S. Simmons',
    photo: 'assets/Bertram S. Simmons.jpg',
    age: 42,
  }, {
    fullName: 'Charles A. Freeman',
    photo: 'assets/Charles A. Freeman.jpg',
    age: 42,
  }, {
    fullName: 'Charles G. Curtis',
    photo: 'assets/Charles G. Curtis.jpg',
    age: 42,
  }, {
    fullName: 'Dave J. Hargrove',
    photo: 'assets/Dave J. Hargrove.jpg',
    age: 42,
  }, {
    fullName: 'Gerald E. Miller',
    photo: 'assets/Gerald E. Miller.jpg',
    age: 42,
  }, {
    fullName: 'Jesse M. Fowler',
    photo: 'assets/Jesse M. Fowler.jpg',
    age: 42,
  },  {
    fullName: 'Jorge Rodriguez',
    photo: 'assets/Jorge Rodriguez.jpg',
    age: 42,
  }, {
    fullName: 'Justin J. Kennedy',
    photo: 'assets/Justin J. Kennedy.jpg',
    age: 42,
  }, {
    fullName: 'Nickolay Osipov',
    photo: 'assets/Nickolay Osipov.jpg',
    age: 42,
  }, {
    fullName: 'Tony T. Maselli',
    photo: 'assets/Tony T. Maselli.jpg',
    age: 42,
  }, {
    fullName: 'Victor Kuzikov',
    photo: 'assets/Victor Kuzikov.jpg',
    age: 42,
  },
];

const routes = {
  'PedestrianRoute1': route1,
  'PedestrianRoute2': route2,
  'PedestrianRoute3': route3,
  'PedestrianRoute4': route4,
  'PedestrianRoute5': route5,
  'PedestrianRoute6': route6,
  DEFAULT: route6,
};

export default class Pedestrian {
  static TYPE = 'pedestrian';
  static AMOUNT = 0;

  constructor({ randomRoute, routeName = 'PedestrianRoute1' } = {}) {
    this.employee = pedestrians[Math.floor(Math.random() * pedestrians.length)];
    const routeIndex = Math.floor(Math.random() * _.keys(routes).length);
    const routeKey = _.keys(routes)[routeIndex];
    this.route = randomRoute ? routes[routeKey] : routes[routeName] || routes.DEFAULT;

    console.log(`[INFO] Spawning Pedestrian ${this.constructor.AMOUNT+1} with route ${routeKey}`);

    const index = Math.floor((Math.random() * this.route.length));
    this.dTime = this.route[index].time;

    this.type = Pedestrian.TYPE;
    this.lastRenderTime = Date.now() + this.dTime;
    this.id = `${this.constructor.TYPE}-${++this.constructor.AMOUNT}`;
    this.lat = this.route[index].lat;
    this.lng = this.route[index].lng;
    this.affects = [];
    this.breakStartTime = 0;
    this.totalIdleTime = 0;
    this.lastTimestamp = 0;

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

    let newPoint = this.route.find(point => point.time > timestamp) || this.route[0];

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
      console.log('[ERROR] Pedestrian: Not found new point for route');
      return null;
    }

    return {
      type: Pedestrian.TYPE,
      id: this.id,
      title: this.title,
      lat: newPoint.lat,
      lng: newPoint.lng,
      affects: this.affects,
      driver: this.employee,
      fuelAmount: this.fuelAmount,
      coolantTemp: 194,
      powerOutput: 10,
      driverTemperature: this.driverTemperature,
      driverHeartRate: this.driverHeartRate,
      driverBloodPressure1: this.driverBloodPressure1,
      driverBloodPressure2: this.driverBloodPressure2,
      driverShiftLength: this.driverShiftLength,
      driverStatus: this.driverStatus,
    };
  }
}