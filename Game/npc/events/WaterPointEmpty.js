import _ from 'lodash';
import uuid from 'uuid/v4';
import game from '../../game';
import WaterPoint from '../cow-water-point/cow-water-point';

class CowLostConnection {
  static EVENT_TYPE = 'Water Point is Empty';
  static DESCRIPTION = `Water Point is empty.`;
  static LEVEL = 'WARNING';
  static DURATION = 20e3;

  constructor(unregister) {
    const waterPoints = game.npcs
      .filter(n => n.type === WaterPoint.TYPE);

    this.unregister = unregister;
    this.id = uuid();
    this.waterPoint = waterPoints[Math.floor(waterPoints.length * Math.random())];
    if(!this.waterPoint) {
      this.error = 'No water point selected!';
    } else {
      this.startTime = null;
      this.endTime = null;
      this.status = null;
      this.unregister = unregister;

      this._waterpointIsEmpty();
      setTimeout(() => { this._fixWaterPoint(); }, 10e3);
    }
  }

  render() {
    this.unregister(this);
    return {
      id: this.id,
      showAlert: true,
      type: CowLostConnection.EVENT_TYPE,
      title: `Water point is empty`,
      description: `Water point ${this.waterPoint.id} is empty.`,
      level: CowLostConnection.LEVEL,
      startTime: this.startTime,
      endTime: this.endTime,
      status: 'CRITICAL',
      waterPointId: this.waterPoint.id,
    }
  }

  _waterpointIsEmpty() {
    console.log("_waterpointIsEmpty");
    this.status = 'active';
    this.startTime = Date.now();

    this.waterPoint.status = 'Empty';
    this.waterPoint.statusLevel = 3;

    setTimeout(() => { this._fixWaterPoint(); }, CowLostConnection.DURATION);
  }

  _fixWaterPoint() {
    this.status = 'finished';
    this.endTime = Date.now();

    this.waterPoint.status = 'Full';
    this.waterPoint.statusLevel = 1;
  }
}

export default CowLostConnection;
