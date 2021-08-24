import Shape from './shape';
import Face from './face';
import { PI_2 } from '../util';

export default class Cubemap extends Shape {
  /**
   * Create a box.
   * Depth default to width if ommitted.
   * @param {*} properties
   */
  constructor({ w, x, y, z, rx, ry, rz }) {
    super({ w, d: w, h: w, x, y, z, rx, ry, rz, className: 'skybox' });

    this.sides = [
      new Face({
        w,
        h: w,
        x: w * -0.5,
        y: w * -0.5,
        z: w * -0.5,
      }),
      new Face({
        w,
        h: w,
        x: w * -0.5,
        y: w * -0.5,
        z: w * -0.5,
        rx: -PI_2,
        rz: Math.PI,
      }),
      new Face({
        w,
        h: w,
        y: -w,
        z: w * -0.5,
        rx: -PI_2,
        rz: PI_2,
      }),
      new Face({
        w,
        h: w,
        x: w * -0.5,
        y: w * -1.5,
        z: w * -0.5,
        rx: -PI_2,
      }),
      new Face({
        w,
        h: w,
        x: -w,
        y: -w,
        z: w * -0.5,
        rx: -PI_2,
        rz: -PI_2,
      }),
      new Face({
        w,
        h: w,
        x: w * -0.5,
        y: w * -1.5,
        z: w * 0.5,
        rx: Math.PI,
      }),
    ];

    this.element.append(...this.sides.map((side) => side.element));
    this.update();
  }

  update() {
    this.updateTransform();
  }

  updateTransform() {
    const sinRx = Math.sin(this.rx);
    const sinRy = Math.sin(this.ry);
    const sinRz = Math.sin(this.rz);
    const cosRx = Math.cos(this.rx);
    const cosRy = Math.cos(this.ry);
    const cosRz = Math.cos(this.rz);
    this.element.style.transform = `
      translate3D(${this.x}px, ${this.y}px, ${this.z}px)
      matrix3d(
        ${cosRz * cosRy},
        ${sinRz * cosRy},
        ${-sinRy},
        0,
        ${cosRz * sinRy * sinRx - sinRz * cosRx},
        ${sinRz * sinRy * sinRx + cosRz * cosRx},
        ${cosRy * sinRx},
        0,
        ${cosRz * sinRy * cosRx + sinRz * sinRx},
        ${sinRz * sinRy * cosRx - cosRz * sinRx},
        ${cosRy * cosRx},
        0,
        0,
        0,
        0,
        1
      )
      scale3d(10, 10, 10)
    `;
  }
}
