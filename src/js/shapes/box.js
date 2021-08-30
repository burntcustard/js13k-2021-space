import Shape from './shape';
import Face from './face';
import { PI_2 } from '../util';

/**
 * Create a box.
 * Depth defaults to width if ommitted.
 * @param {*} properties
 */
export default function Box({ w, d = w, h, x, y, z, rx, ry, rz, className }) {
  this.className = `${className ?? ''} box`;
  Shape.call(this, { w, d, h, x, y, z, rx, ry, rz, className: this.className });

  const W_2 = w * 0.5;
  const D_2 = d * 0.5;
  const H_2 = h * 0.5;

  this.sides = [
    new Face({
      w,
      h: d,
      x: -W_2,
      y: -D_2,
      z: -H_2,
      rx: Math.PI,
    }),
    new Face({
      w,
      h,
      x: -W_2,
      y: D_2 - H_2,
      rx: -PI_2,
    }),
    new Face({
      w: d,
      h,
      x: W_2 - D_2,
      y: -H_2,
      rx: -PI_2,
      rz: -PI_2,
    }),
    new Face({
      w,
      h,
      x: -W_2,
      y: -D_2 - H_2,
      rx: -PI_2,
      rz: Math.PI,
    }),
    new Face({
      w: d,
      h,
      x: -W_2 - D_2,
      y: -H_2,
      rx: -PI_2,
      rz: PI_2,
    }),
    new Face({
      w,
      h: d,
      x: -W_2,
      y: -D_2,
      z: H_2,
    }),
  ];
  this.element.append(...this.sides.map((side) => side.element));
}

Box.prototype = Object.create(Shape.prototype);
Box.prototype.constructor = Box;
