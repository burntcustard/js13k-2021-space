import Shape from './shape';
import Face from './face';

export default class Pyramid extends Shape {
  constructor(props) {
    super({ ...props, className: 'pyramid' });

    const hypotenuse = Math.hypot(this.w / 2, this.h);
    const angle = Math.atan2(this.h * 2, this.w) * -1;

    this.sides = [
      new Face({
        w: this.w,
        h: hypotenuse,
        x: 0,
        y: this.w - hypotenuse,
        rx: angle,
        className: 'tri',
      }),
      new Face({
        w: this.w,
        h: hypotenuse,
        x: this.w / 2,
        y: this.w / 2 - hypotenuse,
        rx: angle,
        rz: Math.PI / -2,
        className: 'tri',
      }),
      new Face({
        w: this.w,
        h: hypotenuse,
        x: 0,
        y: -hypotenuse,
        rx: angle,
        rz: Math.PI,
        className: 'tri',
      }),
      new Face({
        w: this.w,
        h: hypotenuse,
        x: this.w / -2,
        y: this.w / 2 - hypotenuse,
        rx: angle,
        rz: Math.PI / 2,
        className: 'tri',
      }),
    ];

    // this.element.append(this.sides.map((s) => s.element));
    this.element.append(...this.sides.map((side) => side.element));

    super.update();
  }
}
