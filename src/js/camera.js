import { toRad, toDeg } from './util';

const camera = document.querySelector('.camera');
const scene = document.querySelector('.scene');
const cameraDebug = document.querySelector('.debug .view');
const perfDebug = document.querySelector('.debug .perf');

const defaultRotation = {
  x: toRad(parseInt(getComputedStyle(scene).getPropertyValue('--default-rotation-x').replace('deg', ''), 10)),
  z: toRad(parseInt(getComputedStyle(scene).getPropertyValue('--default-rotation-z').replace('deg', ''), 10)),
};
const rotation = { x: defaultRotation.x, z: defaultRotation.z };
const prevRotation = { x: rotation.x, z: rotation.z };
const position = { x: 0, y: 0, z: 0 };
let zoom = 0;
const rotationSpeed = 0.01;

let mouseDown = false;
const mouseDownPos = { x: 0, y: 0 };

function moveCamera() {
  camera.style.transform = `translateZ(${zoom}px)`;
  scene.style.transform = `rotateX(${rotation.x}rad) rotateZ(${rotation.z}rad) translateX(${position.x}px) translateY(${position.y}px)`;
  cameraDebug.innerText = `Position: ${Math.round(position.x)}x, ${Math.round(position.y)}y ${Math.round(position.z)}z\nRotation: ${Math.round(toDeg(rotation.x))}°x, ${Math.round(toDeg(rotation.z))}°z\nZoom: ${Math.round(zoom)}px`;
}

function handleDown(event) {
  event.preventDefault();
  mouseDown = true;
  mouseDownPos.x = event.clientX || event.touches[0].clientX;
  mouseDownPos.y = event.clientY || event.touches[0].clientY;
  // console.log(`Mouse down at ${mouseDownPos.x}, ${mouseDownPos.y}`)
}

function handleUp() {
  mouseDown = false;
  prevRotation.x = rotation.x;
  prevRotation.z = rotation.z;
  // console.log('Mouse up')
}

function handleMove(event) {
  if (mouseDown) {
    event.preventDefault();
    const x = event.clientX || event.touches[0].clientX;
    const y = event.clientY || event.touches[0].clientY;
    rotation.x = (mouseDownPos.y - y) * rotationSpeed + prevRotation.x;
    rotation.z = (mouseDownPos.x - x) * rotationSpeed + prevRotation.z;
    moveCamera();
    // console.log(`Rotating ${tempRotation.x}, ${tempRotation.z}`)
  }
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
document.addEventListener('mousedown', handleDown);
document.addEventListener('touchstart', handleDown);
document.addEventListener('mouseup', handleUp);
document.addEventListener('touchend', handleUp);
document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove);
document.addEventListener('wheel', (event) => {
  zoom += event.deltaY * 1;
  moveCamera();
});

moveCamera();

/* Game loop */

const keys = new Set();
let previousTimestamp;
const movementSpeed = 0.2;
const zoomSpeed = 0.2;

document.onkeydown = (event) => {
  keys.add(event.key);
};

document.onkeyup = (event) => {
  keys.delete(event.key);
};

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
