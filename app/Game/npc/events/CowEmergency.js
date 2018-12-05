import _ from 'lodash';
import uuid from 'uuid/v4';
import game from '../../game';
import Cow from '../cows/cow';

class CowEmergency {
  static EVENT_TYPE = 'Cow Emergency alert';
  static TITLE = 'Cow Emergency alert';
  static DESCRIPTION = `Cow Emergency alert`;
  static LEVEL = 'normal';
  static DURATION = 10e3;


  constructor(unregister) {
    this.cows = game.npcs.filter(n => n.type === Cow.TYPE );
    this.cow = this.cows[_.random(this.cows.length)];
    this.unregister = unregister;

    if(!this.cow) {
      this.error = 'No cow selected!';
      return {};
    }
    this.id = uuid();

    this.startTime = null;
    this.endTime = null;
    this.status = null;

    this._cowEmergency();
  }

  render() {
    this.unregister(this);
    return {
      id: this.cow.id,
      showAlert: true,
      status: 'WARNING',
      type: CowEmergency.EVENT_TYPE,
      title: `Cow biometrical data alert`,
      description: `Check ${this.cow.id} biometrical status`,
      level: CowEmergency.LEVEL,
      startTime: this.startTime,
      endTime: this.endTime,
    }
  }

  _cowEmergency() {
    this.status = 'active';
    this.startTime = Date.now();

    this.cow.state.heartRate -= 30;
    this.cow.status = 'HeartRate extremely low';
    this.cow.setStatusLevel(1, 2);


    setTimeout(() => { this._fixEmergency(); }, 15e3);
  }

  _fixEmergency() {
    this.status = 'finished';
    this.endTime = Date.now();

    this.cow.state.heartRate += 30;
    this.cow.status = 'Normal';
    this.cow.resolveStatusLevel(2, 1);
  }
}

export default CowEmergency;
