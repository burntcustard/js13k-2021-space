import Module from './module';
import Box from '../shapes/box';
import Build from '../build';
import achievements from '../achievements';

const info = {
  tag: 'Multi Block', // Can't use 'name' because is reserved
  desc: 'Generates a small amount of ↯ & M',
  className: 'block-multi module',
  cost: 40,
  mats: 0.5,
  power: 10,
  population: 1,
  unlock: () => achievements.population > 39,
  unlockText: 'Reach 40 population',
  w: 60,
  d: 60,
  h: 60,
};

export default function BlockMulti({
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

Object.assign(BlockMulti, info);
BlockMulti.prototype = Object.create(Module.prototype);
BlockMulti.prototype.constructor = BlockMulti;

BlockMulti.prototype.build = function () {
  // TODO: BlockMulti build animation
  Module.prototype.build.call(this);
};
