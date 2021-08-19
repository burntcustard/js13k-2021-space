import Shape from './shape';
import Face from './face';
import { PI_2, PI_3 } from '../util';

export default class Hexagon extends Shape {
  constructor(props) {
    const faceWidth = 1.155 * props.radius;

    super({
      ...props,
      w: 2 * faceWidth,
      d: 2 * props.radius,
      className: 'hexagonandonandon',
    });

    // TODO: Convert these magic numbers back into their trig equivalents
    this.sides = [
      new Face({
        w: this.w,
        h: this.d,
        z: this.h,
        className: 'hex',
      }),
      new Face({
        w: faceWidth,
        h: this.h,
        x: 0.5 * faceWidth,
        y: 2 * props.radius - this.h,
        rx: -PI_2,
      }),
      new Face({
        w: faceWidth,
        h: this.h,
        x: 0.866 * props.radius + 0.5 * faceWidth,
        y: 1.5 * props.radius - this.h,
        rx: -PI_2,
        rz: -PI_3,
      }),
      new Face({
        w: faceWidth,
        h: this.h,
        x: 0.866 * props.radius + 0.5 * faceWidth,
        y: 0.5 * props.radius - this.h,
        rx: -PI_2,
        rz: -2 * PI_3,
      }),
      new Face({
        w: faceWidth,
        h: this.h,
        x: 0.5 * faceWidth,
        y: -this.h,
        rx: -PI_2,
        rz: -3 * PI_3,
      }),
      new Face({
        w: faceWidth,
        h: this.h,
        x: -0.866 * props.radius + 0.5 * faceWidth,
        y: 0.5 * props.radius - this.h,
        rx: -PI_2,
        rz: -4 * PI_3,
      }),
      new Face({
        w: faceWidth,
        h: this.h,
        x: -0.866 * props.radius + 0.5 * faceWidth,
        y: 1.5 * props.radius - this.h,
        rx: -PI_2,
        rz: -5 * PI_3,
      }),
    ];

    this.element.append(...this.sides.map((side) => side.element));
    super.update();
  }
}
