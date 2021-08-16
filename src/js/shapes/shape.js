import { lerp } from '../util';
import Vec3 from '../vec3';

export default class Shape {
  constructor({ w, h, d, x, y, z, rx, ry, rz, className }) {
    this.w = w;
    this.h = h;
    this.d = d ?? w;
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
    this.rx = rx ?? 0;
    this.ry = ry ?? 0;
    this.rz = rz ?? 0;
    this.element = document.createElement('div');
    this.element.className = `shape ${className}`;
    this.element.style.width = `${w}px`;
    this.element.style.height = `${d ?? w}px`;
    document.querySelector('.scene').append(this.element);
  }

  updateTransform() {
    this.element.style.transform = `
      translate3D(${this.x}px, ${this.y}px, ${this.z}px)
      rotateZ(${this.rz}rad)
      rotateY(${this.ry}rad)
      rotateX(${this.rx}rad)
    `;
  }

  /**
   * Update lighting CSS variable based on angle to light source.
   * We can probably assume the light source is a sun at 0, 0, 0.
   * @return {void}
   */
  updateLighting() {
    // Do we need any shape-based, i.e. not face-based maths?
    // e.g. vector stuff between light source and center of shape
    // (which could be used instead of center of face?)

    this.sides.forEach((side) => {
      // Rotation of face from shape space to world space (face + shape)
      //  - this is placeholder / probably very wrong:
      const rx = this.rx + side.rx;
      const ry = this.ry + side.ry;
      const rz = this.rz + side.rz;

      // Figure out surface normal from rotations
      //  - again, placeholder, probably wrong. This might help:
      // https://stackoverflow.com/a/27486532
      const sinRx = Math.sin(rx);
      const sinRy = Math.sin(ry);
      const sinRz = Math.sin(rz);
      const cosRx = Math.cos(rx);
      const cosRy = Math.cos(ry);
      const cosRz = Math.cos(rz);
      const normal = new Vec3(
        sinRy * cosRx * cosRz + sinRx * sinRz,
        sinRy * sinRz * cosRx - sinRx * cosRz,
        cosRx * cosRy,
      );

      // Sun is shining along +x (left to right)
      const sunVector = new Vec3(1, 0, 0);

      // Angle between sun vector and face normal
      const angle = normal.angleTo(sunVector);

      // If angle = PI then full lightness, if 0 then minimum lightness
      const lightness = lerp(0.2, 0.8, angle / Math.PI);
      side.setLightness(lightness);
      side.updateLighting();

      // console.log(rx, ry, rz, normal, sunVector, angle, lightness);
      // console.log(this, side);

      // Figure out angle to 0,0,0
      // NOPE this doesn't matter, we already have two vectors:
      //  - the surface normal
      //  - the x,y,z of the center of the shape (close enough to the face)

      // Figure out difference between surface normal and angle to 0,0,0

      // Set lightness to 99% when facing directly to 0,0,0
      // and some minimum 9%? when facing directly away from 0,0,0
    });
  }

  update() {
    this.updateTransform();
    this.updateLighting(); // Maybe only do every few frames to save perf
  }
}
