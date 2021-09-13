import Build from './build';
import { camera } from './camera';
import gameObjectList from './game-object-list';
import SceneController from './scene-controller';
import UI from './ui';
import { $ } from './util';

const keyDown = new Set();

function deleteSelected() {
  gameObjectList.killSelected();
  $('.ui-panel--btns').setAttribute('aria-hidden', true);
  $('.ui-panel__build-info').classList.remove('ui-panel__build-info--select');
  $('.ui-panel__build-info').innerHTML = ''; // Remove infos
  $('.ui-panel__build-list').innerHTML = ''; // Remove object buttons
  $('.ui-panel__build-list').style.display = '';
  $('.ui-panel__build-list').append(...UI.buildBarList);

  // Cancel building whatever is the current build item
  UI.deselectAllBuildBarItems();
}

function deselectAll() {
  gameObjectList.deselectAll();
  $('.ui-panel--btns').setAttribute('aria-hidden', true);
  $('.ui-panel__build-info').classList.remove('ui-panel__build-info--select');
  $('.ui-panel__build-info').innerHTML = ''; // Remove infos
  $('.ui-panel__build-list').innerHTML = ''; // Remove object buttons
  $('.ui-panel__build-list').style.display = '';
  $('.ui-panel__build-list').append(...UI.buildBarList);

  // Cancel building whatever is the current build item
  UI.deselectAllBuildBarItems();
  Build.setCurrentItem(false);
}

export function initKeyboard() {
  document.addEventListener('keydown', (event) => {
    if (!SceneController.started) {
      SceneController.start();
    }

    keyDown.add(event.code);
    if (event.key.toLowerCase() === 'r') Build.rotate();
    if (event.key.toLowerCase() === 'delete') deleteSelected();
    if (event.key.toLowerCase() === 'escape') deselectAll();
  });

  document.addEventListener('keyup', (event) => {
    keyDown.delete(event.code);
  });
}

export function doKeyboardInput() {
  if (keyDown.has('KeyW')) camera.moveY += 1;
  if (keyDown.has('KeyA')) camera.moveX -= 1;
  if (keyDown.has('KeyS')) camera.moveY -= 1;
  if (keyDown.has('KeyD')) camera.moveX += 1;
  if (keyDown.has('KeyZ')) camera.dZoom += 1;
  if (keyDown.has('KeyX')) camera.dZoom -= 1;
}
