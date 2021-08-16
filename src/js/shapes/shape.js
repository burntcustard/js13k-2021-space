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
   * @return {void}
   */
  updateLighting() {
    // Do we need any shape-based, i.e. not face-based maths?
    // e.g. vector stuff between light source and center of shape
    // (which could be used instead of center of face?)

    this.sides.forEach((side) => {
      // Rotation of face from shape space to world space (face + shape)
      const rx = this.rx + side.rx;
      const ry = this.ry + side.ry;
      const rz = this.rz + side.rz;

      // Figure out surface normal from rotations
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
      ).normalise();

      // Direction towards the light source
      const sunVector = new Vec3(1, 0, 1).normalise();

      // https://cglearn.codelight.eu/pub/computer-graphics/shading-and-lighting#material-lambert-lighting-model-1
      // When vectors are noralised the cosine between them is just a dot b
      // The cosine is 1 at 0deg separation and 0 at 90deg
      const cosine = normal.dot(sunVector);

      // We only care about the cosine between 1 and 0
      // Multiplying by some factor here so it doesn't blow out to just white
      let lightness = Math.max(cosine, 0) * 0.7;

      // Add base level of ambient lighting
      lightness += 0.5;

      side.setLightness(lightness);
      side.updateLighting();
    });
  }

  update() {
    this.updateTransform();
    this.updateLighting(); // Maybe only do every few frames to save perf
  }
}
