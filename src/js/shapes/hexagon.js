import Shape from './shape';
import Face from './face';
import { PI_2 } from '../util';

export default class Hexagon extends Shape {
  constructor({ w, d, h, x, y, z, rx, ry, rz }) {
    super({ w, d, h, x, y, z, rx, ry, rz, className: 'hexagonandonandon' });

    this.sides = [
      new Face({
        w,
        h: d,
        x: w * -0.5,
        y: d * -1.5,
        z: h * -0.5,
        rx: Math.PI,
        className: 'hex',
      }),
      new Face({
        w: w * 0.5,
        h,
        x: w * -0.25,
        y: d * 0.5 - h,
        z: h * -0.5,
        rx: -PI_2,
      }),
      new Face({
        w: Math.hypot(w * 0.25, d * 0.5),
        h,
        x: w * 0.375 - Math.hypot(w * 0.25, d * 0.5) * 0.5,
        y: d * 0.25 - h,
        z: h * -0.5,
        rx: -PI_2,
        rz: -Math.atan((2 * d) / w),
      }),
      new Face({
        w: Math.hypot(w * 0.25, d * 0.5),
        h,
        x: w * 0.375 - Math.hypot(w * 0.25, d * 0.5) * 0.5,
        y: d * -0.25 - h,
        z: h * -0.5,
        rx: -PI_2,
        rz: -Math.PI + Math.atan((2 * d) / w),
      }),
      new Face({
        w: w * 0.5,
        h,
        x: w * -0.25,
        y: d * -0.5 - h,
        z: h * -0.5,
        rx: -PI_2,
        rz: Math.PI,
      }),
      new Face({
        w: Math.hypot(w * 0.25, d * 0.5),
        h,
        x: w * -0.375 - Math.hypot(w * 0.25, d * 0.5) * 0.5,
        y: d * -0.25 - h,
        z: h * -0.5,
        rx: -PI_2,
        rz: Math.PI - Math.atan((2 * d) / w),
      }),
      new Face({
        w: Math.hypot(w * 0.25, d * 0.5),
        h,
        x: w * -0.375 - Math.hypot(w * 0.25, d * 0.5) * 0.5,
        y: d * 0.25 - h,
        z: h * -0.5,
        rx: -PI_2,
        rz: Math.atan((2 * d) / w),
      }),
      new Face({
        w,
        h: d,
        x: w * -0.5,
        y: d * -0.5,
        z: h * 0.5,
        className: 'hex',
      }),
    ];

    this.element.append(...this.sides.map((side) => side.element));
    super.update();
  }
}
