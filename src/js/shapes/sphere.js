import Face from './face';
import camera from '../camera';

export default class Sphere extends Face {
  constructor({ radius, x, y, z }) {
    super({
      w: radius * 2,
      h: radius * 2,
      x,
      y,
      z,
      className: 'circle sphere',
    });

    document.querySelector('.scene').append(this.element);
    camera.followers.push(this);
  }

  update() {
    this.element.style.transform = `
      translate3D(${this.x}px, ${this.y}px, ${this.z}px)
      rotateZ(${-camera.rz}rad)
      rotateY(${-camera.ry}rad)
      rotateX(${-camera.rx}rad)
    `;
    // Assumes light is directly above the sphere (for now)
    this.element.style.background = `radial-gradient(
      circle at 50% ${50 - ((camera.rx / (Math.PI / 2)) * 50)}%,
      hsl(230 90% 80%) 3%,
      hsl(230 80% 60%) 60%,
      hsl(230 70% 30%) 100%
    )`;
  }
}
