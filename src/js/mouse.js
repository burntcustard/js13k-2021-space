import { $ } from './util';
import camera from './camera';
import settings from './settings';

export default function initMouse() {
  const viewport = $('.viewport');
  const mouseOld = {};

  viewport.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) {
      camera.rz += ((mouseOld.x ?? event.clientX) - event.clientX) * settings.camera.rotateSpeed;
      camera.rx += ((mouseOld.y ?? event.clientY) - event.clientY) * settings.camera.rotateSpeed;
      camera.setTransform();
    }

    mouseOld.x = event.clientX;
    mouseOld.y = event.clientY;
  });

  viewport.addEventListener('wheel', (event) => {
    camera.zoom += event.deltaY * 1;
    camera.setZoom();
  });
}
