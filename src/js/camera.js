import { toRad, toDeg } from './util';
import keys from './keyboard';

const camera = document.querySelector('.camera');
const scene = document.querySelector('.scene');
const cameraDebug = document.querySelector('.debug .view');
const perfDebug = document.querySelector('.debug .perf');

const defaultRotation = {
  x: toRad(parseInt(getComputedStyle(scene).getPropertyValue('--default-rotation-x').replace('deg', ''), 10)),
  z: toRad(parseInt(getComputedStyle(scene).getPropertyValue('--default-rotation-z').replace('deg', ''), 10)),
};
const rotation = { x: defaultRotation.x, z: defaultRotation.z };
const position = { x: 0, y: 0, z: 0 };
let zoom = 0;
const rotationSpeed = 0.01;

const mouseOldPos = { x: 0, y: 0 };
const mouseNewPos = { x: 0, y: 0 };

function moveCamera() {
  camera.style.transform = `translateZ(${zoom}px)`;
  scene.style.transform = `rotateX(${rotation.x}rad) rotateZ(${rotation.z}rad) translateX(${position.x}px) translateY(${position.y}px)`;
  cameraDebug.innerText = `Position: ${Math.round(position.x)}x, ${Math.round(position.y)}y ${Math.round(position.z)}z\nRotation: ${Math.round(toDeg(rotation.x))}°x, ${Math.round(toDeg(rotation.z))}°z\nZoom: ${Math.round(zoom)}px`;
}

function handleMove(event) {
  mouseNewPos.x = event.clientX || event.touches[0].clientX;
  mouseNewPos.y = event.clientY || event.touches[0].clientY;

  if (event.buttons === 1) {
    event.preventDefault();
    rotation.z += (mouseNewPos.x - mouseOldPos.x) * rotationSpeed;
    rotation.x += (mouseNewPos.y - mouseOldPos.y) * rotationSpeed;
    moveCamera();
    // console.log(`Rotating ${tempRotation.x}, ${tempRotation.z}`)
  }

  mouseOldPos.x = mouseNewPos.x;
  mouseOldPos.y = mouseNewPos.y;
}

// eslint-disable-next-line no-unused-vars
function resetRotation() {
  // console.log('Resetting rotation');
  rotation.x = defaultRotation.x;
  rotation.z = defaultRotation.z;
  moveCamera();
}

// eslint-disable-next-line no-unused-vars
function resetPosition() {
  // console.log('Resetting position');
  position.x = 0;
  position.y = 0;
  position.z = 0;
  moveCamera();
}

// TODO: Should these be on the viewport element instead of document?
// document.addEventListener('mousedown', handleDown);
// document.addEventListener('touchstart', handleDown);
// document.addEventListener('mouseup', handleUp);
// document.addEventListener('touchend', handleUp);
document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove);
document.addEventListener('wheel', (event) => {
  zoom += event.deltaY * 1;
  moveCamera();
});

moveCamera();

/* Game loop */

let previousTimestamp;
const movementSpeed = 0.2;
const zoomSpeed = 0.2;

function main(timestamp) {
  window.requestAnimationFrame(main);

  if (previousTimestamp === undefined) previousTimestamp = timestamp;
  const elapsed = timestamp - previousTimestamp;

  // Do stuff
  let moveX = 0; let moveY = 0; let
    moveZoom = 0;
  if (keys.has('w')) {
    moveX += Math.sin(rotation.z) * movementSpeed * elapsed;
    moveY += Math.cos(rotation.z) * movementSpeed * elapsed;
  }
  if (keys.has('a')) {
    moveX += Math.cos(rotation.z) * movementSpeed * elapsed;
    moveY -= Math.sin(rotation.z) * movementSpeed * elapsed;
  }
  if (keys.has('s')) {
    moveX -= Math.sin(rotation.z) * movementSpeed * elapsed;
    moveY -= Math.cos(rotation.z) * movementSpeed * elapsed;
  }
  if (keys.has('d')) {
    moveX -= Math.cos(rotation.z) * movementSpeed * elapsed;
    moveY += Math.sin(rotation.z) * movementSpeed * elapsed;
  }
  if (keys.has('z')) {
    moveZoom += zoomSpeed * elapsed;
  }
  if (keys.has('x')) {
    moveZoom -= zoomSpeed * elapsed;
  }
  if (moveX || moveY || moveZoom) {
    position.x += moveX;
    position.y += moveY;
    zoom += moveZoom;
    moveCamera();
  }

  previousTimestamp = timestamp;
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`;
}

window.requestAnimationFrame(main);
