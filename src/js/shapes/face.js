import Vec3 from '../vec3';

export default class Face {
  constructor({ w, h, x, y, z, rx, ry, rz, colour, className }) {
    this.w = w;
    this.h = h;
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
    this.rz = rz ?? 0;
    this.ry = ry ?? 0;
    this.rx = rx ?? 0;
    this.lightness = 0.5;
    this.colour = colour ?? new Vec3(1, 0, 0);
    this.element = document.createElement('div');
    this.element.className = `face ${className ?? 'rect'}`;
    this.element.style.width = `${w}px`;
    this.element.style.height = `${h}px`;
    this.element.innerHTML = 'FACE';
    this.update();
  }

  update() {
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

  updateLighting() {
    const colour = this.colour.multiply(this.lightness * 255);
    this.element.style.background = `rgb(${colour.x}, ${colour.y}, ${colour.z})`;
  }

  setLightness(lightness) {
    this.lightness = lightness;
  }
}
