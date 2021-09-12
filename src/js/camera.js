import { $, toRad, clamp } from './util';
import settings from './settings';

const cameraElement = $('.camera');
const scene = $('.scene');
const viewport = $('.viewport');
// const cameraDebug = $('.debug .view');

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
  this.followers = [];
  this.perspective = settings.camera.perspective;
  viewport.style.perspective = `${this.perspective}px`;

  this.setTransform = () => {
    // Clamp so the camera can't flip
    this.rx = Math.min(Math.max(this.rx, 0), Math.PI);
    scene.style.transform = `rotateX(${this.rx}rad) rotateZ(${this.rz}rad) translateX(${this.x}px) translateY(${this.y}px)`;
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
    this.followers.forEach((f) => f.updateTransform(this));
    this.setTransform();
  };

  this.changeZoom = (value) => {
    this.zoom += (value * this.zoom * settings.camera.zoomSpeed) / 500;
    this.setZoom();
    this.followers.forEach((f) => f.updateTransform(this));
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

      const xDiff = this.dx * settings.camera.panSpeed * (this.zoom / 300) * elapsed;
      const yDiff = this.dy * settings.camera.panSpeed * (this.zoom / 300) * elapsed;

      this.x = clamp(this.x + xDiff, -settings.camera.bounds, settings.camera.bounds);
      this.y = clamp(this.y + yDiff, -settings.camera.bounds, settings.camera.bounds);
      this.dx = 0;
      this.dy = 0;
      this.setTransform();
      this.followers.forEach((f) => f.updateTransform(this));
    }

    if (this.dZoom) {
      this.changeZoom(this.dZoom * elapsed);
      this.dZoom = 0;
    }

    // cameraDebug.innerText = `Position: ${Math.round(this.x)}x, ${Math.round(this.y)}y, ${Math.round(this.z)}z\nRotation: ${Math.round(toDeg(this.rx))}°x, ${Math.round(toDeg(this.rz))}°z\nZoom: ${Math.round(this.zoom)}px`;
  };
}

export function followCameraUpdate(camera) {
  this.element.style.transform = `
    translate3D(${this.x}px, ${this.y}px, ${this.z}px)
    rotateZ(${-camera.rz}rad)
    rotateY(${-camera.ry}rad)
    rotateX(${-camera.rx}rad)
  `;
}

export const camera = new Camera();
