import gameObjectList from './game-object-list';
import moduleList from './modules/module-list';
import resources from './resources';
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
  gameObjectList.splice(0, gameObjectList.length, ...savedObjects);
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
    if (unlocked) moduleList[i].unlocked = true;
  });
}

export default function initSaveAndLoad() {
  $('#save').addEventListener('click', () => {
    localStorage.setItem('3DC5S', stringify());
    $('#save').disabled = true;
    $('#save').innerText = 'Saved';
    setTimeout(() => {
      $('#save').disabled = false;
      $('#save').innerText = 'Save';
    }, 2500);
  });

  $('#load').addEventListener('click', () => {
    load(localStorage.getItem('3DC5S'));
  });

  $('#export').addEventListener('click', () => {
    $('#export-text').value = stringify();
  });

  $('#import').addEventListener('click', () => {
    load($('#import-text').value);
  });
}
