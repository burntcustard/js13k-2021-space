/**
 * Game object
 */
export default class Object {
  constructor({ w, h, d, x, y, z, rx, ry, rz }) {
    this.w = w;
    this.h = h;
    this.d = d;
    this.x = x;
    this.y = y;
    this.z = z ?? 0;
    this.rx = rx ?? 0;
    this.ry = ry ?? 0;
    this.rz = rz ?? 0;
  }

  update(elapsed, lights) {
    this.model.update(elapsed, lights);
  }
}
