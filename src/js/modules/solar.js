import Module from './module';
import Box from '../shapes/box';
import Vec3 from '../vec3';

const info = {
  tag: 'Solar Panel Basic',
  desc: 'Generates power',
  className: 'solar module',
  cost: 35,
  power: 10,
  w: 108,
  h: 2,
  d: 52,
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
  this.level = 1;
  this.maxLevel = 3;

  Module.call(this, { x, y, z, rx, ry, rz, ...info });
}

Object.assign(Solar, info);
Solar.prototype = Object.create(Module.prototype);
Solar.prototype.constructor = Solar;

Solar.prototype.instancesBuilt = 0;

Solar.prototype.upgrade = function () {
  // Disable the re-enable to update resource bar numbers
  this.disable();
  this.level++;
  this.power = info.power * this.level;
  // TODO: Do we want to add some time while upgrading before re-enabling?
  this.enable();
  this.model.changeSize({ w: info.w * this.level });

  const shape = this.connectedTo.parent;

  // Side rotated with shape's rotation
  const sideRotated = new Vec3(this.connectedTo.x, this.connectedTo.y, this.connectedTo.z)
    .rotateX(shape.rx)
    .rotateY(shape.ry)
    .rotateZ(shape.rz);

  // Half model width in direction of side
  const sideResized = sideRotated.resize(this.model.w * 0.5);

  this.model.x = shape.x + sideRotated.x + sideResized.x;
  this.model.y = shape.y + sideRotated.y + sideResized.y;
  this.model.z = shape.z + sideRotated.z + sideResized.z;
};

Solar.prototype.build = function () {
  Module.prototype.build.call(this);
  Solar.prototype.instancesBuilt++;
};
