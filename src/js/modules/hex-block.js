import Build from '../build';
import SideHexagon from '../shapes/side-hexagon';
import Module from './module';

const info = {
  tag: 'Hex Block',
  desc: 'Hexagonal building block',
  className: 'hex-block module',
  cost: 1,
  power: -10,
  w: 60,
  d: 120,
};

export default function HexBlock({ x, y, z, rx, ry, rz }) {
  this.model = new SideHexagon({
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
