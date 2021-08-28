import Module from './module';
import Box from '../shapes/box';

export default function Solar({
  x, y, z, rx, ry, rz,
}) {
  this.name = 'Solar Panel Basic';
  this.desc = 'Generates power';
  this.power = 10;
  this.cost = 35;
  this.w = 108;
  this.h = 2;
  this.d = 53;
  this.model = new Box({
    w: this.w,
    h: this.h,
    d: this.d,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    className: 'solar',
  });
  this.model.sides[0].element.className += ' panel';
  this.model.sides[this.model.sides.length - 1].element.className += ' panel';
}

Solar.prototype = Object.create(Module.prototype);
Solar.prototype.constructor = Solar;
