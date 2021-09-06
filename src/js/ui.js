import resources from './resources';
import Build from './build';
import { $ } from './util';
import gameObjectList from './game-object-list';

import Block from './modules/block';
import Solar from './modules/solar';
import HabSm from './modules/hab-sm';
import HexBlock from './modules/hex-block';
import RingMd from './modules/ring-md';

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

/* eslint-disable no-nested-ternary */
UI.createBuildBarHTML = (Item) => `
  <div>
    <b>${Item.tag}</b>
    <div>M:${Item.cost}${Item.population ? ` | Pop:${Item.population}` : ''}${Item.power < 0 ? ` | Use ϟ${-Item.power}` : Item.power > 0 ? ` | Gen ϟ${Item.power}` : ''}</div>
  </div>
  <div>
    ${Item.desc}
  </div>
`;

UI.buildBarList = [];

UI.deselectAllBuildBarItems = () => {
  UI.buildBarList.forEach((buildBarItem) => {
    buildBarItem.element.setAttribute('aria-pressed', false);
  });
};

UI.populateBuildBar = () => {
  UI.buildBarList = [Block, Solar, HabSm, HexBlock, RingMd].map((Item) => {
    const buildBarItem = { };
    buildBarItem.element = document.createElement('button');
    buildBarItem.element.className = `build-bar ${Item.className}`;
    buildBarItem.element.addEventListener('click', () => {
      Build.setCurrentItem(Item);

      gameObjectList.forEach((gameObject) => {
        if (gameObject.selected) {
          gameObject.select(false);
        }
      });

      UI.buildBarList.forEach((other) => {
        if (buildBarItem === other) {
          other.element.setAttribute('aria-pressed', true);
        } else {
          other.element.setAttribute('aria-pressed', false);
        }
      });
    });
    buildBarItem.element.addEventListener('mouseover', () => {
      buildInfoElement.innerHTML = UI.createBuildBarHTML(Item);
    });
    buildBarItem.element.addEventListener('mouseleave', () => {
      buildInfoElement.innerHTML = Build.currentItem
        ? UI.createBuildBarHTML(Build.currentItem)
        : '';
    });
    buildListElement.append(buildBarItem.element);

    return buildBarItem;
  });
};

UI.update = () => {
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
  powerNum.classList.toggle('neg', num > 0);
  powerCap.innerText = `${Math.floor(resources.power.current)} /  ${resources.power.capacity}`;
};

deleteButton.addEventListener('click', () => {
  for (let i = gameObjectList.length - 1; i > 0; i--) {
    if (gameObjectList[i].selected) {
      gameObjectList[i].kill();
    }
  }
});

offButton.addEventListener('click', () => {
  // TODO: Make this actually enable and disable modules
  const isDisabled = offButton.getAttribute('aria-pressed') !== 'true';
  offButton.setAttribute('aria-pressed', isDisabled);
});

export default UI;
