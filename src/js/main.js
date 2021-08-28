import camera from './camera';
import resources from './resources';
import initMouse from './mouse';
import { initKeyboard, doKeyboardInput } from './keyboard';
import UI from './ui';
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

const objects = [box, octagon, pyramid, stationBlock, stationSolar];

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

UI.setCurrentBuildItem(Solar);
let canAffordCurrentBuildItem = resources.mats.current > UI.currentBuildItem.cost;
let currentHoverSide;

stationBlock.model.sides.forEach((side) => {
  side.element.addEventListener('mouseover', () => {
    UI.currentBuildItemInstance.model.element.style.display = '';
    side.element.classList.add('build-hover');
    side.element.classList.toggle('obstructed', side.hasConnectedModule ?? false);
    UI.currentBuildItemInstance.model.element.classList.toggle('obstructed', side.hasConnectedModule ?? false);
    currentHoverSide = side;
    UI.currentBuildItemInstance.model.x = side.x;
    UI.currentBuildItemInstance.model.y = side.y;
    UI.currentBuildItemInstance.model.z = side.z;
    UI.currentBuildItemInstance.update();
  });

  side.element.addEventListener('click', () => {
    if (!side.hasConnectedModule && canAffordCurrentBuildItem) {
      UI.currentBuildItemInstance.model.element.classList.remove('frame');
      objects.push(UI.currentBuildItemInstance);
      UI.currentBuildItemInstance.enable();
      side.hasConnectedModule = true;
      side.element.classList.add('obstructed'); // TODO: Refactor this er somehow
      // Cost some resources - should this be on build bar click instead?
      resources.mats.current -= UI.currentBuildItem.cost;
      UI.setCurrentBuildItem(UI.currentBuildItem);
      // Assuming we can't build models on top of each other, new one is obstructed
      UI.currentBuildItemInstance.model.element.classList.add('obstructed');
    }
  });

  side.element.addEventListener('mouseleave', () => {
    side.element.classList.remove('build-hover');
    UI.currentBuildItemInstance.model.element.style.display = 'none';
    currentHoverSide = null;
    // Place it in the sun or something (is actually what PA does lol)
    // TODO: Figure out if we need this now that we're hiding it
    // UI.currentBuildItemInstance.model.x = 0;
    // UI.currentBuildItemInstance.model.y = 0;
    // UI.currentBuildItemInstance.model.z = 0;
    // UI.currentBuildItemInstance.update();
  });
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

  objects.forEach((object) => {
    object.update(elapsed, lights);
  });

  camera.update(elapsed);
  skybox.update();

  previousTimestamp = timestamp;
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`;

  // Do some stuff only every half a second
  if (!halfSecondCounter) {
    // Check if we can afford the thing we're trying to build
    canAffordCurrentBuildItem = resources.mats.current > UI.currentBuildItem.cost;
    UI.currentBuildItemInstance.model.element.classList.toggle('err-cost', !canAffordCurrentBuildItem);
    if (currentHoverSide) {
      currentHoverSide.element.classList.toggle('err-cost', !canAffordCurrentBuildItem);
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
