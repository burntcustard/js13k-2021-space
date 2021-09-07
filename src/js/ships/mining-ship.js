import Box from '../shapes/box';
import Ship from './ship';

const info = {
  tag: 'MiningShip',
  desc: 'Mining ship',
  className: 'mining ship',
  cost: 1,
};

export default function MiningShip({ x, y, z, id, bay }) {
  this.model = new Box({
    w: 40,
    d: 30,
    h: 30,
    x,
    y,
    z,
    className: info.className,
  });

  Ship.call(this, { x, y, z, id, bay, ...info });
}

Object.assign(MiningShip, info);
MiningShip.prototype = Object.create(Ship.prototype);
MiningShip.prototype.constructor = MiningShip;
