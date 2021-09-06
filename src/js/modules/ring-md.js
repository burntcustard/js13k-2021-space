import Build from '../build';
import HexRing from '../shapes/side-hexagon';
import Module from './module';

const info = {
  tag: 'Ring Medium',
  desc: 'Rotating hexagon ring',
  className: '',
  cost: 100,
  power: -20,
  baseW: 60,
  baseD: 50,
  w: 60,
  d: 540, // BIG
};

export default function RingMd({ x, y, z, rx, ry, rz }) {
  this.model = new HexRing({
    w: info.w,
    d: info.d,
    baseW: info.baseW,
    baseD: info.baseD,
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

Object.assign(RingMd, info);
RingMd.prototype = Object.create(Module.prototype);
RingMd.prototype.constructor = RingMd;

RingMd.prototype.build = function () {
  Module.prototype.build.call(this);
};
