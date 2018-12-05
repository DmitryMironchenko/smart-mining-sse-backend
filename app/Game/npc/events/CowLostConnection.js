import _ from 'lodash';
import uuid from 'uuid/v4';
import game from '../../game';
import Cow from '../cows/cow';

class CowLostConnection {
  static EVENT_TYPE = 'CONNECTION_LOST';
  static TITLE = 'Cow-sensor lost connection.';
  static DESCRIPTION = `Fail to update data`;
  static LEVEL = 'warning';


  constructor(unregister) {
    const cows = game.npcs.filter(n => n.type === Cow.TYPE );
    this.unregister = unregister;

    this.id = uuid();
    this.cow = cows[Math.floor(cows.length * Math.random())];

    if(!this.cow) {
      this.error = 'No cow selected!';
      return {};
    }

    this.startTime = null;
    this.endTime = null;
    this.status = null;
    this.unregister = unregister;

    this._cowConnectionLost();
  }

  render() {
    this.unregister(this);
    return {
      id: this.cow.id,
      showAlert: true,
      status: 'WARNING',
      type: "Cow sensor connection lost",
      title: `Cow's sensor lost connection`,
      description: "Sensor connection lost",
      level: CowLostConnection.LEVEL,
      startTime: this.startTime,
      endTime: this.endTime,
      cowId: this.cow.id,
    }
  }

  _cowConnectionLost() {
    console.log("_cowConnectionLost");
    this.status = 'active';
    this.startTime = Date.now();

    this.cow.status = Cow.status = 'Connection Lost';
    this.cow.setStatusLevel(1, 2);
    setTimeout(() => { this._fixCow(); }, 15e3);
  }

  _fixCow() {
    this.status = 'finished';
    this.endTime = Date.now();
    this.unregister(this);

    this.cow.status = 'Normal';
    this.cow.resolveStatusLevel(2, 1);
  }
}

export default CowLostConnection;
