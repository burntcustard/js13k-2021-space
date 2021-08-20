import camera from './camera';
import resources from './resources';
import initMouse from './mouse';
import { initKeyboard, doKeyboardInput } from './keyboard';
import { $, PI_4 } from './util';
import Box from './shapes/box';

const perfDebug = $('.debug .perf');
const powerDebug = $('.debug .power');

let previousTimestamp;

const box = new Box({
  w: 60,
  h: 60,
  z: 100,
});

function main(timestamp) {
  window.requestAnimationFrame(main);

  if (previousTimestamp === undefined) previousTimestamp = timestamp;
  const elapsed = timestamp - previousTimestamp;

  doKeyboardInput();

  box.rx += 0.01;
  // box.ry += 0.01;
  box.rz += 0.01;
  box.update();

  camera.update(elapsed);
  // resources.update(elapsed);

  previousTimestamp = timestamp;
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`;
  powerDebug.innerText = `Power: ${Math.floor(resources.power.current)}/${resources.power.capacity} (+${resources.power.gen}/-${resources.power.use})`;
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
