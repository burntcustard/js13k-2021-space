import { $ } from './util';

const gameObjectList = [];

// TODO: Other game object list related functions, like getAllAlive()

gameObjectList.remove = function (item) {
  this.splice(this.findIndex((i) => i === item), 1);
};

gameObjectList.getSelectedList = function () {
  return this.filter((o) => o.selected);
};

gameObjectList.killSelected = function () {
  for (let i = this.length - 1; i > 0; i--) {
    if (this[i].selected) {
      this[i].kill();
    }
  }

  $('.ui-panel--btns').setAttribute('aria-hidden', true);
};

// TODO: Remove because the upgrade UI doesn't let you upgrade >1 thing at once?
gameObjectList.upgradeSelected = function () {
  for (let i = this.length - 1; i > 0; i--) {
    if (this[i].selected && this[i].upgrade && this[i].level < this[i].maxLevel) {
      this[i].upgrade();
    }
  }
};

// Deslect any selected game objects
gameObjectList.deselectAll = function () {
  gameObjectList.forEach((gameObject) => {
    if (gameObject.selected) gameObject.select(false);
  });
};

export default gameObjectList;
