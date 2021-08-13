import Shape from './shape';
import Face from './face';
import { halfPi, thirdPi } from '../util';

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
        rx: -halfPi,
      }),
      new Face({
        w: faceWidth,
        h: this.h,
        x: 0.866 * props.radius + 0.5 * faceWidth,
        y: 1.5 * props.radius - this.h,
        rx: -halfPi,
        rz: -thirdPi,
      }),
      new Face({
        w: faceWidth,
        h: this.h,
        x: 0.866 * props.radius + 0.5 * faceWidth,
        y: 0.5 * props.radius - this.h,
        rx: -halfPi,
        rz: -2 * thirdPi,
      }),
      new Face({
        w: faceWidth,
        h: this.h,
        x: 0.5 * faceWidth,
        y: -this.h,
        rx: -halfPi,
        rz: -3 * thirdPi,
      }),
      new Face({
        w: faceWidth,
        h: this.h,
        x: -0.866 * props.radius + 0.5 * faceWidth,
        y: 0.5 * props.radius - this.h,
        rx: -halfPi,
        rz: -4 * thirdPi,
      }),
      new Face({
        w: faceWidth,
        h: this.h,
        x: -0.866 * props.radius + 0.5 * faceWidth,
        y: 1.5 * props.radius - this.h,
        rx: -halfPi,
        rz: -5 * thirdPi,
      }),
    ];

    this.element.append(...this.sides.map((side) => side.element));
    super.update();
  }
}
