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

GameObject.prototype.updateBuildBar = function () {
  if (this.upgrade) {
    // You've unlockd the thing!
    if (this.info.unlockUpgrade[this.level] !== true && this.info.unlockUpgrade[this.level]()) {
      this.info.unlockUpgrade[this.level] = true;
    }

    if (this.info.unlockUpgrade[this.level] === true
      && resources.mats.current >= this.upgradeCost * (this.level + 1)) {
      this.buildBarItemElement.classList.remove('disabled');
    } else {
      this.buildBarItemElement.classList.add('disabled');
    }

    if (this.buildBarItemElement.mouseIsOver) {
      buildInfoElement.innerHTML = createBuildScreenHTML({
        tag: this.tag + '+'.repeat(this.level + 1),
        cost: this.upgradeCost * (this.level + 1),
        power: this.info.power * (this.level + 2),
        desc: 'Upgrade',
        unlock: this.info.unlockUpgrade[this.level],
        unlockText: this.info.unlockUpgradeText[this.level],
      });
    }
  }

  if (this.buildList) {
    this.buildList.forEach((Item) => {
      // TODO: Change this to figure out if has enough people to go in new ship
      const hasRequiredPopulation = true;

      if (!hasRequiredPopulation
        || resources.mats.current < Item.cost) {
        Item.buildBarItemElement.classList.add('disabled');
      } else {
        Item.buildBarItemElement.classList.remove('disabled');
      }
    });
  }
};

GameObject.prototype.populateBuildBar = function () {
  if (this.upgrade) {
    this.buildBarItemElement = document.createElement('button');
    this.buildBarItemElement.className = 'build-bar upgrade';
    this.buildBarItemElement.innerHTML = 'UPGRADE';

    if (this.info.unlockUpgrade[this.level] === true || this.info.unlockUpgrade[this.level]()) {
      this.info.unlockUpgrade[this.level] = true; // Now we've unlocked item forever!
    } else {
      this.buildBarItemElement.classList.add('disabled');
    }

    if (this.level === this.maxLevel
      || resources.mats.current < (this.upgradeCost * (this.level + 1))) {
      this.buildBarItemElement.classList.add('disabled');
    }

    this.buildBarItemElement.addEventListener('mouseover', () => {
      this.buildBarItemElement.mouseIsOver = true;
      buildInfoElement.innerHTML = createBuildScreenHTML({
        tag: this.tag + '+'.repeat(this.level + 1),
        cost: this.upgradeCost * (this.level + 1),
        power: this.info.power * (this.level + 2),
        desc: 'Upgrade',
        unlock: this.info.unlockUpgrade[this.level],
        unlockText: this.info.unlockUpgradeText[this.level],
      });
    });

    this.buildBarItemElement.addEventListener('mouseleave', () => {
      this.buildBarItemElement.mouseIsOver = false;
      buildInfoElement.innerHTML = this.createSelectedObjectHTML();
    });

    this.buildBarItemElement.addEventListener('click', () => {
      if (this.info.unlockUpgrade[this.level] !== true
        && resources.mats.current < (this.upgradeCost * (this.level + 1))) {
        return;
      }

      resources.mats.current -= this.upgradeCost * (this.level + 1);
      this.upgrade();
      this.populateBuildBar();
      buildInfoElement.innerHTML = createBuildScreenHTML({
        tag: this.tag + '+'.repeat(this.level + 1),
        cost: this.upgradeCost * (this.level + 1),
        power: this.info.power * (this.level + 2),
        desc: 'Upgrade',
        unlock: this.info.unlockUpgrade[this.level],
        unlockText: this.info.unlockUpgradeText[this.level],
      });
    });

    $('.ui-panel__build-list').innerHTML = '';
    $('.ui-panel__build-list').append(this.buildBarItemElement);
  }

  if (this.buildList) {
    this.buildList.forEach((Item) => {
      Item.buildBarItemElement = document.createElement('button');
      Item.buildBarItemElement.className = `build-bar ${Item.className}`;

      // TODO: Change this to figure out if has enough people to go in new ship
      const hasRequiredPopulation = true;

      if (!hasRequiredPopulation || resources.mats.current < Item.cost) {
        this.buildBarItemElement.classList.add('disabled');
      }

      Item.buildBarItemElement.addEventListener('click', () => {
        if (!hasRequiredPopulation || resources.mats.current < Item.cost) {
          return;
        }

        resources.mats.current -= Item.cost;

        const newItem = new Item({
          x: this.x,
          y: this.y,
          z: this.z,
          parent: this,
        });
        newItem.spawn();
      });

      Item.buildBarItemElement.addEventListener('mouseover', () => {
        Item.buildBarItemElement.mouseIsOver = true;
        buildInfoElement.innerHTML = createBuildScreenHTML(Item);
      });

      Item.buildBarItemElement.addEventListener('mouseleave', () => {
        Item.buildBarItemElement.mouseIsOver = false;
        buildInfoElement.innerHTML = this.createSelectedObjectHTML();
      });

      $('.ui-panel__build-list').innerHTML = '';
      $('.ui-panel__build-list').append(Item.buildBarItemElement);
    });
  }
};

GameObject.prototype.updateBuildBarUI = function () {
  $('.ui-panel__build-info').classList.add('ui-panel__build-info--select');
  $('.ui-panel__build-info').innerHTML = this.createSelectedObjectHTML();

  // If no upgrades or things this thing can build:
  if (this.upgrade || this.buildList) {
    // If there's only one module selected (can't do multi-build or multi-upgrade)
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

  // Get half the resources back
  resources.mats.current = Math.min(
    resources.mats.current + this.cost / 2,
    resources.mats.capacity,
  );

  gameObjectList.remove(this);
  // TODO (if space) remove mouse & click event listeners to prevent memory leak
};
