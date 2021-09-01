import Module from './module';
import Box from '../shapes/box';
import Build from '../build';

const info = {
  tag: 'Hab Sm', // Can't use 'name' because is reserved
  desc: 'Small habitation module',
  className: 'hab-sm',
  cost: 10,
  power: -10,
  population: 5,
  w: 60,
  d: 60,
  h: 60,
};

export default function Hab({
  x, y, z, rx, ry, rz,
}) {
  this.model = new Box({
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

  Build.addEventListenersTo(this.model.sides[0]); // Top (first)
  Build.addEventListenersTo(this.model.sides[5]); // Bottom (last)
}

Object.assign(Hab, info);
Hab.prototype = Object.create(Module.prototype);
Hab.prototype.constructor = Hab;

Hab.prototype.build = function () {
  // TODO: Block build animation
  Module.prototype.build.call(this);
};
