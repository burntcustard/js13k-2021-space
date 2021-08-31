/* eslint-disable camelcase */

import Shape from './shape';
import Face from './face';
import { PI, PI3_4, PI_2, PI_4, PI_8 } from '../util';

/**
 * Create a regular octagon.
 * @param {*} properties
 */
export default function Octagon({ w, h, x, y, z, rx, ry, rz, className }) {
  this.className = `${className ?? ''} octagon`;
  Shape.call(this, { w, d: w, h, x, y, z, rx, ry, rz, className: this.className });

  const W_2 = w * 0.5;
  const H_2 = h * 0.5;

  const sideW = w * Math.tan(PI_8);
  const sideOffset = W_2 * Math.sin(PI_4);

  this.sides = [
    new Face({
      w,
      h: w,
      z: -H_2,
      rx: PI,
      className: 'oct',
    }),
    new Face({
      w: sideW,
      h,
      y: W_2,
      rx: -PI_2,
    }),
    new Face({
      w: sideW,
      h,
      x: sideOffset,
      y: sideOffset,
      rx: -PI_2,
      rz: -PI_4,
    }),
    new Face({
      w: sideW,
      h,
      x: W_2,
      rx: -PI_2,
      rz: -PI_2,
    }),
    new Face({
      w: sideW,
      h,
      x: sideOffset,
      y: -sideOffset,
      rx: -PI_2,
      rz: -PI3_4,
    }),
    new Face({
      w: sideW,
      h,
      y: -W_2,
      rx: -PI_2,
      rz: -PI,
    }),
    new Face({
      w: sideW,
      h,
      x: -sideOffset,
      y: -sideOffset,
      rx: -PI_2,
      rz: PI3_4,
    }),
    new Face({
      w: sideW,
      h,
      x: -W_2,
      rx: -PI_2,
      rz: PI_2,
    }),
    new Face({
      w: sideW,
      h,
      x: -sideOffset,
      y: sideOffset,
      rx: -PI_2,
      rz: PI_4,
    }),
    new Face({
      w,
      h: w,
      z: H_2,
      className: 'oct',
    }),
  ];
  // TODO: Set octagon face clip-path in JS so it can be precise
  // this.sides[0].element.style.clipPath = `polygon(
  //   29.34% 0, 70.66% 0, 100% 29.34%, 100% 70.66%, 70.66% 100%, 29.34% 100%, 0 70.66%, 0 29.34%
  // )`;
  this.element.append(...this.sides.map((side) => side.element));
}

Octagon.prototype = Object.create(Shape.prototype);
Octagon.prototype.constructor = Octagon;
