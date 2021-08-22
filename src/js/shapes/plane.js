import { PI_2 } from '../util';
import Face from './face';
import Shape from './shape';

export default class Plane extends Shape {
  constructor(props) {
    super(props);

    this.sides = [
      new Face({
        w: this.w,
        h: this.h,
        x: this.w * -0.5,
        y: this.h * -0.5,
        rx: -PI_2,
      }),
    ];

    this.element.append(...this.sides.map((side) => side.element));
    super.update();
  }
}
