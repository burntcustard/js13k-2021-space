import { camera, followCameraUpdate } from '../camera';

export default function Sun({ x, y, z, r }) {
  this.x = x ?? 0;
  this.y = y ?? 0;
  this.z = z ?? 0;
  this.r = r ?? 0;
  this.color = '#f90'; // TODO: Replace with fancy background & lighting color?
  this.element = document.createElement('div');
  this.element.className = 'face circle sun';
  this.element.style.width = `${r * 2}px`;
  this.element.style.height = `${r * 2}px`;
  this.element.style.filter = 'url(#noise)';
  document.querySelector('.scene').append(this.element);
  camera.followers.push(this);
  this.updateTransform = () => {
    this.element.style.transform = `
      translate3D(${this.x}px, ${this.y}px, ${this.z}px)
      rotateZ(${-camera.rz}rad)
      rotateY(${-camera.ry}rad)
      rotateX(${-camera.rx}rad)
      scale(9)
    `;
  };
}
