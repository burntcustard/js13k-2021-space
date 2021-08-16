export default class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross(other) {
    return new Vec3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x,
    );
  }

  length() {
    return Math.hypot(this.x, this.y, this.z);
  }

  angleTo(other) {
    return Math.acos(this.dot(other) / (this.length() * other.length()));
  }
}
