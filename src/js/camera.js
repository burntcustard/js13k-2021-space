import { $, toRad, toDeg } from './util';
import settings from './settings';

const cameraElement = $('.camera');
const scene = $('.scene');
const viewport = $('.viewport');
const cameraDebug = $('.debug .view');
const sky = $('.sky');

function Camera() {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.rx = toRad(45);
  this.ry = 0;
  this.rz = toRad(45);
  this.dx = 0;
  this.dy = 0;
  this.zoom = settings.camera.zoom.default;
  this.dZoom = 0;
  this.moveY = 0;
  this.moveX = 0;
  this.followers = [];
  this.perspective = settings.camera.perspective;
  viewport.style.perspective = `${this.perspective}px`;

  this.setTransform = () => {
    // Clamp so the camera can't flip (values in radians)
    this.rx = Math.min(Math.max(this.rx, 0), 1.5);
    scene.style.transform = `rotateX(${this.rx}rad) rotateZ(${this.rz}rad) translateX(${this.x}px) translateY(${this.y}px)`;
    sky.style.transform = `translate(${-50 + this.rz * 8}%, ${-50 + this.rx * 8}%)`;
  };

  this.setZoom = () => {
    this.zoom = Math.min(Math.max(this.zoom, settings.camera.zoom.min), settings.camera.zoom.max);
    cameraElement.style.transform = `translateZ(${settings.camera.perspective - this.zoom}px)`;
  };

  this.setTransform();
  this.setZoom();

  this.rotate = (x, y) => {
    this.rz += x * settings.camera.rotateSpeed;
    this.rx += y * settings.camera.rotateSpeed;
    this.rz %= Math.PI * 2;
    console.log(this.rz);
    this.followers.forEach((f) => f.update());
    this.setTransform();
  };

  this.changeZoom = (value) => {
    this.zoom += (value * this.zoom * settings.camera.zoomSpeed) / 500;
    this.setZoom();
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

      this.x += this.dx * settings.camera.panSpeed * (this.zoom / 300) * elapsed;
      this.y += this.dy * settings.camera.panSpeed * (this.zoom / 300) * elapsed;
      this.dx = 0;
      this.dy = 0;
      this.setTransform();
    }

    if (this.dZoom) {
      this.changeZoom(this.dZoom * elapsed);
      this.dZoom = 0;
    }

    cameraDebug.innerText = `Position: ${Math.round(this.x)}x, ${Math.round(this.y)}y, ${Math.round(this.z)}z\nRotation: ${Math.round(toDeg(this.rx))}°x, ${Math.round(toDeg(this.rz))}°z\nZoom: ${Math.round(this.zoom)}px`;
  };
}

export default new Camera();
