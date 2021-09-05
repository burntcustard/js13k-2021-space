import Module from './module';
import Box from '../shapes/box';

const info = {
  tag: 'Solar Panel Basic',
  desc: 'Generates power',
  className: 'solar module',
  cost: 35,
  power: 10,
  w: 108,
  h: 2,
  d: 54,
};

export default function Solar({
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
  this.model.sides[1].element.className += ' panel';
  this.model.sides[4].element.className += ' panel';

  Module.call(this, { x, y, z, rx, ry, rz, ...info });
}

Object.assign(Solar, info);
Solar.prototype = Object.create(Module.prototype);
Solar.prototype.constructor = Solar;

Solar.prototype.build = function () {
  // TODO: Solar panel build animation
  Module.prototype.build.call(this);
};
