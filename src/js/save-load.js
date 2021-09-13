import gameObjectList from './game-object-list';
import moduleList from './modules/module-list';
import resources from './resources';
import ShipController from './ship-controller';
import MiningShip from './ships/mining-ship';
import Ship from './ships/ship';
import UI from './ui';
import { $ } from './util';

const { localStorage } = window;

function stringify() {
  return JSON.stringify({
    objects: gameObjectList.map((object) => ({
      tag: object.tag,
      x: object.x,
      y: object.y,
      z: object.z,
      rx: object.rx,
      ry: object.ry,
      rz: object.rz,
      level: object.level,
      connectedTo: object.connectedTo ? `${gameObjectList.indexOf(object.connectedTo.parent.parent)}:${object.connectedTo.parent.sides.indexOf(object.connectedTo)}` : undefined,
    })),
    resources,
    unlocks: moduleList.map((module) => module.unlock === true),
    ships: ShipController.ships.map((ship) => ({
      x: ship.x,
      y: ship.y,
      z: ship.z,
      timer: ship.timer,
      status: ship.status,
      power: ship.power,
      destination: ship.destination,
      bay: ship.bay ? `${gameObjectList.indexOf(ship.bay.hangar)}:${ship.bay.hangar.bays.indexOf(ship.bay)}` : undefined,
    })),
  });
}

function load(data) {
  const parsed = JSON.parse(data);

  // Delete all game objects then replace with save data
  for (let i = gameObjectList.length - 1; i >= 0; i--) {
    gameObjectList[i].kill();
  }
  const savedObjects = parsed.objects.map((saved) => new (moduleList.get(saved.tag))(saved));
  for (let i = 0; i < savedObjects.length; i++) {
    if (parsed.objects[i].connectedTo) {
      const [module, side] = parsed.objects[i].connectedTo.split(':');
      savedObjects[i].connectedTo = savedObjects[module].model.sides[side];
    }
    if (parsed.objects[i].level) savedObjects[i].setLevel(parsed.objects[i].level);
  }
  // if (saved.level) module.setLevel(saved.level);
  gameObjectList.push(...savedObjects);
  gameObjectList.forEach((object) => {
    object.spawn();
    object.build();
    object.enable();
  });

  // Load resources
  resources.mats = parsed.resources.mats;
  resources.power = parsed.resources.power;
  resources.population = parsed.resources.population;

  // Load unlocks
  parsed.unlocks.forEach((unlocked, i) => {
    if (unlocked) moduleList[i].unlock = true;
  });
  UI.refreshUnlocks();

  // Load ships
  ShipController.ships.forEach((ship) => {
    ship.kill();
  });
  ShipController.ships = [];
  ShipController.dockingQueue = [];
  Ship.prototype.count = 0;
  parsed.ships.forEach((saved) => {
    const ship = new MiningShip({ x: saved.x, y: saved.y, z: saved.z });
    ship.destination = saved.destination;
    ship.status = saved.status;
    ship.power = saved.power;
    ship.timer = saved.timer;
    if (saved.bay) {
      const [hangar, bay] = saved.bay.split(':');
      ship.dock(gameObjectList[hangar].bays[bay]);
    }
    if (ship.status === 4) ShipController.dockingQueue.push(ship);
    ship.spawn();
  });
}

export default function initSaveAndLoad() {
  $('.save').addEventListener('click', () => {
    localStorage.setItem('3DC5S', stringify());
    $('.save').classList.add('disabled');
    $('.save').innerText = 'Saved';
    setTimeout(() => {
      $('.save').classList.remove('disabled');
      $('.save').innerText = 'Save';
    }, 3000);
  });

  $('.load').addEventListener('click', () => {
    load(localStorage.getItem('3DC5S'));
  });

  $('.export').addEventListener('click', () => {
    $('.export.text').value = stringify();
  });

  $('.import').addEventListener('click', () => {
    load($('.import.text').value);
  });
}
