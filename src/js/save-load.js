import gameObjectList from './game-object-list';
import moduleList from './modules/module-list';
import { $ } from './util';

const { localStorage } = window;

function stringify() {
  return JSON.stringify(
    gameObjectList.map(({ tag, x, y, z, rx, ry, rz }) => ({ tag, x, y, z, rx, ry, rz })),
  );
}

function parse(data) {
  return JSON.parse(data).map(({ tag, x, y, z, rx, ry, rz }) => {
    const module = moduleList.get(tag);
    // eslint-disable-next-line new-cap
    return new module({ x, y, z, rx, ry, rz });
  });
}

function load(data) {
  for (let i = gameObjectList.length - 1; i >= 0; i--) {
    gameObjectList[i].kill();
  }
  gameObjectList.splice(0, gameObjectList.length, ...parse(data));
  gameObjectList.forEach((object) => {
    object.spawn();
    object.enable();
  });
}

export default function initSaveAndLoad() {
  $('#save').addEventListener('click', () => {
    console.log(stringify());
    localStorage.setItem('3DC5S', stringify());
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
