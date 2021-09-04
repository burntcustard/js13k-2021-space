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

new Hexagon({ w: 120, h: 60, rx: PI_2 }).spawn();
new Solar({ x: 95, z: 55, ry: -Math.PI / 6, rx: PI_2 }).spawn();
new Solar({ x: -95, z: 55, ry: Math.PI / 6, rx: PI_2 }).spawn();
new Solar({ z: -110, rx: PI_2, ry: PI_2 }).spawn();
new Hexagon({ y: 50, w: 80, h: 40, rx: PI_2 }).spawn();
new HabSm({ y: 100, rx: PI_2, ry: PI_2 }).spawn();
new HabSm({ y: 160, x: -60, rx: PI_2, ry: PI_2, rz: PI_2 }).spawn();
new HabSm({ y: 160, x: -120, rx: PI_2, ry: PI_2, rz: PI_2 }).spawn();
new Block({ y: 160, rx: PI_2, ry: PI_2 }).spawn();
new HabSm({ y: 220, rx: PI_2, ry: PI_2 }).spawn();
new HabSm({ y: 160, x: 60, rx: PI_2, ry: PI_2, rz: PI_2 }).spawn();
new HabSm({ y: 160, x: 120, rx: PI_2, ry: PI_2, rz: PI_2 }).spawn();
new Hexagon({ y: 270, w: 80, h: 40, rx: PI_2 }).spawn();
new Hexagon({ y: 320, w: 120, h: 60, rx: PI_2 }).spawn();
new Solar({ y: 320, x: 95, z: 55, ry: -Math.PI / 6, rx: PI_2 }).spawn();
new Solar({ y: 320, x: -95, z: 55, ry: Math.PI / 6, rx: PI_2 }).spawn();
new Solar({ y: 320, z: -110, rx: PI_2, ry: PI_2 }).spawn();

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
