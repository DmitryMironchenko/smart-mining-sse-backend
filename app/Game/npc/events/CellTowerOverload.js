import _ from 'lodash';
import uuid from 'uuid/v4';
import game from '../../game';
import CellTower from '../static/CellTower';
import SmallCell from "../static/SmallCell";

class CellTowerOverload {
  static EVENT_TYPE = 'cell tower overload';
  static TITLE = 'BTS is overloaded';
  static LEVEL = 'WARNING';
  static DURATION = 120e3;


  constructor(unregister) {
    this.reduceRadius = Math.round(Math.random() * 100) / 100;
    this.description = `BTS is overloaded. Coverage reduced to ${Math.round(this.reduceRadius * 100)}%.`;

    const cellTowers = game.npcs
      .filter(n => n.type === CellTower.TYPE || n.type === SmallCell.TYPE)
      .filter(n => n.affects.length < 1);

    this.id = uuid();

    this.tower = cellTowers[Math.floor(cellTowers.length * Math.random())];

    if(!this.tower) {
      this.error = 'No Cell Tower selected for CellTowerPowerOverload';
    } else {
      this.startTime = null;
      this.endTime = null;
      this.status = null;
      this.unregister = unregister;
      console.log('[INFO]: CellTowerOverload spawned', this.tower.id);
      this._runEvent();
      setTimeout(() => {
        this._stopEvent();
      }, CellTowerOverload.DURATION);
    }
  }

  render(time) {
    return {
      id: this.id,
      type: this.constructor.EVENT_TYPE,
      title: `Cell Tower #${this.tower.id} is overloaded.`,
      description: this.description,
      level: CellTowerOverload.LEVEL,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      towerId: this.tower.id,
    }
  }

  _runEvent() {
    this.tower.affects.push({
      id: this.id,
      type: this.constructor.EVENT_TYPE,
      title: `Cell tower #${this.tower.id} is overloaded.`,
      description: this.description,
      level: CellTowerOverload.LEVEL,
      startTime: this.startTime,
      status: this.status,
      applyAffect: (tower) => {
        tower.radius *= this.reduceRadius;
      },
    });
    this.startTime = Date.now();
  }

  _stopEvent() {
    this.status = 'finished';
    _.remove(this.tower.affects, a => a.id === this.id);
    this.endTime = Date.now();
    this.unregister(this);
  }
}

export default CellTowerOverload;
