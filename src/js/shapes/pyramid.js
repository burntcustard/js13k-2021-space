import Shape from './shape';
import Face from './face';
import { PI_2 } from '../util';

export default class Pyramid extends Shape {
  constructor({ w, d, h, x, y, z, rx, ry, rz }) {
    super({
      w,
      d,
      h,
      x,
      y,
      z,
      rx,
      ry,
      rz,
      className: 'pyramid',
    });

    const wHypot = Math.hypot(w * 0.5, h);
    const dHypot = Math.hypot(d * 0.5, h);
    const wAngle = -Math.atan2(h * 2, w);
    const dAngle = -Math.atan2(h * 2, d);

    this.sides = [
      new Face({
        w,
        h: d,
        x: w * -0.5,
        y: d * -1.5,
        z: h * -0.5,
        rx: Math.PI,
      }),
      new Face({
        w,
        h: dHypot,
        x: w * -0.5,
        y: d * 0.5 - dHypot,
        z: h * -0.5,
        rx: dAngle,
        className: 'tri',
      }),
      new Face({
        w: d,
        h: wHypot,
        x: w * 0.5 - d * 0.5,
        y: -wHypot,
        z: h * -0.5,
        rx: wAngle,
        rz: -PI_2,
        className: 'tri',
      }),
      new Face({
        w,
        h: dHypot,
        x: w * -0.5,
        y: d * -0.5 - dHypot,
        z: h * -0.5,
        rx: dAngle,
        rz: Math.PI,
        className: 'tri',
      }),
      new Face({
        w: d,
        h: wHypot,
        x: w * -0.5 - d * 0.5,
        y: -wHypot,
        z: h * -0.5,
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
