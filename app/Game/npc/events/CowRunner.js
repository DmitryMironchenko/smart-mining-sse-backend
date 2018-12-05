import _ from 'lodash';
import uuid from 'uuid/v4';
import game from '../../game';
import Cow from '../cows/cow';

class CowRunner {
  static EVENT_TYPE = 'Cow run fast';

  constructor() {
    this.cows = game.npcs.filter(n => n.type === Cow.TYPE );
    this.cow = this.cows[0];

    if(!this.cow) {
      this.error = 'No cow selected!';
      return {};
    }
    this.id = uuid();

    this.startTime = null;
    this.endTime = null;
    this.status = null;

    _.times(10, i => {
      setTimeout(() => {this._cowRunner()}, i*2000)
    })
  }

  render() {
    return {
      id: this.cow.id,
      showAlert: false,
      status: 'CRITICAL',
      type: 'Cow run',
      title: `Cow biometrical data alert`,
      description: `Check ${this.cow.id} biometrical status`,
      level: 3,
      startTime: this.startTime,
      endTime: this.endTime,
    }
  }

  _cowRunner() {
    console.log("_cowRunner");
    this.status = 'active';
    this.startTime = Date.now();
    this.cow.state.lat += 0.00008;
    setTimeout(() => { this._cowBackRunner(); }, 22e3);
  }

  _cowBackRunner() {
    console.log("_cowBackRunner");
    this.status = 'finished';
    this.endTime = Date.now();

    this.cow.state.lat -= 0.00008;
  }
}

export default CowRunner;
