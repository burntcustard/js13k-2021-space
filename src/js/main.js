import camera from './camera';
import initMouse from './mouse';
import { initKeyboard, doKeyboardInput } from './keyboard';
import Build from './build';
import UI from './ui';
import gameObjectList from './game-object-list';
import resources from './resources';
import { $, PI_2, PI_4, PI_8 } from './util';
import Block from './modules/block';
import Solar from './modules/solar';
import HabSm from './modules/hab-sm';
import Hexagon from './shapes/hexagon';
import Light from './objects/light';
import Cubemap from './shapes/cubemap';

const perfDebug = $('.debug .perf');

let previousTimestamp;

const skybox = new Cubemap({
  w: 2048,
});

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

UI.populateBuildBar();

new Block({}).spawn();
new Block({ y: -60 }).spawn();
new HabSm({ y: -120, rx: PI_2, ry: PI_2 }).spawn();
new HabSm({ y: -180, rx: PI_2, ry: PI_2 }).spawn();
new Block({ y: -240 }).spawn();
new Solar({ x: 90, y: -240 }).spawn();
new Solar({ x: -90, y: -240 }).spawn();
new HabSm({ y: -300, rx: PI_2, ry: PI_2 }).spawn();
new HabSm({ y: 60, rx: PI_2, ry: PI_2 }).spawn();
new HabSm({ y: 120, rx: PI_2, ry: PI_2 }).spawn();
new Block({ y: 180 }).spawn();
new HabSm({ x: 60, y: 180, ry: PI_2 }).spawn();
new HabSm({ x: -60, y: 180, ry: PI_2 }).spawn();
new HabSm({ x: 120, y: 180, ry: PI_2 }).spawn();
new HabSm({ x: -120, y: 180, ry: PI_2 }).spawn();
new HabSm({ x: -180, y: 180, ry: PI_2 }).spawn();
new Block({ x: 60 }).spawn();
new Block({ x: -60 }).spawn();
new Block({ x: 120 }).spawn();
new Solar({ x: 120, y: -90, rz: PI_2 }).spawn();
new Solar({ x: 180, y: -90, rz: PI_2 }).spawn();
new Solar({ x: 240, y: -90, rz: PI_2 }).spawn();
new Solar({ x: -120, y: -90, rz: PI_2 }).spawn();
new Solar({ x: -180, y: -90, rz: PI_2 }).spawn();
new Solar({ x: -240, y: -90, rz: PI_2 }).spawn();
new Block({ x: -120 }).spawn();
new Block({ x: 180 }).spawn();
new Block({ x: -180 }).spawn();
new Block({ x: 240 }).spawn();
new Block({ x: -240 }).spawn();
new Block({ x: 300 }).spawn();
new Solar({ x: 300, z: 90, rx: PI_2, ry: PI_2 }).spawn();
new Solar({ x: 300, z: -90, rx: PI_2, ry: PI_2 }).spawn();
new Solar({ x: 300, y: 90, rz: PI_2 }).spawn();
new Block({ x: 360 }).spawn();
new Solar({ x: 360, z: 90, rx: PI_2, ry: PI_2 }).spawn();
new Solar({ x: 360, z: -90, rx: PI_2, ry: PI_2 }).spawn();
new Block({ x: 420 }).spawn();
new Solar({ x: 420, z: 90, rx: PI_2, ry: PI_2 }).spawn();
new Solar({ x: 420, z: -90, rx: PI_2, ry: PI_2 }).spawn();
new Solar({ x: 420, y: 90, rz: PI_2 }).spawn();
new Block({ x: 480 }).spawn();
new Solar({ x: 480, z: 90, rx: PI_2, ry: PI_2 }).spawn();
new Solar({ x: 480, z: -90, rx: PI_2, ry: PI_2 }).spawn();
new Block({ x: -300 }).spawn();
new Solar({ x: -300, z: 90, rx: PI_2, ry: PI_2 }).spawn();
new Solar({ x: -300, z: -90, rx: PI_2, ry: PI_2 }).spawn();
new Solar({ x: -300, y: 90, rz: PI_2 }).spawn();
new Block({ x: -360 }).spawn();
new Solar({ x: -360, z: 90, rx: PI_2, ry: PI_2 }).spawn();
new Solar({ x: -360, z: -90, rx: PI_2, ry: PI_2 }).spawn();
new Block({ x: -420 }).spawn();
new Solar({ x: -420, z: 90, rx: PI_2, ry: PI_2 }).spawn();
new Solar({ x: -420, z: -90, rx: PI_2, ry: PI_2 }).spawn();
new Solar({ x: -420, y: 90, rz: PI_2 }).spawn();
new Block({ x: -480 }).spawn();
new Solar({ x: -480, z: 90, rx: PI_2, ry: PI_2 }).spawn();
new Solar({ x: -480, z: -90, rx: PI_2, ry: PI_2 }).spawn();

let halfSecondCounter = 0;

function main(timestamp) {
  window.requestAnimationFrame(main);

  if (previousTimestamp === undefined) previousTimestamp = timestamp;
  const elapsed = timestamp - previousTimestamp;
  halfSecondCounter += elapsed;
  if (halfSecondCounter > 500) {
    halfSecondCounter = 0;
  }

  doKeyboardInput();

  gameObjectList.forEach((object) => {
    object.update(elapsed, lights);
  });

  camera.update(elapsed);
  skybox.update();

  previousTimestamp = timestamp;
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`;

  // Do some stuff only every half a second
  if (!halfSecondCounter) {
    // TODO: Only update build if actually building something
    Build.update();

    if (resources.population.current < resources.population.capacity
      && Math.floor(Math.random() * 1.02)) {
      // TODO: Display a '+1' or some indicator that the population has gone up
      // TODO: Show a 'population capacity reached' indicator
      resources.population.current++;
    }

    UI.update();
  }
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
