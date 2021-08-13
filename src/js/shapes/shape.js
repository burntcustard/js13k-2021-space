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

  update() {
    this.element.style.transform = `
      translate3D(${this.x}px, ${this.y}px, ${this.z}px)
      rotateZ(${this.rz}rad)
      rotateY(${this.ry}rad)
      rotateX(${this.rx}rad)
    `;
  }
}
