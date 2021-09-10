/* eslint-disable camelcase */
import Shape from './shape';
import Face from './face';
import { PI, PI_2, PI_3 } from '../util';

const ratio = Math.sqrt(3) / 2;

export default function HexRing({
  baseW, baseD, baseH = baseD * ratio, w, d, h = d * ratio, x, y, z, rx, ry, rz, className,
}) {
  this.className = `${className ?? ''} hex-ring`;
  Shape.call(this, { w, d: w, h, x, y, z, rx, ry, rz, className: this.className });

  const baseW_2 = baseW * 0.5;
  const baseD_2 = baseD * 0.5;
  const baseD_4 = baseD * 0.25;
  const baseD_8 = baseD * 0.125;
  const baseH_2 = baseH * 0.5;
  const baseH_4 = baseH * 0.25;
  const baseSideHeight = Math.hypot(baseD * 0.25, baseH * 0.5);

  const thickness = w;
  const xyThickness = thickness / Math.sqrt(2); // Inverse pythagoras (?)
  const W_2 = w * 0.5;
  const D_2 = d * 0.5;
  const D_4 = d * 0.25;
  const D_8 = d * 0.125;
  const H_2 = h * 0.5;
  const H_4 = h * 0.25;
  const sideHeight = Math.hypot(d * 0.25, h * 0.5);
  const sideRotation = Math.atan((2 * h) / d);

  const beamThickness = baseW / 6;

  this.sides = [
    // base/center hexagon
    new Face({
      w: baseD,
      h: baseH,
      x: baseW_2,
      rx: -PI_2,
      rz: -PI_2,
      className: 'hex',
    }),
    new Face({
      w: baseW,
      h: baseD_2,
      z: -baseH_2,
      rx: PI,
    }),
    new Face({
      w: baseW,
      h: baseSideHeight,
      y: -baseD_4 - baseD_8,
      z: -baseH_4,
      rx: PI - sideRotation,
    }),
    new Face({
      w: baseW,
      h: baseSideHeight,
      y: -baseD_4 - baseD_8,
      z: baseH_4,
      rx: sideRotation,
    }),
    new Face({
      w: baseW,
      h: baseD_2,
      z: baseH_2,
    }),
    new Face({
      w: baseW,
      h: baseSideHeight,
      y: baseD_4 + baseD_8,
      z: baseH_4,
      rx: -sideRotation,
    }),
    new Face({
      w: baseW,
      h: baseSideHeight,
      y: baseD_4 + baseD_8,
      z: -baseH_4,
      rx: PI + sideRotation,
    }),
    new Face({
      w: baseD,
      h: baseH,
      x: -baseW_2,
      rx: -PI_2,
      rz: PI_2,
      className: 'hex',
    }),

    // Rod support beam boxes
    new Face({
      w: beamThickness,
      h: h - thickness * 2,
      x: -beamThickness / 2,
      rx: -PI_2,
      rz: PI_2,
    }),
    new Face({
      w: beamThickness,
      h: h - thickness * 2,
      y: beamThickness / 2,
      rx: -PI_2,
    }),
    new Face({
      w: beamThickness,
      h: h - thickness * 2,
      y: -beamThickness / 2,
      rx: PI_2,
    }),
    new Face({
      w: beamThickness,
      h: h - thickness * 2,
      x: beamThickness / 2,
      rx: -PI_2,
      rz: -PI_2,
    }),

    new Face({
      w: beamThickness,
      h: h - thickness * 2,
      x: -beamThickness / 2,
      rx: -PI_2,
      rz: PI_2,
      ry: PI_3,
    }),
    new Face({
      w: beamThickness,
      h: h - thickness * 2,
      x: beamThickness / 2,
      rz: PI_2,
      rx: PI_2,
      // rz: PI_2,
      ry: PI_3,
    }),
    new Face({
      w: beamThickness,
      h: h - thickness * 2,
      y: beamThickness,
      rx: PI_3 / 2,
    }),
    new Face({
      w: beamThickness,
      h: h - thickness * 2,
      // x: beamThickness / 2,
      y: -beamThickness,
      // rx: -PI_2,
      // rz: -PI_2,
      rx: PI_3 / 2,
    }),

    // Right side
    new Face({
      w: d,
      h,
      x: W_2,
      rx: -PI_2,
      rz: -PI_2,
      className: 'hex-cut',
    }),

    // Inner ring
    new Face({
      w,
      h: D_2,
      z: -H_2 + thickness,
      rx: PI,
      ry: PI,
    }),
    new Face({
      w,
      h: sideHeight,
      y: -D_4 - D_8 + xyThickness,
      z: -H_4 + xyThickness,
      rx: -sideRotation,
    }),
    new Face({
      w,
      h: sideHeight,
      y: -D_4 - D_8 + xyThickness,
      z: H_4 - xyThickness,
      rx: -PI + sideRotation,
    }),
    new Face({
      w,
      h: D_2,
      z: H_2 - thickness,
      rx: PI,
    }),
    new Face({
      w,
      h: sideHeight,
      y: D_4 + D_8 - xyThickness,
      z: H_4 - xyThickness,
      rx: PI - sideRotation,
    }),
    new Face({
      w,
      h: sideHeight,
      y: D_4 + D_8 - xyThickness,
      z: -H_4 + xyThickness,
      rx: sideRotation,
    }),

    // Outer ring
    new Face({
      w,
      h: D_2,
      z: -H_2,
      rx: PI,
    }),
    new Face({
      w,
      h: sideHeight,
      y: -D_4 - D_8,
      z: -H_4,
      rx: PI - sideRotation,
    }),
    new Face({
      w,
      h: sideHeight,
      y: -D_4 - D_8,
      z: H_4,
      rx: sideRotation,
    }),
    new Face({
      w,
      h: D_2,
      z: H_2,
    }),
    new Face({
      w,
      h: sideHeight,
      y: D_4 + D_8,
      z: H_4,
      rx: -sideRotation,
    }),
    new Face({
      w,
      h: sideHeight,
      y: D_4 + D_8,
      z: -H_4,
      rx: PI + sideRotation,
    }),

    new Face({
      w: d,
      h,
      x: -W_2,
      rx: -PI_2,
      rz: PI_2,
      className: 'hex-cut',
    }),
  ];

  this.sides.forEach((side) => { side.parent = this; });

  this.element.style.setProperty('--t', `${thickness}px`);
  // This one is completely made up
  this.element.style.setProperty('--tx', `${xyThickness * PI_2}px`);
  this.element.style.setProperty('--txy', `${xyThickness}px`);

  this.element.append(...this.sides.map((side) => side.element));
}

HexRing.prototype = Object.create(Shape.prototype);
HexRing.prototype.constructor = HexRing;
