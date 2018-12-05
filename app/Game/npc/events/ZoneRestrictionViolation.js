import uuid from 'uuid/v4';
import game from '../../game';
import Cow from '../cows/cow';

class ZoneRestrictionViolation {
  static EVENT_TYPE = 'unit violates zone restrictions';
  static TITLE = 'Cow run out';
  static DESCRIPTION = `Cow-1 run out from the restriction zone.`;
  static LEVEL = 'WARNING';
  static DURATION = 5e3;

  constructor(unregister, cow) {
    this.id = uuid();
    this.cow = cow;
    this.unregister = unregister;

    setTimeout(() => {
      this._tryToFixProblem();
    }, ZoneRestrictionViolation.DURATION);
  }

  render(time) {
    if(this.cow) {
      return {
        id: this.id,
        showAlert: true,
        status: 'CRITICAL',
        type: ZoneRestrictionViolation.EVENT_TYPE,
        title: `Engine #${this.cow.id} is violating zone restriction`,
        description: ZoneRestrictionViolation.DESCRIPTION,
        level: ZoneRestrictionViolation.LEVEL,
        cowId: this.cow.id,
      };
    }
    this.unregister(this);
  }

  _tryToFixProblem() {
    this.unregister(this);
  }
}

export default ZoneRestrictionViolation;
