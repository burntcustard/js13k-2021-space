import Build from '../build';
import Hexagon from '../shapes/hexagon';
import Module from './module';

const info = {
  tag: 'Hex Block',
  desc: 'Hexagonal block with solar panels',
  className: 'hex-block hex-block-multi module',
  unlock: () => Build.itemHasBeenRotated,
  unlockText: '',
  cost: 90,
  w: 60,
  d: 120,
};

export default function HexBockMulti({ x, y, z, rx, ry, rz }) {
  this.model = new Hexagon({
    w: info.w,
    d: info.d,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    className: info.className,
  });

  Module.call(this, { x, y, z, rx, ry, rz, ...info });

  this.model.sides[3].element.classList.add('panel');
  this.model.sides[4].element.classList.add('panel');
  this.model.sides[5].element.classList.add('panel');

  this.model.sides.forEach((side) => {
    Build.addEventListenersTo(side);
  });
}

Object.assign(HexBockMulti, info);
HexBockMulti.prototype = Object.create(Module.prototype);
HexBockMulti.prototype.constructor = HexBockMulti;

HexBockMulti.prototype.build = function () {
  Module.prototype.build.call(this);
};
