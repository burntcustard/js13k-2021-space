import { $ } from './util';
import camera from './camera';

export default function initMouse() {
  const viewport = $('.viewport');
  const mouseOld = {};

  viewport.addEventListener('mousemove', (event) => {
    if (mouseOld.x !== undefined && event.buttons === 1) {
      camera.rotate(mouseOld.x - event.clientX, mouseOld.y - event.clientY);
    }

    mouseOld.x = event.clientX;
    mouseOld.y = event.clientY;
  });

  viewport.addEventListener('wheel', (event) => {
    camera.changeZoom(event.deltaY);
  });
}
