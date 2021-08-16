import camera from './camera';
import resources from './resources';
import initMouse from './mouse';
import { initKeyboard, doKeyboardInput } from './keyboard';
import { $, halfPi, toRad } from './util';
import Pyramid from './shapes/pyramid';
import Box from './shapes/box';
import Sphere from './shapes/sphere';
import Hexagon from './shapes/hexagon';
import Block from './objects/structures/block';
import Solar from './objects/structures/solar';
import Plane from './shapes/plane';

const perfDebug = $('.debug .perf');
const powerDebug = $('.debug .power');

let previousTimestamp;

// const box = new Box({
//   w: 100,
//   d: 60,
//   h: 140,
//   x: 0,
//   y: 0,
// });

const box = new Box({
  w: 50,
  h: 100,
});

const plane = new Plane({
  w: 100,
  h: 60,
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
  plane.update();
  camera.update(elapsed);
  // resources.update(elapsed);

  previousTimestamp = timestamp;
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`;
  powerDebug.innerText = `Power: ${Math.floor(resources.power.current)}/${resources.power.capacity} (+${resources.power.gen}/-${resources.power.use})`;
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
