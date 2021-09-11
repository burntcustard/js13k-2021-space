import { camera } from '../camera';
import { PI_2 } from '../util';

export default function Planet({ x, y, z, r }) {
  this.x = x ?? 0;
  this.y = y ?? 0;
  this.z = z ?? 0;
  this.r = r ?? 0;

  this.element = document.createElement('div');
  this.element.className = 'planet';
  this.element.style.transform = `
    translate3D(${this.x}px, ${this.y}px, ${this.z}px)
  `;

  this.bodyElement = document.createElement('div');
  this.bodyElement.style.width = `${r * 2}px`;
  this.bodyElement.style.height = `${r * 2}px`;
  this.bodyElement.className = 'circle body';

  this.ringElement = document.createElement('div');
  this.ringElement.style.width = `${r * 8}px`;
  this.ringElement.style.height = `${r * 8}px`;
  this.ringElement.className = 'ring';
  this.ringElement.style.transform = `
    scale3D(8, 8, 8)
  `;

  this.element.append(this.bodyElement, this.ringElement);
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

    this.bodyElement.style.transform = `
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
