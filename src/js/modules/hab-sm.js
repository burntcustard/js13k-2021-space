import Module from './module';
import Octabox from '../shapes/octabox';
import Build from '../build';

const info = {
  tag: 'Hab Sm', // Can't use 'name' because is reserved
  desc: 'Small habitation module',
  className: 'hab-sm module',
  cost: 10,
  power: -10,
  population: 5,
  w: 60,
  d: 84,
  h: 84,
};

export default function Hab({
  x, y, z, rx, ry, rz,
}) {
  this.model = new Octabox({
    w: info.w,
    h: info.h,
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

  // Add build listeners to the larger sides, and the top (or is it bottom?)
  // We may need to add to the other top/bottom/whatever-the-end-is as well
  this.model.sides.forEach((side, i) => {
    if (i === 0 || i % 2 || i === this.model.sides.length - 1) {
      Build.addEventListenersTo(side);
    }
  });
}

Object.assign(Hab, info);
Hab.prototype = Object.create(Module.prototype);
Hab.prototype.constructor = Hab;

Hab.prototype.build = function () {
  // TODO: Block build animation
  Module.prototype.build.call(this);
};
