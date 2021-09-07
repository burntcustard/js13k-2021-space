import Shape from './shape';
import Face from './face';
import { PI, PI_2 } from '../util';

/**
 * Create a box.
 * Depth defaults to width if ommitted.
 * @param {*} properties
 */
export default function Box({ w, d = w, h, x, y, z, rx, ry, rz, className }) {
  this.className = `${className ?? ''} box`;
  Shape.call(this, { w, d, h, x, y, z, rx, ry, rz, className: this.className });

  const W_2 = w * 0.5;
  const D_2 = d * 0.5;
  const H_2 = h * 0.5;

  this.sides = [
    new Face({
      w: d,
      h,
      x: -W_2,
      rx: -PI_2,
      rz: PI_2,
    }),
    new Face({
      w,
      h: d,
      z: -H_2,
      rx: PI,
    }),
    new Face({
      w,
      h,
      y: D_2,
      rx: -PI_2,
    }),
    new Face({
      w,
      h,
      y: -D_2,
      rx: PI_2,
    }),
    new Face({
      w,
      h: d,
      z: H_2,
    }),
    new Face({
      w: d,
      h,
      x: W_2,
      rx: -PI_2,
      rz: -PI_2,
    }),
  ];

  this.sides.forEach((side) => {
    side.parent = this;
  });

  this.element.append(...this.sides.map((side) => side.element));
}

Box.prototype = Object.create(Shape.prototype);
Box.prototype.constructor = Box;

Box.prototype.changeSize = function ({ w, d, h, x, y, z }) {
  this.x = x ?? this.x;
  this.y = y ?? this.y;
  this.z = z ?? this.z;
  this.w = w = w ?? this.w;
  this.d = d = d ?? this.d;
  this.h = h = h ?? this.h;

  const W_2 = w * 0.5;
  const D_2 = d * 0.5;
  const H_2 = h * 0.5;

  this.sides[0].w = d;
  this.sides[0].h = h;
  this.sides[0].x = -W_2;

  this.sides[1].w = w;
  this.sides[1].h = d;
  this.sides[1].z = -H_2;

  this.sides[2].w = w;
  this.sides[2].h = h;
  this.sides[2].y = D_2;

  this.sides[3].w = w;
  this.sides[3].h = h;
  this.sides[3].y = -D_2;

  this.sides[4].w = w;
  this.sides[4].h = d;
  this.sides[4].z = H_2;

  this.sides[5].w = d;
  this.sides[5].h = h;
  this.sides[5].x = W_2;

  this.sides.forEach((side) => {
    side.setSize();
    side.updateTransform();
  });
};
