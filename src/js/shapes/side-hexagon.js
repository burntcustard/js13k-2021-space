import Shape from './shape';
import Face from './face';
import { PI, PI_2 } from '../util';

const ratio = Math.sqrt(3) / 2;

export default class SideHexagon extends Shape {
  /**
   * Create a hexagon.
   * Depth defaults to correct length to make the hexagon regular if ommitted.
   * @param {*} properties
   */
  constructor({ w, d, h = d * ratio, x, y, z, rx, ry, rz }) {
    super({ w, d, h, x, y, z, rx, ry, rz, className: 'hexagonandonandon' });

    const W_2 = w * 0.5;
    const D_2 = d * 0.5;
    const D_4 = d * 0.25;
    const D_8 = d * 0.125;
    const H_2 = h * 0.5;
    const H_4 = h * 0.25;

    const sideHeight = Math.hypot(d * 0.25, h * 0.5);
    const sideRotation = Math.atan((2 * h) / d);

    this.sides = [
      new Face({
        w: d,
        h,
        x: W_2,
        rx: -PI_2,
        rz: -PI_2,
        className: 'hex',
      }),
      new Face({
        w,
        h: D_2,
        z: -H_2,
        rx: PI,
      }),
      new Face({
        w,
        h: sideHeight,
        y: -D_4 - D_8,
        z: -H_4,
        rx: PI - sideRotation,
      }),
      new Face({
        w,
        h: sideHeight,
        y: -D_4 - D_8,
        z: H_4,
        rx: sideRotation,
      }),
      new Face({
        w,
        h: D_2,
        z: H_2,
      }),
      new Face({
        w,
        h: sideHeight,
        y: D_4 + D_8,
        z: H_4,
        rx: -sideRotation,
      }),
      new Face({
        w,
        h: sideHeight,
        y: D_4 + D_8,
        z: -H_4,
        rx: PI + sideRotation,
      }),
      new Face({
        w: d,
        h,
        x: -W_2,
        rx: -PI_2,
        rz: PI_2,
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
