import { camera } from '../camera';

export default function Planet({ x, y, z, r }) {
  this.x = x ?? 0;
  this.y = y ?? 0;
  this.z = z ?? 0;
  this.r = r ?? 0;
  this.element = document.createElement('div');
  this.element.className = 'face circle planet';
  this.element.style.background = '#139';
  this.element.style.width = `${r * 2}px`;
  this.element.style.height = `${r * 2}px`;
  // TODO: A new filter for whatever type of planet this is
  // this.element.style.filter = 'url(#noise)';
  document.querySelector('.scene').append(this.element);
  camera.followers.push(this);
  this.updateTransform = () => {
    const clientRect = this.element.getBoundingClientRect();
    const xOffset = clientRect.left + clientRect.right - window.innerWidth;
    const yOffset = clientRect.top + clientRect.bottom - window.innerWidth;

    // TODO: Include camera distance in the translate so that far away
    // planets get x/y offsetted MORE so that they don't eat nearby objects(?)
    const xDist = Math.abs(this.x - camera.x);
    const yDist = Math.abs(this.y - camera.y);

    this.element.style.transform = `
      translate3D(${this.x}px, ${this.y}px, ${this.z}px)
      rotateZ(${-camera.rz}rad)
      rotateY(${-camera.ry}rad)
      rotateX(${-camera.rx}rad)
      translate(${xOffset}px, ${yOffset}px)
      scale(32)
      rotate(90deg)
    `;
  };
  this.updateTransform();
}
