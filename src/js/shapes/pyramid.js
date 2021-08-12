import Shape from './shape';
import Rect from './rect';

export default class Pyramid extends Shape {
  constructor(props) {
    super(props);

    this.element.className = 'pyramid';

    const hypotenuse = Math.hypot(this.w / 2, this.h);
    this.a = Math.atan2(this.h * 2, this.w) * -1;

    this.sides = [
      new Rect({
        w: this.w,
        h: hypotenuse,
        x: 0,
        y: this.w - hypotenuse,
        rx: this.a,
      }),
      new Rect({
        w: this.w,
        h: hypotenuse,
        x: this.w / 2,
        y: this.w / 2 - hypotenuse,
        rx: this.a,
        rz: Math.PI / -2,
      }),
      new Rect({
        w: this.w,
        h: hypotenuse,
        x: 0,
        y: -hypotenuse,
        rx: this.a,
        rz: Math.PI,
      }),
      new Rect({
        w: this.w,
        h: hypotenuse,
        x: this.w / -2,
        y: this.w / 2 - hypotenuse,
        rx: this.a,
        rz: Math.PI / 2,
      }),
    ];

    // this.element.append(this.sides.map((s) => s.element));
    this.element.append(...this.sides.map((side) => side.element));

    super.update();
  }
}
