import Shape from './shape';
import Face from './face';
import { toRad } from '../util';
import Vec3 from '../vec3';

export default class Box extends Shape {
  constructor(props) {
    super({ ...props, className: 'box' });

    this.sides = [
      new Face({
        w: this.w,
        h: this.d,
        z: this.h,
        colour: new Vec3(1, 0, 0),
      }),
      new Face({
        w: this.w,
        h: this.h,
        y: this.d - this.h,
        rx: toRad(-90),
        colour: new Vec3(1, 1, 0),
      }),
      new Face({
        w: this.d,
        h: this.h,
        x: this.w - this.d / 2,
        y: this.d / 2 - this.h,
        rz: toRad(-90),
        rx: toRad(-90),
        colour: new Vec3(0, 1, 0),
      }),
      new Face({
        w: this.w,
        h: this.h,
        y: -this.h,
        rz: toRad(180),
        rx: toRad(-90),
        colour: new Vec3(0, 1, 1),
      }),
      new Face({
        w: this.d,
        h: this.h,
        x: -this.d / 2,
        y: this.d / 2 - this.h,
        rz: toRad(90),
        rx: toRad(-90),
        colour: new Vec3(0, 0, 1),
      }),
      new Face({
        w: this.w,
        h: this.d,
        y: -this.d,
        rx: Math.PI,
        colour: new Vec3(1, 0, 1),
      }),
    ];

    // this.element.append(this.sides.map((s) => s.element));
    this.element.append(...this.sides.map((side) => side.element));

    super.update();
  }
}
