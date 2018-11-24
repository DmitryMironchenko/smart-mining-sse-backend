import _ from 'lodash';
import Bases from './micro-cells.json';
import CellTowerPowerCut from '../events/CellTowerPowerCut';
import CellTowerOverload from '../events/CellTowerOverload';

export default class SmallCell {
  static TYPE = 'poleCell';
  static AMOUNT = 0;

  static spawn = () => {
    return Bases.map(t => new SmallCell(t));
  };

  constructor(towerData) {
    this.initialParams = { radius: 20, ...towerData };
    this.type = SmallCell.TYPE;
    this.id = `${this.constructor.TYPE}-${++SmallCell.AMOUNT}`;

    this.title = this.id;
    this.image = 'assets/cell-towers/pole-cell.jpg';
    this.height = "3m";
    this["overlap area"] = "70 miles";
    this.tower_type = 'fixed';
    this["GPS receiver"] = "CDMA2000/IS-95";
    this.range = "2G/3G";
    this["signal frequency"] = "3–30 MHz";
    this.transmitters = "radio";
    this["emergency power system"] = "fuel cells";
    this.affects = [];

    Object.assign(this, towerData);

    this.status = 'NORMAL';
    this.loadBalance = Math.random();
  }

  render(timestamp) {
    const state = _.clone(this.initialParams);
    this.affects.forEach(a => a.applyAffect(state));

    Object.assign(this, state);
    this.status = '';

    const powerCutAffect = this.affects.find(a => a.type === CellTowerPowerCut.EVENT_TYPE);
    const cellTowerOverloaded = this.affects.find(a => a.type === CellTowerOverload.EVENT_TYPE);

    if (cellTowerOverloaded) {
      this.status = 'OVERLOADED';
    }

    if (powerCutAffect) {
      this.status = 'DOWN';
    }

    return this;
  }
}