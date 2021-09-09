import Shape from './shape';
import Face from './face';
import { PI, PI_2 } from '../util';

/**
 * Create a box.
 * Depth defaults to width if ommitted.
 * @param {*} properties
 */
export default function Sidewinder({ w, d, h, x, y, z, rx, ry, rz, className }) {
  this.className = `${className ?? ''} ship`;
  Shape.call(this, { w, d, h, x, y, z, rx, ry, rz, className: this.className });

  const W_2 = w / 2;
  const W_4 = w / 4;
  const D_2 = d / 2;
  // const H_2 = h * 0.5;

  this.sides = [
    // Top
    new Face({
      w: W_2,
      h: d,
      z: 2,
      rx: -0.2,
      rz: -PI,
      className: 'tri',
    }),
    // Top left
    new Face({
      w: W_2,
      h: d,
      z: 1,
      x: -W_4,
      ry: -0.2,
      rx: 0.1,
      className: 'tri',
    }),
    // Top right
    new Face({
      w: W_2,
      h: d,
      z: 1,
      x: W_4,
      ry: 0.2,
      rx: 0.1,
      className: 'tri',
    }),
    // Bottom
    new Face({
      w: W_2,
      h: d,
      z: -2,
      ry: PI,
      rx: -0.2,
      rz: -PI,
      className: 'tri',
    }),
    // Bottom left
    new Face({
      w: W_2,
      h: 20,
      z: -1,
      x: -W_4,
      ry: PI + 0.2,
      rx: 0.1,
      className: 'tri',
    }),
    // Bottom right
    new Face({
      w: W_2,
      h: 20,
      z: -1,
      x: W_4,
      ry: PI - 0.2,
      rx: 0.1,
      className: 'tri',
    }),
    // Rear
    new Face({
      w,
      h: 8,
      y: D_2,
      rx: -PI_2,
      className: 'dia',
    }),
  ];

  this.sides.forEach((side) => {
    side.parent = this;
    // side.element.style.backfaceVisibility = 'visible';
  });

  this.element.append(...this.sides.map((side) => side.element));
}

Sidewinder.prototype = Object.create(Shape.prototype);
Sidewinder.prototype.constructor = Sidewinder;
