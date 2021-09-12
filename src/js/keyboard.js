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

    const key = event.key.toLowerCase();
    keyDown.add(key);
    if (key === 'r') Build.rotate();
    if (key === 'delete') deleteSelected();
    if (key === 'u') gameObjectList.upgradeSelected(); // TODO: Remove?
    if (key === 'escape') deselectAll();
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
}
