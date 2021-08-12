import camera from './camera';
import initMouse from './mouse';
import { initKeyboard, doKeyboardInput } from './keyboard';
import { $, toRad } from './util';
import Pyramid from './shapes/pyramid';

const perfDebug = $('.debug .perf');

let previousTimestamp;

const pyramid = new Pyramid({
  w: 150,
  h: 200,
  x: -300,
  y: -300,
});

console.log(pyramid);

function main(timestamp) {
  window.requestAnimationFrame(main);

  if (previousTimestamp === undefined) previousTimestamp = timestamp;
  const elapsed = timestamp - previousTimestamp;

  doKeyboardInput();
  camera.update(elapsed);

  previousTimestamp = timestamp;
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`;
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
