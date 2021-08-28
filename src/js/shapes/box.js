import Shape from './shape';
import Face from './face';
import { PI_2 } from '../util';
import Vec3 from '../vec3';

/**
 * Create a box.
 * Depth default to width if ommitted.
 * @param {*} properties
 */
export default function Box({
  w, d = w, h, x, y, z, rx, ry, rz, className,
}) {
  this.className = `${className ?? ''} box`;
  Shape.call(this, { w, d, h, x, y, z, rx, ry, rz, className: this.className });
  this.sides = [
    new Face({
      w,
      h: d,
      x: w * -0.5,
      y: d * -1.5,
      z: h * -0.5,
      rx: Math.PI,
      colour: new Vec3(1, 1, 1),
    }),
    new Face({
      w,
      h,
      x: w * -0.5,
      y: d * 0.5 - h,
      z: h * -0.5,
      rx: -PI_2,
      colour: new Vec3(1, 1, 1),
    }),
    new Face({
      w: d,
      h,
      x: w * 0.5 - d * 0.5,
      y: -h,
      z: h * -0.5,
      rx: -PI_2,
      rz: -PI_2,
      colour: new Vec3(1, 1, 1),
    }),
    new Face({
      w,
      h,
      x: w * -0.5,
      y: d * -0.5 - h,
      z: h * -0.5,
      rx: -PI_2,
      rz: Math.PI,
      colour: new Vec3(1, 1, 1),
    }),
    new Face({
      w: d,
      h,
      x: w * -0.5 - d * 0.5,
      y: -h,
      z: h * -0.5,
      rx: -PI_2,
      rz: PI_2,
      colour: new Vec3(1, 1, 1),
    }),
    new Face({
      w,
      h: d,
      x: w * -0.5,
      y: d * -0.5,
      z: h * 0.5,
      colour: new Vec3(1, 1, 1),
    }),
  ];
  this.element.append(...this.sides.map((side) => side.element));
}

Box.prototype = Object.create(Shape.prototype);
Box.prototype.constructor = Box;
