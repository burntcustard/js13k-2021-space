import Build from '../build';
import HexRing from '../shapes/hex-ring';
import Module from './module';
import achievements from '../achievements';

const info = {
  tag: 'Hab Ring',
  desc: 'Rotating hexagon habition ring',
  className: 'ring',
  cost: 100,
  power: -40,
  population: 15,
  unlock: () => achievements.population > 24,
  unlockText: 'Reach 25 population',
  baseW: 60,
  baseD: 50,
  w: 60,
  d: 540, // BIG
};

export default function Ring({ x, y, z, rx, ry, rz }) {
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

  this.vrx = 0; // Velocity rotation x axis

  Build.addEventListenersTo(this.model.sides[0]);
  Build.addEventListenersTo(this.model.sides[7]);
}

Object.assign(Ring, info);
Ring.prototype = Object.create(Module.prototype);
Ring.prototype.constructor = Ring;

Ring.prototype.build = function () {
  Module.prototype.build.call(this);
};

Ring.prototype.update = function (elapsed = 0, lights) {
  Module.prototype.update.call(this, elapsed, lights);

  if (this.active) {
    // Speed rotation velocity up a bit, to a maximum
    this.vrx = Math.min(this.vrx + 0.0001 * elapsed, 2);
  } else {
    // Slow rotation velocity down a bit, to a minumum of 0
    this.vrx = Math.max(this.vrx - 0.0001 * elapsed, 0);
  }

  // Do the rotation
  this.rx += (this.vrx * elapsed) / 10000;
};
