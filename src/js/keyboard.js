import { camera } from './camera';

const keys = new Set();

export function initKeyboard() {
  document.addEventListener('keydown', (event) => {
    keys.add(event.key);
  });

  document.addEventListener('keyup', (event) => {
    keys.delete(event.key);
  });
}

export function doKeyboardInput() {
  if (keys.has('w')) camera.moveY += 1;
  if (keys.has('a')) camera.moveX -= 1;
  if (keys.has('s')) camera.moveY -= 1;
  if (keys.has('d')) camera.moveX += 1;
  if (keys.has('z')) camera.dZoom += 1;
  if (keys.has('x')) camera.dZoom -= 1;
}
