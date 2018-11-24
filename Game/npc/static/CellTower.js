import _ from 'lodash';
import Towers from './towers.json';
import CellTowerPowerCut from '../events/CellTowerPowerCut';
import CellTowerOverload from '../events/CellTowerOverload';

export default class CellTower {
  static TYPE = 'cellTower';
  static AMOUNT = 0;
  static spawn = () => {
    return Towers.map(t => new CellTower(t));
  };

  constructor(towerData) {
    this.initialParams = towerData;
    this.type = CellTower.TYPE;
    this.id = `${this.constructor.TYPE}-${++CellTower.AMOUNT}`;
    this.affects = [];

    Object.assign(this, towerData);

    this.loadBalance = .78;
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