import Shape from './shape';
import Face from './face';
import { PI, PI_2 } from '../util';

/**
 * Create a box with a duplicate set of faces on the "inside".
 * Depth defaults to width if ommitted.
 * @param {*} properties
 */
export default function BoxScaffold({ w, d = w, h, x, y, z, rx, ry, rz, className }) {
  this.className = `${className ?? ''} box`;
  Shape.call(this, { w, d, h, x, y, z, rx, ry, rz, className: this.className });

  const W_2 = w * 0.5;
  const D_2 = d * 0.5;
  const H_2 = h * 0.5;

  this.sides = [
    // Outside
    new Face({
      w: d,
      h,
      x: -W_2,
      rx: -PI_2,
      rz: PI_2,
    }),
    new Face({
      w,
      h: d,
      z: -H_2,
      rx: PI,
    }),
    new Face({
      w,
      h,
      y: D_2,
      rx: -PI_2,
    }),
    new Face({
      w,
      h,
      y: -D_2,
      rx: PI_2,
    }),
    new Face({
      w,
      h: d,
      z: H_2,
    }),
    new Face({
      w: d,
      h,
      x: W_2,
      rx: -PI_2,
      rz: -PI_2,
    }),
    // Inside
    new Face({
      w: d,
      h,
      x: W_2,
      rx: -PI_2,
      rz: PI_2,
    }),
    new Face({
      w,
      h: d,
      z: H_2,
      rx: PI,
    }),
    new Face({
      w,
      h,
      y: -D_2,
      rx: -PI_2,
    }),
    new Face({
      w,
      h,
      y: D_2,
      rx: PI_2,
    }),
    new Face({
      w,
      h: d,
      z: -H_2,
    }),
    new Face({
      w: d,
      h,
      x: -W_2,
      rx: -PI_2,
      rz: -PI_2,
    }),
  ];

  this.sides.forEach((side) => {
    side.parent = this;
  });

  this.element.append(...this.sides.map((side) => side.element));
}

BoxScaffold.prototype = Object.create(Shape.prototype);
BoxScaffold.prototype.constructor = BoxScaffold;
