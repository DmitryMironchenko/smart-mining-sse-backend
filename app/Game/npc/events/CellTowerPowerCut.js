import _ from 'lodash';
import uuid from 'uuid/v4';
import game from '../../game';
import CellTower from '../static/CellTower';
import SmallCell from "../static/SmallCell";

class CellTowerPowerCut {
  static EVENT_TYPE = 'cell tower power cut';
  static TITLE = 'BTS Power Cut Off';
  static LEVEL = 'ERROR';
  static DURATION = 20e3;


  constructor(unregister) {
    this.description = `Input voltage: ${Math.round(Math.random() * 70)} V`;

    const cellTowers = game.npcs
      .filter(n => n.type === CellTower.TYPE || n.type === SmallCell.TYPE)
      .filter(n => n.affects.length < 1);

    this.id = uuid();

    this.tower = cellTowers[Math.floor(cellTowers.length * Math.random())];

    if(!this.tower) {
      this.error = 'No Cell Tower selected for CellTowerPowerCutEvent';
    } else {
      this.startTime = null;
      this.endTime = null;
      this.status = null;
      this.unregister = unregister;

      console.log('[INFO]: CellTowerPowerCut spawned', this.tower.id);

      this._turnPowerOff();
      setTimeout(() => {
        this._turnPowerOn();
      }, CellTowerPowerCut.DURATION);
    }
  }

  render(time) {
    return {
      id: this.id,
      type: this.constructor.EVENT_TYPE,
      title: `Cell Tower #${this.tower.id} is down`,
      description: this.description,
      level: CellTowerPowerCut.LEVEL,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      towerId: this.tower.id,
    }
  }

  _turnPowerOff() {
    this.status = 'down';
    this.tower.affects.push({
      id: this.id,
      type: this.constructor.EVENT_TYPE,
      title: `Cell tower #${this.tower.id} is down`,
      description: this.description,
      level: CellTowerPowerCut.LEVEL,
      startTime: this.startTime,
      status: this.status,
      applyAffect: (tower) => {
        tower.radius = 0;
        // tower.status.push('DOWN');
      },
    });
    this.startTime = Date.now();
  }

  _turnPowerOn() {
    this.status = 'finished';
    _.remove(this.tower.affects, a => a.id === this.id);
    this.endTime = Date.now();
    this.unregister(this);
  }
}

export default CellTowerPowerCut;
