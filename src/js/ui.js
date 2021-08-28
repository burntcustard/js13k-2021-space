import resources from './resources';
import { $ } from './util';

import Block from './modules/block';
import Solar from './modules/solar';

const matsBar = $('.mats .fill');
const matsDot = $('.mats .dot');
const matsCap = $('.mats .cap');
const powerBar = $('.power .fill');
const powerDot = $('.power .dot');
const powerGen = $('.power .gen');
const powerUse = $('.power .use');
const powerNum = $('.power .num');
const powerCap = $('.power .cap');
const buildListElement = $('.ui-panel__build-list');

const UI = {};

UI.setCurrentBuildItem = (Item) => {
  UI.currentBuildItem = Item;
  UI.currentBuildItemInstance = new Item({});
  UI.currentBuildItemInstance.model.element.classList.add('frame');
  UI.currentBuildItemInstance.spawn();
  UI.currentBuildItemInstance.model.element.style.display = 'none';
};

UI.populateBuildBar = () => {
  [Block, Solar].forEach((Item) => {
    const buildButton = document.createElement('button');
    buildButton.className = 'placeholder';
    buildButton.onclick = () => {
      UI.setCurrentBuildItem(Item);
    };

    // TODO: Some proper build bar icon somehow
    /* eslint-disable-next-line prefer-destructuring */
    buildButton.innerHTML = Item.moduleName[0];
    buildListElement.append(buildButton);
  });
};

UI.update = () => {
  matsBar.style.width = `${(100 / resources.mats.capacity) * resources.mats.current}%`;
  matsDot.classList.toggle('empty', resources.mats.current < 1);
  matsCap.innerText = `${Math.floor(resources.mats.current)} /  ${resources.mats.capacity}`;

  powerBar.style.width = `${(100 / resources.power.capacity) * resources.power.current}%`;
  powerDot.classList.toggle('empty', resources.power.current < 1);
  powerGen.innerText = `+${resources.power.gen}`;
  powerUse.innerText = `-${resources.power.use}`;
  const num = resources.power.gen - resources.power.use;
  powerNum.innerText = (num <= 0 ? '' : '+') + num;
  powerNum.classList.toggle('neg', num > 0);
  powerCap.innerText = `${Math.floor(resources.power.current)} /  ${resources.power.capacity}`;
};

export default UI;
