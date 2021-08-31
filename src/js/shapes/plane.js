import Face from './face';
import Shape from './shape';

export default class Plane extends Shape {
  constructor({ w, h, x, y, z, rx, ry, rz }) {
    super({ w, h, x, y, z, rx, ry, rz, className: 'plane' });

    this.sides = [
      new Face({
        w,
        h,
        x: w * -0.5,
        y: h * -0.5,
      }),
    ];

    this.element.append(...this.sides.map((side) => side.element));
    super.update();
  }
}
