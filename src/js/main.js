import camera from './camera';
import resources from './resources';
import initMouse from './mouse';
import { initKeyboard, doKeyboardInput } from './keyboard';
import { $, toRad } from './util';
import Pyramid from './shapes/pyramid';
import Box from './shapes/box';
import Sphere from './shapes/sphere';
import Hexagon from './shapes/hexagon';
import Block from './objects/structures/block';
import Solar from './objects/structures/solar';

const perfDebug = $('.debug .perf');
const powerDebug = $('.debug .power');
const power = $('.power__bar__fill');
const powerDot = $('.power__dot');
const powerGen = $('.power .gen');
const powerUse = $('.power .use');
const powerNum = $('.power .num');
const powerCap = $('.power .cap');

let previousTimestamp;

const stationBlock = new Block({
  x: 0,
  y: 0,
  z: 40,
});

const stationSolar = new Solar({
  x: 20,
  y: 0,
  z: 40,
});

const sphere = new Sphere({
  radius: 40,
  x: -300,
  y: 300,
  z: 20,
});

const pyramid = new Pyramid({
  w: 150,
  h: 200,
  x: -300,
  y: -300,
});

const box = new Box({
  w: 100,
  d: 60,
  h: 140,
  x: 200,
  y: 160,
});

const hexagon = new Hexagon({
  radius: 100,
  h: 200,
  x: 0,
  y: 0,
});

function main(timestamp) {
  window.requestAnimationFrame(main);

  if (previousTimestamp === undefined) previousTimestamp = timestamp;
  const elapsed = timestamp - previousTimestamp;

  doKeyboardInput();
  box.rz += 0.01;
  box.update();
  pyramid.rz -= 0.01;
  pyramid.update();
  camera.update(elapsed);
  stationBlock.update(elapsed);
  stationSolar.update(elapsed);
  // resources.update(elapsed);

  previousTimestamp = timestamp;
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`;
  powerDebug.innerText = `Power: ${Math.floor(resources.power.current)}/${resources.power.capacity} (+${resources.power.gen}/-${resources.power.use})`;
  power.style.width = `${(100 / resources.power.capacity) * resources.power.current}%`;
  powerDot.classList.toggle('empty', resources.power.current < 1);
  powerGen.innerText = resources.power.gen;
  powerUse.innerText = resources.power.use;
  const num = resources.power.gen - resources.power.use;
  powerNum.innerText = (num <= 0 ? '' : '+') + num;
  powerNum.classList.toggle('pos', num <= 0);
  powerCap.innerText = `${Math.floor(resources.power.current)} /  ${resources.power.capacity}`;
}

initMouse();
initKeyboard();

$('#reset-rotation').addEventListener('click', () => {
  camera.rx = toRad(45);
  camera.rz = toRad(45);
  camera.setTransform();
});

$('#reset-position').addEventListener('click', () => {
  camera.x = 0;
  camera.y = 0;
  camera.z = 0;
  camera.setTransform();
});

window.requestAnimationFrame(main);
