import Shape from './shape';
import Face from './face';
import { PI, PI_2 } from '../util';

const ratio = Math.sqrt(3) / 2;

export default class Hexagon extends Shape {
  /**
   * Create a hexagon.
   * Depth defaults to correct length to make the hexagon regular if ommitted.
   * @param {*} properties
   */
  constructor({ w, d = w * ratio, h, x, y, z, rx, ry, rz }) {
    super({ w, d, h, x, y, z, rx, ry, rz, className: 'hexagonandonandon' });

    const W_2 = w * 0.5;
    const W_4 = w * 0.25;
    const W_8 = w * 0.125;
    const D_2 = d * 0.5;
    const D_4 = d * 0.25;
    const H_2 = h * 0.5;

    const sideW = Math.hypot(w * 0.25, d * 0.5);
    const sideRotation = Math.atan((2 * d) / w);

    this.sides = [
      new Face({
        w,
        h: d,
        z: -H_2,
        rx: PI,
        className: 'hex',
      }),
      new Face({
        w: W_2,
        h,
        y: D_2,
        rx: -PI_2,
      }),
      new Face({
        w: sideW,
        h,
        x: W_4 + W_8,
        y: D_4,
        rx: -PI_2,
        rz: -sideRotation,
      }),
      new Face({
        w: sideW,
        h,
        x: W_4 + W_8,
        y: -D_4,
        rx: -PI_2,
        rz: Math.PI + sideRotation,
      }),
      new Face({
        w: W_2,
        h,
        y: -D_2,
        rx: -PI_2,
        rz: Math.PI,
      }),
      new Face({
        w: sideW,
        h,
        x: -W_4 - W_8,
        y: -D_4,
        rx: -PI_2,
        rz: Math.PI - sideRotation,
      }),
      new Face({
        w: sideW,
        h,
        x: -W_4 - W_8,
        y: D_4,
        rx: -PI_2,
        rz: sideRotation,
      }),
      new Face({
        w,
        h: d,
        z: H_2,
        className: 'hex',
      }),
    ];

    this.sides.forEach((side) => {
      side.parent = this;
    });

    this.element.append(...this.sides.map((side) => side.element));
    super.update();
  }
}
