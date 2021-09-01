/* eslint-disable camelcase */

import Shape from './shape';
import Face from './face';
import { PI_2 } from '../util';

export default class Pyramid extends Shape {
  /**
   * Create a pyramid.
   * Depth defaults to width if ommitted.
   * @param {*} properties
   */
  constructor({ w, d = w, h, x, y, z, rx, ry, rz }) {
    super({ w, d, h, x, y, z, rx, ry, rz, className: 'pyramid' });

    const W_4 = w * 0.25;
    const D_4 = d * 0.25;
    const H_2 = h * 0.5;

    const wHypot = Math.hypot(w * 0.5, h);
    const dHypot = Math.hypot(d * 0.5, h);
    const wAngle = -Math.atan2(h * 2, w);
    const dAngle = -Math.atan2(h * 2, d);

    this.sides = [
      new Face({
        w,
        h: d,
        z: -H_2,
        rx: Math.PI,
      }),
      new Face({
        w,
        h: dHypot,
        y: D_4,
        rx: dAngle,
        className: 'tri',
      }),
      new Face({
        w: d,
        h: wHypot,
        x: W_4,
        rx: wAngle,
        rz: -PI_2,
        className: 'tri',
      }),
      new Face({
        w,
        h: dHypot,
        y: -D_4,
        rx: dAngle,
        rz: Math.PI,
        className: 'tri',
      }),
      new Face({
        w: d,
        h: wHypot,
        x: -W_4,
        rx: wAngle,
        rz: PI_2,
        className: 'tri',
      }),
    ];

    // this.element.append(this.sides.map((s) => s.element));
    this.element.append(...this.sides.map((side) => side.element));

    super.update();
  }
}
