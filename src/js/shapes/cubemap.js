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
  }

  update(camera) {
    this.x = -camera.x;
    this.y = -camera.y;
    this.z = -camera.z;
    this.element.style.transform = `
      translate3D(${this.x}px, ${this.y}px, ${this.z}px)
      rotateX(${this.rx})
      rotateY(${this.ry})
      rotateZ(${this.rz})
      scale3d(100, 100, 100)`;
  }
}
