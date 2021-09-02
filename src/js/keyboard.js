import Build from './build';
import { camera } from './camera';
import gameObjectList from './game-object-list';

const keyDown = new Set();

export function initKeyboard() {
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    keyDown.add(key);
    if (key === 'r') Build.rotate();
  });

  document.addEventListener('keyup', (event) => {
    keyDown.delete(event.key.toLowerCase());
  });
}

export function doKeyboardInput() {
  if (keyDown.has('w')) camera.moveY += 1;
  if (keyDown.has('a')) camera.moveX -= 1;
  if (keyDown.has('s')) camera.moveY -= 1;
  if (keyDown.has('d')) camera.moveX += 1;
  if (keyDown.has('z')) camera.dZoom += 1;
  if (keyDown.has('x')) camera.dZoom -= 1;
  if (keyDown.has('delete')) {
    for (let i = gameObjectList.length - 1; i > 0; i--) {
      if (gameObjectList[i].selected) {
        gameObjectList[i].kill();
      }
    }
  }
}
