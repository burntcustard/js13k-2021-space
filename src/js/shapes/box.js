import Shape from './shape';
import Face from './face';
import { PI_2 } from '../util';
import Vec3 from '../vec3';

export default class Box extends Shape {
  /**
   * Create a box.
   * Depth default to width if ommitted.
   * @param {*} properties
   */
  constructor({ w, d = w, h, x, y, z, rx, ry, rz, classNames = [] }) {
    super({ w, d, h, x, y, z, rx, ry, rz, className: `box ${classNames[0] ?? ''}` });

    this.sides = [
      new Face({
        w,
        h: d,
        x: w * -0.5,
        y: d * -1.5,
        z: h * -0.5,
        rx: Math.PI,
        colour: new Vec3(1, 1, 1),
        className: classNames[1],
      }),
      new Face({
        w,
        h,
        x: w * -0.5,
        y: d * 0.5 - h,
        z: h * -0.5,
        rx: -PI_2,
        colour: new Vec3(1, 1, 1),
        className: classNames[2],
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
        className: classNames[3],
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
        className: classNames[4],
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
        className: classNames[5],
      }),
      new Face({
        w,
        h: d,
        x: w * -0.5,
        y: d * -0.5,
        z: h * 0.5,
        colour: new Vec3(1, 1, 1),
        className: classNames[6],
      }),
    ];

    this.element.append(...this.sides.map((side) => side.element));
    super.update();
  }
}
