import camera from './camera';
import resources from './resources';
import initMouse from './mouse';
import { initKeyboard, doKeyboardInput } from './keyboard';
import { $, PI_4 } from './util';
import Box from './shapes/box';
import block from './modules/block';
import solarAdv from './modules/solar-adv';
import solar from './modules/solar';
import Pyramid from './shapes/pyramid';
import Light from './objects/light';
import Cubemap from './shapes/cubemap';

const perfDebug = $('.debug .perf');
const matsBar = $('.mats .fill');
const matsDot = $('.mats .dot');
const matsCap = $('.mats .cap');
const powerBar = $('.power .fill');
const powerDot = $('.power .dot');
const powerGen = $('.power .gen');
const powerUse = $('.power .use');
const powerNum = $('.power .num');
const powerCap = $('.power .cap');

let previousTimestamp;

const box = new Box({
  w: 60,
  h: 60,
});

const skybox = new Cubemap({
  w: 2048,
});

const stationBlock = block.new({ x: 0, z: 10 });
stationBlock.enable();
const stationSolar = solarAdv.new({ x: 90, z: 10 });
stationSolar.enable();

const pyramid = new Pyramid({
  w: 100,
  h: 100,
  y: 200,
  z: 100,
});

const objects = [box, pyramid, stationBlock, stationSolar];

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

let currentBuildItem = solar.new({});
currentBuildItem.model.element.classList.add('outline');
currentBuildItem.model.element.style.display = 'none';
let canAffordCurrentBuildItem = resources.mats.current > currentBuildItem.cost;
let currentHoverSide;

stationBlock.model.sides.forEach((side) => {
  side.element.addEventListener('mouseover', () => {
    currentBuildItem.model.element.style.display = '';
    side.element.classList.add('build-hover');
    side.element.classList.toggle('obstructed', side.hasConnectedModule ?? false);
    currentBuildItem.model.element.classList.toggle('obstructed', side.hasConnectedModule ?? false);
    currentHoverSide = side;
    currentBuildItem.model.x = side.x;
    currentBuildItem.model.y = side.y;
    currentBuildItem.model.z = side.z;
    currentBuildItem.update();
  });

  side.element.addEventListener('mouseup', () => {
    // currentBuildItem.build() // ?
    // Don't want to repeat long className str
    // .mode.element.classList is too many dots
    if (!side.hasConnectedModule && canAffordCurrentBuildItem) {
      currentBuildItem.model.element.classList.remove('outline');
      objects.push(currentBuildItem);
      currentBuildItem.enable();
      side.hasConnectedModule = true;
      side.element.classList.add('obstructed');
      // Cost some resources - should this be on build bar click instead?
      resources.mats.current -= currentBuildItem.cost;
      currentBuildItem = solar.new({});
      currentBuildItem.model.x = side.x;
      currentBuildItem.model.y = side.y;
      currentBuildItem.model.z = side.z;
      currentBuildItem.update();
      currentBuildItem.model.element.classList.add('outline');
      // Assuming we can't build models on top of each other, new one is obstructed
      currentBuildItem.model.element.classList.add('obstructed');
    }
  });

  side.element.addEventListener('mouseleave', () => {
    side.element.classList.remove('build-hover');
    currentBuildItem.model.element.style.display = 'none';
    currentHoverSide = null;
    // Place it in the sun or something (is actually what PA does lol)
    currentBuildItem.model.x = 0;
    currentBuildItem.model.y = 0;
    currentBuildItem.model.z = 0;
    currentBuildItem.update();
  });
});

function main(timestamp) {
  window.requestAnimationFrame(main);

  // Check if we can afford the thing we're trying to build
  canAffordCurrentBuildItem = resources.mats.current > currentBuildItem.cost;
  currentBuildItem.model.element.classList.toggle('err-cost', !canAffordCurrentBuildItem);
  if (currentHoverSide) {
    currentHoverSide.element.classList.toggle('err-cost', !canAffordCurrentBuildItem);
  }

  if (previousTimestamp === undefined) previousTimestamp = timestamp;
  const elapsed = timestamp - previousTimestamp;

  doKeyboardInput();

  objects.forEach((object) => {
    object.update(elapsed, lights);
  });

  camera.update(elapsed);
  skybox.update(camera);

  previousTimestamp = timestamp;
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`;

  matsBar.style.width = `${(100 / resources.mats.capacity) * resources.mats.current}%`;
  matsDot.classList.toggle('empty', resources.mats.current < 1);
  matsCap.innerText = `${Math.floor(resources.mats.current)} /  ${resources.mats.capacity}`;

  powerBar.style.width = `${(100 / resources.power.capacity) * resources.power.current}%`;
  powerDot.classList.toggle('empty', resources.power.current < 1);
  powerGen.innerText = resources.power.gen;
  powerUse.innerText = resources.power.use;
  const num = resources.power.gen - resources.power.use;
  powerNum.innerText = (num <= 0 ? '' : '+') + num;
  powerNum.classList.toggle('neg', num > 0);
  powerCap.innerText = `${Math.floor(resources.power.current)} /  ${resources.power.capacity}`;
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
