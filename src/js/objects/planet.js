import { camera } from '../camera';
import { PI_2 } from '../util';

export default function Planet({ x, y, z, r, className }) {
  this.x = x ?? 0;
  this.y = y ?? 0;
  this.z = z ?? 0;
  this.r = r ?? 0;

  this.element = document.createElement('div');
  this.element.className = `planet circle ${className}`;
  // this.element.style.transform = ``;
  this.element.style.width = `${r * 2}px`;
  this.element.style.height = `${r * 2}px`;

  // TODO: A new filter for whatever type of planet this is
  // this.element.style.filter = 'url(#noise)';
  document.querySelector('.scene').append(this.element);

  // When the camera moves, this will updateTransform();
  camera.followers.push(this);

  this.updateTransform = () => {
    // These absolutes seem to *fix* the problem but I'm not sure they are
    // correct or needed, it'll do for now
    const angleX = Math.atan2(
      camera.zoom * Math.cos(camera.rx) + Math.abs(this.z - camera.z),
      camera.zoom * Math.sin(camera.rx) + Math.abs(this.y - camera.y),
    ) - PI_2;

    const angleZ = Math.atan2(
      camera.zoom * Math.cos(camera.rz) - this.y - camera.y,
      camera.zoom * Math.sin(camera.rz) - this.x - camera.x,
    ) - PI_2;

    const sinRx = Math.sin(angleX);
    const sinRz = Math.sin(angleZ);
    const cosRx = Math.cos(angleX);
    const cosRz = Math.cos(angleZ);

    this.element.style.transform = `
      translate3D(${this.x}px, ${this.y}px, ${this.z}px)
      matrix3d(
        ${cosRz},
        ${sinRz},
        0,
        0,
        ${-sinRz * cosRx},
        ${cosRz * cosRx},
        ${sinRx},
        0,
        ${sinRz * sinRx},
        ${-cosRz * sinRx},
        ${cosRx},
        0,
        0,
        0,
        0,
        1
      )
      scale(32)
    `;
  };

  this.updateTransform();
}
