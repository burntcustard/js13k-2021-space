import { camera } from '../camera';

export default function Planet({ x, y, z, r }) {
  this.x = x ?? 0;
  this.y = y ?? 0;
  this.z = z ?? 0;
  this.r = r ?? 0;
  this.ring = {};
  this.element = document.createElement('div');
  this.element.body = document.createElement('div');
  this.element.ring = document.createElement('div');
  this.element.ring.style.width = `${r * 16}px`;
  this.element.ring.style.height = `${r * 16}px`;
  this.element.className = 'planet-wrap';
  this.element.body.className = 'face circle planet';
  this.element.ring.className = 'ring';
  this.element.append(this.element.body, this.element.ring);
  this.element.body.style.background = '#139';
  this.element.body.style.width = `${r * 16}px`;
  this.element.body.style.height = `${r * 16}px`;
  // TODO: A new filter for whatever type of planet this is
  // this.element.style.filter = 'url(#noise)';
  this.element.ring.style.transform = `
    scale(2)
  `;
  document.querySelector('.scene').append(this.element);
  camera.followers.push(this);
  this.updateTransform = () => {
    // const clientRect = this.element.getBoundingClientRect();
    // const xOffset = clientRect.left + clientRect.right - window.innerWidth;
    // const yOffset = clientRect.top + clientRect.bottom - window.innerWidth;
    //
    // // TODO: Include camera distance in the translate so that far away
    // // planets get x/y offsetted MORE so that they don't eat nearby objects(?)
    // const xDist = Math.abs(this.x - camera.x);
    // const yDist = Math.abs(this.y - camera.y);

    this.element.style.transform = `
      translate3D(${this.x}px, ${this.y}px, ${this.z}px)
    `;
    this.element.body.style.transform = `
      rotateZ(${-camera.rz}rad)
      rotateY(${-camera.ry}rad)
      rotateX(${-camera.rx}rad)
      scale(2)
      rotate(90deg)
    `;
    // translate(${xOffset}px, ${yOffset}px)
  };
  this.updateTransform();
}
