import Shape from './shape';
import Face from './face';
import { PI, PI_2, PI_4 } from '../util';

export default class Hexagon extends Shape {
  /**
   * Create an octagon prism.
   * Depth defaults to correct length to make the octagon regular if ommitted.
   * @param {*} properties
   */
  constructor({ w, d = w, h, x, y, z, rx, ry, rz }) {
    super({ w, d, h, x, y, z, rx, ry, rz, className: 'octagon' });

    // TODO: Calculation to make this more precise w/o more decimal places
    // TODO: Also all the face x and y coords
    const sideW = w * 0.4132;

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

    this.element.append(...this.sides.map((side) => side.element));
    super.update();
  }
}
