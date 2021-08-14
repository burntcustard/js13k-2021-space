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

const perfDebug = $('.debug .perf');
const powerDebug = $('.debug .power');

let previousTimestamp;

const stationBlock = new Block({
  x: 0,
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
  stationBlock.update();
  resources.update(elapsed);

  previousTimestamp = timestamp;
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`;
  powerDebug.innerText = `Power: ${Math.floor(resources.power.current)}`;
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
