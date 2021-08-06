import camera from './camera';
import keys from './keyboard';
import settings from './settings';

const perfDebug = document.querySelector('.debug .perf');

/* Game loop */

let previousTimestamp;

function main(timestamp) {
  window.requestAnimationFrame(main);

  if (previousTimestamp === undefined) previousTimestamp = timestamp;
  const elapsed = timestamp - previousTimestamp;

  if (keys.has('w')) camera.moveY += 1;
  if (keys.has('a')) camera.moveX -= 1;
  if (keys.has('s')) camera.moveY -= 1;
  if (keys.has('d')) camera.moveX += 1;
  if (keys.has('z')) camera.dZoom += 1;
  if (keys.has('x')) camera.dZoom -= 1;
  camera.update(elapsed);

  previousTimestamp = timestamp;
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`;
}

function mouseMoveHandler(event) {
  if (event.buttons > 1) {
    camera.rz += (event.clientX - this.mousePosOldX ?? 0) * settings.camera.rotateSpeed;
    camera.rx += (event.clientY - this.mousePosOldY ?? 0) * settings.camera.rotateSpeed;
    camera.setTransform();
  }

  this.mousePosOldX = event.clientX;
  this.mousePosOldY = event.clientY;
}

function wheelHandler(event) {
  camera.zoom += event.deltaY * 1;
  camera.setZoom();
}

// TODO: Should these be on the viewport element instead of document?
document.addEventListener('mousemove', mouseMoveHandler);
document.addEventListener('wheel', wheelHandler);

window.requestAnimationFrame(main);

document.querySelector('#reset-rotation').addEventListener('click', () => {
  // console.log('Resetting rotation');
  camera.rx = 45;
  camera.rz = 45;
  camera.setTransform();
});

document.querySelector('#reset-position').addEventListener('click', () => {
  // console.log('Resetting position');
  camera.x = 0;
  camera.y = 0;
  camera.z = 0;
  camera.setTransform();
});
