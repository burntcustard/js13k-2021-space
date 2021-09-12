import gameObjectList from './game-object-list';
import moduleList from './modules/module-list';
import resources from './resources';
import { $ } from './util';

const { localStorage } = window;

function stringify() {
  return JSON.stringify({
    objects: gameObjectList.map(({ tag, x, y, z, rx, ry, rz }) => ({ tag, x, y, z, rx, ry, rz })),
    resources,
  });
}

function load(data) {
  const parsed = JSON.parse(data);

  // Delete all game objects then replace with save data
  for (let i = gameObjectList.length - 1; i >= 0; i--) {
    gameObjectList[i].kill();
  }
  const savedObjects = parsed.objects.map((saved) => {
    const Module = moduleList.get(saved.tag);
    return new Module(saved);
  });
  gameObjectList.splice(0, gameObjectList.length, ...savedObjects);
  gameObjectList.forEach((object) => {
    object.spawn();
    object.enable();
  });

  // Load resources
  resources.mats = parsed.resources.mats;
  resources.power = parsed.resources.power;
  resources.population = parsed.resources.population;
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
