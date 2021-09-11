import resources from './resources';
import Build from './build';
import { $ } from './util';
import gameObjectList from './game-object-list';
import moduleList from './modules/module-list';
import createBuildScreenHTML from './build-screen-html';

const matsBar = $('.mats .fill');
const matsDot = $('.mats .dot');
const matsCap = $('.mats .cap');
const popCur = $('.pop .cur');
const popCap = $('.pop .cap');
const powerBar = $('.power .fill');
const powerDot = $('.power .dot');
const powerGen = $('.power .gen');
const powerUse = $('.power .use');
const powerNum = $('.power .num');
const powerCap = $('.power .cap');
const buildListElement = $('.ui-panel__build-list');
const buildInfoElement = $('.ui-panel__build-info');
const deleteButton = $('.del');
const offButton = $('.off');

const UI = {};

UI.buildBarList = [];

UI.deselectAllBuildBarItems = () => {
  UI.buildBarList.forEach((buildBarItemElement) => {
    buildBarItemElement.setAttribute('aria-pressed', false);
  });
};

UI.populateBuildBar = () => {
  UI.buildBarList = moduleList.map((Item) => {
    const buildBarItemElement = document.createElement('button');
    buildBarItemElement.className = `build-bar ${Item.className}`;
    buildBarItemElement.Item = Item;

    if (Item.unlock === true || (Item.unlock && Item.unlock())) {
      Item.unlock = true; // Now we've unlocked item forever!
    } else {
      buildBarItemElement.classList.add('disabled');
    }

    buildBarItemElement.addEventListener('click', () => {
      if (Item.unlock !== true) return;

      Build.setCurrentItem(Item);

      UI.buildBarList.forEach((other) => {
        if (buildBarItemElement === other) {
          other.setAttribute('aria-pressed', true);
        } else {
          other.setAttribute('aria-pressed', false);
        }
      });
    });

    buildBarItemElement.addEventListener('mouseover', () => {
      buildInfoElement.innerHTML = createBuildScreenHTML(Item);
    });

    buildBarItemElement.addEventListener('mouseleave', () => {
      buildInfoElement.innerHTML = Build.currentItem
        ? createBuildScreenHTML(Build.currentItem)
        : '';
    });

    buildListElement.append(buildBarItemElement);

    return buildBarItemElement;
  });
};

UI.update = () => {
  UI.buildBarList.forEach((buildBarItemElement) => {
    // If already unlocked, do nothing
    if (buildBarItemElement.Item.unlock === true) {
      return;
    }

    if (buildBarItemElement.Item.unlock && buildBarItemElement.Item.unlock()) {
      buildBarItemElement.Item.unlock = true;
      buildBarItemElement.classList.remove('disabled');
    }
  });

  matsBar.style.width = `${(100 / resources.mats.capacity) * resources.mats.current}%`;
  matsDot.classList.toggle('empty', resources.mats.current < 1);
  matsCap.innerText = `${Math.floor(resources.mats.current)} /  ${resources.mats.capacity}`;

  popCur.innerText = resources.population.current;
  popCap.innerText = resources.population.capacity;

  powerBar.style.width = `${(100 / resources.power.capacity) * resources.power.current}%`;
  powerDot.classList.toggle('empty', resources.power.current < 1);
  powerGen.innerText = `+${resources.power.gen}`;
  powerUse.innerText = `-${resources.power.use}`;
  const num = resources.power.gen - resources.power.use;
  powerNum.innerText = (num <= 0 ? '' : '+') + num;
  powerNum.classList.toggle('neg', num < 0);
  powerCap.innerText = `${Math.floor(resources.power.current)} /  ${resources.power.capacity}`;
};

deleteButton.addEventListener('click', () => {
  for (let i = gameObjectList.length - 1; i > 0; i--) {
    if (gameObjectList[i].selected) {
      gameObjectList[i].kill();
    }
  }

  $('.ui-panel--btns').setAttribute('aria-hidden', true);
  $('.ui-panel__build-info').classList.remove('ui-panel__build-info--select');
  $('.ui-panel__build-info').innerHTML = ''; // Remove infos
  $('.ui-panel__build-list').innerHTML = ''; // Remove object buttons
  $('.ui-panel__build-list').style.display = '';
  $('.ui-panel__build-list').append(...UI.buildBarList);

  // Cancel building whatever is the current build item
  UI.deselectAllBuildBarItems();
  Build.setCurrentItem(false);
});

offButton.addEventListener('click', () => {
  // TODO: Make this actually enable and disable modules
  const isEnabled = offButton.getAttribute('aria-pressed') !== 'true';
  offButton.setAttribute('aria-pressed', isEnabled);

  for (let i = gameObjectList.length - 1; i > 0; i--) {
    if (gameObjectList[i].selected) {
      if (!isEnabled && gameObjectList[i].enable) gameObjectList[i].enable();
      if (isEnabled && gameObjectList[i].disable) gameObjectList[i].disable();
    }
  }
});

export default UI;
