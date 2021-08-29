import camera from './camera';
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

const perfDebug = $('.debug .perf');

let previousTimestamp;

const box = new Box({
  w: 60,
  h: 60,
  x: 200,
});
box.spawn();

const skybox = new Cubemap({
  w: 2048,
});

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

stationBlock.model.sides.forEach((side) => {
  Build.addEventListenersTo(side);
});

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
