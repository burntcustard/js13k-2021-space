import { camera } from './camera';
import achievements from './achievements';
import resources from './resources';
import initMouse from './mouse';
import { initKeyboard, doKeyboardInput } from './keyboard';
import Build from './build';
import UI from './ui';
import gameObjectList from './game-object-list';
import { $, PI_4 } from './util';
import BlockMulti from './modules/block-multi';
import Light from './objects/light';
import Cubemap from './shapes/cubemap';
import Sun from './objects/sun';
import Planet from './objects/planet';
import ShipController from './ship-controller';
import initSaveAndLoad from './save-load';

const perfDebug = $('.debug .perf');

let previousTimestamp;

const skybox = new Cubemap({
  w: 2048,
});

// eslint-disable-next-line no-unused-vars
const sun = new Sun({ x: 40000, y: 40000, z: 10000, r: 200 });

// eslint-disable-next-line no-unused-vars
const planet = new Planet({ x: 900, y: -12000, z: -500, r: 300 });

// TODO: Put this somewhere else
// const canvas = document.getElementsByTagName('canvas')[0];
// const feImageSphereDistort = document.getElementById('fe-image-sphere-distort');
// const ctx = canvas.getContext('2d');
//
// for (let y = 0; y < canvas.height; y++) {
//   for (let x = 0; x < canvas.width; x++) {
//     const dx = x - 32;
//     const dy = y - 32;
//     const l = Math.sqrt(dx * dx + dy * dy);
//     const a = l < 32 ? Math.asin(l / 32) : 0;
//     const z = l < 32 ? 64 - Math.cos(a) * 64 : 0;
//     const r = l < 32 ? 32 + (dx / 32) * (z / 64) * 32 : 0;
//     const g = l < 32 ? 32 + (dy / 32) * (z / 64) * 32 : 0;
//     const o = l > 30 ? Math.max(0, 1 - (l - 31) / 4) : 1;
//
//     ctx.fillStyle = `rgba(${Math.floor(r) * 4},${Math.floor(g) * 4},0,${o})`;
//     ctx.fillRect(x, y, 1, 1);
//   }
// }
//
// feImageSphereDistort.setAttribute('xlink:href', canvas.toDataURL());

const lights = [
  new Light({
    x: -1,
    y: 1,
    z: 1,
    intensity: 0.6,
  }),
  new Light({
    x: -1,
    y: 1,
    z: 0,
    intensity: 0.2,
  }),
];

const stationBlock = new BlockMulti({});
stationBlock.spawn();
stationBlock.enable();

gameObjectList.push(stationBlock);

UI.populateBuildBar();

let halfSecondCounter = 0;

function main(timestamp) {
  window.requestAnimationFrame(main);

  if (previousTimestamp === undefined) previousTimestamp = timestamp;
  const elapsed = timestamp - previousTimestamp;
  halfSecondCounter += elapsed;
  if (halfSecondCounter > 500) {
    halfSecondCounter = 0;
  }

  doKeyboardInput();

  ShipController.update(elapsed, lights);

  gameObjectList.forEach((object) => {
    object.update(elapsed, lights);
  });

  camera.update(elapsed);
  skybox.update();

  previousTimestamp = timestamp;
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`;

  // Do some stuff only every half a second
  if (!halfSecondCounter) {
    const selectedObjects = gameObjectList.getSelectedList();

    if (selectedObjects.length === 1) {
      if (selectedObjects[0].buildBarItemElement || selectedObjects[0].buildList) {
        selectedObjects[0].updateBuildBar();
      }
    }

    // TODO: Only update build if actually building something
    Build.update();

    if (resources.population.current <= resources.population.capacity) {
      $('.ui-panel.ui-panel--top').classList.remove('neg');
      $('.pop .err').innerHTML = '';
    }

    if (resources.population.current < resources.population.capacity) {
      if (Math.floor(Math.random() * 1.1)) {
        // TODO: Display a '+1' or some indicator that the population has gone up
        // TODO: Show a 'population capacity reached' indicator
        resources.population.current++;
        achievements.population = Math.max(achievements.population, resources.population.current);
      }
    }

    if (resources.population.current > resources.population.capacity) {
      $('.ui-panel.ui-panel--top').classList.add('neg');
      $('.pop .err').innerHTML = 'EXCEEDS<br>CAPACITY';

      if (Math.floor(Math.random() * 1.1)) {
        resources.population.current--;
      }
    }

    UI.update();
  }
}

initMouse();
initKeyboard();
initSaveAndLoad();

$('#reset-rotation').addEventListener('click', () => {
  camera.rx = PI_4;
  camera.rz = PI_4;
  camera.setTransform();
});

$('#reset-position').addEventListener('click', () => {
  camera.x = 0;
  camera.y = 0;
  camera.z = 0;
  camera.setTransform();
});

window.requestAnimationFrame(main);
