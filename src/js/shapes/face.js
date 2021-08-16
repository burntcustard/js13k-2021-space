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
    this.update();
  }

  update() {
    this.element.style.transform = `
      translate3D(${this.x}px, ${this.y}px, ${this.z}px)
      rotateZ(${this.rz}rad)
      rotateY(${this.ry}rad)
      rotateX(${this.rx}rad)
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
