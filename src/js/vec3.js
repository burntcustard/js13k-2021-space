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

  normalise() {
    const len = this.length();
    return new Vec3(this.x / len, this.y / len, this.z / len);
  }

  multiply(multiplier) {
    return new Vec3(this.x * multiplier, this.y * multiplier, this.z * multiplier);
  }

  rotateX(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec3(
      this.x,
      this.y * cos - this.z * sin,
      this.y * sin + this.z * cos,
    );
  }

  rotateY(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec3(
      this.x * cos + this.z * sin,
      this.y,
      -this.x * sin + this.z * cos,
    );
  }

  rotateZ(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec3(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
      this.z,
    );
  }
}
