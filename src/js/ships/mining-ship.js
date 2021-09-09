import Box from '../shapes/box';
import Ship from './ship';

const info = {
  tag: 'MiningShip',
  desc: 'Mining ship',
  className: 'mining ship',
  cost: 1,
};

export default function MiningShip({ x, y, z, parent }) {
  this.model = new Box({
    w: 40,
    d: 30,
    h: 30,
    x,
    y,
    z,
    className: info.className,
  });

  // TODO: Spawn only in empty bays? Not bay 0?
  Ship.call(this, { x, y, z, bay: parent.bays[0], ...info });
}

Object.assign(MiningShip, info);
MiningShip.prototype = Object.create(Ship.prototype);
MiningShip.prototype.constructor = MiningShip;
