import Shape from './shape';
import Face from './face';
import { PI, PI_2 } from '../util';

/**
 * Create a box.
 * Depth defaults to width if ommitted.
 * @param {*} properties
 */
export default function BoxVisibleInner({
  w, d = w, h, x, y, z, rx, ry, rz, className, wallThickness = 8, middleWallOffset = 0,
}) {
  this.className = `${className ?? ''} box box-visible-inner`;
  Shape.call(this, { w, d, h, x, y, z, rx, ry, rz, className: this.className });

  const W_2 = w * 0.5;
  const D_2 = d * 0.5;
  const H_2 = h * 0.5;

  this.sides = [
    new Face({
      w: d,
      h,
      x: -W_2,
      rx: -PI_2,
      rz: PI_2,
    }),
    // Bottom
    new Face({
      w,
      h: d,
      z: -H_2,
      rx: PI,
    }),
    // Left
    new Face({
      w,
      h,
      y: D_2,
      rx: -PI_2,
    }),
    // Right
    new Face({
      w,
      h,
      y: -D_2,
      rx: PI_2,
    }),
    // Top
    new Face({
      w,
      h: d,
      z: H_2,
    }),
    // Back wall
    new Face({
      w: d - wallThickness * 2,
      h: h - wallThickness * 2,
      x: -W_2 + wallThickness,
      rx: PI_2,
      rz: PI_2,
    }),
    new Face({
      w: d - wallThickness * 2,
      h: h - wallThickness * 2,
      x: W_2 - middleWallOffset, // Center
      rx: PI_2,
      rz: PI_2,
    }),
    new Face({
      w: d,
      h: wallThickness,
      x: W_2,
      z: H_2 - wallThickness / 2,
      rx: PI_2,
      rz: PI_2,
    }),
    new Face({
      w: d,
      h: wallThickness,
      x: W_2,
      z: -H_2 + wallThickness / 2,
      rx: PI_2,
      rz: PI_2,
    }),
    new Face({
      w: wallThickness,
      h,
      x: W_2,
      y: -D_2 + wallThickness / 2,
      rx: PI_2,
      rz: PI_2,
    }),
    new Face({
      w: wallThickness,
      h,
      x: W_2,
      y: D_2 - wallThickness / 2,
      rx: PI_2,
      rz: PI_2,
    }),
    new Face({
      w,
      h: d,
      z: H_2 - wallThickness,
      rx: PI,
    }),
    new Face({
      w,
      h,
      y: -D_2 + wallThickness,
      rx: -PI_2,
    }),
    new Face({
      w,
      h,
      y: D_2 - wallThickness,
      rx: PI_2,
    }),
    new Face({
      w,
      h: d,
      z: -H_2 + wallThickness,
    }),
  ];

  this.sides.forEach((side) => {
    side.parent = this;
  });

  this.element.append(...this.sides.map((side) => side.element));
}

BoxVisibleInner.prototype = Object.create(Shape.prototype);
BoxVisibleInner.prototype.constructor = BoxVisibleInner;
