import { camera } from './camera';
import resources from './resources';
import initMouse from './mouse';
import { initKeyboard, doKeyboardInput } from './keyboard';
import Build from './build';
import UI from './ui';
import gameObjectList from './game-object-list';
import { $, PI_4 } from './util';
import Box from './shapes/box';
import Block from './modules/block';
import Solar from './modules/solar';
import Pyramid from './shapes/pyramid';
import Octagon from './shapes/octagon';
import Light from './objects/light';
import Cubemap from './shapes/cubemap';
import Sun from './objects/sun';
import Planet from './objects/planet';

const perfDebug = $('.debug .perf');

let previousTimestamp;

const skybox = new Cubemap({
  w: 2048,
});

const sun = new Sun({ x: 40000, y: 40000, z: 10000, r: 200 });

const planet = new Planet({ x: 900, y: -9000, r: 300 });

const box = new Box({
  w: 60,
  h: 60,
  x: 200,
});
box.spawn();

// const stationBlock = block.new({ x: 0, z: 10 });
const stationBlock = new Block({ x: 0 });
stationBlock.spawn();
stationBlock.enable();
// const stationSolar = solar.new({ x: 90, z: 10 });
const stationSolar = new Solar({ x: 90 });
stationSolar.spawn();
stationSolar.enable();

const pyramid = new Pyramid({
  w: 100,
  h: 100,
  y: 200,
  z: 100,
});
pyramid.spawn();

const octagon = new Octagon({
  w: 100,
  h: 70,
  x: 150,
  y: 200,
  z: -10,
  rz: 0.4,
});
octagon.spawn();

gameObjectList.push(box, octagon, pyramid, stationBlock, stationSolar);

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

  gameObjectList.forEach((object) => {
    object.update(elapsed, lights);
  });

  camera.update(elapsed);
  skybox.update();

  previousTimestamp = timestamp;
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`;

  // Do some stuff only every half a second
  if (!halfSecondCounter) {
    // TODO: Only update build if actually building something
    Build.update();

    if (resources.population.current < resources.population.capacity
      && Math.floor(Math.random() * 1.02)) {
      // TODO: Display a '+1' or some indicator that the population has gone up
      // TODO: Show a 'population capacity reached' indicator
      resources.population.current++;
    }

    UI.update();
  }
}

initMouse();
initKeyboard();

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
