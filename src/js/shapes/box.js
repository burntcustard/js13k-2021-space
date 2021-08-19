import Shape from './shape';
import Face from './face';
import { PI_2, toRad } from '../util';
import Vec3 from '../vec3';

export default class Box extends Shape {
  constructor(props) {
    super({ ...props, className: 'box' });

    this.sides = [
      // new Face({
      //   w: this.w,
      //   h: this.d,
      //   x: this.w * -0.5,
      //   y: this.d * -1.5,
      //   z: this.h * -0.5,
      //   rx: Math.PI,
      //   colour: new Vec3(1, 1, 1),
      // }),
      // new Face({
      //   w: this.w,
      //   h: this.h,
      //   x: this.w * -0.5,
      //   y: this.d * 0.5 - this.h,
      //   z: this.h * -0.5,
      //   rx: -PI_2,
      //   colour: new Vec3(1, 1, 1),
      // }),
      new Face({
        w: this.d,
        h: this.h,
        y: -this.h,
        z: this.h * -0.5,
        rx: -PI_2,
        rz: -PI_2,
        colour: new Vec3(1, 1, 1),
      }),
      // new Face({
      //   w: this.w,
      //   h: this.h,
      //   x: this.w * -0.5,
      //   y: this.d * -0.5 - this.h,
      //   z: this.h * -0.5,
      //   rx: -PI_2,
      //   rz: Math.PI,
      //   colour: new Vec3(1, 1, 1),
      // }),
      // new Face({
      //   w: this.d,
      //   h: this.h,
      //   x: -this.w,
      //   y: -this.h,
      //   z: this.h * -0.5,
      //   rx: -PI_2,
      //   rz: PI_2,
      //   colour: new Vec3(1, 1, 1),
      // }),
      // new Face({
      //   w: this.w,
      //   h: this.d,
      //   x: this.w * -0.5,
      //   y: this.d * -0.5,
      //   z: this.h * 0.5,
      //   colour: new Vec3(1, 1, 1),
      // }),
    ];

    // this.element.append(this.sides.map((s) => s.element));
    this.element.append(...this.sides.map((side) => side.element));

    super.update();
  }
}
