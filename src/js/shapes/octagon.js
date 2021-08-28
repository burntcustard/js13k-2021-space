import Shape from './shape';
import Face from './face';
import { PI, PI_2, PI_4 } from '../util';

/**
 * Create a box.
 * Depth default to width if ommitted.
 * @param {*} properties
 */
export default function Octagon({
  w, d = w, h, x, y, z, rx, ry, rz, className,
}) {
  this.className = `${className ?? ''} octagon`;
  Shape.call(this, { w, d, h, x, y, z, rx, ry, rz, className: this.className });

  const sideW = ((w / 2) / Math.tan((3 * Math.PI) / 8)) * 2;

  this.sides = [
    new Face({
      w,
      h: d,
      x: w * -0.5,
      y: d * -1.5,
      z: h * -0.5,
      rx: PI,
      className: 'oct',
    }),
    new Face({
      w: sideW,
      h,
      x: w * -0.2,
      y: d * 0.5 - h,
      z: h * -0.5,
      rx: -PI_2,
    }),
    new Face({
      w: sideW,
      h,
      x: w * 0.15,
      y: d * 0.35 - h,
      z: h * -0.5,
      rx: -PI_2,
      rz: -PI_4,
    }),
    new Face({
      w: sideW,
      h,
      x: w * 0.3,
      y: -h,
      z: h * -0.5,
      rx: -PI_2,
      rz: -PI_2,
    }),
    new Face({
      w: sideW,
      h,
      x: w * 0.15,
      y: d * -0.35 - h,
      z: h * -0.5,
      rx: -PI_2,
      rz: -PI_2 - PI_4,
    }),
    new Face({
      w: sideW,
      h,
      x: w * -0.2,
      y: d * -0.5 - h,
      z: h * -0.5,
      rx: -PI_2,
      rz: -Math.PI,
    }),
    new Face({
      w: sideW,
      h,
      x: w * -0.55,
      y: d * -0.35 - h,
      z: h * -0.5,
      rx: -PI_2,
      rz: PI_2 + PI_4,
    }),
    new Face({
      w: sideW,
      h,
      x: w * -0.7,
      y: -h,
      z: h * -0.5,
      rx: -PI_2,
      rz: PI_2,
    }),
    new Face({
      w: sideW,
      h,
      x: w * -0.55,
      y: d * 0.35 - h,
      z: h * -0.5,
      rx: -PI_2,
      rz: PI_2 - PI_4,
    }),
    new Face({
      w,
      h: d,
      x: w * -0.5,
      y: d * -0.5,
      z: h * 0.5,
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
