import Build from './build';
import camera from './camera';
import gameObjectList from './game-object-list';
import { PI, PI_2 } from './util';

const keyDown = new Set();

export function initKeyboard() {
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    keyDown.add(key);

    // TODO: increment should be based on how many sides the selected item has
    if (key === 'r') {
      if (!Build.currentItem) return;
      Build.rotation = (Build.rotation + PI_2) % (PI * 2);
      Build.updateRotation();
    }
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
  if (keyDown.has('Delete')) {
    for (let i = gameObjectList.length - 1; i > 0; i--) {
      if (gameObjectList[i].selected) {
        gameObjectList[i].kill();
      }
    }
  }
}
