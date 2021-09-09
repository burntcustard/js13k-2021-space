import Module from './module';
import BoxScaffold from '../shapes/box-scaffold';
import Build from '../build';

const info = {
  tag: 'Scaffold', // Can't use 'name' because is reserved
  desc: 'Alternative to the Block module',
  className: 'scaffold module',
  cost: 10,
  w: 60,
  d: 60,
  h: 60,
};

export default function Scaffold({
  x, y, z, rx, ry, rz,
}) {
  this.model = new BoxScaffold({
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

Object.assign(Scaffold, info);
Scaffold.prototype = Object.create(Module.prototype);
Scaffold.prototype.constructor = Scaffold;

Scaffold.prototype.build = function () {
  // TODO: Block build animation
  Module.prototype.build.call(this);
};
