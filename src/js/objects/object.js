import Build from '../build';
import gameObjectList from '../game-object-list';
import resources from '../resources';
import { $ } from '../util';
import createBuildScreenHTML from '../build-screen-html';

const buildInfoElement = $('.ui-panel__build-info');

export default function GameObject(props) {
  this.w = props.w ?? 1;
  this.h = props.h ?? 1;
  this.d = props.d ?? 1;
  this.x = props.x ?? 0;
  this.y = props.y ?? 0;
  this.z = props.z ?? 0;
  this.rx = props.rx ?? 0;
  this.ry = props.ry ?? 0;
  this.rz = props.rz ?? 0;
}

/**
 * Update a game object to change it's position, recalculate lighting, etc.
 * @param  {[type]} elapsed               [description]
 * @param  {[type]} lights                [description]
 */
GameObject.prototype.update = function (elapsed, lights) {
  this.model.x = this.x;
  this.model.y = this.y;
  this.model.z = this.z;
  this.model.rx = this.rx;
  this.model.ry = this.ry;
  this.model.rz = this.rz;
  this.model.update(elapsed, lights);
};

/**
 * Add the shape to the gameworld by appending it's element to the DOM
 */
GameObject.prototype.spawn = function () {
  this.model.spawn();
  this.update();
};

/* eslint-disable no-nested-ternary */
// TODO: Move ui.createBuildBarHTML to here, or move this to there, or somewhere else?
GameObject.prototype.createSelectedObjectHTML = function () {
  return `
    <div>
      <b>${this.tag + '+'.repeat(this.level ?? 0)}</b>
      <div>${!this.active ? '<s>' : ''}${this.power < 0 ? `Use ϟ${-this.power}` : this.power > 0 ? `Gen ϟ${this.power}` : ''}${!this.active ? '</s>' : ''}</div>
    </div>
    <div>
      ${this.desc}
    </div>
  `;
};

GameObject.prototype.populateBuildBar = function () {
  if (this.upgrade) {
    const buildBarItemElement = document.createElement('button');
    buildBarItemElement.className = 'build-bar upgrade';
    if (this.level === this.maxLevel) {
      buildBarItemElement.innerHTML = 'UPGRADE<br>[max]';
      buildBarItemElement.disabled = true;
    } else if (resources.mats.current < (this.upgradeCost * (this.level + 1))) {
      buildBarItemElement.innerHTML = `UPGRADE<br>[M:${this.upgradeCost * (this.level + 1)}]`;
      buildBarItemElement.disabled = true;
    } else {
      buildBarItemElement.innerHTML = `UPGRADE<br>[M:${this.upgradeCost * (this.level + 1)}]`;
    }

    buildBarItemElement.addEventListener('click', () => {
      resources.mats.current -= this.upgradeCost * (this.level + 1);
      this.upgrade();
      this.populateBuildBar();
    });

    $('.ui-panel__build-list').innerHTML = '';
    $('.ui-panel__build-list').append(buildBarItemElement);
  }

  if (this.buildList) {
    this.buildList.forEach((Item) => {
      const buildBarItemElement = document.createElement('button');
      buildBarItemElement.className = `build-bar ${Item.className}`;

      buildBarItemElement.addEventListener('click', () => {
        const newItem = new Item({
          x: this.x,
          y: this.y,
          z: this.z,
          parent: this,
        });
        newItem.spawn();
      });

      buildBarItemElement.addEventListener('mouseover', () => {
        buildInfoElement.innerHTML = createBuildScreenHTML(Item);
      });

      buildBarItemElement.addEventListener('mouseleave', () => {
        buildInfoElement.innerHTML = this.createSelectedObjectHTML();
      });

      $('.ui-panel__build-list').innerHTML = '';
      $('.ui-panel__build-list').append(buildBarItemElement);
    });
  }
};

GameObject.prototype.updateBuildBarUI = function () {
  $('.ui-panel__build-info').classList.add('ui-panel__build-info--select');
  $('.ui-panel__build-info').innerHTML = this.createSelectedObjectHTML();

  // If no upgrades or things this thing can build:
  if (this.upgrade || this.buildList) {
    if (gameObjectList.getSelectedList().length === 1) {
      $('.ui-panel__build-list').style.display = '';
      this.populateBuildBar();
    }
  } else {
    $('.ui-panel__build-list').style.display = 'none';
  }
};

/**
 * Make this game object the selected one
 * @return {[type]} [description]
 */
GameObject.prototype.select = function (select) {
  this.selected = select;

  if (select) {
    $('.ui-panel--btns').setAttribute('aria-hidden', false);
    this.model.element.classList.add('select');
    this.updateBuildBarUI();
  } else {
    this.model.element.classList.remove('select');
  }
};

/**
 * Make this game object the selected one
 * @return {[type]} [description]
 */
GameObject.prototype.hover = function (hover) {
  if (!Build.currentItem) {
    this.hovered = hover;
    this.model.element.classList.toggle('hover', hover);
  }
};

/**
 * Add select and hover event listeners the GameObject
 * Assuming all game objects should have event listeners for clicking on them?
 * @return {[type]} [description]
 */
GameObject.prototype.addSelectEventListeners = function () {
  // Assumes every side of the shape should be used for selection
  this.model.sides.forEach((side) => {
    side.element.addEventListener('mouseover', () => {
      this.hover(true);
    });

    side.element.addEventListener('mouseleave', () => {
      this.hover(false);
    });

    side.element.addEventListener('click', () => {
      // You're building something not selecting, do nothing
      if (Build.currentItem) return;

      // Deselect every other GameObject in the list
      gameObjectList.forEach((item) => {
        if (this !== item && item.select) {
          item.select(false);
        }
      });

      // Select this object if it's not already selected
      this.select(true);
    });

    side.element.addEventListener('dblclick', () => {
      gameObjectList.forEach((item) => {
        if (this.tag === item.tag && item.select) {
          item.select(true);
        }
      });

      // Hide upgrades and building stuff
      // TODO: Enable building from or upgrading multiple selected gameObjects
      $('.ui-panel__build-list').style.display = 'none';
    });
  });
};

GameObject.prototype.kill = function () {
  this.model.element?.remove();

  if (this.connectedTo) {
    this.connectedTo.connectedTo = undefined;
  }

  gameObjectList.remove(this);
  // TODO (if space) remove mouse & click event listeners to prevent memory leak
};
