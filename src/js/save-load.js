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

export default function initSaveAndLoad() {
  $('#save').addEventListener('click', () => {
    console.log(stringify());
    localStorage.setItem('3DC5S', stringify());
  });

  $('#load').addEventListener('click', () => {
    for (let i = gameObjectList.length - 1; i >= 0; i--) {
      gameObjectList[i].kill();
    }
    console.log(parse(localStorage.getItem('3DC5S')));
    gameObjectList.splice(0, gameObjectList.length, ...parse(localStorage.getItem('3DC5S')));
    gameObjectList.forEach((object) => {
      object.spawn();
      object.enable();
    });
    console.log(gameObjectList);
  });
}
