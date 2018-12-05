import _ from 'lodash';
import route1 from './Route1.json';
import route2 from './Route2.json';
import CarBreakDownEvent from '../events/CarBreakDown';
import DriverBloodPressureLoweredEvent from '../events/DriverBloodPressureLowered';
import DriverGotTired from '../events/DriverGotTired';

const drivers = [
  {
    fullName: 'Jack Black',
    photo: 'assets/driver1.jpg',
    age: 35,
  }, {
    fullName: 'Lee Rigby',
    photo: 'assets/driver2.jpg',
    age: 42,
  }, {
    fullName: 'Craig Puffett',
    photo: 'assets/driver3.jpg',
    age: 29,
  },
  {
    fullName: 'Jim R. Hamilton',
    photo: 'assets/driver4.jpg',
    age: 29,
  },
  {
    fullName: 'Anthony V. Dixon',
    photo: 'assets/driver5.jpg',
    age: 29,
  },
  {
    fullName: 'Boyd A. Richter',
    photo: 'assets/driver6.jpg',
    age: 29,
  },
  {
    fullName: 'Paul M. Posner',
    photo: 'assets/driver7.jpg',
    age: 29,
  },
  {
    fullName: 'Fedor I Afanasiev',
    photo: 'assets/driver8.jpg',
    age: 55,
  },
];

const cars = [
  {
    image: 'assets/Cat797F.jpg',
    label: 'Caterpillar 797F',
    fuelTankCapacity: 900,
    fuelConsumptionPerHour: 90,
  },
  {
    image: 'assets/Cat793F.jpg',
    label: 'Caterpillar 793F',
    fuelTankCapacity: 700,
    fuelConsumptionPerHour: 70,
  },
  {
    image: 'assets/Kom930E-5.jpg',
    label: 'Komatsu 930E-5',
    fuelTankCapacity: 1000,
    fuelConsumptionPerHour: 100,
  },
  {
    image: 'assets/Kamaz54115.jpg',
    label: 'Kamaz 54115',
    fuelTankCapacity: 200,
    fuelConsumptionPerHour: 30,
  },
  {
    image: 'assets/MBArocs.jpg',
    label: 'MB Arocs',
    fuelTankCapacity: 200,
    fuelConsumptionPerHour: 25,
  },
  {
    image: 'assets/Belaz7547.jpg',
    label: 'Belaz 7547',
    fuelTankCapacity: 600,
    fuelConsumptionPerHour: 50,
  },
];

const routes = {
  'Route1': route1,
  'Route2': route2,
  DEFAULT: route1,
};

export default class Car {
  static TYPE = 'car';
  static AMOUNT = 0;

  constructor({ randomPosition, routeName = 'Route1' }) {
    this.driver = drivers[Math.floor(Math.random() * drivers.length)];
    this.car = cars[Math.floor(Math.random() * cars.length)];
    this.route = routes[routeName] || routes.DEFAULT;

    const index = !randomPosition ? 0 : Math.round((Math.random() * this.route.length));
    this.dTime = this.route[index].time;
    this.type = this.constructor.TYPE;
    this.lastRenderTime = Date.now() + this.dTime;
    this.id = `${this.constructor.TYPE}-${++Car.AMOUNT}`;
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
      newPoint = this.route.find(point => point.time > timestamp);
      if(!newPoint) {
        console.log('[ERROR] Car: Not found new point for route', timestamp);
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
      console.log('[ERROR] Car: Not found new point for route');
      return null;
    }

    return {
      type: Car.TYPE,
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