import { $ } from './util';

const gameObjectList = [];

// TODO: Other game object list related functions, like getAllAlive()

gameObjectList.remove = function (item) {
  this.splice(this.findIndex((i) => i === item), 1);
};

gameObjectList.killSelected = function () {
  for (let i = this.length - 1; i > 0; i--) {
    if (this[i].selected) {
      this[i].kill();
    }
  }

  $('.ui-panel--btns').setAttribute('aria-hidden', true);
};

export default gameObjectList;
