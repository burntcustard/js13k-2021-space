import camera from './camera';
import resources from './resources';
import initMouse from './mouse';
import { initKeyboard, doKeyboardInput } from './keyboard';
import { $, PI_4 } from './util';
import Box from './shapes/box';
import block from './modules/block';
import solarAdv from './modules/solar-adv';
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
const stationSolar = solarAdv.new({ x: 90, z: 10 });

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

function main(timestamp) {
  window.requestAnimationFrame(main);

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
