import _ from 'lodash';

import cowsCollection from './cows-collection';

export default class Cow {
  static TYPE = 'cow';
  static AMOUNT = 0;
  static INITIAL_STATE = {
    temperature: 38.7,
    heartRate: 58,
    systolicBloodPressure: 134,
    diastolicBloodPressure: 83,
    lat: 50.161785,
    lng: -120.136131,
  };
  static STATUS_LEVEL = {
    normal: 1,
    warning: 2,
    critical: 3,
  };
  static DEFAULT_STATUS = 'Normal';

  constructor() {
    this.id = `${this.constructor.TYPE}-${++Cow.AMOUNT}`;
    this.type = this.constructor.TYPE;
    this.status = this.constructor.DEFAULT_STATUS;
    this.statusLevel = this.constructor.STATUS_LEVEL.normal;

    this.bio = cowsCollection[0];
    this.showAlert = false;
    this.affects = [];
    this.state = this.initialRender();
  }

  setStatusLevel(oldLevel, newLevel) {
    if (oldLevel === 1) {
      this.statusLevel = newLevel;
    }
  }

  resolveStatusLevel(oldLevel, newLevel) {
    if (oldLevel === this.statusLevel ) {
      this.statusLevel = newLevel;
    }
  }

  initialRender() {
    const state = Cow.INITIAL_STATE;
    return {
      temperature: +(state.temperature + Math.random() * 3 - 1.5).toFixed(1),
      heartRate: +(state.heartRate + Math.random() * 10 - 5).toFixed(0),
      systolicBloodPressure: +(state.systolicBloodPressure + Math.random() * 10 - 5).toFixed(0),
      diastolicBloodPressure: +(state.diastolicBloodPressure + Math.random() * 10 - 5).toFixed(0),
      lat: state.lat + (Math.random() * 0.0004) - 0.0002,
      lng: state.lng + (Math.random() * 0.0006) - 0.0003,
    }
  }

  cowRandomizer() {
    const state = this.state;
    if (this.status === 'Normal'){
      return {
        temperature: +(state.temperature + Math.random() * 1 - 0.5).toFixed(1),
        heartRate: +(state.heartRate + Math.random() * 2 - 1).toFixed(0),
        systolicBloodPressure: +(state.systolicBloodPressure + Math.random() * 4 - 2).toFixed(0),
        diastolicBloodPressure: +(state.diastolicBloodPressure + Math.random() * 10 - 5).toFixed(0),
        lat: state.lat + (Math.random() * 0.00008) - 0.000004,
        lng: state.lng + (Math.random() * 0.00008) - 0.000004,
      }
    } else {
      return this.state;
    }

  }

  render(timestamp) {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      statusLevel: this.statusLevel,
      affects: this.affects,
      showAlert: this.showAlert,


      ...this.bio,
      ...this.cowRandomizer(this.state),
    }
  }
}
