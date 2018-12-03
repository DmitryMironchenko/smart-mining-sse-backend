import _ from 'lodash';

import waterpoint from './cows-water-point-collection';

export default class CowWaterPoint {
  static TYPE = 'waterpoint';
  static AMOUNT = 0;

  constructor() {
    this.waterPoint = waterpoint[0];
    this.type = this.constructor.TYPE;
    this.id = `${this.constructor.TYPE}-${++CowWaterPoint.AMOUNT}`;
    this.lat = 50.161785 + (Math.random() * 0.0006) - 0.0003;
    this.lng = -120.136131 + (Math.random() * 0.0008) - 0.0004;
    this.affects = [];
    this.status = 'Full';
    this.statusLevel = 1;
  }

  render() {

    return {
      type: this.type,
      id: this.id,
      lat: this.lat,
      lng: this.lng,
      waterPoint: this.waterPoint,
      status: this.status,
      statusLevel: this.statusLevel,
    };
  }
}
