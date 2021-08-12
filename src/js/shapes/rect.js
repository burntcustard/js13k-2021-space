export default class Rect {
  /* eslint-disable object-curly-newline */
  constructor({ w, h, x, y, z, rx, ry, rz }) {
    this.w = w;
    this.h = h;
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
    this.rx = rx ?? 0;
    this.ry = ry ?? 0;
    this.rz = rz ?? 0;
    this.element = document.createElement('div');
    this.element.className = 'rect';
    console.log(w);
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
}
