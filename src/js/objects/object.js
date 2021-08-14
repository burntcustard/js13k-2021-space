/**
 * Game object
 */
export default class Object {
  constructor({ x, y, z, rx, ry, rz }) {
    this.x = x;
    this.y = y;
    this.z = z ?? 0;
    this.rx = rx ?? 0;
    this.ry = ry ?? 0;
    this.rz = rz ?? 0;
  }
}
