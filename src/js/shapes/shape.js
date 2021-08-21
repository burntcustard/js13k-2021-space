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
    document.querySelector('.scene').append(this.element);
  }

  updateTransform() {
    const sinRx = Math.sin(this.rx);
    const sinRy = Math.sin(this.ry);
    const sinRz = Math.sin(this.rz);
    const cosRx = Math.cos(this.rx);
    const cosRy = Math.cos(this.ry);
    const cosRz = Math.cos(this.rz);
    this.element.style.transform = `
      translate3D(${this.x}px, ${this.y}px, ${this.z}px)
      matrix3d(
        ${cosRz * cosRy},
        ${sinRz * cosRy},
        ${-sinRy},
        0,
        ${cosRz * sinRy * sinRx - sinRz * cosRx},
        ${sinRz * sinRy * sinRx + cosRz * cosRx},
        ${cosRy * sinRx},
        0,
        ${cosRz * sinRy * cosRx + sinRz * sinRx},
        ${sinRz * sinRy * cosRx - cosRz * sinRx},
        ${cosRy * cosRx},
        0,
        0,
        0,
        0,
        1
      )
    `;
  }

  /**
   * Update lighting CSS variable based on angle to light source.
   * @return {void}
   */
  updateLighting(lights = []) {
    this.sides.forEach((side) => {
      // Figure out surface normal from rotations
      // We have to do this for the shape rotation, then the face rotation
      // https://stackoverflow.com/a/27486532
      const sx = Math.sin(this.rx);
      const sy = Math.sin(this.ry);
      const sz = Math.sin(this.rz);
      const cx = Math.cos(this.rx);
      const xy = Math.cos(this.ry);
      const cz = Math.cos(this.rz);

      const ms = [
        [cz * xy, cz * sy * sx - sz * cx, cz * sy * cx + sz * sx],
        [sz * xy, sz * sy * sx + cz * cx, sz * sy * cx - cz * sx],
        [-sy, xy * sx, xy * cx],
      ];

      const fsx = Math.sin(side.rx);
      const fsy = Math.sin(side.ry);
      const fsz = Math.sin(side.rz);
      const fcx = Math.cos(side.rx);
      const fcy = Math.cos(side.ry);
      const fcz = Math.cos(side.rz);

      const mf = [
        fcx * fsy * fcz + fsx * fsz,
        fcx * fsy * fsz - fsx * fcz,
        fcx * fcy,
      ];

      const normal = new Vec3(
        ms[0][0] * mf[0] + ms[0][1] * mf[1] + ms[0][2] * mf[2],
        ms[1][0] * mf[0] + ms[1][1] * mf[1] + ms[1][2] * mf[2],
        ms[2][0] * mf[0] + ms[2][1] * mf[1] + ms[2][2] * mf[2],
      ).normalise();

      // Start with base level of ambient lighting
      let lightness = 0.2;

      // https://cglearn.codelight.eu/pub/computer-graphics/shading-and-lighting#material-lambert-lighting-model-1
      // When vectors are noralised the cosine between them is just a dot b
      // The cosine is 1 at 0deg separation and 0 at 90deg
      // We only care about the cosine between 1 and 0
      // Multiplying by some factor so it doesn't blow out to just white
      lights.forEach((light) => {
        lightness += Math.max(normal.dot(light.direction), 0) * light.intensity;
      });

      side.setLightness(lightness);
      side.updateLighting();
    });
  }

  update(lights) {
    this.updateTransform();
    this.updateLighting(lights); // Maybe only do every few frames to save perf
  }
}
