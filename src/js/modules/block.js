import Module from './module';
import Box from '../shapes/box';
import Build from '../build';

const info = {
  tag: 'Block', // Can't use 'name' because is reserved
  desc: 'Basic building block',
  className: 'block module',
  cost: 10,
  w: 60,
  d: 60,
  h: 60,
};

export default function Block({
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

  // Add buildableness to all the sides of the cube
  this.model.sides.forEach((side) => {
    // TODO: Don't add buildableness to the side touching the existing shape side
    Build.addEventListenersTo(side);
  });
  // TODO: Add hover selecty (not building) even listeners? Or just use :hover?
}

Object.assign(Block, info);
Block.prototype = Object.create(Module.prototype);
Block.prototype.constructor = Block;

Block.prototype.build = function () {
  // TODO: Block build animation
  Module.prototype.build.call(this);
};
