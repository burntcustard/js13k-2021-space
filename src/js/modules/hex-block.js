import Build from '../build';
import Hexagon from '../shapes/hexagon';
import Module from './module';

const info = {
  tag: 'Hex Block',
  desc: 'Hexagonal building block',
  className: 'hex-block',
  cost: 1,
  power: -10,
  w: 120,
  h: 60,
};

export default function HexBlock({ x, y, z, rx, ry, rz }) {
  this.model = new Hexagon({
    w: info.w,
    h: info.h,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    className: info.className,
  });

  Module.call(this, { x, y, z, rx, ry, rz, ...info });

  this.model.sides.forEach((side) => {
    Build.addEventListenersTo(side);
  });
}

Object.assign(HexBlock, info);
HexBlock.prototype = Object.create(Module.prototype);
HexBlock.prototype.constructor = HexBlock;

HexBlock.prototype.build = function () {
  Module.prototype.build.call(this);
};
