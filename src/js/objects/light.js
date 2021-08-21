import Vec3 from '../vec3';

export default class Light {
  constructor({ x, y, z, intensity }) {
    this.direction = new Vec3(x, y, z);
    this.intensity = intensity;
  }
}
