import { $, toRad, toDeg } from './util';
import settings from './settings';

const cameraElement = $('.camera');
const scene = $('.scene');
const cameraDebug = $('.debug .view');

function Camera() {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.rx = toRad(45);
  this.ry = 0;
  this.rz = toRad(45);
  this.dx = 0;
  this.dy = 0;
  this.zoom = 0;
  this.dZoom = 0;
  this.moveY = 0;
  this.moveX = 0;

  this.setTransform = () => {
    scene.style.transform = `rotateX(${this.rx}rad) rotateZ(${this.rz}rad) translateX(${this.x}px) translateY(${this.y}px)`;
  };

  this.rotate = (x, y) => {
    this.rz += x * settings.camera.rotateSpeed;
    this.rx += y * settings.camera.rotateSpeed;
    this.setTransform();
  };

  this.setZoom = () => {
    cameraElement.style.transform = `translateZ(${this.zoom}px)`;
  };

  this.update = (elapsed) => {
    // Normalize dx and dy so moving diagonally isn't 2x as fast
    if (this.moveX || this.moveY) {
      if (this.moveX && this.moveY) {
        this.moveX *= 0.7071;
        this.moveY *= 0.7071;
      }

      if (this.moveY) {
        this.dx += this.moveY * Math.sin(this.rz);
        this.dy += this.moveY * Math.cos(this.rz);
        this.moveY = 0;
      }

      if (this.moveX) {
        this.dx -= this.moveX * Math.cos(this.rz);
        this.dy += this.moveX * Math.sin(this.rz);
        this.moveX = 0;
      }

      this.x += this.dx * settings.camera.panSpeed * elapsed;
      this.y += this.dy * settings.camera.panSpeed * elapsed;
      this.dx = 0;
      this.dy = 0;
      this.setTransform();
    }

    if (this.dZoom) {
      this.zoom += this.dZoom * settings.camera.zoomSpeed * elapsed;
      this.dZoom = 0;
      this.setZoom();
    }

    cameraDebug.innerText = `Position: ${Math.round(this.x)}x, ${Math.round(this.y)}y, ${Math.round(this.z)}z\nRotation: ${Math.round(toDeg(this.rx))}°x, ${Math.round(toDeg(this.rz))}°z\nZoom: ${Math.round(this.zoom)}px`;
  };
}

export default new Camera();
